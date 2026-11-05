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

const output = process.env.IMMUNIZATION_SCREENSHOTS || '/tmp/immunization-draft-screenshots';
const theme = process.env.UI_THEME || 'light';
fs.mkdirSync(output,{recursive:true});

(async()=>{
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true});
  await context.routeWebSocket('**/*',socket=>socket.close());
  await context.addInitScript(theme=>{
   const payload = btoa(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600,platform:'web',role:'midwife'}));
   localStorage.setItem('maslogcare_current_user',JSON.stringify({id:'TEST-STAFF',name:'Test fixture midwife',role:'midwife',token:`test.${payload}.test`,verified:true}));
   localStorage.setItem('maslogcare_ui_theme',theme);
  },theme);
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
    const file = route.request().resourceType()==='document'?path.join(dist,'midwife/medical-records.html'):path.join(dist,url.pathname);
    if(fs.existsSync(file))return route.fulfill({contentType:file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':undefined,body:fs.readFileSync(file)});
    return route.fulfill({status:404,body:''});
   }
   return route.fulfill({json:{success:true,notifications:[],unreadCount:0,data:[],records:[],forms:[],residents:[],appointments:[],pagination:{total:0}}});
  });
  await page.goto('http://127.0.0.1:8091/midwife/medical-records');
  await page.getByRole('button',{name:'Add medical record',exact:true}).first().click();
  const dialog = page.getByRole('dialog',{name:'Add medical record',exact:true});
  await dialog.waitFor();

  let mutations = 0;
  let revision = 0;
  await context.route('**/immunization/drafts', async route => {
    mutations++;
    const body = route.request().postDataJSON();
    assert.equal(body.babyId,baby._id);
    assert.equal(body.motherMasterResidentId,mother.masterResidentId);
    assert.equal(body.doseKey,'bcg-1');
    assert.equal(body.administeredOn,'');
    doses[0].record={...body,_id:'TEST-DOSE-001',state:'pending',workflowStatus:'draft',revision:revision++,recordedBy:'TEST-STAFF',createdAt:today,updatedAt:today,history:[]};
    checklist.history=[doses[0].record];
    checklist.medicalRecord={_id:'TEST-PROGRAM-001',workflowStatus:'draft',recordStatus:'in_progress',immunizationProgress:{administered:0,total:15}};
    await route.fulfill({json:{success:true}});
  });
  const bcg = () => dialog.getByRole('button',{name:/BCG, Dose 1,/});
  const discard = page.getByRole('dialog',{name:'Discard unsaved immunization details?',exact:true});
  const doseDialog = page.getByRole('dialog',{name:'Vaccination Dose Details',exact:true});
  await dialog.getByRole('radio',{name:'Immunization',exact:true}).click();
  await dialog.getByRole('textbox',{name:'Search the master list for the resident',exact:true}).fill('Test');
  await dialog.getByRole('button',{name:/Choose Test fixture mother/}).click();
  await dialog.getByRole('checkbox',{name:/The name and birth date match the paper record/}).click();
  await dialog.getByRole('button',{name:'Select baby',exact:true}).click();
  await bcg().click();
  await doseDialog.getByRole('textbox',{name:'Remarks (optional)',exact:true}).fill('Draft test clinic');
  await doseDialog.getByRole('textbox',{name:'Immediate reaction (optional)',exact:true}).fill('TEST-DRAFT-LOT');
  await doseDialog.getByRole('button',{name:'Save Vaccination Details',exact:true}).click();
  await doseDialog.getByText('Select the actual date this dose was administered.',{exact:false}).waitFor();
  assert.equal(mutations,0);
  await doseDialog.getByRole('button',{name:'Save Draft',exact:true}).click();
  await doseDialog.waitFor({state:'hidden'});
  await bcg().waitFor();
  await page.waitForFunction(()=>[...document.querySelectorAll('[role=button]')].some(el=>/^BCG, Dose 1,.*Draft\. Not administered/.test(el.getAttribute('aria-label')||'')));
  assert.equal(checklist.medicalRecord.immunizationProgress.administered,0);
  await bcg().hover();
  await dialog.getByText('Clinician: Not recorded',{exact:false}).waitFor();
  assert.equal(mutations,1,'hover cannot write');
  await bcg().focus(); await page.keyboard.press('Enter');
  await doseDialog.waitFor();
  await doseDialog.getByText('Not yet recorded (draft)',{exact:true}).first().waitFor();
  assert.equal(await doseDialog.getByRole('textbox').count(),0,'details are read-only');
  assert.equal(mutations,1,'keyboard inspection cannot write');
  await doseDialog.getByRole('button',{name:'Edit draft',exact:true}).click();
  assert.equal(await doseDialog.getByRole('textbox',{name:'Remarks (optional)',exact:true}).inputValue(),'Draft test clinic');
  assert.equal(await doseDialog.getByRole('textbox',{name:'Immediate reaction (optional)',exact:true}).inputValue(),'TEST-DRAFT-LOT');
  await doseDialog.getByRole('textbox',{name:'Remarks (optional)',exact:true}).fill('Updated draft clinic');
  await doseDialog.getByRole('button',{name:'Cancel',exact:true}).click();
  await discard.getByRole('button',{name:'Keep editing',exact:true}).click();
  await doseDialog.getByRole('button',{name:'Save Draft',exact:true}).click();
  await doseDialog.waitFor({state:'hidden'});
  await bcg().waitFor();
  await dialog.getByRole('button',{name:'Close medical record',exact:true}).click();
  await dialog.waitFor({state:'hidden'});
  await page.getByText('Draft entries · In progress · 0 of 15 doses administered',{exact:true}).waitFor();
  await page.getByRole('button',{name:/Edit immunization record for/}).click();
  const editor = page.getByRole('dialog',{name:'Edit medical record',exact:true});
  await editor.waitFor();
  await editor.getByRole('button',{name:/BCG, Dose 1,/}).click();
  await doseDialog.getByRole('button',{name:'Edit draft',exact:true}).click();
  assert.equal(await doseDialog.getByRole('textbox',{name:'Remarks (optional)',exact:true}).inputValue(),'Updated draft clinic');
  // Reload/close-tab protection must be installed while edits are unsaved.
  await doseDialog.getByRole('textbox',{name:'Remarks (optional)',exact:true}).fill('Unsaved edit');
  await page.waitForFunction(()=>{const event=new Event('beforeunload',{cancelable:true});window.dispatchEvent(event);return event.defaultPrevented;});
  await doseDialog.getByRole('button',{name:'Cancel',exact:true}).click();
  await discard.getByRole('button',{name:'Discard',exact:true}).click();
  await doseDialog.waitFor({state:'hidden'});
  assert.equal(mutations,2);
  await page.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
  for (const width of [375,768,1024,1280,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    await page.waitForFunction(wide=>Boolean(document.querySelector('[role="table"][aria-label="Infant immunization checklist"]'))===wide,width>=1024);
    const doseButton = editor.getByRole('button',{name:/BCG, Dose 1,/});
    await doseButton.waitFor({state:'visible'});
    await doseButton.scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(output,`draft-checklist-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
    if (width === 375) await doseButton.tap();
    else await doseButton.click();
    await doseDialog.waitFor();
    assert.equal(mutations,2,'tap/click cannot write or toggle');
    assert.equal(doses[0].record.state,'pending');
    const axe = await page.evaluate(async()=>window.axe.run([...document.querySelectorAll('[role=dialog]')].at(-1)));
    assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),[]);
    await page.screenshot({path:path.join(output,`draft-details-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
    if (width === 375) {
      const originals=await doseDialog.locator('[dir="auto"]').evaluateAll(elements=>elements.map(element=>{
        const saved={fontSize:element.style.fontSize,lineHeight:element.style.lineHeight};
        const computed=getComputedStyle(element);
        element.style.fontSize=`${parseFloat(computed.fontSize)*1.3}px`;
        const line=parseFloat(computed.lineHeight);
        if(Number.isFinite(line))element.style.lineHeight=`${line*1.3}px`;
        return saved;
      }));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'draft text scaling overflow');
      await page.screenshot({path:path.join(output,`draft-details-large-text-${theme}.png`),fullPage:true,animations:'disabled'});
      await doseDialog.locator('[dir="auto"]').evaluateAll((elements,saved)=>elements.forEach((element,index)=>Object.assign(element.style,saved[index])),originals);
    }

    await doseDialog.getByRole('button',{name:'Close',exact:true}).click();
    await doseDialog.waitFor({state:'hidden'});
  }
  await editor.getByRole('button',{name:'Close medical record',exact:true}).click();
  assert.deepEqual(errors,[]);
  console.log('PASS: draft creation, incomplete validation, reopen/edit from table, hover/keyboard/tap details without writes, navigation warning, responsive details and axe');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
