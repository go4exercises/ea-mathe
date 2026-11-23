/* Render-Check bei 375 px: scrollWidth je Seite, JS-Fehler, MathJax-Fehler, geladene Schriften, externe Anfragen.
   Aufruf vom Repo-Root:  PLAYWRIGHT=~/sek1-mathe/node_modules/playwright node scripts/render-check.js
   Erwartet: jede Zeile «sw=375 merr=0», keine «ERR», am Schluss «extern: keine». */
const {chromium}=require(process.env.PLAYWRIGHT||'playwright');
const fs=require('fs'),path=require('path');
const dir=require('path').resolve(__dirname,'..');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:375,height:800}});
const ext=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.html')).sort()){
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  p.on('request',r=>{if(!r.url().startsWith('file:')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))ext.push(f+' '+r.url())});
  await p.goto('file://'+dir+'/'+f);await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{const W=document.documentElement.clientWidth;const out=[];
    for(const el of document.querySelectorAll('body *')){const rc=el.getBoundingClientRect();if(rc.right>W+1&&rc.width>0){let a=el.parentElement,clip=false;while(a&&a!==document.body){const o=getComputedStyle(a).overflowX;if(o!=='visible'){clip=true;break}a=a.parentElement}if(!clip)out.push(el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+(el.className&&typeof el.className==='string'?'.'+el.className.split(' ').join('.'):'')+' r='+Math.round(rc.right))}}
    return {sw:document.documentElement.scrollWidth,merr:document.querySelectorAll('[data-mjx-error],mjx-merror').length,fam:getComputedStyle(document.body).fontFamily,fontsOk:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)===i),bad:out.slice(0,8)}});
  console.log(f,'sw='+r.sw,'merr='+r.merr,'fonts='+r.fontsOk.join('/'),errs.length?'ERR '+errs.join(' | '):'',r.sw>375?'\n   '+r.bad.join('\n   '):'');await p.close()}
console.log('extern:',ext.length?ext.join('\n'):'keine');await b.close()})();
