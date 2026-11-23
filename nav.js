/* ======================= Navigation: Blöcke (Pulldown) und Kapitelmenü (rechts) =======================
   Neue Blöcke oder Kapitel werden nur hier in BLOCKS eingetragen. Kapitel ohne Seite (p:null) erscheinen als «folgt». */
(function(){
  "use strict";
  const BLOCKS=[
    {n:1,t:'Grundoperationen, Algebra, Geometrie',home:'index.html',ch:[
      {p:'1-1.html',t:'1.1 Grundoperationen',a:'aufgaben-11.html'},{p:'1-2.html',t:'1.2 Algebra',a:'aufgaben-12.html'},{p:'1-3.html',t:'1.3 Geometrie',a:'aufgaben-13.html'}]},
    {n:2,t:'Bruchterme, Gleichungen, Geometrie',home:'index2.html',ch:[
      {p:'2-1.html',t:'2.1 Bruchrechnen mit Termen',a:'aufgaben-21.html'},{p:'2-2.html',t:'2.2 Gleichungen',a:'aufgaben-22.html'},{p:'2-3.html',t:'2.3 Geometrie',a:'aufgaben-23.html'}]},
    {n:3,t:'Potenzen, Ungleichungen, Geometrie',home:null,ch:[
      {p:null,t:'3.1 Potenzgesetze'},{p:null,t:'3.2 Ungleichungen, Gleichungssysteme'},{p:null,t:'3.3 Geometrie: Berechnungen'}]},
    {n:4,t:'Funktionen, Kombinatorik, Geometrie',home:null,ch:[
      {p:null,t:'4.1 Lineare Funktionen'},{p:null,t:'4.2 Einfache kombinatorische Probleme'},{p:null,t:'4.3 Geometrie: Ähnlichkeit'},{p:null,t:'4.4 Geometrie: Körperberechnungen'}]}];
  const page=(location.pathname.split('/').pop()||'index.html').split('?')[0]||'index.html';
  let curB=null,curC=null,isAuf=false;
  for(const b of BLOCKS){if(b.home===page)curB=b;for(const c of b.ch){if(c.p===page||c.a===page){curB=b;curC=c;isAuf=c.a===page}}}
  if(!curB&&/^index/.test(page))curB=BLOCKS[0];

  /* ---------- «Über»-Inhalte (Autor, Lizenz) — Texte wie sek1-mathe ---------- */
  const UEBER_AUTOR=`<div class="meta-titel">Autor</div>
    <img class="meta-portrait" src="autor.jpg" width="112" height="112" loading="lazy" alt="Porträt von Raphael Arnold Kohler (Aquarell)">
    <p><strong>Autor:</strong> Raphael Arnold Kohler, Elektroingenieur und BM-Fachlehrperson für Mathematik und Physik mit über 30 Jahren Unterrichtserfahrung.</p>
    <p>Bei der Erstellung und technischen Umsetzung wurden KI-Werkzeuge eingesetzt. Alle veröffentlichten Inhalte werden redaktionell geprüft; die Verantwortung für die Veröffentlichung liegt bei Raphael Arnold Kohler.</p>`;
  const UEBER_LIZENZ=`<div class="meta-titel">Lizenz</div>
    <p><strong>Autor:</strong> Raphael Arnold Kohler. Soweit nicht anders angegeben, stehen die von ihm erstellten Lerninhalte unter der Lizenz <strong>Creative Commons Namensnennung – Nicht kommerziell 4.0 International (CC BY-NC 4.0)</strong>.</p>
    <p>Die Inhalte dürfen für nicht-kommerzielle Zwecke geteilt und bearbeitet werden. Dabei sind Raphael Arnold Kohler als Urheber zu nennen, die Lizenz zu verlinken und Änderungen kenntlich zu machen. Inhalte Dritter und verlinkte externe Angebote unterliegen ihren eigenen Rechten und Nutzungsbedingungen.</p>
    <p><em>Empfohlene Namensnennung:</em> Raphael Arnold Kohler, EA Mathe begreifbar, https://ea-mathe.begreifbar.ch/, CC BY-NC 4.0.</p>
    <p><a href="https://creativecommons.org/licenses/by-nc/4.0/deed.de" target="_blank" rel="noopener" class="meta-link">→ Lizenztext (CC BY-NC 4.0)</a></p>
    <p><a href="https://github.com/go4exercises/ea-mathe" target="_blank" rel="noopener" class="meta-link">→ Quelltext und Inhalte des Lehrmittels (GitHub)</a></p>`;

  /* ---------- obere Leiste (Aufbau wie sek1-mathe: Logo · Menüs · Trennstrich · Über) ---------- */
  const bar=document.querySelector('.blocknav');
  if(bar){
    const nr=t=>t.split(' ')[0], tit=t=>t.slice(t.indexOf(' ')+1);
    let dd='',mn='';
    for(const b of BLOCKS){const ready=!!b.home;
      dd+=`<div class="dd-gruppe"><div class="dd-gruppe-titel">Block ${b.n}<small>${b.t}</small></div>`;
      mn+=`<details class="mn-lg"${b===curB?' open':''}><summary>Block ${b.n} · ${b.t}</summary><div class="mn-body">`;
      if(ready){dd+=`<a href="${b.home}"${page===b.home?' class="dd-aktiv"':''}><span class="dd-nr">${b.n}</span><span class="dd-tit">Übersicht und Gesamtquiz</span></a>`;
        mn+=`<a href="${b.home}"${page===b.home?' class="mn-aktiv"':''}>Übersicht und Gesamtquiz</a>`}
      for(const c of b.ch){
        if(!c.p){dd+=`<span class="dd-dis"><span class="dd-nr">${nr(c.t)}</span><span class="dd-tit">${tit(c.t)} <small>in Vorbereitung</small></span></span>`;mn+=`<span class="mn-dis">${c.t} · in Vorbereitung</span>`;continue}
        dd+=`<a href="${c.p}"${c===curC&&!isAuf?' class="dd-aktiv"':''}><span class="dd-nr">${nr(c.t)}</span><span class="dd-tit">${tit(c.t)}</span></a>`;
        mn+=`<a href="${c.p}"${c===curC&&!isAuf?' class="mn-aktiv"':''}>${c.t}</a>`;
        if(c.a){dd+=`<a class="dd-sub${c===curC&&isAuf?' dd-aktiv':''}" href="${c.a}" target="_blank" rel="noopener"><span class="dd-nr"></span><span class="dd-tit">✎ Übungsaufgaben ${nr(c.t)}</span></a>`;
          mn+=`<a class="mn-sub${c===curC&&isAuf?' mn-aktiv':''}" href="${c.a}" target="_blank" rel="noopener">✎ Übungsaufgaben ${nr(c.t)}</a>`}}
      dd+='</div>';mn+='</div></details>'}
    bar.innerHTML=`<header class="site-hdr">
  <a href="index.html" class="logo">IDM EA Mathematik</a>
  <nav class="site-nav">
    <div class="dropdown"><button type="button" class="nav-btn${curC?' aktiv':''}" data-dd="dd-bl">Unterrichtsblöcke ▾</button>
      <div class="dd-menu dd-menu-gross" id="dd-bl">${dd}</div></div>
    <span class="nav-sep" aria-hidden="true"></span>
    <div class="dropdown"><button type="button" class="nav-btn nav-meta" data-dd="dd-ueber">Über ▾</button>
      <div class="dd-menu dd-menu-ueber" id="dd-ueber">
        <div class="ueber-tabs" role="tablist"><button type="button" class="ueber-tab aktiv" role="tab" data-target="ueber-autor">Autor</button><button type="button" class="ueber-tab" role="tab" data-target="ueber-lizenz">Lizenz</button></div>
        <div class="ueber-panels"><div class="ueber-panel aktiv" id="ueber-autor" role="tabpanel">${UEBER_AUTOR}</div><div class="ueber-panel" id="ueber-lizenz" role="tabpanel">${UEBER_LIZENZ}</div></div>
      </div></div>
  </nav>
  <button type="button" class="burger" aria-label="Navigation">☰</button>
</header>
<div class="mobile-nav" id="mobile-nav">
  <a href="index.html" class="mn-direkt">← Übersicht</a>
  <details class="mn-sektion" open><summary>Unterrichtsblöcke</summary><div class="mn-body">${mn}</div></details>
  <details class="mn-sektion"><summary>Über dieses Lehrmittel</summary><div class="mn-body">
    <details class="mn-meta"><summary>Autor</summary><div class="mn-meta-body">${UEBER_AUTOR}</div></details>
    <details class="mn-meta"><summary>Lizenz</summary><div class="mn-meta-body">${UEBER_LIZENZ}</div></details></div></details>
</div>`;
    const menus=[...bar.querySelectorAll('.dd-menu')];
    const closeAll=except=>menus.forEach(m=>{if(m!==except)m.classList.remove('open')});
    bar.querySelectorAll('[data-dd]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const m=document.getElementById(btn.dataset.dd);const o=!m.classList.contains('open');closeAll(m);m.classList.toggle('open',o)}));
    document.addEventListener('click',e=>{if(!e.target.closest('.blocknav .dropdown'))closeAll(null)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll(null)});
    bar.querySelector('.burger').addEventListener('click',()=>bar.querySelector('.mobile-nav').classList.toggle('open'));
    bar.querySelectorAll('.ueber-tab').forEach(t=>t.addEventListener('click',()=>{const w=t.closest('.dd-menu-ueber');
      w.querySelectorAll('.ueber-tab').forEach(x=>x.classList.toggle('aktiv',x===t));w.querySelectorAll('.ueber-panel').forEach(p=>p.classList.toggle('aktiv',p.id===t.dataset.target))}));
  }

  /* ---------- Kapitelmenü rechts (folgt beim Scrollen mit) ---------- */
  const top=document.querySelector('nav.top');
  const links=top?[...top.querySelectorAll('a')].filter(a=>a.getAttribute('href').startsWith('#')):[];
  const secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  if(secs.length>=2){
    document.body.classList.add('has-sn');
    const sn=document.createElement('aside');sn.className='sn';sn.setAttribute('aria-label','Inhalt');
    let h=`<button type="button" class="sn-tab" aria-expanded="false"><span>Inhalt</span></button><div class="sn-box"><div class="sn-tit">${curC?curC.t:curB?'Block '+curB.n:'Inhalt'}${isAuf?' · Aufgaben':''}</div><ol>`;
    links.forEach(a=>{const id=a.getAttribute('href').slice(1);if(document.getElementById(id))h+=`<li><a href="#${id}" data-id="${id}">${a.textContent.trim()}</a></li>`});
    h+='</ol><div class="sn-foot">';
    if(curC&&!isAuf&&curC.a)h+=`<a href="${curC.a}" target="_blank" rel="noopener">✎ Übungsaufgaben</a>`;
    if(curC&&isAuf)h+=`<a href="${curC.p}">← zum Kapitel</a>`;
    h+='<a href="#" data-top="1">↑ nach oben</a></div></div>';
    sn.innerHTML=h;document.body.appendChild(sn);
    const tab=sn.querySelector('.sn-tab');
    tab.addEventListener('click',e=>{e.stopPropagation();const o=!sn.classList.contains('open');sn.classList.toggle('open',o);tab.setAttribute('aria-expanded',String(o))});
    document.addEventListener('click',e=>{if(!sn.contains(e.target))sn.classList.remove('open')});
    sn.querySelectorAll('a[data-id],a[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();sn.classList.remove('open');
      if(a.dataset.top){window.scrollTo({top:0,behavior:'smooth'});return}
      const el=document.getElementById(a.dataset.id);const y=el.getBoundingClientRect().top+window.scrollY-56;window.scrollTo({top:y,behavior:'smooth'});history.replaceState(null,'','#'+a.dataset.id)}));
    const items=[...sn.querySelectorAll('a[data-id]')];let last=null;
    function spy(){let cur=secs[0];for(const s of secs){if(s.getBoundingClientRect().top<=window.innerHeight*0.3)cur=s}
      if((window.innerHeight+window.scrollY)>=document.documentElement.scrollHeight-4)cur=secs[secs.length-1];
      if(cur!==last){last=cur;items.forEach(a=>a.classList.toggle('on',a.dataset.id===cur.id))}}
    window.addEventListener('scroll',spy,{passive:true});window.addEventListener('resize',spy);spy();
  }
})();
