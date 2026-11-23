/* ======================= Quiz-Fragen Kapitel 1.1 Grundoperationen ======================= */
(function(){
  const M={N:'\\(\\mathbb{N}\\)',Z:'\\(\\mathbb{Z}\\)',Q:'\\(\\mathbb{Q}\\)',R:'\\(\\mathbb{R}\\)'};
  const NUMS=[['7','N'],['−12','Z'],['\\(\\tfrac{3}{4}\\)','Q'],['\\(\\sqrt{2}\\)','R'],['\\(-2.5\\)','Q'],['\\(\\sqrt{9}\\)','N'],['\\(\\pi\\)','R'],['\\(0.\\overline{3}\\)','Q'],['\\(\\tfrac{12}{4}\\)','N'],['\\(-\\sqrt{16}\\)','Z'],['\\(\\sqrt{5}\\)','R'],['0.125','Q'],['\\(-\\tfrac{10}{5}\\)','Z'],['\\(10^{3}\\)','N'],['\\(10^{-2}\\)','Q']];
  const num=(x)=>`\\(${String(x).replace('-','-')}\\)`;
  const frT=(n,d)=>`\\(\\tfrac{${n}}{${d}}\\)`;
  const qT=q=>`\\(${q.tex().replace(/\\dfrac/g,'\\tfrac')}\\)`;
  const G=[
  /* ---------- Zahlenmengen ---------- */
  {a:'zm',top:'Zahlenmengen',gen(){const [x,s]=pick(NUMS);const o=['N','Z','Q','R'];
    return{q:`Zu welcher <b>kleinsten</b> Zahlenmenge gehört ${x}?`,opts:[M[s],...o.filter(k=>k!==s).map(k=>M[k])],
      expl:{N:'Eine natürliche Zahl (eventuell erst nach dem Ausrechnen).',Z:'Eine negative ganze Zahl.',Q:'Ein Bruch, der keine ganze Zahl ist (endliche oder periodische Dezimalzahl).',R:'Eine irrationale Zahl: unendlich viele Nachkommastellen ohne Periode.'}[s]}}},
  {a:'zm',top:'Zahlenmengen',gen:fact([
    ['Welche Aussage ist richtig?',['\\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\)','\\(\\mathbb{R}\\subset\\mathbb{Q}\\subset\\mathbb{Z}\\subset\\mathbb{N}\\)','\\(\\mathbb{Z}\\subset\\mathbb{N}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\)','\\(\\mathbb{N}\\subset\\mathbb{Q}\\subset\\mathbb{Z}\\subset\\mathbb{R}\\)'],'Jede natürliche Zahl ist ganz, jede ganze Zahl rational, jede rationale Zahl reell.'],
    ['Welche Aussage ist <b>falsch</b>?',['\\(-3\\in\\mathbb{N}\\)','\\(-3\\in\\mathbb{Z}\\)','\\(\\tfrac12\\in\\mathbb{Q}\\)','\\(\\sqrt2\\in\\mathbb{R}\\)'],'Negative Zahlen sind keine natürlichen Zahlen: \\(-3\\notin\\mathbb{N}\\).'],
    ['Welche Dezimalzahl ist <b>irrational</b>?',['1.414213562… (ohne Periode, z. B. \\(\\sqrt2\\))','0.333… (Periode 3)','0.125','2.5'],'Endliche und periodische Dezimalzahlen sind Brüche, also rational.'],
    ['Welche Rechnung führt aus \\(\\mathbb{N}\\) heraus?',['\\(3-5\\)','\\(3+5\\)','\\(3\\cdot5\\)','\\(5^3\\)'],'Addition, Multiplikation und Potenzieren natürlicher Zahlen ergeben wieder natürliche Zahlen; 3 − 5 = −2 nicht.'],
    ['Welche Rechnung führt aus \\(\\mathbb{Z}\\) heraus?',['\\(3:4\\)','\\(3-4\\)','\\((-3)\\cdot4\\)','\\(12:(-4)\\)'],'3 : 4 = 0.75 ist keine ganze Zahl.'],
    ['Was bedeutet \\(\\{1;2;3\\}\\cap\\{2;3;4\\}\\)?',['\\(\\{2;3\\}\\), die gemeinsamen Elemente','\\(\\{1;2;3;4\\}\\), alle Elemente','\\(\\{1;4\\}\\)','die leere Menge'],'∩ ist die Schnittmenge.'],
    ['Was bedeutet das Zeichen \\(\\approx\\)?',['ungefähr gleich (gerundet)','gleich','ungleich','Element von'],'z. B. \\(\\pi\\approx3.14\\).']])},
  /* ---------- Operationsstufen ---------- */
  {a:'os',top:'Operationsstufen',gen(){const t=randTermQ();const r=termSolve(t).value;const wrong=leftToRight(t);
    return{q:`Welchen Wert hat der Term? <div class="term" style="font-size:22px;margin-top:6px">${termHTML(termNorm(tokTerm(t)))}</div>`,opts:numOpt(r,[wrong,r+pick([2,-2,4,10]),-r,r*2]),expl:`Rechenweg: ${termSolve(t).lines.map((l,i)=>(i?'= ':'')+l).join(' ')}`}}},
  {a:'os',top:'Operationsstufen',gen:fact([
    ['Was rechnet man in \\(5+3\\cdot2^2\\) zuerst?',['\\(2^2\\)','\\(5+3\\)','\\(3\\cdot2\\)','von links nach rechts \\(5+3\\)'],'Potenzen vor Punkt vor Strich.'],
    ['\\(-3^2=\\;?\\)',['\\(-9\\)','\\(9\\)','\\(-6\\)','\\(6\\)'],'Die Potenz bindet stärker als das Minuszeichen: \\(-3^2=-(3\\cdot3)=-9\\).'],
    ['\\((-3)^2=\\;?\\)',['\\(9\\)','\\(-9\\)','\\(-6\\)','\\(6\\)'],'Die Klammer gehört zur Basis: \\((-3)\\cdot(-3)=9\\).'],
    ['\\(24:4\\cdot2=\\;?\\)',['\\(12\\)','\\(3\\)','\\(48\\)','\\(6\\)'],'Gleiche Stufe: von links nach rechts, \\(24:4=6\\), dann \\(6\\cdot2=12\\).'],
    ['\\(20-8-2=\\;?\\)',['\\(10\\)','\\(14\\)','\\(30\\)','\\(6\\)'],'Von links nach rechts: \\(20-8=12\\), \\(12-2=10\\).'],
    ['Welches Gesetz zeigt \\(4\\cdot(5+2)=4\\cdot5+4\\cdot2\\)?',['Distributivgesetz','Kommutativgesetz','Assoziativgesetz','Punkt vor Strich'],'Der Faktor wird auf beide Summanden verteilt.'],
    ['Welche Rechenart ist <b>nicht</b> kommutativ?',['Subtraktion','Addition','Multiplikation','keine'],'\\(7-3\\neq3-7\\).']])},
  /* ---------- Teilbarkeit, ggT, kgV ---------- */
  {a:'tb',top:'Teilbarkeit',gen(){const k=pick([3,4,6,8,9,25]);const ok=k*rnd(Math.ceil(1000/k),Math.floor(9999/k));const ws=[];while(ws.length<3){const w=rnd(1000,9999);if(w%k!==0&&!ws.includes(w))ws.push(w)}
    const rule={3:'Quersumme durch 3 teilbar',4:'letzte zwei Ziffern durch 4 teilbar',6:'durch 2 und durch 3 teilbar',8:'letzte drei Ziffern durch 8 teilbar',9:'Quersumme durch 9 teilbar',25:'endet auf 00, 25, 50 oder 75'}[k];
    return{q:`Welche Zahl ist durch <b>${k}</b> teilbar?`,opts:[sep(ok),...ws.map(sep)],expl:`Regel: ${rule}. ${sep(ok)} : ${k} = ${sep(ok/k)}.`}}},
  {a:'tb',top:'ggT und kgV',gen(){const g=pick([2,3,4,5,6,8,9,12]);let a=g*rnd(2,9),b=g*rnd(2,9);while(gcd(a,b)!==g||a===b){a=g*rnd(2,9);b=g*rnd(2,9)}const w=pick(['ggT','kgV']);const G2=gcd(a,b),L=lcm(a,b);
    return{q:`Bestimme ${w}(${a}; ${b}).`,opts:w==='ggT'?numOpt(G2,[L,a*b,G2*2,G2/2,1]):numOpt(L,[a*b,G2,L*2,L/2]),expl:`${a} = ${primeFactors(a).join(' · ')}, ${b} = ${primeFactors(b).join(' · ')}. ggT = ${G2}, kgV = ${L}.`}}},
  {a:'tb',top:'Primfaktorzerlegung',gen(){const n=pick([72,84,90,96,108,120,126,150,180,200,252,270,300,360,450,504]);const f=primeFactors(n);const m={};f.forEach(p=>m[p]=(m[p]||0)+1);
    const ps=Object.keys(m),tex=ps.map(p=>p+(m[p]>1?`^{${m[p]}}`:'')).join('\\cdot');
    const w1=ps.map(p=>p+(m[p]>1?`^{${m[p]+1}}`:'')).join('\\cdot'),w2=ps.map(p=>p+'\\cdot'+m[p]).join('\\cdot'),w3=`2\\cdot${n/2}`;
    return{q:`Welche Primfaktorzerlegung von ${n} ist richtig?`,opts:[`\\(${tex}\\)`,`\\(${w1}\\)`,`\\(${w3}\\)`,`\\(${w2}\\)`],expl:`${n} = ${f.join(' · ')}. ${n/2} ist keine Primzahl.`}}},
  {a:'tb',top:'Teiler',gen:fact([
    ['Ist 1 eine Primzahl?',['Nein, eine Primzahl hat genau zwei verschiedene Teiler.','Ja, sie ist nur durch sich selbst teilbar.','Ja, sie ist die kleinste Primzahl.','Nur in \\(\\mathbb{N}_0\\).'],'1 hat nur einen Teiler. Die kleinste Primzahl ist 2.'],
    ['Wofür braucht man das kgV beim Bruchrechnen?',['als Hauptnenner beim Addieren und Subtrahieren','zum vollständigen Kürzen','zum Multiplizieren','zum Dividieren'],'Der Hauptnenner ist das kgV der Nenner.'],
    ['Wofür braucht man den ggT beim Bruchrechnen?',['zum vollständigen Kürzen','als Hauptnenner','zum Erweitern','zum Bilden des Kehrwerts'],'Teilt man Zähler und Nenner durch ihren ggT, ist der Bruch vollständig gekürzt.'],
    ['Zwei Zahlen sind teilerfremd, wenn …',['ihr ggT gleich 1 ist','ihr kgV gleich 1 ist','beide Primzahlen sind','beide ungerade sind'],'z. B. 8 und 15: ggT(8; 15) = 1, obwohl keine der beiden Zahlen eine Primzahl ist.'],
    ['Welche Zahl ist eine Primzahl?',['97','91','87','51'],'91 = 7 · 13, 87 = 3 · 29, 51 = 3 · 17.']])},
  /* ---------- Zehnerpotenzen ---------- */
  {a:'zp',top:'Wissenschaftliche Schreibweise',gen(){const m=rnd(101,999)/100,e=pick([-6,-5,-4,-3,-2,3,4,5,6,7]);const v=Number((m*10**e).toPrecision(3));const dec=sep((fx=>fx.includes('.')?fx.replace(/0+$/,'').replace(/\.$/,''):fx)(v.toFixed(Math.max(0,-e+2))));
    const sx=(a,b)=>`\\(${a}\\cdot10^{${b}}\\)`;
    return{q:`Wie lautet ${dec} in wissenschaftlicher Schreibweise?`,opts:[sx(m,e),sx(m,-e),sx(Number((m*10).toPrecision(3)),e-1),sx(m,e+(e>0?1:-1))],expl:`Dezimalpunkt hinter die erste von null verschiedene Ziffer: ${Math.abs(e)} Stellen nach ${e>0?'links':'rechts'} ⇒ Exponent ${e}. Zudem muss \\(1\\le a<10\\) gelten.`}}},
  {a:'zp',top:'Zehnerpotenzen',gen:fact([
    ['\\(10^{-3}=\\;?\\)',['\\(0.001\\)','\\(-1000\\)','\\(0.0001\\)','\\(-0.001\\)'],'\\(10^{-3}=\\tfrac{1}{1000}\\). Ein negativer Exponent ergibt eine kleine positive Zahl.'],
    ['\\(10^{0}=\\;?\\)',['\\(1\\)','\\(0\\)','\\(10\\)','nicht definiert'],'Jede Zahl (ausser 0) hoch 0 ergibt 1.'],
    ['Welcher Vorsatz bedeutet \\(10^{-6}\\)?',['Mikro (µ)','Milli (m)','Nano (n)','Mega (M)'],'Milli = 10⁻³, Mikro = 10⁻⁶, Nano = 10⁻⁹.'],
    ['\\(3.75\\cdot1000=\\;?\\)',['\\(3\\,750\\)','\\(375\\)','\\(0.00375\\)','\\(3.75000\\)'],'Bei · 1000 rücken die Ziffern drei Stellen nach links.'],
    ['\\(48:100=\\;?\\)',['\\(0.48\\)','\\(4\\,800\\)','\\(4.8\\)','\\(0.048\\)'],'Bei : 100 rücken die Ziffern zwei Stellen nach rechts.'],
    ['Welche Zahl ist in wissenschaftlicher Schreibweise korrekt notiert?',['\\(4.8\\cdot10^{5}\\)','\\(48\\cdot10^{4}\\)','\\(0.48\\cdot10^{6}\\)','\\(480\\cdot10^{3}\\)'],'Es muss \\(1\\le a<10\\) gelten.']])},
  {a:'zp',top:'Einheiten',gen(){const T=pick([['m³','dm³',1000,'Volumen: Umwandlungszahl 1000'],['m²','dm²',100,'Fläche: Umwandlungszahl 100'],['km','m',1000,'1 km = 1000 m'],['dm³','cm³',1000,'Volumen: 1000 pro Stufe'],['ha','m²',10000,'1 ha = 100 a = 10′000 m²'],['kg','g',1000,'1 kg = 1000 g'],['cm²','mm²',100,'Fläche: 100 pro Stufe']]);
    const v=pick([2,3.5,0.4,12,0.07,45]);const r=Number((v*T[2]).toPrecision(10));
    return{q:`<span style="font-size:20px">${sep(v)} ${T[0]} = ? ${T[1]}</span>`,opts:[sep(r),sep(Number((v*T[2]/10).toPrecision(10))),sep(Number((v*T[2]*10).toPrecision(10))),sep(Number((v/T[2]).toPrecision(10)))],expl:`${T[3]}: ${v} · ${sep(T[2])} = ${sep(r)}.`}}},
  /* ---------- Brüche ---------- */
  {a:'br',top:'Brüche addieren',gen(){let b,d;do{b=rnd(2,9);d=rnd(2,9)}while(b===d);const a=rnd(1,b-1),c=rnd(1,d-1);const r=new Q(a,b).add(new Q(c,d));
    return{q:`\\(\\dfrac{${a}}{${b}}+\\dfrac{${c}}{${d}}=\\;?\\)`,opts:[qT(r),frT(a+c,b+d),frT(a+c,b*d),frT(a*c,b*d)],expl:`Hauptnenner kgV(${b}; ${d}) = ${lcm(b,d)}. Zähler werden erst addiert, wenn die Nenner gleich sind.`}}},
  {a:'br',top:'Brüche multiplizieren',gen(){const pf=()=>{for(;;){const n=rnd(2,9),z=rnd(1,12);if(gcd(z,n)===1&&z%n!==0)return[z,n]}};const [a,b]=pf(),[c,d]=pf();const r=new Q(a,b).mul(new Q(c,d));
    return{q:`\\(\\dfrac{${a}}{${b}}\\cdot\\dfrac{${c}}{${d}}=\\;?\\)`,opts:[qT(r),qT(new Q(a*d,b*c)),qT(new Q(a+c,b+d)),qT(new Q(a*c,b+d))],expl:'Zähler mal Zähler, Nenner mal Nenner, dann kürzen.'}}},
  {a:'br',top:'Brüche dividieren',gen(){const pf=()=>{for(;;){const n=rnd(2,9),z=rnd(1,12);if(gcd(z,n)===1&&z%n!==0)return[z,n]}};const [a,b]=pf(),[c,d]=pf();const r=new Q(a,b).div(new Q(c,d));
    return{q:`\\(\\dfrac{${a}}{${b}}:\\dfrac{${c}}{${d}}=\\;?\\)`,opts:[qT(r),qT(new Q(a*c,b*d)),qT(new Q(b*c,a*d)),qT(new Q(a+c,b+d))],expl:`Mit dem Kehrwert multiplizieren: \\(\\tfrac{${a}}{${b}}\\cdot\\tfrac{${d}}{${c}}\\).`}}},
  {a:'br',top:'Brüche',gen:fact([
    ['Welcher Bruch ist gleichwertig zu \\(\\tfrac34\\)?',['\\(\\tfrac{15}{20}\\)','\\(\\tfrac{4}{5}\\)','\\(\\tfrac{6}{7}\\)','\\(\\tfrac{9}{16}\\)'],'Erweitern mit 5: \\(\\tfrac{3\\cdot5}{4\\cdot5}=\\tfrac{15}{20}\\).'],
    ['Welcher Bruch ist vollständig gekürzt?',['\\(\\tfrac{8}{15}\\)','\\(\\tfrac{6}{9}\\)','\\(\\tfrac{10}{25}\\)','\\(\\tfrac{14}{21}\\)'],'ggT(8; 15) = 1. Die anderen lassen sich noch durch 3, 5 bzw. 7 kürzen.'],
    ['Was ist der Hauptnenner von \\(\\tfrac16\\) und \\(\\tfrac18\\)?',['24','48','14','8'],'kgV(6; 8) = 24. Auch 48 funktioniert, ist aber nicht der kleinste.'],
    ['\\(\\tfrac{2}{3}\\) von 45 sind …',['30','15','67.5','22.5'],'«von» heisst mal: \\(\\tfrac23\\cdot45=30\\).'],
    ['Wie lautet der Kehrwert von \\(\\tfrac{5}{8}\\)?',['\\(\\tfrac{8}{5}\\)','\\(-\\tfrac58\\)','\\(\\tfrac{5}{8}\\)','\\(0.625\\)'],'Zähler und Nenner werden vertauscht.'],
    ['\\(\\tfrac{1}{3}\\) als Dezimalzahl ist …',['\\(0.\\overline{3}\\) (periodisch)','\\(0.3\\)','\\(0.33\\)','\\(3.0\\)'],'1 : 3 = 0.333… mit Periode 3.']])}
  ];
  function numOpt(x,c){return[sep(x),...shuffle(c.filter(v=>Number.isFinite(v)&&Number.isInteger(v)&&v!==x)).map(v=>sep(v))].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4)}
  function randTermQ(){return pick(['18 − 6 : 3 · 2','24 − 4 · 3 + 2','2 + 3 · 4²','(2 + 3) · 4²','36 : 4 · 3 − 5','50 − 2 · (3 + 4)²','7 · 2 − 12 : 3','(8 − 3)² − 2 · 5','4 · 3² : 6','60 : (2 + 3 · 2) · 2'].concat([randomTermSafe()]))}
  function randomTermSafe(){const a=rnd(10,40),b=rnd(2,6),c=rnd(2,5);return`${a} − ${b} · ${c}`}
  function leftToRight(t){try{const T=termNorm(tokTerm(t.replace(/[()]/g,'')));let v=null,op='+';for(const x of T){if(x.t==='n'){const n=x.v;if(v===null)v=n;else v=op==='+'?v+n:op==='-'?v-n:op==='*'?v*n:v/n}else if(x.t==='p')v=Math.pow(v,x.v);else if(x.t==='o')op=x.v}return Number.isInteger(v)?v:NaN}catch(e){return NaN}}
  qzRegister('11',{zm:'Zahlenmengen',os:'Operationsstufen',tb:'Teilbarkeit, ggT, kgV',zp:'Zehnerpotenzen und Einheiten',br:'Brüche'},G);
})();
