/* ======================= Quiz-Fragen Kapitel 1.2 Algebra ======================= */
(function(){
  const X=Poly.v('x');const L=()=>pick(['x','a','b','y','m']);
  const P=(p)=>`\\(${p.tex()}\\)`;const sg=v=>v<0?`-${-v}`:`+${v}`;
  const lin=(v,a,b)=>Poly.v(v).scale(a).add(Poly.c(b));
  const G=[
  /* ---------- Begriffe ---------- */
  {a:'be',top:'Begriffe',gen:fact([
    ['Welche Terme sind gleichartig?',['\\(4x^2\\) und \\(-x^2\\)','\\(4x^2\\) und \\(4x\\)','\\(3ab\\) und \\(3a\\)','\\(x\\) und \\(x^3\\)'],'Gleiche Variablen mit gleichen Exponenten.'],
    ['Wie heisst der Koeffizient von \\(x\\) in \\(3x^2-5x+7\\)?',['\\(-5\\)','\\(5\\)','\\(3\\)','\\(7\\)'],'Das Vorzeichen gehört zum Koeffizienten.'],
    ['\\(4x^2-x^2=\\;?\\)',['\\(3x^2\\)','\\(4\\)','\\(3x^4\\)','\\(3\\)'],'Gleichartige Terme: Koeffizienten subtrahieren, die Variable bleibt.'],
    ['\\(2a+3b-a+b=\\;?\\)',['\\(a+4b\\)','\\(5ab\\)','\\(3a+4b\\)','\\(a+2b\\)'],'Nur gleichartige Terme zusammenfassen: \\(2a-a=a\\), \\(3b+b=4b\\).'],
    ['Welcher Ausdruck lässt sich <b>nicht</b> weiter zusammenfassen?',['\\(3x+2y\\)','\\(3x+2x\\)','\\(5y-y\\)','\\(x^2+x^2\\)'],'\\(3x\\) und \\(2y\\) sind nicht gleichartig.']])},
  {a:'be',top:'Termwert',gen(){const a=rnd(1,4),b=pick([-5,-3,-2,2,3,5]),c=rnd(-6,6),x=pick([-3,-2,-1,2,3]);const v=a*x*x+b*x+c;const p=Poly.v('x',2).scale(a).add(Poly.v('x').scale(b)).add(Poly.c(c));
    const wrong1=-a*x*x+b*x+c,wrong2=a*x*x-b*x+c,wrong3=a*2*x+b*x+c;
    return{q:`Welchen Wert hat \\(T(x)=${p.tex()}\\) für \\(x=${x}\\)?`,opts:[String(v),String(wrong1),String(wrong2),String(wrong3)].map(s=>mn(s)),expl:`\\(T(${x})=${a===1?'':a+'\\cdot'}(${x})^2${b<0?'-':'+'}${Math.abs(b)}\\cdot(${x})${sg(c)}=${v}\\). Negative Zahlen in Klammern einsetzen.`}}},
  /* ---------- Klammern ---------- */
  {a:'kl',top:'Klammern auflösen',gen(){const v=L();const a=rnd(2,6),b=rnd(1,6),c=rnd(1,6);const res=Poly.v(v).scale(a).sub(Poly.v(v).scale(b).sub(Poly.c(c)));
    const w1=Poly.v(v).scale(a).sub(Poly.v(v).scale(b)).sub(Poly.c(c)),w2=Poly.v(v).scale(a+b).add(Poly.c(c)),w3=Poly.v(v).scale(a-b).add(Poly.c(-c));
    return{q:`\\(${a}${v}-(${b===1?'':b}${v}-${c})=\\;?\\)`,opts:[P(res),P(w1),P(w2),P(w3)],expl:'Minus vor der Klammer: <b>alle</b> Vorzeichen in der Klammer umkehren.'}}},
  {a:'kl',top:'Klammern auflösen',gen(){const v=L();const k=rnd(2,5),a=rnd(1,5),b=rnd(1,6);const res=Poly.v(v).scale(-k*a).add(Poly.c(k*b));
    return{q:`\\(-${k}(${a===1?'':a}${v}-${b})=\\;?\\)`,opts:[P(res),P(Poly.v(v).scale(-k*a).sub(Poly.c(b))),P(Poly.v(v).scale(-k*a).sub(Poly.c(k*b))),P(Poly.v(v).scale(-a).add(Poly.c(k*b)))],expl:`\\(-${k}\\) mit <b>jedem</b> Glied multiplizieren: \\((-${k})\\cdot(-${b})=+${k*b}\\).`}}},
  {a:'kl',top:'Addition und Subtraktion',gen(){const v=L();const r=()=>pick([-4,-3,-2,-1,1,2,3,4,5]);const A=lin(v,rnd(2,6),r()),B=lin(v,rnd(1,4),r());const res=A.sub(B);
    return{q:`\\((${A.tex()})-(${B.tex()})=\\;?\\)`,opts:[P(res),P(A.add(B)),P(lin(v,res.m.get(v+'^1')||0,(A.constVal()+B.constVal()))),P(lin(v,(A.m.get(v+'^1')||0)+(B.m.get(v+'^1')||0),res.constVal()))],expl:'Die zweite Klammer wird subtrahiert: beide Vorzeichen umkehren.'}}},
  /* ---------- Multiplikation / Division ---------- */
  {a:'mu',top:'Monome multiplizieren',gen(){const v=L();const a=rnd(2,6),b=rnd(2,5),e=rnd(2,4),f=rnd(1,3);
    return{q:`\\(${a}${v}^{${e}}\\cdot${b}${v}${f>1?`^{${f}}`:''}=\\;?\\)`,opts:[`\\(${a*b}${v}^{${e+f}}\\)`,`\\(${a*b}${v}^{${e*f}}\\)`,`\\(${a+b}${v}^{${e+f}}\\)`,`\\(${a*b}${v}^{${e}}\\)`],expl:'Koeffizienten multiplizieren, Exponenten gleicher Basis addieren.'}}},
  {a:'mu',top:'Ausmultiplizieren',gen(){const m=pick([-5,-4,-3,-2,2,3,4,5]),n=pick([-6,-3,-2,1,2,3,4,6]);const res=X.add(Poly.c(m)).mul(X.add(Poly.c(n)));
    return{q:`\\((x${sg(m)})(x${sg(n)})=\\;?\\)`,opts:[P(res),P(X.pow(2).add(Poly.c(m*n))),P(X.pow(2).add(X.scale(m*n)).add(Poly.c(m+n))),P(X.pow(2).add(X.scale(m+n)).add(Poly.c(-m*n)))],expl:`Jedes Glied mit jedem: \\(x^2${sg(n)}x${sg(m)}x${sg(m*n)}\\), zusammenfassen.`}}},
  {a:'mu',top:'Division durch ein Monom',gen(){const v=L();const c=rnd(2,5),a=rnd(1,4),b=pick([-3,-2,2,3]);const q=Poly.v(v).scale(a).add(Poly.c(b));const m=Poly.v(v).scale(c);const d=q.mul(m);
    return{q:`\\((${d.tex()}):${m.tex()}=\\;?\\)`,opts:[P(q),P(Poly.v(v).scale(a).add(Poly.c(b*c))),P(Poly.v(v,2).scale(a).add(Poly.v(v).scale(b))),P(Poly.v(v).scale(a*c).add(Poly.c(b)))],expl:`Jedes Glied durch \\(${m.tex()}\\) teilen. Probe: \\(${m.tex()}\\cdot(${q.tex()})=${d.tex()}\\).`}}},
  {a:'mu',top:'Vorzeichenregeln',gen:fact([
    ['\\((-2x)\\cdot(-3x)=\\;?\\)',['\\(6x^2\\)','\\(-6x^2\\)','\\(6x\\)','\\(-5x^2\\)'],'Minus mal Minus ergibt Plus; \\(x\\cdot x=x^2\\).'],
    ['\\(-a\\cdot(b-c)=\\;?\\)',['\\(-ab+ac\\)','\\(-ab-ac\\)','\\(ab-ac\\)','\\(-ab-c\\)'],'Jedes Glied mit \\(-a\\) multiplizieren: \\((-a)\\cdot(-c)=+ac\\).'],
    ['\\(x^3\\cdot x^4=\\;?\\)',['\\(x^7\\)','\\(x^{12}\\)','\\(2x^7\\)','\\(x^{34}\\)'],'Exponenten addieren.'],
    ['\\(12a^5:3a^2=\\;?\\)',['\\(4a^3\\)','\\(4a^{2.5}\\)','\\(9a^3\\)','\\(4a^7\\)'],'Koeffizienten dividieren, Exponenten subtrahieren.']])},
  /* ---------- Binomische Formeln ---------- */
  {a:'bf',top:'Binomische Formeln',gen(){const v=L();const a=rnd(1,5),b=rnd(1,7),typ=rnd(1,3);const pa=Poly.v(v).scale(a),pb=Poly.c(b);
    const res=typ===1?pa.add(pb).pow(2):typ===2?pa.sub(pb).pow(2):pa.add(pb).mul(pa.sub(pb));const A=pa.tex();
    const lhs=typ===1?`(${A}+${b})^2`:typ===2?`(${A}-${b})^2`:`(${A}+${b})(${A}-${b})`;
    const w1=pa.pow(2).add(Poly.c(typ===3?b*b:b*b)),w2=typ===3?pa.pow(2).sub(pb.scale(2).mul(pa)).sub(Poly.c(b*b)):pa.pow(2).add(pa.scale(typ===1?b:-b)).add(Poly.c(b*b)),w3=Poly.v(v,2).scale(a).add(pa.scale(typ===2?-2*b:2*b)).add(Poly.c(b*b));
    return{q:`\\(${lhs}=\\;?\\)`,opts:[P(res),P(typ===3?pa.pow(2).add(Poly.c(b*b)):w1),P(w2),P(w3)],expl:`${typ}. binomische Formel mit \\(a=${A}\\), \\(b=${b}\\). Achtung: \\((${A})^2=${pa.pow(2).tex()}\\).`}}},
  {a:'bf',top:'Binomische Formeln',gen:fact([
    ['Was fehlt bei \\((a+b)^2=a^2+b^2\\)?',['das Glied \\(2ab\\)','nichts, die Gleichung stimmt','das Glied \\(ab\\)','das Glied \\(-2ab\\)'],'Im Quadrat mit Seite a + b stecken zwei Rechtecke ab.'],
    ['Welche Formel ist richtig?',['\\((a-b)^2=a^2-2ab+b^2\\)','\\((a-b)^2=a^2-b^2\\)','\\((a-b)^2=a^2-2ab-b^2\\)','\\((a-b)^2=a^2+2ab-b^2\\)'],'Das letzte Glied ist \\((-b)^2=+b^2\\).'],
    ['\\((a+b)(a-b)=\\;?\\)',['\\(a^2-b^2\\)','\\(a^2+b^2\\)','\\(a^2-2ab+b^2\\)','\\((a-b)^2\\)'],'3. binomische Formel: Die gemischten Glieder heben sich auf.'],
    ['\\(41^2\\) im Kopf: \\((40+1)^2=\\;?\\)',['\\(1600+80+1=1681\\)','\\(1600+1=1601\\)','\\(1600+40+1=1641\\)','\\(1681+80=1761\\)'],'1. binomische Formel mit a = 40, b = 1.'],
    ['\\(51\\cdot49=\\;?\\)',['\\(50^2-1^2=2499\\)','\\(50^2+1=2501\\)','\\(2500\\)','\\(49^2+51=2452\\)'],'\\((50+1)(50-1)=50^2-1^2\\).']])},
  /* ---------- Faktorisieren ---------- */
  {a:'fa',top:'Ausklammern',gen(){const v=L();const g=rnd(2,6),a=rnd(1,5),b=pick([-5,-3,-1,1,2,3,5,7]);if(gcd(a,b)!==1)return this.gen();const inner=Poly.v(v).scale(a).add(Poly.c(b));const res=inner.mul(Poly.v(v).scale(g));
    const fmt=(m,p)=>`\\(${m}(${p.tex()})\\)`;
    return{q:`Klammere den grösstmöglichen Faktor aus: \\(${res.tex()}\\)`,opts:[fmt(g+v,inner),fmt(g,Poly.v(v,2).scale(a).add(Poly.v(v).scale(b))),fmt(g+v,Poly.v(v).scale(a).add(Poly.c(b*g))),fmt(v,Poly.v(v).scale(g*a).add(Poly.c(g*b+1)))],expl:`Gemeinsamer Faktor \\(${g}${v}\\). Probe durch Ausmultiplizieren.`}}},
  {a:'fa',top:'Faktorisieren',gen(){const v=L();const a=rnd(1,5),b=rnd(1,8);if(gcd(a,b)!==1)return this.gen();const pa=Poly.v(v).scale(a);const res=pa.pow(2).sub(Poly.c(b*b));const A=pa.tex();
    return{q:`\\(${res.tex()}=\\;?\\)`,opts:[`\\((${A}+${b})(${A}-${b})\\)`,`\\((${A}-${b})^2\\)`,`\\((${A}+${b})^2\\)`,`\\((${A}-${b*b})(${A}+1)\\)`],expl:`3. binomische Formel rückwärts: \\(a^2-b^2=(a+b)(a-b)\\) mit \\(a=${A}\\), \\(b=${b}\\).`}}},
  {a:'fa',top:'Zweiklammeransatz',gen(){let m=pick([-6,-5,-4,-3,-2,2,3,4,5,6]),n=pick([-5,-4,-3,-2,1,2,3,4,7]);if(m===-n)n++;const res=X.add(Poly.c(m)).mul(X.add(Poly.c(n)));
    const f=(a,b)=>`\\((x${sg(a)})(x${sg(b)})\\)`;
    return{q:`\\(${res.tex()}=\\;?\\)`,opts:[f(m,n),f(-m,-n),f(m,-n),f(m*n,1)],expl:`Gesucht: \\(m\\cdot n=${m*n}\\) und \\(m+n=${m+n}\\), also \\(${m}\\) und \\(${n}\\).`}}},
  {a:'fa',top:'Faktorisieren',gen:fact([
    ['Was macht man beim Faktorisieren <b>zuerst</b>?',['gemeinsame Faktoren ausklammern','binomische Formeln anwenden','ausmultiplizieren','durch x dividieren'],'Erst ausklammern, dann sieht man oft eine binomische Formel.'],
    ['Faktorisiere vollständig: \\(3x^2-12\\)',['\\(3(x+2)(x-2)\\)','\\(3(x^2-4)\\)','\\((3x+2)(x-6)\\)','\\(3(x-2)^2\\)'],'Ausklammern, dann 3. binomische Formel. \\(3(x^2-4)\\) ist noch nicht vollständig zerlegt.'],
    ['\\(x^2-10x+25=\\;?\\)',['\\((x-5)^2\\)','\\((x+5)(x-5)\\)','\\((x-25)(x+1)\\)','\\((x+5)^2\\)'],'2. binomische Formel: \\(2\\cdot x\\cdot5=10x\\).'],
    ['\\(m^2+18m-40=\\;?\\)',['\\((m+20)(m-2)\\)','\\((m-20)(m+2)\\)','\\((m+10)(m+8)\\)','\\((m+40)(m-1)\\)'],'\\(20\\cdot(-2)=-40\\) und \\(20+(-2)=18\\).'],
    ['Welcher Term ist ein <b>Produkt</b>?',['\\(2x(x-3)\\)','\\(2x^2-6x\\)','\\(x^2+x+1\\)','\\(2x+x-3\\)'],'Ein Produkt besteht aus Faktoren, die multipliziert werden.']])}
  ];
  qzRegister('12',{be:'Terme und Begriffe',kl:'Addition, Subtraktion, Klammern',mu:'Multiplikation und Division',bf:'Binomische Formeln',fa:'Faktorisieren'},G);
})();
