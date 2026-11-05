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

const output = process.env.IMMUNIZATION_SCREENSHOTS || '/tmp/immunization-modal-screenshots';
// Admin is read-only and has no Add button: scripts/verifyAdminMedicalRecordReadOnly.cjs covers it.
const role = process.env.TEST_VIEWER_ROLE || 'doctor';
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

  // The fixture deliberately offers immunization forms to test the UI role gate.
  checklist.medicalRecord={_id:'TEST-PROGRAM-001',workflowStatus:'draft',recordStatus:'in_progress',immunizationProgress:{administered:0,total:15}};
  await page.goto(`http://127.0.0.1:8091/${role}/medical-records`);
  await page.getByRole('button',{name:/View the Immunization record/}).waitFor();
  assert.equal(await page.getByRole('button',{name:/Delete Immunization record/}).count(),0,`${role} cannot delete immunization records`);
  assert.equal(await page.getByRole('button',{name:/Edit immunization record/}).count(),0);
  await page.getByRole('button',{name:'Add medical record',exact:true}).first().click();
  const dialog=page.getByRole('dialog',{name:'Add medical record',exact:true});
  await dialog.getByRole('radio',{name:'Prenatal',exact:true}).waitFor();
  assert.equal(await dialog.getByRole('radio',{name:'Immunization',exact:true}).count(),0,`${role} cannot choose immunization creation`);
  assert.equal(await dialog.getByRole('button',{name:'Save Draft',exact:true}).count(),0);
  assert.equal(await dialog.getByRole('button',{name:'Complete Record',exact:true}).count(),0);
  assert.equal(await page.getByRole('button',{name:/Edit immunization record/}).count(),0,`${role} cannot edit clinical doses`);
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${role} UI hides immunization creation and editing despite offered form metadata`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
