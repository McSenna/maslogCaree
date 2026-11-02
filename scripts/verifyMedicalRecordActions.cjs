'use strict';
// Fictional fixtures only. All HTTP and WebSocket requests are intercepted.
// Run after `npx expo export --platform web`; supply PLAYWRIGHT_MODULE if needed.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const {INITIAL_SCHEDULE:schedule} = require('../../backend/services/immunization/scheduleDefinition');
const {getAllCompletionForms} = require('../../backend/config/medicalRecordFields');
const {nextThursday} = require('../../backend/services/immunization/appointmentPlan');
const {todayManila,targetDate} = require('../../backend/services/immunization/calendar');
const today = todayManila();
const mother = {masterResidentId:'TEST-MOTHER-001',name:'Test fixture mother with a long family name'};
const identity = {...mother,fullName:mother.name,dateOfBirth:'1995-01-01',sex:'female',purok:'Test purok',isActive:true,hasAccount:true};
const baby = {_id:'TEST-BABY-001',name:'Test fixture newborn with a long family name',dateOfBirth:today,motherMasterResidentId:mother.masterResidentId,temporaryName:true,scheduleVersion:schedule.version,age:{months:0,days:0,weeks:0}};
const doses = schedule.vaccines.flatMap(v=>v.doses.map(d=>({...d,vaccineKey:v.key,targetOn:targetDate(today,schedule.slots.find(slot=>slot.key===d.slot)),scheduledOn:targetDate(today,schedule.slots.find(slot=>slot.key===d.slot)),status:'Requires review',reviewRequired:true,record:null})));
const checklist = {medicalRecord:null,baby,mother,accountLinked:true,remindersEnabled:true,schedule,doses,nextScheduledDate:null,nextProposedDate:nextThursday(targetDate(today,schedule.slots.find(slot=>slot.days===42))),legacyReviewRequired:false,history:[]};
// A non-deferred follow-up uses the legacy void storage state without being a voided administration.
const reviewRecord={_id:'TEST-REVIEW-001',babyId:baby._id,doseKey:'hepb-1',state:'void',recordedBy:'TEST-STAFF',revision:0,followUpOn:today,reason:'Review paper card at follow-up',createdAt:today,updatedAt:today,history:[{action:'follow_up',reason:'Review paper card at follow-up',actor:'TEST-STAFF',at:today,previous:null}]};

const output = process.env.IMMUNIZATION_SCREENSHOTS || '/tmp/medical-record-actions';
const role = process.env.TEST_VIEWER_ROLE || 'midwife';
const theme = process.env.UI_THEME || 'light';
fs.mkdirSync(output,{recursive:true});

