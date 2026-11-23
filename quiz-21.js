/* ======================= Quiz-Fragen Kapitel 2.1 Bruchterme ======================= */
(function(){
  const T=t=>`\\(${t}\\)`;const sg=v=>v<0?`-${-v}`:`+${v}`;const nz=()=>pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
  const G=[
  /* ---------- Kürzen ---------- */
  {a:'ku',top:'Darf man kürzen?',gen:fact([
    ['Welche Umformung ist <b>richtig</b>?',[T('\\dfrac{3x+6}{3}=x+2'),T('\\dfrac{x+3}{3}=x'),T('\\dfrac{x+5}{x+2}=\\dfrac52'),T('\\dfrac{2x+x^2}{x}=2+x^2')],'Kürzen darf man nur Faktoren: \\(3x+6=3(x+2)\\).'],
    ['Welcher Bruch lässt sich <b>nicht</b> kürzen?',[T('\\dfrac{x+4}{x+2}'),T('\\dfrac{x^2-4}{x+2}'),T('\\dfrac{2x+4}{x+2}'),T('\\dfrac{x^2+2x}{x+2}')],'In \\(\\dfrac{x+4}{x+2}\\) haben Zähler und Nenner keinen gemeinsamen Faktor.'],
    ['\\(\\dfrac{a+b}{a}=\\;?\\)',[T('1+\\dfrac{b}{a}'),T('b'),T('1+b'),T('\\dfrac{b}{1}')],'Man darf den Bruch in zwei Brüche aufteilen: \\(\\dfrac{a}{a}+\\dfrac{b}{a}=1+\\dfrac ba\\). Kürzen von \\(a\\) allein ist falsch.'],
    ['\\(\\dfrac{x-5}{5-x}=\\;?\\)',[T('-1'),T('1'),T('0'),T('\\text{nicht kürzbar}')],'\\(5-x=-(x-5)\\). Also ist der Bruch \\(-1\\) (für \\(x\\neq5\\)).']])},
  {a:'ku',top:'Kürzen',gen(){const p=nz();let q;do{q=nz()}while(q===p||q===-p);const k=pick([2,3,5]);
    const num=Poly.v('x').add(Poly.c(p)).mul(Poly.c(k));const den=Poly.v('x').add(Poly.c(p)).mul(Poly.v('x').add(Poly.c(q)));
    return{q:`Kürze vollständig: \\(\\dfrac{${num.tex()}}{${den.tex()}}\\)`,opts:[T(`\\dfrac{${k}}{x${sg(q)}}`),T(`\\dfrac{${k}}{x${sg(p)}}`),T(`\\dfrac{${k}x}{x${sg(q)}}`),T(`\\dfrac{${k}}{${q}}`)],
      expl:`\\(\\dfrac{${k}(x${sg(p)})}{(x${sg(p)})(x${sg(q)})}=\\dfrac{${k}}{x${sg(q)}}\\)`}}},
  {a:'ku',top:'Kürzen mit binomischer Formel',gen(){const p=rnd(1,6);const v=pick(['x','a','y']);
    return{q:`Kürze: \\(\\dfrac{${v}^2-${p*p}}{${v}+${p}}\\)`,opts:[T(`${v}-${p}`),T(`${v}+${p}`),T(`${v}-${p*p}`),T(`${v}^2-${p}`)],expl:`\\(${v}^2-${p*p}=(${v}+${p})(${v}-${p})\\) (3. binomische Formel), dann \\((${v}+${p})\\) kürzen.`}}},
  /* ---------- Definitionsmenge ---------- */
  {a:'de',top:'Definitionsmenge',gen(){const p=nz();let q;do{q=nz()}while(q===p||q===-p);
    return{q:`Welche Zahlen sind für \\(\\dfrac{3}{(x${sg(p)})(x${sg(q)})}\\) ausgeschlossen?`,opts:[T(`x=${-p}\\text{ und }x=${-q}`),T(`x=${p}\\text{ und }x=${q}`),T(`x=${-p}`),T('\\text{keine}')],expl:`Der Nenner ist null, wenn ein Faktor null ist: \\(x${sg(p)}=0\\Rightarrow x=${-p}\\), \\(x${sg(q)}=0\\Rightarrow x=${-q}\\).`}}},
  {a:'de',top:'Definitionsmenge',gen:fact([
    ['Für welche Zahl ist \\(\\dfrac{x^2-4}{x-2}\\) nicht definiert?',[T('x=2'),T('x=-2'),T('x=\\pm2'),T('\\text{für keine}')],'Massgebend ist der ursprüngliche Nenner \\(x-2\\). Auch nach dem Kürzen zu \\(x+2\\) bleibt \\(x=2\\) ausgeschlossen.'],
    ['\\(\\mathbb{D}\\) von \\(\\dfrac{5}{x^2-9}\\)?',[T('\\mathbb{R}\\setminus\\{-3;\\,3\\}'),T('\\mathbb{R}\\setminus\\{3\\}'),T('\\mathbb{R}\\setminus\\{9\\}'),T('\\mathbb{R}')],'\\(x^2-9=(x+3)(x-3)\\) ist null für \\(x=3\\) und \\(x=-3\\).'],
    ['\\(\\mathbb{D}\\) von \\(\\dfrac{x}{x^2+1}\\)?',[T('\\mathbb{R}'),T('\\mathbb{R}\\setminus\\{-1\\}'),T('\\mathbb{R}\\setminus\\{0\\}'),T('\\mathbb{R}\\setminus\\{-1;\\,1\\}')],'\\(x^2+1\\geq1\\) wird nie null.'],
    ['\\(\\mathbb{D}\\) von \\(\\dfrac{1}{2x-3}\\)?',[T('\\mathbb{R}\\setminus\\{1.5\\}'),T('\\mathbb{R}\\setminus\\{3\\}'),T('\\mathbb{R}\\setminus\\{-1.5\\}'),T('\\mathbb{R}\\setminus\\{2;\\,3\\}')],'\\(2x-3=0\\Rightarrow x=1.5\\).']])},
  /* ---------- ggT / kgV ---------- */
  {a:'gk',top:'ggT von Monomen',gen(){const a=pick([4,6,8,12]),b=pick([6,9,10,15,18].filter(z=>z!==a));const e1=rnd(1,3),e2=rnd(1,3),f1=rnd(1,3),f2=rnd(1,3);const g=gcd(a,b);
    const pw=(v,e)=>e===1?v:`${v}^{${e}}`;
    return{q:`ggT von \\(${a}${pw('x',e1)}${pw('y',f1)}\\) und \\(${b}${pw('x',e2)}${pw('y',f2)}\\)?`,opts:[T(`${g===1?'':g}${pw('x',Math.min(e1,e2))}${pw('y',Math.min(f1,f2))}`),T(`${g===1?'':g}${pw('x',Math.max(e1,e2))}${pw('y',Math.max(f1,f2))}`),T(`${lcm(a,b)}${pw('x',Math.min(e1,e2))}${pw('y',Math.min(f1,f2))}`),T(`${g===1?'':g}xy`),T(`${a*b}${pw('x',Math.min(e1,e2))}${pw('y',Math.min(f1,f2))}`),T(`${g===1?'':g}${pw('x',Math.min(e1,e2)+1)}${pw('y',Math.min(f1,f2))}`)].filter((x,i,A)=>A.indexOf(x)===i).slice(0,4),
      expl:`Gemeinsame Faktoren: ggT der Zahlen \\(=${g}\\), jede Variable mit dem <b>kleineren</b> Exponenten.`}}},
  {a:'gk',top:'Hauptnenner',gen:fact([
    ['Hauptnenner von \\(\\dfrac{1}{x-2}\\) und \\(\\dfrac{3}{x^2-4}\\)?',[T('(x+2)(x-2)'),T('(x-2)(x^2-4)'),T('(x-2)^2(x+2)'),T('x^2-2')],'\\(x^2-4=(x+2)(x-2)\\) enthält \\(x-2\\) schon.'],
    ['Hauptnenner von \\(\\dfrac{1}{6x}\\) und \\(\\dfrac{1}{4x^2}\\)?',[T('12x^2'),T('24x^3'),T('24x^2'),T('12x^3')],'kgV(6; 4) = 12, höchste Potenz \\(x^2\\).'],
    ['Hauptnenner von \\(\\dfrac{a}{2a+2}\\) und \\(\\dfrac{1}{a^2+a}\\)?',[T('2a(a+1)'),T('(2a+2)(a^2+a)'),T('2a^2(a+1)'),T('2(a+1)')],'\\(2a+2=2(a+1)\\), \\(a^2+a=a(a+1)\\). kgV: \\(2\\cdot a\\cdot(a+1)\\).'],
    ['kgV von \\(x^2-1\\) und \\(x^2+2x+1\\)?',[T('(x+1)^2(x-1)'),T('(x+1)(x-1)'),T('(x^2-1)(x^2+2x+1)'),T('(x+1)^3(x-1)')],'\\((x+1)(x-1)\\) und \\((x+1)^2\\): jeder Faktor mit der höchsten Potenz.']])},
  /* ---------- Addition / Subtraktion ---------- */
  {a:'as',top:'Gleichnamige Brüche',gen(){const a=rnd(2,7),b=rnd(1,6);
    return{q:`\\(\\dfrac{${a}x}{x+1}-\\dfrac{x-${b}}{x+1}=\\;?\\)`,opts:[T(`\\dfrac{${a-1===1?'':a-1}x+${b}}{x+1}`),T(`\\dfrac{${a-1===1?'':a-1}x-${b}}{x+1}`),T(`\\dfrac{${a+1}x-${b}}{x+1}`),T(`\\dfrac{${a-1===1?'':a-1}x+${b}}{0}`)],
      expl:`Minus vor dem Bruch: Der ganze Zähler wird subtrahiert: \\(${a}x-(x-${b})=${a-1===1?'':a-1}x+${b}\\).`}}},
  {a:'as',top:'Addition',gen(){const a=rnd(1,5),b=rnd(1,5);const p=rnd(1,4);
    const n=Poly.c(a).mul(Poly.v('x').sub(Poly.c(p))).add(Poly.c(b).mul(Poly.v('x').add(Poly.c(p))));
    return{q:`\\(\\dfrac{${a}}{x+${p}}+\\dfrac{${b}}{x-${p}}=\\;?\\)`,opts:[T(`\\dfrac{${n.tex()}}{x^2-${p*p}}`),T(`\\dfrac{${a+b}}{2x}`),T(`\\dfrac{${a+b}}{x^2-${p*p}}`),T(`\\dfrac{${a*b}}{x^2-${p*p}}`)],
      expl:`HN \\((x+${p})(x-${p})=x^2-${p*p}\\). Zähler: \\(${a}(x-${p})+${b}(x+${p})=${n.tex()}\\).`}}},
  {a:'as',top:'Häufiger Fehler',gen:fact([
    ['\\(\\dfrac{1}{a}+\\dfrac{1}{b}=\\;?\\)',[T('\\dfrac{a+b}{ab}'),T('\\dfrac{2}{a+b}'),T('\\dfrac{1}{a+b}'),T('\\dfrac{2}{ab}')],'HN \\(ab\\): \\(\\dfrac{b}{ab}+\\dfrac{a}{ab}\\). Nenner werden nie einfach addiert.'],
    ['\\(\\dfrac{x}{2}+\\dfrac{x}{3}=\\;?\\)',[T('\\dfrac{5x}{6}'),T('\\dfrac{2x}{5}'),T('\\dfrac{x^2}{6}'),T('\\dfrac{2x}{6}')],'HN 6: \\(\\dfrac{3x}{6}+\\dfrac{2x}{6}=\\dfrac{5x}{6}\\).'],
    ['\\(1-\\dfrac{1}{x}=\\;?\\)',[T('\\dfrac{x-1}{x}'),T('\\dfrac{0}{x}'),T('\\dfrac{1-1}{x}'),T('-\\dfrac{1}{x}')],'\\(1=\\dfrac{x}{x}\\), also \\(\\dfrac{x}{x}-\\dfrac1x=\\dfrac{x-1}{x}\\).']])},
  /* ---------- Multiplikation / Division ---------- */
  {a:'md',top:'Multiplikation',gen(){const a=rnd(2,6),b=rnd(2,6),c=rnd(2,6);const g=gcd(a*b,c*a);
    return{q:`Berechne und kürze vollständig: \\(\\dfrac{${a}x}{${c}}\\cdot\\dfrac{${b}}{${a}x^2}\\)`,opts:[T(`\\dfrac{${b/gcd(b,c)}}{${c/gcd(b,c)}x}`.replace(/\\dfrac\{(\d+)\}\{1x\}/,'\\dfrac{$1}{x}')),T(`\\dfrac{${a*b}x}{${c*a}x^2}`),T(`\\dfrac{${b}x}{${c}}`),T(`\\dfrac{${a+b}}{${c+a}x}`)],
      expl:`Auf einen Bruchstrich und kürzen: \\(\\dfrac{${a}\\cdot x\\cdot${b}}{${c}\\cdot${a}\\cdot x\\cdot x}\\). Es bleibt \\(\\dfrac{${b}}{${c}x}\\), dann die Zahlen kürzen.`}}},
  {a:'md',top:'Division',gen:fact([
    ['\\(\\dfrac{a}{b}:\\dfrac{c}{d}=\\;?\\)',[T('\\dfrac{ad}{bc}'),T('\\dfrac{ac}{bd}'),T('\\dfrac{bc}{ad}'),T('\\dfrac{a:c}{b:d}')],'Mit dem Kehrwert multiplizieren: \\(\\dfrac ab\\cdot\\dfrac dc\\).'],
    ['\\(\\dfrac{x^2-1}{x}:(x+1)=\\;?\\)',[T('\\dfrac{x-1}{x}'),T('\\dfrac{(x^2-1)(x+1)}{x}'),T('x-1'),T('\\dfrac{x+1}{x}')],'\\(\\dfrac{(x+1)(x-1)}{x}\\cdot\\dfrac{1}{x+1}=\\dfrac{x-1}{x}\\).'],
    ['\\(\\dfrac{4}{x}:\\dfrac{2}{x^2}=\\;?\\)',[T('2x'),T('\\dfrac{8}{x^3}'),T('\\dfrac{2}{x}'),T('8x')],'\\(\\dfrac4x\\cdot\\dfrac{x^2}{2}=2x\\).'],
    ['Was ist der Kehrwert von \\(\\dfrac{x-3}{2x}\\)?',[T('\\dfrac{2x}{x-3}'),T('\\dfrac{x+3}{2x}'),T('-\\dfrac{x-3}{2x}'),T('\\dfrac{2x}{3-x}')],'Zähler und Nenner vertauschen.']])},
  /* ---------- Doppelbrüche ---------- */
  {a:'db',top:'Doppelbrüche',gen:fact([
    ['\\(\\dfrac{\\frac{a}{b}}{\\frac{c}{d}}=\\;?\\)',[T('\\dfrac{ad}{bc}'),T('\\dfrac{ac}{bd}'),T('\\dfrac{ab}{cd}'),T('\\dfrac{bc}{ad}')],'Hauptbruchstrich = Division: \\(\\dfrac ab\\cdot\\dfrac dc\\). Merke: «Aussen mal aussen durch innen mal innen».'],
    ['\\(\\dfrac{1+\\frac{1}{x}}{\\frac{1}{x}}=\\;?\\)',[T('x+1'),T('1'),T('\\dfrac{x+1}{x^2}'),T('2')],'Mit \\(x\\) erweitern: \\(\\dfrac{x+1}{1}=x+1\\).'],
    ['Mit welchem Term erweitert man \\(\\dfrac{\\frac{1}{x}-\\frac{1}{2}}{\\frac{1}{x^2}}\\) am besten?',[T('2x^2'),T('x'),T('2x'),T('x^3')],'Hauptnenner aller Teilbrüche: kgV\\((x;\\,2;\\,x^2)=2x^2\\).'],
    ['\\(\\dfrac{\\frac{3}{4}}{\\frac{9}{8}}=\\;?\\)',[T('\\dfrac23'),T('\\dfrac{27}{32}'),T('\\dfrac32'),T('\\dfrac{3}{8}')],'\\(\\dfrac34\\cdot\\dfrac89=\\dfrac{24}{36}=\\dfrac23\\).']])},
  {a:'db',top:'Doppelbruch berechnen',gen(){const p=rnd(1,5);
    return{q:`\\(\\dfrac{x-\\frac{${p*p}}{x}}{1-\\frac{${p}}{x}}=\\;?\\)`,opts:[T(`x+${p}`),T(`x-${p}`),T(`\\dfrac{x+${p}}{x}`),T(`x^2-${p*p}`)],expl:`Mit \\(x\\) erweitern: \\(\\dfrac{x^2-${p*p}}{x-${p}}=\\dfrac{(x+${p})(x-${p})}{x-${p}}=x+${p}\\).`}}}
  ];
  qzRegister('21',{ku:'Kürzen',de:'Definitionsmenge',gk:'ggT, kgV, Hauptnenner',as:'Addieren und Subtrahieren',md:'Multiplizieren und Dividieren',db:'Doppelbrüche'},G);
})();
