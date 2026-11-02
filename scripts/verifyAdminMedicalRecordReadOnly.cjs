'use strict';
// Real application UI, fictional fixtures, intercepted HTTP/WebSockets only.
// Run after exporting web; backend authorization is covered by integration tests.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {getCompletionForm}=require('../../backend/config/medicalRecordFields');
const root=path.resolve(__dirname,'..');
const output='/tmp/admin-medical-read-only';
fs.mkdirSync(output,{recursive:true});
const stamp='2026-01-15T08:00:00.000Z';
const resident={masterResidentId:'TEST-001',fullName:'Sample Resident',dateOfBirth:'1990-01-01',sex:'female',purok:'3',hasAccount:false};
const encoded={_id:'TEST-RECORD',source:'manual_entry',serviceType:'bp_checking',serviceLabel:'Blood pressure',visitDate:stamp,providerName:'Sample BHW',providerRole:'bhw',createdById:'TEST-ADMIN',resident,linkage:'unlinked',createdAt:stamp,updatedAt:stamp};
const program={...encoded,_id:'TEST-PROGRAM',serviceType:'immunization',serviceLabel:'Immunization',baby:{_id:'TEST-BABY',name:'Sample baby',dateOfBirth:'2026-01-01'},workflowStatus:'draft',recordStatus:'in_progress',immunizationProgress:{administered:0,total:15}};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  for(const theme of ['light','dark']){
   const context=await browser.newContext({viewport:{width:1440,height:1000},hasTouch:true});
   await context.routeWebSocket('**/*',socket=>socket.close());
   await context.addInitScript(theme=>{
    const payload=btoa(JSON.stringify({exp:Math.floor(Date.now()/1000)+3600,platform:'web',role:'admin'}));
    localStorage.setItem('maslogcare_current_user',JSON.stringify({id:'TEST-ADMIN',name:'Sample admin',role:'admin',token:`test.${payload}.test`,verified:true}));
    localStorage.setItem('maslogcare_ui_theme',theme);
   },theme);
   let empty=false,writes=0;
   const page=await context.newPage(),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await context.route('**/*',route=>{
    const req=route.request(),url=new URL(req.url());
    if(url.pathname.includes('/medical-record-masterlist')){
     if(url.pathname.endsWith('/summary'))return route.fulfill({json:{summary:{total:empty?0:2,historical:0,linked:0,pendingReview:0,unlinked:empty?0:2,services:['bp_checking','immunization']}}});
     if(url.pathname.endsWith('/search'))return route.fulfill({json:{records:empty?[]:[encoded,program],pagination:{total:empty?0:2}}});
     if(req.method()!=='GET'){writes++;return route.fulfill({status:403,json:{message:'Administrators have read-only access.'}});}
     const row=url.pathname.endsWith('TEST-PROGRAM')?program:encoded;
     // A stale server advertising editable=true must still not expose admin editing.
     return route.fulfill({json:{detail:{...row,record:{...row,assessment:'Fictional clinical values',completedAt:stamp,serviceDetails:{systolic:120,diastolic:80}},form:getCompletionForm(row.serviceType),audit:{createdBy:null,createdByRole:'bhw',createdAt:stamp,updatedAt:stamp,updatedBy:null,updatedByRole:null,duplicateAcknowledged:false},revisions:[],editable:true}}});
    }
    if(url.pathname.endsWith('/appointments/completion-forms'))return route.fulfill({json:{forms:[getCompletionForm('bp_checking'),getCompletionForm('immunization')]}});
    if(url.hostname==='127.0.0.1'){
     const file=req.resourceType()==='document'?path.join(root,'dist/admin/medical-records.html'):path.join(root,'dist',url.pathname);
     return fs.existsSync(file)?route.fulfill({contentType:file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':undefined,body:fs.readFileSync(file)}):route.fulfill({status:404,body:''});
    }
    return route.fulfill({json:{success:true,notifications:[],unreadCount:0,data:[],users:[],records:[],pagination:{total:0}}});
   });
   for(const width of [375,768,1440]){
    empty=false;
    await page.setViewportSize({width,height:1000});
    await page.goto('http://127.0.0.1:8094/admin/medical-records');
    const actions=page.getByRole('group',{name:'Medical record actions',exact:true});
    await actions.first().waitFor();
    assert.equal(await actions.count(),2);
    assert.equal(await page.getByRole('button',{name:'Add medical record',exact:true}).count(),0,'no Add in page header');
    for(const group of await actions.all()){
     assert.equal(await group.getByRole('button').count(),1,'only View is offered');
     const view=group.getByRole('button');
     assert.match(await view.getAttribute('aria-label'),/^View the /);
     await view.focus();
     await page.keyboard.press('Enter');
     const dialog=page.getByRole('dialog',{name:'Medical record',exact:true});
     await dialog.waitFor();
     await dialog.getByText('Record history',{exact:true}).waitFor();
     assert.equal(await dialog.getByRole('button',{name:/Edit|Delete|Save/}).count(),0,'detail remains read-only despite stale editable metadata');
     await page.screenshot({path:`${output}/${theme}-${width}-detail.png`,fullPage:true});
     await dialog.getByRole('button',{name:'Close the medical record',exact:true}).last().click();
     await dialog.waitFor({state:'hidden'});
    }
    await page.screenshot({path:`${output}/${theme}-${width}.png`,fullPage:true});
    empty=true;
    await page.reload();
    await page.getByText('No medical records found',{exact:true}).waitFor();
    assert.equal(await page.getByRole('button',{name:'Add medical record',exact:true}).count(),0,'empty state has no Add');
    assert.equal(writes,0,'viewing never sends a write request');
    assert.deepEqual(errors,[],'no runtime errors');
    console.log(`PASS admin read-only: ${theme}, ${width}px; View opens records, no Add/Edit/Delete in rows/details/empty state`);
   }
   await context.close();
  }
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