(async()=>{
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true});
  await context.routeWebSocket('**/*',socket=>socket.close());
  await context.addInitScript(({theme,role})=>{
   const payload = btoa(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600,platform:'web',role}));
   localStorage.setItem('maslogcare_current_user',JSON.stringify({id:'TEST-STAFF',name:'Test fixture midwife',role,token:`test.${payload}.test`,verified:true}));
   localStorage.setItem('maslogcare_ui_theme',theme);
  },{theme,role});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',async route=>{
   const url = new URL(route.request().url());
   if(url.pathname.includes('/medical-record-masterlist/summary'))return route.fulfill({json:{summary:{total:checklist.medicalRecord?1:0,historical:0,linked:checklist.medicalRecord?1:0,pendingReview:0,unlinked:0,services:['prenatal','immunization']}}});
   if(url.pathname.includes('/medical-record-masterlist/identities/search'))return route.fulfill({json:{identities:[identity]}});
   if(url.pathname.includes('/appointments/completion-forms'))return route.fulfill({json:{forms:getAllCompletionForms()}});
   if(url.pathname.endsWith('/medical-record-masterlist/search')){
    const record = checklist.medicalRecord;
    const records = record ? [{...record,source:'manual_entry',serviceType:'immunization',serviceLabel:'Immunization',visitDate:today,resident:identity,baby,linkage:'linked',providerName:'Test fixture midwife',providerRole:'midwife',createdAt:today}] : [];
    return route.fulfill({json:{records,pagination:{total:records.length}}});
   }
   if(url.pathname.endsWith('/medical-record-masterlist/TEST-PROGRAM-001')){
    const record={...checklist.medicalRecord,immunizationBabyId:baby,immunizationScheduleVersion:schedule.version,source:'manual_entry',serviceType:'immunization',assessment:'Routine immunization checklist: 1 of 15 doses documented as administered.',completedAt:today};
    return route.fulfill({json:{detail:{...record,record,baby,serviceLabel:'Immunization',visitDate:today,resident:identity,linkage:'linked',providerName:'Test fixture midwife',providerRole:'midwife',createdAt:today,form:getAllCompletionForms().find(form=>form.categoryKey==='immunization'),audit:{createdBy:null,createdByRole:'midwife',createdAt:today,updatedBy:null,updatedByRole:'midwife',updatedAt:today,duplicateAcknowledged:false},revisions:[],editable:false}}});
   }
   if(url.pathname.includes('/immunization/babies/search'))return route.fulfill({json:{babies:[baby]}});
   if(url.pathname.includes('/immunization/checklist'))return route.fulfill({json:checklist});
   if(url.hostname==='127.0.0.1'){
    const dist = path.join(root,'dist');
    const file = route.request().resourceType()==='document'?path.join(dist,`${role}/medical-records.html`):path.join(dist,url.pathname);
    if(fs.existsSync(file))return route.fulfill({contentType:file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':undefined,body:fs.readFileSync(file)});
    return route.fulfill({status:404,body:''});
   }
   return route.fulfill({json:{success:true,notifications:[],unreadCount:0,data:[],records:[],forms:[],residents:[],appointments:[],pagination:{total:0}}});
  });


  checklist.medicalRecord={_id:'TEST-PROGRAM-001',workflowStatus:'draft',recordStatus:'in_progress',immunizationProgress:{administered:0,total:15}};
  await page.goto(`http://127.0.0.1:8091/${role}/medical-records`);
  const actions=page.getByRole('group',{name:'Medical record actions',exact:true});
  await actions.waitFor();
  assert.equal(await actions.getByText('View',{exact:true}).count(),0,'View uses an icon only');
  assert.equal(await actions.getByText('Edit',{exact:true}).count(),0,'Edit uses an icon only');
  assert.equal(await actions.getByText('Delete',{exact:true}).count(),0,'Delete uses an icon only');
  for(const title of ['View record','Edit record','Delete record']) assert.equal(await actions.locator(`[title="${title}"]`).count(),1);
  await page.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
  for(const width of [320,375,768,1024,1280,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    await page.waitForFunction(wide=>Boolean(document.querySelector('[role="table"][aria-label="Medical records"]'))===wide,width>=1280);
    const view=actions.getByRole('button',{name:/View the Immunization record/});
    const edit=actions.getByRole('button',{name:/Edit immunization record/});
    await view.waitFor({state:'visible'});
    await view.scrollIntoViewIfNeeded();
    // Poll across responsive card/table remounts before measuring the controls.
    await page.waitForFunction(()=>{
      const group=document.querySelector('[role="group"][aria-label="Medical record actions"]');
      const buttons=group?.querySelectorAll('[role="button"]');
      if(buttons?.length!==3)return false;
      const [a,b,c]=Array.from(buttons).map(button=>button.getBoundingClientRect());
      return Math.abs(a.y-b.y)<1 && Math.abs(a.y-c.y)<1 && b.x>=a.right && c.x>=b.right && [a,b,c].every(box=>box.width>=44 && box.height>=44);
    });
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
    await page.screenshot({path:path.join(output,`actions-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
    if(width===375 || width===1440) {
      const originals=await actions.locator('[dir="auto"]').evaluateAll(elements=>elements.map(element=>{
        const saved={fontSize:element.style.fontSize,lineHeight:element.style.lineHeight};
        const computed=getComputedStyle(element);
        element.style.fontSize=`${parseFloat(computed.fontSize)*1.3}px`;
        element.style.lineHeight=`${parseFloat(computed.lineHeight)*1.3}px`;
        return saved;
      }));
      const a=await view.boundingBox(),b=await edit.boundingBox();
      assert.ok(Math.abs(a.y-b.y)<1 && b.x>=a.x+a.width,'scaled actions remain side by side');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'scaled action overflow');
      await page.screenshot({path:path.join(output,`actions-${width}-large-text-${theme}.png`),fullPage:true,animations:'disabled'});
      await actions.locator('[dir="auto"]').evaluateAll((elements,saved)=>elements.forEach((element,index)=>Object.assign(element.style,saved[index])),originals);
    }

  }
  await page.setViewportSize({width:1440,height:1000});
  await actions.screenshot({path:path.join(output,`record-action-icons-${theme}.png`),animations:'disabled'});
  const view=actions.getByRole('button',{name:/View the Immunization record/});
  await view.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
  assert.equal(await view.evaluate(element=>getComputedStyle(element).outlineWidth),'2px');
  await page.keyboard.press('Enter');
  const detail=page.getByRole('dialog',{name:'Medical record',exact:true});
  await detail.waitFor();
  await detail.getByRole('button',{name:'Close',exact:true}).click();
  await detail.waitFor({state:'hidden'});
  let release;
  const gate=new Promise(resolve=>release=resolve);
  let editRequests=0;
  await context.route('**/medical-record-masterlist/TEST-PROGRAM-001',async route=>{
    editRequests++;await gate;await route.fallback();
  });
  const edit=actions.getByRole('button',{name:/Edit immunization record/});
  await edit.click();
  await page.waitForFunction(()=>document.querySelector('[aria-label^="Edit immunization record"]')?.getAttribute('aria-busy')==='true');
  assert.equal(await edit.getAttribute('aria-disabled'),'true');
  assert.equal(editRequests,1);
  await page.screenshot({path:path.join(output,`actions-loading-${theme}.png`),fullPage:true,animations:'disabled'});
  release();
  const editor=page.getByRole('dialog',{name:'Edit medical record',exact:true});
  await editor.getByRole('button',{name:'Choose another baby',exact:true}).waitFor();
  await editor.getByRole('button',{name:'Close medical record',exact:true}).click();
  await editor.waitFor({state:'hidden'});
  const axe=await page.evaluate(async()=>window.axe.run(document.querySelector('[role="group"][aria-label="Medical record actions"]')));
  assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  let deleteRequests=0;
  let releaseDelete;
  const deleteGate=new Promise(resolve=>releaseDelete=resolve);
  await context.route('**/medical-record-masterlist/delete',async route=>{
    deleteRequests++;
    const body=route.request().postDataJSON();
    assert.equal(body.recordId,'TEST-PROGRAM-001');
    assert.equal(body.reason,'Duplicate record confirmed against source card');
    assert.equal(body.expectedUpdatedAt,today);
    if(deleteRequests===1)return route.fulfill({status:409,json:{message:'Record changed'}});
    await deleteGate;
    checklist.medicalRecord=null;
    return route.fulfill({json:{success:true,recordId:body.recordId,deleted:true}});
  });
  const trash=actions.getByRole('button',{name:/Delete Immunization record/});
  await trash.click();
  const deletion=page.getByRole('dialog',{name:'Delete medical record?',exact:true});
  await deletion.waitFor();
  assert.equal(deleteRequests,0,'opening confirmation does not delete');
  await deletion.getByRole('button',{name:'Cancel',exact:true}).click();
  await deletion.waitFor({state:'hidden'});
  assert.equal(deleteRequests,0,'cancel does not delete');
  await trash.click();
  await deletion.getByRole('button',{name:'Delete record',exact:true}).click();
  await deletion.getByText('Enter the reason for deleting this medical record.',{exact:true}).waitFor();
  assert.equal(deleteRequests,0,'reason is required');
  await deletion.getByRole('textbox',{name:'Reason for deletion',exact:true}).fill('Duplicate record confirmed against source card');
  for(const width of [375,1440]){
    await page.setViewportSize({width,height:1000});
    try {await deletion.getByRole('textbox',{name:'Reason for deletion',exact:true}).waitFor();}
    catch(error){
      await page.screenshot({path:path.join(output,`delete-debug-${width}-${theme}.png`),fullPage:true});
      console.log(await page.locator('[role="dialog"]').evaluateAll(elements=>elements.map(element=>({label:element.getAttribute('aria-label'),text:element.textContent,inputs:element.querySelectorAll('input,textarea').length,rect:element.getBoundingClientRect().toJSON()}))));
      throw error;
    }
    await page.screenshot({path:path.join(output,`delete-confirmation-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
    const deletionAxe=await page.evaluate(async()=>window.axe.run(document.querySelector('[role="dialog"]')));
    assert.deepEqual(deletionAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  }
  await deletion.getByRole('button',{name:'Delete record',exact:true}).click();
  await deletion.getByText('This record changed. Cancel, refresh the table, and review it before deleting.',{exact:true}).waitFor();
  assert.equal(checklist.medicalRecord._id,'TEST-PROGRAM-001','failed deletion retains row');
  await deletion.getByRole('button',{name:'Cancel',exact:true}).click();
  await deletion.waitFor({state:'hidden'});
  await trash.click();
  await deletion.getByRole('textbox',{name:'Reason for deletion',exact:true}).fill('Duplicate record confirmed against source card');
  const confirm=deletion.getByRole('button',{name:'Delete record',exact:true});
  await confirm.click();
  await deletion.getByRole('button',{name:'Cancel',exact:true,disabled:true}).waitFor();
  await confirm.evaluate(element=>element.click());
  assert.equal(deleteRequests,2,'duplicate confirmation is locked');
  releaseDelete();
  await deletion.waitFor({state:'hidden'});
  await actions.waitFor({state:'hidden'});
  await page.getByText('Medical record deleted',{exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  console.log('PASS: icon-only 44px actions at 320–1920px, tooltips, keyboard View, Edit/loading, Delete cancellation/reason/stale conflict/locking/refresh, zero axe violations and page errors');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
