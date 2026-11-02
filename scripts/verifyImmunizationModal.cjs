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
doses[1].record=reviewRecord;checklist.history=[reviewRecord];
const output = process.env.IMMUNIZATION_SCREENSHOTS || '/tmp/immunization-modal-screenshots';
const theme = process.env.UI_THEME || 'light';
fs.mkdirSync(output,{recursive:true});

(async()=>{
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
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
  await page.addScriptTag({path:path.join(root,'node_modules/axe-core/axe.min.js')});
  const settleModal = () => page.waitForFunction(()=>{
   const modal=document.querySelector('[aria-modal="true"]');
   if(!modal || modal.getAnimations({subtree:true}).some(animation=>animation.playState==='running' && animation.effect?.getComputedTiming().iterations!==Infinity))return false;
   let node=modal.querySelector('[dir="auto"]') || modal;
   while(node){if(Number(getComputedStyle(node).opacity)<0.999)return false;node=node.parentElement;}
   return true;
  });

  const largeTextScreenshot = async (name) => {
   const text=dialog.locator('[dir="auto"]');
   const originals=await text.evaluateAll(elements=>elements.map(element=>{
    const original={fontSize:element.style.fontSize,lineHeight:element.style.lineHeight};
    const computed=getComputedStyle(element);
    const size=parseFloat(computed.fontSize),line=parseFloat(computed.lineHeight);
    element.style.fontSize=`${size*1.3}px`;
    if(Number.isFinite(line))element.style.lineHeight=`${line*1.3}px`;
    return original;
   }));
   const anchor=name==='immunization-checklist'?dialog.getByRole('button',{name:'Show BCG vaccine information',exact:true}):dialog.getByRole('heading',{name:'Vaccination details',exact:true});
   await anchor.evaluate(element=>element.scrollIntoView({block:'start'}));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${name} text overflow`);
   await page.screenshot({path:path.join(output,`${name}-large-text-${theme}.png`),fullPage:true,animations:'disabled'});
   await text.evaluateAll((elements,originals)=>elements.forEach((element,index)=>Object.assign(element.style,originals[index])),originals);
  };
  assert.equal(await dialog.getByRole('radio',{name:'Immunization',exact:true}).count(),1);
  assert.equal(await page.getByRole('button',{name:'Legacy medical records',exact:true}).count(),0);
  const originalUrl = page.url();
  await dialog.getByRole('radio',{name:'Immunization',exact:true}).click();
  assert.equal(await dialog.getByRole('button',{name:'Save medical record',exact:true}).count(),0);
  await dialog.getByRole('textbox',{name:'Search the master list for the resident',exact:true}).fill('Test');
  await dialog.getByRole('button',{name:/Choose Test fixture mother/}).click();
  await dialog.getByRole('checkbox',{name:/The name and birth date match the paper record/}).click();
  await dialog.getByRole('button',{name:'Select baby',exact:true}).click();
  await dialog.getByText(schedule.title,{exact:true}).waitFor();
  assert.equal(await dialog.getByText(/Schedule version:|Effective date:|Activation:/).count(),0);
  assert.equal(await dialog.getByText(/Target dates are shown for review/).count(),0);
  assert.equal(await dialog.getByText(/A checked dose has a saved administration/).count(),0);
  await dialog.getByText('Medical record: Not started',{exact:true}).waitFor();
  await dialog.getByText('Next assigned appointment: Not reserved',{exact:true}).waitFor();
  await dialog.getByText(/Proposed Thursday \(not reserved\):/).waitFor();
  assert.equal(page.url(),originalUrl,'selection must stay on the same page');
  const discard = page.getByRole('dialog',{name:'Discard unsaved immunization details?',exact:true});
  await dialog.getByRole('textbox',{name:'Replace temporary newborn name',exact:true}).fill(baby.name);
  await dialog.getByRole('radio',{name:'Prenatal',exact:true}).click();
  await discard.getByRole('button',{name:'Keep editing',exact:true}).click();
  let releaseRename;
  const renameGate = new Promise(resolve=>releaseRename=resolve);
  await context.route('**/immunization/babies/rename',async route=>{
   await renameGate;
   baby.temporaryName=false;
   return route.fulfill({status:200,json:{baby}});
  });
  await dialog.getByRole('button',{name:'Save baby name',exact:true}).click();
  await dialog.getByRole('button',{name:'Choose another baby',exact:true,disabled:true}).waitFor();
  assert.equal(await dialog.getByRole('button',{name:/BCG, Dose 1,/}).count(),0,'checklist navigation is locked during other clinical saves');
  releaseRename();
  await dialog.getByRole('button',{name:/BCG, Dose 1,/}).waitFor();
  await dialog.getByRole('button',{name:/Hepatitis B, Birth dose,/}).click();
  await dialog.getByText('Requires review',{exact:true}).waitFor({timeout:5000});
  assert.equal(await dialog.getByText('Voided',{exact:true}).count(),0,'a review request is not a voided administration');
  await dialog.getByRole('button',{name:'Back to checklist',exact:true}).click();
  for (const width of [375,768,1024,1280,1440,1920]) {
   await page.setViewportSize({width,height:1000});
   await page.waitForFunction(wide=>Boolean(document.querySelector('[role="table"][aria-label="Infant immunization checklist"]'))===wide,width>=1280);
   await dialog.getByRole('button',{name:'Show BCG vaccine information',exact:true}).scrollIntoViewIfNeeded();
   await settleModal();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`checklist overflow at ${width}`);
   await page.screenshot({path:path.join(output,`immunization-redesigned-checklist-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
   if(width===375)await largeTextScreenshot('immunization-checklist');
  }
  await page.setViewportSize({width:1440,height:1000});
  await dialog.getByRole('button',{name:'Show BCG vaccine information',exact:true}).focus();
  await page.keyboard.press('Enter');
  await dialog.getByText('Severe forms of tuberculosis',{exact:true}).waitFor();
  await dialog.getByRole('button',{name:'Hide BCG vaccine information',exact:true}).click();
  await dialog.getByText(schedule.title,{exact:true}).evaluate(element=>element.scrollIntoView({block:'start'}));
  await page.screenshot({path:path.join(output,`immunization-same-modal-checklist-${theme}.png`),fullPage:true,animations:'disabled'});
  await dialog.getByRole('button',{name:/BCG, Dose 1,/}).click();
  await dialog.getByRole('textbox',{name:'Clinician who administered the dose (optional)',exact:true}).waitFor();
  assert.equal(await page.getByRole('dialog').count(),1,'dose entry cannot stack a second modal');
  for(const width of [375,768,1024,1280,1440,1920]){
   await page.setViewportSize({width,height:1000});
   // React Native Web applies its dimension subscription after the browser resize.
   await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);
   await page.waitForFunction(()=>{
    const input=document.querySelector('input[aria-label="Clinician who administered the dose (optional)"]');
    const bounds=input?.getBoundingClientRect();
    return bounds && bounds.y>=0 && bounds.y<920;
   });
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
   const inputBounds = await dialog.getByRole('textbox',{name:'Clinician who administered the dose (optional)',exact:true}).boundingBox();
   assert.ok(inputBounds && inputBounds.y>=0 && inputBounds.y<920,`dose entry is brought into view at ${width}`);
   await page.screenshot({path:path.join(output,`immunization-same-modal-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
  }
  await page.setViewportSize({width:1440,height:1000});
  await dialog.getByRole('button',{name:'Close dose entry',exact:true}).click();
  await dialog.getByRole('radio',{name:'Prenatal',exact:true}).click();
  await dialog.getByRole('button',{name:'Save medical record',exact:true}).waitFor();
  assert.equal(await dialog.getByText('Baby immunization record',{exact:true}).count(),0);
  await dialog.getByRole('radio',{name:'Immunization',exact:true}).click();
  await dialog.getByRole('button',{name:'Select baby',exact:true}).click();
  const openReview = async()=>{
   await dialog.getByRole('button',{name:/BCG, Dose 1,/}).click();
   await dialog.getByRole('textbox',{name:'Clinician who administered the dose (optional)',exact:true}).fill('Test fixture clinician');
   await dialog.getByRole('button',{name:/Actual administration date, required/}).click();
   const dateLabel = new Date(`${today}T00:00:00Z`).toLocaleDateString('en-US',{timeZone:'UTC',month:'long',day:'numeric',year:'numeric'});
   await page.getByRole('button',{name:dateLabel,exact:true}).click();
   await page.getByRole('button',{name:'Confirm actual administration date',exact:true}).click();
   await dialog.getByRole('button',{name:'Complete Record',exact:true}).click();
   await dialog.getByRole('button',{name:'Complete Record',exact:true}).waitFor();
   assert.equal(await page.getByRole('dialog').count(),1,'review must remain in the original modal');
  };
  await openReview();
  await page.screenshot({path:path.join(output,`immunization-same-modal-review-${theme}.png`),fullPage:true,animations:'disabled'});
  await dialog.getByRole('button',{name:'Close medical record',exact:true}).click();
  const closeDiscard=page.getByRole('dialog',{name:'Discard your unsaved changes?',exact:true});
  await closeDiscard.getByRole('button',{name:'Keep editing',exact:true}).click();
  await dialog.getByRole('button',{name:'Complete Record',exact:true}).waitFor();

  await dialog.getByRole('radio',{name:'Prenatal',exact:true}).click();
  await discard.getByRole('button',{name:'Keep editing',exact:true}).click();
  assert.equal(await dialog.getByRole('button',{name:'Complete Record',exact:true}).count(),1,'cancelling discard retains review input');
  await context.route('**/immunization/administrations',route=>route.fulfill({status:400,json:{message:'Test save failure. Retry the administration.'}}));
  await dialog.getByRole('button',{name:'Complete Record',exact:true}).click();
  await dialog.getByText(/Test save failure/).waitFor();
  await dialog.getByRole('button',{name:'Close dose entry',exact:true}).click();
  await discard.getByRole('button',{name:'Discard',exact:true}).click();
  assert.ok(!(await dialog.getByRole('button',{name:/BCG, Dose 1,/}).getAttribute('aria-label')).includes('Administered.'));
  await openReview();
  let releaseSave;
  const gate = new Promise(resolve=>releaseSave=resolve);
  await context.route('**/immunization/administrations',async route=>{
   await gate;
   doses[0].record={_id:'TEST-DOSE-001',babyId:baby._id,doseKey:'bcg-1',state:'administered',administeredOn:today,administeredBy:'Test fixture clinician',facility:'Test health center',lotNumber:'TEST-LOT-01',route:'Intradermal',recordedBy:'TEST-STAFF',revision:0,createdAt:today,updatedAt:today,history:[{action:'administered',reason:'Initial administration record',actor:'TEST-STAFF',at:today,previous:null}]};doses[0].status='Administered';checklist.history=[doses[0].record,reviewRecord];
   checklist.medicalRecord={_id:'TEST-PROGRAM-001',recordStatus:'in_progress',immunizationProgress:{administered:1,total:15}};
   return route.fulfill({status:201,json:{success:true}});
  });
  await dialog.getByRole('button',{name:'Complete Record',exact:true}).click();
  await dialog.getByRole('button',{name:'Close medical record',exact:true,disabled:true}).waitFor();
  assert.equal(await dialog.getByRole('radio',{name:'Immunization',exact:true}).getAttribute('aria-disabled'),'true');
  releaseSave();
  await dialog.getByRole('button',{name:/BCG, Dose 1,.*Administered/}).waitFor();
  await dialog.getByText('Medical record: In progress · 1 of 15 doses administered',{exact:true}).waitFor();
  // Saved doses must open read-first details; inspecting must never start an edit.
  await dialog.getByRole('button',{name:/BCG, Dose 1,.*Administered/}).click();
  await dialog.getByRole('heading',{name:'Vaccination details',exact:true}).waitFor({timeout:5000});
  assert.equal(await dialog.getByRole('textbox').count(),0,'viewing a saved dose must not expose editable fields');
  await dialog.getByText('TEST-LOT-01',{exact:true}).waitFor();
  assert.equal(await page.getByRole('dialog').count(),1,'saved details stay in the original medical-record modal');
  await dialog.getByRole('button',{name:'Edit saved record',exact:true}).click();
  await dialog.getByRole('button',{name:'Review selected dose',exact:true}).click();
  await dialog.getByText('Enter the reason for correcting or voiding this record.',{exact:false}).waitFor();
  await dialog.getByRole('textbox',{name:'Reason for correction or void',exact:true}).fill('Correct facility from paper record');
  await dialog.getByRole('textbox',{name:'Facility (optional)',exact:true}).fill('Corrected test health center');
  await dialog.getByRole('button',{name:'Review selected dose',exact:true}).click();
  await context.route('**/immunization/corrections',async route=>{
   const body=route.request().postDataJSON();
   assert.equal(body.expectedRevision,0);assert.equal(body.reason,'Correct facility from paper record');
   assert.equal(body.babyId,'TEST-BABY-001');assert.equal(body.doseKey,'bcg-1');
   const record=doses[0].record;
   record.history.push({action:'corrected',reason:body.reason,actor:'TEST-STAFF',at:today,previous:{facility:record.facility}});
   record.facility=body.administration.facility;record.revision=1;
   return route.fulfill({status:200,json:{success:true}});
  });
  await dialog.getByRole('button',{name:'Save correction',exact:true}).click();
  await dialog.getByRole('button',{name:/BCG, Dose 1,.*Administered/}).waitFor();
  assert.equal(await dialog.getByText('Saved dose history',{exact:true}).count(),0);
  const savedDoseButton=dialog.getByRole('button',{name:/BCG, Dose 1,.*Administered/});
  await savedDoseButton.focus();await page.keyboard.press('Enter');
  await dialog.getByText('Corrected test health center',{exact:true}).waitFor();
  await dialog.getByRole('button',{name:'Show audit history',exact:true}).click();
  await dialog.getByText('Correct facility from paper record',{exact:true}).waitFor();
  for (const width of [375,768,1440]) {
   await page.setViewportSize({width,height:1000});
   await dialog.getByRole('heading',{name:'Vaccination details',exact:true}).evaluate(element=>element.scrollIntoView({block:'start'}));
   await settleModal();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`vaccination details overflow at ${width}`);
   await page.screenshot({path:path.join(output,`immunization-vaccination-details-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
   if(width===375)await largeTextScreenshot('immunization-vaccination-details');
  }
  await page.setViewportSize({width:1440,height:1000});
  const vaccinationAxe=await page.evaluate(async()=>window.axe.run(document.querySelector('[aria-modal="true"]')));
  assert.deepEqual(vaccinationAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  await dialog.getByRole('button',{name:'Back to checklist',exact:true}).click();
  const savedTable=dialog.getByRole('table',{name:'Infant immunization checklist',exact:true});
  await savedTable.evaluate(element=>element.scrollIntoView({block:'center'}));
  await savedTable.screenshot({path:path.join(output,`immunization-checklist-saved-${theme}.png`),animations:'disabled'});

  await page.setViewportSize({width:375,height:1000});
  await dialog.getByText('Medical record: In progress · 1 of 15 doses administered',{exact:true}).evaluate(element=>element.scrollIntoView({block:'center'}));
  await page.screenshot({path:path.join(output,`immunization-progress-375-${theme}.png`),fullPage:true,animations:'disabled'});
  await page.setViewportSize({width:1440,height:1000});
  assert.equal(page.url(),originalUrl);

  await settleModal();
  const axe = await page.evaluate(async()=>window.axe.run(document.querySelector('[aria-modal="true"]')));
  const violations = axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));
  console.log(JSON.stringify({axe:violations,errors}));
  assert.equal(errors.length,0);
  assert.equal(violations.length,0);
  await dialog.getByRole('button',{name:'Close medical record',exact:true}).click();
  await dialog.waitFor({state:'hidden'});
  await page.getByText('In progress · 1 of 15 doses administered',{exact:true}).waitFor();
  await page.screenshot({path:path.join(output,`immunization-progress-list-${theme}.png`),fullPage:true,animations:'disabled'});
  await page.getByRole('button',{name:/View the Immunization record for/}).click();
  const details=page.getByRole('dialog',{name:'Medical record',exact:true});
  await details.getByText('In progress · 1 of 15 doses administered',{exact:true}).waitFor();
  assert.equal(await details.getByRole('button',{name:'Edit record',exact:true}).count(),1);
  for(const width of [375,768,1440]){
   await page.setViewportSize({width,height:1000});
   await details.getByText('Baby immunization program',{exact:true}).evaluate(element=>element.scrollIntoView({block:'center'}));
   await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);
   await page.screenshot({path:path.join(output,`immunization-progress-detail-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
  }
  await settleModal();
  await page.setViewportSize({width:375,height:1000});
  await settleModal();
  const scaled=await details.locator('[dir="auto"]').evaluateAll(elements=>elements.map(element=>({element,size:parseFloat(getComputedStyle(element).fontSize),line:parseFloat(getComputedStyle(element).lineHeight)})).map(({element,size,line})=>{element.style.fontSize=`${size*1.3}px`;if(Number.isFinite(line))element.style.lineHeight=`${line*1.3}px`;return true;}));
  assert.ok(scaled.length>0);
  await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);
  await page.screenshot({path:path.join(output,`immunization-progress-detail-large-text-${theme}.png`),fullPage:true,animations:'disabled'});
  const detailAxe=await page.evaluate(async()=>window.axe.run(document.querySelector('[aria-modal="true"]')));
  assert.deepEqual(detailAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  assert.deepEqual(errors,[]);
  console.log('PASS: compact responsive checklist, read-first saved details, audited correction with required reason, review follow-up labels, keyboard access, 130% text, failed-save recovery, save locking, and In progress records; zero axe violations');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
