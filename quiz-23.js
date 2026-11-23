/* ======================= Quiz-Fragen Kapitel 2.3 Geometrie ======================= */
(function(){
  const T=t=>`\\(${t}\\)`;const deg=v=>`\\(${v}^\\circ\\)`;
  const VI='#7a6a9c';
  const quad=(f,P,labs=['A','B','C','D'])=>{f.poly(P,{w:2.2,f:'rgba(122,106,156,.10)'});const G={x:P.reduce((s,p)=>s+p.x,0)/4,y:P.reduce((s,p)=>s+p.y,0)/4};P.forEach((p,i)=>{f.dot(p,3.5);f.text(V.add(p,V.mul(V.norm(V.sub(p,G)),0.45)),labs[i],'lbl')})};
  const G=[
  /* ---------- Ortslinien ---------- */
  {a:'ol',top:'Ortslinien',gen:fact([
    ['Alle Punkte, die von zwei Punkten \\(A\\) und \\(B\\) gleich weit entfernt sind, liegen auf …',['der Mittelsenkrechten \\(m_{AB}\\)','dem Kreis um \\(A\\)','der Winkelhalbierenden','einer Parallelen zu \\(AB\\)'],'Die Mittelsenkrechte ist die Ortslinie «gleich weit von A und B».'],
    ['Alle Punkte mit dem Abstand 2 cm von einem Punkt \\(M\\) bilden …',['einen Kreis \\(k(M;\\,2\\text{ cm})\\)','ein Parallelenpaar','eine Gerade','eine Kreisfläche'],'Nur die Kreis<b>linie</b>, nicht die Fläche.'],
    ['Alle Punkte mit dem Abstand 2 cm von einer Geraden \\(g\\) bilden …',['zwei Parallelen zu \\(g\\)','eine Parallele zu \\(g\\)','einen Kreis','eine Senkrechte zu \\(g\\)'],'Auf jeder Seite von \\(g\\) eine Parallele im Abstand 2 cm.'],
    ['Alle Punkte, die von zwei sich schneidenden Geraden gleich weit entfernt sind, liegen auf …',['den zwei Winkelhalbierenden','einer Mittelsenkrechten','einem Kreis um den Schnittpunkt','einer Parallelen'],'Zwei Geraden bilden zwei Winkelpaare, also zwei Winkelhalbierende. Sie stehen senkrecht aufeinander.'],
    ['Wie viele Punkte sind von \\(A\\) und \\(B\\) gleich weit entfernt <b>und</b> liegen auf einem Kreis, dessen Mittelpunkt auf \\(m_{AB}\\) liegt?',['2','1','0','unendlich viele'],'Eine Gerade durch den Kreismittelpunkt schneidet den Kreis immer zweimal.']])},
  {a:'ol',top:'Inkreis und Umkreis',gen:fact([
    ['Der Umkreismittelpunkt eines Dreiecks ist der Schnittpunkt der …',['Mittelsenkrechten','Winkelhalbierenden','Höhen','Seitenhalbierenden'],'Er ist von allen Ecken gleich weit entfernt: Ortslinie Mittelsenkrechte.'],
    ['Der Inkreismittelpunkt ist der Schnittpunkt der …',['Winkelhalbierenden','Mittelsenkrechten','Höhen','Seitenhalbierenden'],'Er ist von allen Seiten gleich weit entfernt: Ortslinie Winkelhalbierende.']])},
  /* ---------- Thales ---------- */
  {a:'th',top:'Satz des Thales',gen(){const a=rnd(20,70);return{q:`\\(C\\) liegt auf dem Halbkreis über \\(\\overline{AB}\\). \\(\\alpha=${a}^\\circ\\). Wie gross ist \\(\\beta\\)?`,opts:[deg(90-a),deg(180-a),deg(a),deg(90)],expl:`\\(\\gamma=90^\\circ\\) (Thales), also \\(\\beta=90^\\circ-${a}^\\circ=${90-a}^\\circ\\).`,
    draw(f){const M={x:0,y:-2},r=4;const Cc=V.add(M,V.mul(V.dir(2*a*PI/180),r));f.arc(M,0,PI,r,{c:VI,w:1.6,d:'6 4'});f.poly([{x:-4,y:-2},{x:4,y:-2},Cc],{w:2.2,f:'rgba(122,106,156,.1)'});
      f.text({x:-4.35,y:-2.3},'A','lbl');f.text({x:4.35,y:-2.3},'B','lbl');f.text(V.add(Cc,{x:0,y:0.4}),'C','lbl');const w=ang2({x:-4,y:-2},{x:4,y:-2},Cc);f.angle({x:-4,y:-2},w.a1,w.a2,{r:1,lab:'α'});const w2=ang2(Cc,{x:-4,y:-2},{x:4,y:-2});f.angle(Cc,w2.a1,w2.a2,{rr:0.45})}}}},
  {a:'th',top:'Thaleskreis',gen:fact([
    ['Ein Dreieck \\(ABC\\) hat bei \\(C\\) einen rechten Winkel. Wo liegt der Umkreismittelpunkt?',['in der Mitte der Hypotenuse \\(\\overline{AB}\\)','im Punkt \\(C\\)','im Schwerpunkt','ausserhalb des Dreiecks'],'Umkehrung des Thalessatzes: \\(C\\) liegt auf dem Kreis über \\(\\overline{AB}\\).'],
    ['\\(C\\) liegt innerhalb des Thaleskreises über \\(\\overline{AB}\\). Dann ist \\(\\gamma\\) …',['grösser als 90°','gleich 90°','kleiner als 90°','nicht bestimmbar'],'Innerhalb: stumpf; ausserhalb: spitz.'],
    ['Wozu braucht man den Thaleskreis bei der Konstruktion der Tangenten von \\(P\\) an einen Kreis um \\(M\\)?',['Der Winkel \\(\\angle MTP\\) im Berührpunkt muss 90° sein.','Um den Radius zu verdoppeln.','Um \\(P\\) zu spiegeln.','Um den Mittelpunkt zu finden.'],'Tangente ⊥ Radius: \\(T\\) liegt auf dem Thaleskreis über \\(\\overline{MP}\\).'],
    ['Eine Tangente steht im Berührpunkt …',['senkrecht auf dem Radius','parallel zum Radius','unter 45° zum Radius','senkrecht auf dem Durchmesser durch einen anderen Punkt'],'Tangente ⊥ Berührradius.']])},
  {a:'th',top:'Winkel im Thaleskreis',gen(){const a=rnd(20,70);return{q:`\\(C\\) liegt auf dem Thaleskreis über \\(\\overline{AB}\\) mit Mittelpunkt \\(M\\). \\(\\angle MCA=${a}^\\circ\\). Wie gross ist \\(\\angle AMC\\)?`,opts:[deg(180-2*a),deg(2*a),deg(90-a),deg(180-a)],expl:`\\(AMC\\) ist gleichschenklig: \\(\\angle MAC=${a}^\\circ\\). \\(\\angle AMC=180^\\circ-2\\cdot${a}^\\circ\\).`}}},
  /* ---------- Dreieckskonstruktionen ---------- */
  {a:'dk',top:'Kongruenzsätze',gen:fact([
    ['Welche Angaben legen ein Dreieck <b>nicht</b> eindeutig fest?',['drei Winkel','drei Seiten','zwei Seiten und der Zwischenwinkel','eine Seite und die zwei anliegenden Winkel'],'Drei Winkel legen nur die Form fest, nicht die Grösse (ähnliche Dreiecke).'],
    ['Gibt es ein Dreieck mit den Seiten 3 cm, 4 cm und 8 cm?',['nein','ja, genau eines','ja, zwei','ja, unendlich viele'],'\\(3+4=7<8\\): Die Kreise schneiden sich nicht.'],
    ['Gegeben sind \\(c=6\\) cm, \\(\\alpha=50^\\circ\\), \\(\\beta=60^\\circ\\). Welcher Kongruenzsatz?',['WSW','SWS','SSS','SsW'],'Eine Seite und die beiden anliegenden Winkel.'],
    ['Gegeben sind \\(b=5\\) cm, \\(c=6\\) cm, \\(\\alpha=50^\\circ\\). Welcher Kongruenzsatz?',['SWS','WSW','SsW','SSS'],'\\(\\alpha\\) liegt zwischen \\(b\\) und \\(c\\).'],
    ['Bei SsW <b>kann</b> es zwei Lösungen geben, wenn …',['der Winkel der kleineren Seite gegenüberliegt','der Winkel der grösseren Seite gegenüberliegt','die Seiten gleich lang sind','der Winkel 90° ist'],'Dann kann der Kreis den Strahl zweimal schneiden. Je nach Länge berührt er ihn aber nur (eine Lösung) oder erreicht ihn nicht (keine Lösung).'],
    ['Gegeben: \\(c=5\\) cm, \\(\\alpha=70^\\circ\\), \\(\\beta=120^\\circ\\). Wie viele Dreiecke gibt es?',['keines','eines','zwei','unendlich viele'],'\\(\\alpha+\\beta=190^\\circ>180^\\circ\\): Die Strahlen schneiden sich nicht.']])},
  {a:'dk',top:'Konstruktionsbericht',gen:fact([
    ['SSS mit \\(c=\\overline{AB}\\). Wie findet man \\(C\\)?',[T('C\\in k(A;\\,b)\\cap k(B;\\,a)'),T('C\\in k(A;\\,a)\\cap k(B;\\,b)'),T('C\\in k(A;\\,c)\\cap k(B;\\,c)'),T('C=m_{AB}\\cap k(A;\\,b)')],'\\(b=|\\overline{AC}|\\), also Kreis um \\(A\\) mit \\(b\\); \\(a=|\\overline{BC}|\\), Kreis um \\(B\\) mit \\(a\\).'],
    ['Was bedeutet \\(k(A;\\,4\\text{ cm})\\)?',['Kreis um \\(A\\) mit Radius 4 cm','Kreis mit Durchmesser 4 cm durch \\(A\\)','Strecke der Länge 4 cm ab \\(A\\)','Strahl ab \\(A\\)'],'Mittelpunkt; Radius.']])},
  /* ---------- Vierecke ---------- */
  {a:'vi',top:'Vierecksarten',gen:fact([
    ['Welche Aussage ist <b>falsch</b>?',['Jedes Rechteck ist ein Quadrat.','Jedes Quadrat ist eine Raute.','Jedes Rechteck ist ein Parallelogramm.','Jede Raute ist ein Drachenviereck.'],'Ein Rechteck braucht keine gleich langen Seiten.'],
    ['Bei welchem Viereck stehen die Diagonalen immer senkrecht aufeinander?',['Raute','Rechteck','Parallelogramm','gleichschenkliges Trapez'],'Drachen, Raute und Quadrat haben senkrechte Diagonalen.'],
    ['Bei welchem Viereck sind die Diagonalen immer gleich lang?',['Rechteck','Raute','Parallelogramm','Drachenviereck'],'Gleichschenkliges Trapez, Rechteck und Quadrat.'],
    ['Wie viele Symmetrieachsen hat ein Rechteck (kein Quadrat)?',['2','4','1','0'],'Die beiden Mittellinien. Die Diagonalen sind keine Symmetrieachsen.'],
    ['Ein Viereck hat zwei Paare paralleler Gegenseiten und vier rechte Winkel. Es ist sicher ein …',['Rechteck','Quadrat','Raute','Drachen'],'Ein Quadrat ist es nur, wenn zusätzlich alle Seiten gleich lang sind.'],
    ['Welche Eigenschaft hat ein Parallelogramm <b>immer</b>?',['Die Diagonalen halbieren sich.','Die Diagonalen sind gleich lang.','Die Diagonalen stehen senkrecht.','Es ist achsensymmetrisch.'],'Das Parallelogramm ist punktsymmetrisch zum Diagonalenschnittpunkt.']])},
  {a:'vi',top:'Vierecke erkennen',gen(){const types=[['Parallelogramm',[{x:-3.5,y:-2},{x:2,y:-2},{x:3.5,y:1.6},{x:-2,y:1.6}]],['Trapez',[{x:-3.5,y:-2},{x:3.5,y:-2},{x:1.5,y:1.6},{x:-2.5,y:1.6}]],['Drachenviereck',[{x:-3.8,y:0},{x:0,y:-2.2},{x:2,y:0},{x:0,y:2.2}]],['Raute',[{x:-3.5,y:0},{x:0,y:-2},{x:3.5,y:0},{x:0,y:2}]],['Rechteck',[{x:-3.5,y:-2},{x:3.5,y:-2},{x:3.5,y:1.8},{x:-3.5,y:1.8}]]];
    const [n,P]=pick(types);const others=types.map(t=>t[0]).filter(x=>x!==n);shuffle(others);
    return{q:'Welche Vierecksart ist abgebildet (möglichst genaue Bezeichnung)? Die Rasterlinien helfen.',opts:[n,...others.slice(0,3)],expl:'Prüfe parallele Seiten, gleich lange Seiten und die Diagonalen.',draw(f){quad(f,P)}}}},
  /* ---------- Berechnungen ---------- */
  {a:'vb',top:'Winkelsumme',gen(){const a=rnd(60,120),b=rnd(60,110),c=rnd(60,110);return{q:`Viereck: \\(\\alpha=${a}^\\circ\\), \\(\\beta=${b}^\\circ\\), \\(\\gamma=${c}^\\circ\\). \\(\\delta=\\;?\\)`,opts:[deg(360-a-b-c),deg(Math.abs(180-a-b-c)),deg(360-a-b),deg(Math.round((a+b+c)/3))].filter((x,i,A)=>A.indexOf(x)===i),expl:'Winkelsumme im Viereck \\(360^\\circ\\).'}}},
  {a:'vb',top:'Flächen',gen(){const t=rnd(1,3);if(t===1){const a=rnd(6,12),c=rnd(2,5),h=rnd(2,6);return{q:`Trapez \\(a=${a}\\) cm, \\(c=${c}\\) cm, \\(h=${h}\\) cm. \\(A=\\;?\\)`,opts:[`${(a+c)*h/2} cm²`,`${(a+c)*h} cm²`,`${a*c*h/2} cm²`,`${(a-c)*h/2} cm²`],expl:'\\(A=\\dfrac{a+c}{2}\\cdot h\\)'}}
    if(t===2){const e=rnd(4,12),ff=rnd(3,9);return{q:`Drachen mit \\(e=${e}\\) cm, \\(f=${ff}\\) cm. \\(A=\\;?\\)`,opts:[`${e*ff/2} cm²`,`${e*ff} cm²`,`${e+ff} cm²`,`${2*(e+ff)} cm²`],expl:'\\(A=\\dfrac{e\\cdot f}{2}\\)'}}
    const a=rnd(4,10),h=rnd(2,7),b=h+rnd(1,3);return{q:`Parallelogramm: \\(a=${a}\\) cm, \\(b=${b}\\) cm, \\(h_a=${h}\\) cm. \\(A=\\;?\\)`,opts:[`${a*h} cm²`,`${a*b} cm²`,`${a*h/2} cm²`,`${2*(a+b)} cm²`],expl:'\\(A=a\\cdot h_a\\). Die schräge Seite \\(b\\) braucht man nur für den Umfang.'}}},
  /* ---------- Kongruenzabbildungen ---------- */
  {a:'ka',top:'Kongruenzabbildungen',gen:fact([
    ['Bei welcher Abbildung ändert sich der Umlaufsinn?',['Achsenspiegelung','Drehung','Punktspiegelung','Verschiebung'],'Nur die Achsenspiegelung kehrt den Umlaufsinn um.'],
    ['Eine Punktspiegelung an \\(Z\\) ist dasselbe wie …',['eine Drehung um \\(Z\\) mit 180°','eine Achsenspiegelung','eine Verschiebung','eine Drehung um 90°'],'Z halbiert jede Strecke PP\'.'],
    ['Bei der Achsenspiegelung an \\(g\\) ist \\(g\\) für jede Strecke \\(\\overline{PP\'}\\) …',['die Mittelsenkrechte','parallel dazu','eine Winkelhalbierende','ein Kreis'],'\\(PP\'\\perp g\\) und \\(g\\) halbiert \\(\\overline{PP\'}\\).'],
    ['Welche Abbildung hat keinen Fixpunkt (ausser der Nullverschiebung)?',['Verschiebung','Drehung','Punktspiegelung','Achsenspiegelung'],'Alle Punkte werden verschoben.'],
    ['\\(P(3;\\,1)\\) wird an der \\(y\\)-Achse gespiegelt. \\(P\'=\\;?\\)',['\\((-3;\\,1)\\)','\\((3;\\,-1)\\)','\\((-3;\\,-1)\\)','\\((1;\\,3)\\)'],'Die \\(x\\)-Koordinate wechselt das Vorzeichen.'],
    ['\\(P(2;\\,5)\\) wird am Ursprung gespiegelt. \\(P\'=\\;?\\)',['\\((-2;\\,-5)\\)','\\((-2;\\,5)\\)','\\((2;\\,-5)\\)','\\((5;\\,2)\\)'],'Beide Koordinaten wechseln das Vorzeichen.']])},
  /* ---------- Kreis ---------- */
  {a:'kr',top:'Geraden am Kreis',gen:fact([
    ['Eine Gerade hat vom Kreismittelpunkt den Abstand 5 cm, der Radius ist 3 cm. Die Gerade ist eine …',['Passante','Tangente','Sekante','Sehne'],'Abstand > Radius: kein gemeinsamer Punkt.'],
    ['Abstand vom Mittelpunkt = Radius. Die Gerade ist eine …',['Tangente','Passante','Sekante','Durchmesser'],'Genau ein Berührpunkt.'],
    ['Die längste Sehne eines Kreises ist …',['der Durchmesser','der Radius','die Tangente','der Bogen'],'\\(d=2r\\).']])},
  {a:'kr',top:'Kreiswinkel',gen(){const phi=2*rnd(25,85);return{q:`Zentriwinkel \\(\\varphi=${phi}^\\circ\\). Peripheriewinkel über demselben Bogen?`,opts:[deg(phi/2),deg(2*phi),deg(180-phi),deg(phi)],expl:'Zentriwinkelsatz: \\(\\gamma=\\dfrac{\\varphi}{2}\\).'}}},
  {a:'kr',top:'Kreisberechnungen',gen(){const r=rnd(2,10);const t=rnd(1,3);
    if(t===1)return{q:`Umfang eines Kreises mit \\(r=${r}\\) cm?`,opts:[`${(2*PI*r).toFixed(2)} cm`,`${(PI*r*r).toFixed(2)} cm`,`${(PI*r).toFixed(2)} cm`,`${(2*r).toFixed(2)} cm`],expl:'\\(u=2\\pi r\\).'};
    if(t===2)return{q:`Fläche eines Kreises mit \\(d=${2*r}\\) cm?`,opts:[`${(PI*r*r).toFixed(2)} cm²`,`${(PI*4*r*r).toFixed(2)} cm²`,`${(2*PI*r).toFixed(2)} cm²`,`${(PI*2*r).toFixed(1)} cm²`],expl:'Zuerst \\(r=\\dfrac d2\\), dann \\(A=\\pi r^2\\).'};
    const phi=pick([45,60,90,120,180]);return{q:`Welcher Anteil der Kreisfläche ist ein Sektor mit \\(\\varphi=${phi}^\\circ\\)?`,opts:[T(`\\dfrac{${phi}}{360}=\\dfrac{1}{${360/phi}}`),T(`\\dfrac{${phi}}{180}`),T(`\\dfrac{1}{${phi}}`),T(`\\dfrac{${phi}}{100}`)],expl:'Ein Sektor ist der Anteil \\(\\dfrac{\\varphi}{360^\\circ}\\) des Kreises.'}}}
  ];
  qzRegister('23',{ol:'Ortslinien',th:'Thaleskreis',ka:'Kongruenzabbildungen (freiwillig)',dk:'Dreieckskonstruktionen',vi:'Vierecksarten',vb:'Berechnungen an Vierecken',kr:'Kreis'},G);
})();
