/* ======================= Quiz-Fragen Kapitel 2.2 Gleichungen ======================= */
(function(){
  const T=t=>`\\(${t}\\)`;const sg=v=>v<0?`-${-v}`:`+${v}`;const co=(a,v='x')=>a===1?v:a===-1?'-'+v:a+v;
  const G=[
  /* ---------- Äquivalenzumformungen ---------- */
  {a:'ae',top:'Äquivalenzumformungen',gen:fact([
    ['Welche Umformung ist <b>keine</b> Äquivalenzumformung?',['beide Seiten mit 0 multiplizieren','auf beiden Seiten 5 subtrahieren','beide Seiten durch −2 dividieren','auf beiden Seiten \\(3x\\) addieren'],'Mit 0 multipliziert wird jede Gleichung zu \\(0=0\\). Dabei geht die Information verloren.'],
    ['\\(4x+3=19\\). Welcher Schritt ist sinnvoll?',['\\(\\big|-3\\)','\\(\\big|-19\\)','\\(\\big|\\,:3\\)','\\(\\big|+4x\\)'],'Zuerst die Zahl 3 von der \\(x\\)-Seite wegschaffen.'],
    ['Was ist die Lösungsmenge von \\(2x=2x+1\\)?',[T('\\mathbb{L}=\\{\\,\\}'),T('\\mathbb{L}=\\mathbb{R}'),T('\\mathbb{L}=\\{0\\}'),T('\\mathbb{L}=\\{1\\}')],'\\(|-2x\\): \\(0=1\\) ist falsch. Keine Lösung.'],
    ['Was ist die Lösungsmenge von \\(3(x-1)=3x-3\\)?',[T('\\mathbb{L}=\\mathbb{R}'),T('\\mathbb{L}=\\{\\,\\}'),T('\\mathbb{L}=\\{1\\}'),T('\\mathbb{L}=\\{0\\}')],'Ausmultipliziert: \\(3x-3=3x-3\\). Wahre Aussage für jedes \\(x\\).'],
    ['Eine Waage ist im Gleichgewicht: links 3 \\(x\\)-Klötze und 2 Gewichte, rechts 1 \\(x\\)-Klotz und 8 Gewichte. Wie schwer ist ein Klotz?',['3','2','6','10/4'],'\\(3x+2=x+8\\Rightarrow2x=6\\Rightarrow x=3\\).']])},
  /* ---------- Lineare Gleichungen ---------- */
  {a:'li',top:'Lineare Gleichung',gen(){let a,c,s;do{a=rnd(2,8);c=rnd(-3,5);s=pick([-5,-4,-3,-2,-1,1,2,3,4,5,6])}while(a===c);const b=rnd(-9,9);const d=(a-c)*s+b;
    const L=`${co(a)}${b?sg(b):''}`,Rt=c===0?String(d):`${co(c)}${d?sg(d):''}`;
    return{q:`Löse: \\(${L}=${Rt}\\)`,opts:[T(`x=${s}`),T(`x=${-s}`),T(`x=${s+1}`),T(`x=${(d+b)/(a-c)===s?s+2:(d+b)/(a-c)}`.replace(/(\d+\.\d{3})\d+/,'$1'))],expl:`\\(${co(a-c)}=${d-b}\\Rightarrow x=${s}\\). Probe nicht vergessen!`}}},
  {a:'li',top:'Klammern',gen(){const k=rnd(2,5),p=rnd(1,6),s=rnd(-4,6);const r=k*(s-p);
    return{q:`Löse: \\(${k}(x-${p})=${r}\\)`,opts:[T(`x=${s}`),T(`x=${r/k-p}`),T(`x=${(r+p)/k===s?s+1:Number(((r+p)/k).toFixed(2))}`),T(`x=${r-k*p===k*s?s-1:Number(((r-p)/k).toFixed(2))}`)],expl:`\\(${k}x-${k*p}=${r}\\Rightarrow${k}x=${r+k*p}\\Rightarrow x=${s}\\). Oder zuerst durch ${k} dividieren: \\(x-${p}=${r/k}\\).`}}},
  {a:'li',top:'Gleichung mit Brüchen',gen(){const a=pick([2,3,4]),b=pick([3,5,6].filter(z=>z!==a));const L=lcm(a,b);const s=L*rnd(1,3);const c=s/a+s/b;
    return{q:`Löse: \\(\\dfrac{x}{${a}}+\\dfrac{x}{${b}}=${c}\\)`,opts:[T(`x=${s}`),T(`x=${c*a}`),T(`x=${c}`),T(`x=${(c*(a+b)/2)}`)],expl:`Mit \\(${L}\\) multiplizieren: \\(${L/a}x+${L/b}x=${c*L}\\Rightarrow${L/a+L/b}x=${c*L}\\Rightarrow x=${s}\\).`}}},
  {a:'li',top:'Fehler finden',gen:fact([
    ['Wo ist der Fehler? \\(5-(x-2)=8\\;\\Rightarrow\\;5-x-2=8\\;\\Rightarrow\\;x=-5\\)',['Minus vor der Klammer: \\(+2\\) statt \\(-2\\)','beim Zusammenfassen','beim Dividieren','kein Fehler'],'\\(5-(x-2)=5-x+2\\). Richtig: \\(7-x=8\\Rightarrow x=-1\\).'],
    ['Wo ist der Fehler? \\(\\dfrac{x+1}{2}=\\dfrac{x}{3}\\;\\Rightarrow\\;3x+1=2x\\)',['Zähler nicht in Klammern: \\(3(x+1)\\)','HN falsch','Seiten vertauscht','kein Fehler'],'Mit 6 multipliziert: \\(3(x+1)=2x\\Rightarrow3x+3=2x\\Rightarrow x=-3\\).'],
    ['Wo ist der Fehler? \\(-3x=12\\;\\Rightarrow\\;x=4\\)',['Vorzeichen: \\(x=-4\\)','man darf nicht durch −3 dividieren','kein Fehler','es fehlt \\(|+3x\\)'],'\\(12:(-3)=-4\\).']])},
  /* ---------- Bruchgleichungen ---------- */
  {a:'bg',top:'Definitionsmenge',gen(){const p=rnd(1,6),q=rnd(1,6);return{q:`Definitionsmenge von \\(\\dfrac{3}{x-${p}}=\\dfrac{1}{x+${q}}\\)?`,opts:[T(`\\mathbb{R}\\setminus\\{-${q};\\,${p}\\}`.replace(`{-${q};\\,${p}}`,-q<p?`{-${q};\\,${p}}`:`{${p};\\,-${q}}`)),T(`\\mathbb{R}\\setminus\\{${q};\\,-${p}\\}`),T(`\\mathbb{R}\\setminus\\{${p}\\}`),T('\\mathbb{R}')],expl:`Nenner null: \\(x=${p}\\) oder \\(x=-${q}\\).`}}},
  {a:'bg',top:'Bruchgleichung',gen(){for(;;){const p=rnd(1,5),a=rnd(2,6),s=rnd(-4,8);const b=a*(s)/(s+p);if(!Number.isInteger(b)||b===0||b===a||s===0||s===-p)continue;
    return{q:`Löse: \\(\\dfrac{${a}}{x+${p}}=\\dfrac{${b}}{x}\\)`,opts:[T(`\\mathbb{L}=\\{${s}\\}`),T(`\\mathbb{L}=\\{${-s}\\}`),T(`\\mathbb{L}=\\{\\,\\}`),T(`\\mathbb{L}=\\{${s+1}\\}`)],expl:`\\(${a}x=${b}(x+${p})\\Rightarrow${a-b}x=${b*p}\\Rightarrow x=${s}\\). \\(${s}\\in\\mathbb{D}\\).`}}}},
  {a:'bg',top:'Kontrolle',gen:fact([
    ['\\(\\dfrac{x}{x-3}=\\dfrac{3}{x-3}\\). Lösungsmenge?',[T('\\mathbb{L}=\\{\\,\\}'),T('\\mathbb{L}=\\{3\\}'),T('\\mathbb{L}=\\mathbb{R}'),T('\\mathbb{L}=\\{0\\}')],'Mal \\((x-3)\\): \\(x=3\\). Aber \\(3\\notin\\mathbb{D}\\). Also keine Lösung.'],
    ['Warum muss man bei Bruchgleichungen am Schluss kontrollieren?',['Die Lösung könnte einen Nenner null machen.','Weil man mit 0 multipliziert hat.','Weil man durch x dividiert hat.','Muss man nicht.'],'Beim Multiplizieren mit dem Hauptnenner geht die Information «Nenner ≠ 0» verloren.'],
    ['Mit welchem Hauptnenner multipliziert man \\(\\dfrac{2}{x}+\\dfrac{1}{x-1}=\\dfrac{5}{x^2-x}\\)?',[T('x(x-1)'),T('x^2(x-1)'),T('x(x^2-x)'),T('x-1')],'\\(x^2-x=x(x-1)\\) ist schon der Hauptnenner.']])},
  /* ---------- Formeln ---------- */
  {a:'fo',top:'Formeln umformen',gen:fact([
    ['\\(v=\\dfrac{s}{t}\\) nach \\(t\\)?',[T('t=\\dfrac{s}{v}'),T('t=s\\cdot v'),T('t=\\dfrac{v}{s}'),T('t=s-v')],'Mal \\(t\\): \\(vt=s\\), dann durch \\(v\\).'],
    ['\\(A=\\dfrac{g\\cdot h}{2}\\) nach \\(h\\)?',[T('h=\\dfrac{2A}{g}'),T('h=\\dfrac{A}{2g}'),T('h=2Ag'),T('h=\\dfrac{g}{2A}')],'Mal 2, dann durch \\(g\\).'],
    ['\\(u=2(a+b)\\) nach \\(a\\)?',[T('a=\\dfrac{u}{2}-b'),T('a=\\dfrac{u-b}{2}'),T('a=2u-b'),T('a=u-2b')],'Durch 2, dann \\(-b\\).'],
    ['\\(y=mx+q\\) nach \\(x\\)?',[T('x=\\dfrac{y-q}{m}'),T('x=\\dfrac{y}{m}-q'),T('x=m(y-q)'),T('x=\\dfrac{y+q}{m}')],'Zuerst \\(-q\\), dann durch \\(m\\).'],
    ['\\(F=\\tfrac95C+32\\) nach \\(C\\)?',[T('C=\\tfrac59(F-32)'),T('C=\\tfrac59F-32'),T('C=\\tfrac95(F-32)'),T('C=\\tfrac59F+32')],'Umkehrung in umgekehrter Reihenfolge: zuerst \\(-32\\), dann \\(\\cdot\\tfrac59\\).'],
    ['\\(\\dfrac1R=\\dfrac1{R_1}+\\dfrac1{R_2}\\) nach \\(R\\)?',[T('R=\\dfrac{R_1R_2}{R_1+R_2}'),T('R=R_1+R_2'),T('R=\\dfrac{R_1+R_2}{R_1R_2}'),T('R=\\dfrac1{R_1}+\\dfrac1{R_2}')],'Rechts gleichnamig machen: \\(\\dfrac{R_2+R_1}{R_1R_2}\\), dann Kehrwert.']])},
  /* ---------- Textgleichungen ---------- */
  {a:'te',top:'Gleichung aufstellen',gen:fact([
    ['«Das Doppelte einer Zahl, vermindert um 7, ergibt 15.»',[T('2x-7=15'),T('2(x-7)=15'),T('2x+7=15'),T('x-7\\cdot2=15')],'Zuerst verdoppeln, dann 7 subtrahieren.'],
    ['«Vermindert man eine Zahl um 7 und verdoppelt das Resultat, erhält man 15.»',[T('2(x-7)=15'),T('2x-7=15'),T('x-14=15'),T('2x+7=15')],'Erst vermindern, dann das <b>Resultat</b> verdoppeln: Klammer.'],
    ['Lea ist 3 Jahre jünger als Tim. Zusammen sind sie 29. \\(x\\) = Alter von Tim.',[T('x+(x-3)=29'),T('x+(x+3)=29'),T('x-3=29'),T('2x=29+3')],'Lea ist jünger: \\(x-3\\).'],
    ['Ein Rechteck ist doppelt so lang wie breit, sein Umfang ist 42 cm. \\(x\\) = Breite.',[T('2x+2\\cdot2x=42'),T('x+2x=42'),T('x\\cdot2x=42'),T('2(x+2)=42')],'Umfang = 2 · Breite + 2 · Länge.']])},
  {a:'te',top:'Textaufgabe',gen(){const x=rnd(6,20),d=rnd(2,9);return{q:`Nora ist ${d} Jahre älter als Ivo. Zusammen sind sie ${2*x+d} Jahre alt. Wie alt ist Ivo?`,opts:[String(x),String(x+d),String((2*x+d)/2),String(x-d)].map(String),expl:`\\(x+(x+${d})=${2*x+d}\\Rightarrow2x=${2*x}\\Rightarrow x=${x}\\).`}}}
  ];
  qzRegister('22',{ae:'Äquivalenzumformungen',li:'Lineare Gleichungen',bg:'Bruchgleichungen',fo:'Formeln umformen',te:'Textgleichungen'},G);
})();
