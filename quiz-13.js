/* ======================= Quiz-Fragen Kapitel 1.3 Geometrie ======================= */
(function(){
  const W=['spitzer Winkel','rechter Winkel','stumpfer Winkel','gestreckter Winkel','überstumpfer Winkel'];
  const P4=[['Umkreismittelpunkt U','Mittelsenkrechten'],['Inkreismittelpunkt I','Winkelhalbierenden'],['Höhenschnittpunkt H','Höhen'],['Schwerpunkt S','Seitenhalbierenden']];
  function niceTri(){for(;;){const A={x:rnd(-9,-3)/2,y:rnd(-6,-3)/2},B={x:rnd(3,9)/2,y:rnd(-6,-3)/2},Cc={x:rnd(-4,4)/2,y:rnd(3,7)/2};const a=TRI.angles(A,B,Cc);if(Math.min(a.al,a.be,a.ga)>35&&Math.max(a.al,a.be,a.ga)<85)return{A,B,C:Cc}}}
  function triBase(f,T,sides=false){f.poly([T.A,T.B,T.C],{w:0,f:'#f6f9fb',c:'none'});for(const [p,q] of[[T.A,T.B],[T.B,T.C],[T.C,T.A]])f.seg(p,q,{w:2.4});for(const p of[T.A,T.B,T.C])f.dot(p,3.6);triLabels(f,T,{sides})}
  function triAng(al,be){const A={x:0,y:0},B={x:1,y:0},Cc=V.mul(V.dir(al/DEG),Math.sin(be/DEG)/Math.sin((al+be)/DEG));
    const pts=[A,B,Cc];let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)}
    const k=Math.min(9/(x1-x0),5.6/(y1-y0)),cx=(x0+x1)/2,cy=(y0+y1)/2;const m=pts.map(p=>({x:(p.x-cx)*k,y:(p.y-cy)*k-0.1}));return{A:m[0],B:m[1],C:m[2]}}
  const parSecs=(S,td)=>{const hd={x:1,y:0},a=x=>V.ang(x),m=(p,q)=>{let A1=a(p),A2=a(q);while(A2<=A1)A2+=2*PI;return[A1,A2]};return{'α':m(V.mul(hd,-1),V.mul(td,-1)),'β':m(V.mul(td,-1),hd),'γ':m(hd,td),'δ':m(td,V.mul(hd,-1))}};
  function parFig(f,td){const S1=lineX({x:0,y:0},td,{x:0,y:1.4},{x:1,y:0}),S2=lineX({x:0,y:0},td,{x:0,y:-1.4},{x:1,y:0});
    f.line({x:0,y:1.4},{x:1,y:0},{w:2.2});f.line({x:0,y:-1.4},{x:1,y:0},{w:2.2});f.line({x:0,y:0},td,{w:2.2});f.text({x:f.xmax-0.6,y:1.8},'h_1');f.text({x:f.xmax-0.6,y:-1.0},'h_2');f.dot(S1,3.2);f.dot(S2,3.2);return{1:S1,2:S2}}
  const numOpts=(x,cands)=>[`${x}°`,...cands.filter(c=>c!==x&&c>0&&c<360).map(c=>`${c}°`)].slice(0,4);
  const KN={ms:'Mittelsenkrechte einer Strecke',lot:'Lot von einem Punkt auf eine Gerade fällen',err:'Senkrechte in einem Punkt der Geraden errichten',wh:'Winkelhalbierende',par:'Parallele durch einen Punkt',w60:'60°-Winkel',w30:'30°-Winkel'};
  const G=[
  /* ---------- Grundbegriffe ---------- */
  {a:'gb',top:'Grundbegriffe',gen(){const t=rnd(0,2);const n=['Strecke AB','Strahl mit Anfangspunkt A durch B','Gerade AB'];
    return{q:'Was ist in der Figur dargestellt?',opts:[n[t],...n.filter((_,i)=>i!==t)],
      expl:['Eine Strecke endet in <i>A</i> und in <i>B</i>.','Der Strahl beginnt in <i>A</i>, geht durch <i>B</i> und endet nicht.','Die Gerade geht über <i>A</i> und <i>B</i> hinaus, auf beiden Seiten unbegrenzt.'][t],
      draw(f){const A={x:-2.5,y:-1},B={x:2.5,y:1},d=V.norm(V.sub(B,A));f.seg(t===2?V.sub(A,V.mul(d,20)):A,t===0?B:V.add(B,V.mul(d,20)),{w:2.6,c:C.blau});f.dot(A,4.2);f.dot(B,4.2);
        f.text(V.add(A,V.mul(V.perp(d),0.5)),'A');f.text(V.add(B,V.mul(V.perp(d),0.5)),'B')}}}},
  {a:'gb',top:'Winkelarten',gen(){const c=rnd(0,4);const x=[rnd(5,85),90,rnd(95,175),180,rnd(185,355)][c];const o=shuffle([0,1,2,3,4].filter(i=>i!==c)).slice(0,3);
    return{q:`Ein Winkel misst ${x}°. Wie heisst diese Winkelart?`,opts:[W[c],...o.map(i=>W[i])],expl:'spitz: unter 90° · recht: 90° · stumpf: zwischen 90° und 180° · gestreckt: 180° · überstumpf: zwischen 180° und 360°.'}}},
  {a:'gb',top:'Winkelarten',gen(){const c=pick([0,2,4]);const x=[rnd(25,70),0,rnd(110,160),0,rnd(205,330)][c];
    return{q:'Welche Winkelart ist <i>α</i> in der Figur?',opts:[W[c],...[0,2,4].filter(i=>i!==c).map(i=>W[i]),W[1]],expl:`Der Winkel <i>α</i> misst ${x}°.`,
      draw(f){const S={x:-1,y:-1},a0=rnd(-20,20)/DEG,a=x/DEG;f.wedge(S,a0,a0+a,1.2);f.arc(S,a0,a0+a,1.2,{c:C.blau,w:1.6,me:'b'});f.seg(S,V.add(S,V.mul(V.dir(a0),5)),{w:2.6});f.seg(S,V.add(S,V.mul(V.dir(a0+a),5)),{w:2.6});
        f.text(V.add(S,V.mul(V.dir(a0+a/2),1.75)),'α');f.dot(S,4)}}}},
  {a:'gb',top:'Winkel schätzen',gen(){const x=5*rnd(5,33);const c=shuffle([x-50,x-25,x+25,x+50].filter(v=>v>=10&&v<=175)).slice(0,3);
    return{q:'Schätze die Grösse des Winkels <i>α</i>. (Ein Häuschen ist 5 mm.)',opts:numOpts(x,c),expl:`<i>α</i> misst ${x}°. Vergleiche mit einem rechten Winkel (90°) und seiner Hälfte (45°).`,
      draw(f){const S={x:-2,y:-2.5},a0=rnd(-15,15)/DEG,a=x/DEG;f.wedge(S,a0,a0+a,1.1);f.seg(S,V.add(S,V.mul(V.dir(a0),6)),{w:2.6});f.seg(S,V.add(S,V.mul(V.dir(a0+a),6)),{w:2.6});f.text(V.add(S,V.mul(V.dir(a0+a/2),clamp(0.36/Math.sin(a/2),0.7,1.8))),'α');f.dot(S,4)}}}},
  {a:'gb',top:'Lage von Geraden',gen(){const t=rnd(0,2);const n=['<i>g</i> ∥ <i>h</i>','<i>g</i> ⊥ <i>h</i>','<i>g</i> und <i>h</i> schneiden sich, aber nicht senkrecht'];const b=rnd(-30,30)/DEG,dif=[0,PI/2,rnd(35,65)/DEG][t];
    return{q:'Wie liegen die Geraden <i>g</i> und <i>h</i> zueinander?',opts:[n[t],...n.filter((_,i)=>i!==t)],expl:['Gleiche Richtung, überall gleicher Abstand.','Sie schneiden sich unter 90°. Prüfe mit dem Geodreieck.','Der Schnittwinkel ist nicht 90°.'][t],
      draw(f){const d1=V.dir(b),d2=V.dir(b+dif),P1={x:-1,y:-1.4},P2=t===0?{x:0.5,y:1.3}:{x:0.3,y:-0.6};f.line(P1,d1,{w:2.4});f.line(P2,d2,{w:2.4,c:C.blau});
        f.text(f.inView(V.add(P1,V.add(V.mul(d1,6),V.mul(V.perp(d1),-0.45)))),'g');f.text(f.inView(V.add(P2,V.add(V.mul(d2,t===0?6:3.5),V.mul(V.perp(d2),0.45)))),'h','lbl',{fill:C.blau})}}}},
  {a:'gb',top:'Grundbegriffe',gen:fact([
    ['Wie viele Geraden gehen durch zwei verschiedene Punkte <i>A</i> und <i>B</i>?',['genau eine','keine','genau zwei','unendlich viele'],'Zwei Punkte legen eine Gerade eindeutig fest.'],
    ['Wie schreibt man die <b>Länge</b> der Strecke von <i>A</i> nach <i>B</i>?',[OV('AB'),'<span class="ov">AB</span> (ohne Betragsstriche)','<i>AB</i> (Gerade)','∠<i>AB</i>'],'<span class="ov">AB</span> ist die Strecke selbst, die Betragsstriche bezeichnen ihre Länge.'],
    ['Der Abstand eines Punktes <i>P</i> von einer Geraden <i>g</i> ist …',['die Länge des Lots von <i>P</i> auf <i>g</i>','die Länge irgendeiner Strecke von <i>P</i> zu <i>g</i>','der Winkel zwischen <i>P</i> und <i>g</i>','immer 1 cm'],'Das Lot ist die kürzeste Verbindung von <i>P</i> zu <i>g</i>.'],
    ['Die Geraden <i>g</i> und <i>h</i> stehen beide senkrecht auf <i>k</i>. Dann gilt …',['<i>g</i> ∥ <i>h</i>','<i>g</i> ⊥ <i>h</i>','<i>g</i> und <i>h</i> schneiden sich auf <i>k</i>','keine Aussage möglich'],'Zwei Senkrechte zur gleichen Geraden haben die gleiche Richtung.'],
    ['Wie heisst der gemeinsame Anfangspunkt der beiden Schenkel eines Winkels?',['Scheitel','Fusspunkt','Mittelpunkt','Endpunkt'],'Bei <i>α</i> = ∠<i>PSQ</i> ist <i>S</i> der Scheitel.'],
    ['Welche Linie hat genau einen Endpunkt?',['der Strahl','die Strecke','die Gerade','keine'],'Der Strahl beginnt im Anfangspunkt und ist auf der anderen Seite unbegrenzt.'],
    ['Wie viele rechte Winkel ergeben zusammen einen Vollwinkel?',['4','2','3','6'],'4 · 90° = 360°.'],
    ['Bei <i>α</i> = ∠<i>PSQ</i> ist der Scheitel …',['<i>S</i>, der mittlere Buchstabe','<i>P</i>, der erste Buchstabe','<i>Q</i>, der letzte Buchstabe','nicht angegeben'],'Bei der Dreipunkt-Schreibweise steht der Scheitel immer in der Mitte.']])},
  /* ---------- Grundkonstruktionen ---------- */
  {a:'gk',top:'Grundkonstruktionen',gen(){const keys=Object.keys(KN);const t=pick(keys);
    const G0={ms:{A:{x:-3,y:-1+rnd(-2,2)/2},B:{x:3,y:0.5+rnd(-2,2)/2}},lot:{G1:{x:-6,y:-1.5},G2:{x:5,y:-0.5+rnd(-2,2)/2},P:{x:rnd(-2,2)/2,y:2.5}},err:{G1:{x:-6,y:-2},G2:{x:5,y:-1+rnd(-2,2)/2},P:{x:0,y:-1.5}},
      wh:{S:{x:-4.5,y:-3},P:{x:4,y:-2+rnd(-2,2)/2},Q:{x:rnd(-2,2)/2,y:4}},par:{G1:{x:-6,y:-3},G2:{x:5,y:-1.5+rnd(-2,2)/2},P:{x:-1,y:1}},w60:{S:{x:-4,y:-3},P:{x:3,y:-3+rnd(0,2)/2}},w30:{S:{x:-4,y:-3},P:{x:3,y:-3+rnd(0,2)/2}}}[t];
    if(t==='err')G0.P=footOf(G0.P,G0.G1,G0.G2).p;
    return{q:'Welche Grundkonstruktion ist hier fertig ausgeführt?',opts:[KN[t],...shuffle(keys.filter(x=>x!==t)).slice(0,3).map(x=>KN[x])],expl:{ms:'Gleiche Bögen um beide Endpunkte der Strecke, Gerade durch die Schnittpunkte.',lot:'Der Punkt P liegt ausserhalb der Geraden; die Bögen liefern einen zweiten Punkt Q auf der anderen Seite.',err:'Der Punkt P liegt auf der Geraden und ist die Mitte von RS.',wh:'Bögen um den Scheitel und um die Schnittpunkte mit den Schenkeln; Strahl vom Scheitel aus.',par:'Vier gleiche Radien bilden eine Raute ABQP.',w60:'Das Dreieck SRT ist gleichseitig.',w30:'Ein 60°-Winkel (gleichseitiges Dreieck) wird halbiert.'}[t],
      draw(f){f.s=27;f.ox=f.w/2;f.oy=f.h/2+10;const cons=KON[t].build(G0,'zl');drawCons(f,cons,cons.steps.length,false)}}}},
  {a:'gk',top:'Grundkonstruktionen',gen:fact([
    ['Bei der Konstruktion der Mittelsenkrechten von <span class="ov">AB</span> muss der Radius …',[`grösser als die Hälfte von ${OV('AB')} sein`,`genau ${OV('AB')} sein`,`kleiner als die Hälfte von ${OV('AB')} sein`,'beliebig sein'],'Sonst schneiden sich die beiden Bögen nicht.'],
    ['Was bedeutet <i>k</i>(<i>A</i>; 3 cm)?',['Kreis um <i>A</i> mit Radius 3 cm','Kreis um <i>A</i> mit Durchmesser 3 cm','Strecke von <i>A</i> aus, 3 cm lang','Winkel bei <i>A</i> von 3°'],'k(M; r): Kreis mit Mittelpunkt M und Radius r.'],
    ['Was bedeutet {<i>P</i>, <i>Q</i>} = <i>k</i><sub>1</sub> ∩ <i>k</i><sub>2</sub>?',['<i>P</i> und <i>Q</i> sind die Schnittpunkte der Kreise <i>k</i><sub>1</sub> und <i>k</i><sub>2</sub>','<i>P</i> und <i>Q</i> sind die Mittelpunkte der Kreise','<i>P</i> liegt auf <i>k</i><sub>1</sub>, <i>Q</i> liegt auf <i>k</i><sub>2</sub>','<i>k</i><sub>1</sub> und <i>k</i><sub>2</sub> haben den gleichen Radius'],'∩ bedeutet «Schnittmenge»: die Punkte, die auf beiden Kreisen liegen.'],
    ['Was bedeutet <i>w</i> = [<i>SW</i>?',['Strahl mit Anfangspunkt <i>S</i> durch <i>W</i>','Strecke von <i>S</i> nach <i>W</i>','Gerade durch <i>S</i> und <i>W</i>','Kreis um <i>S</i> durch <i>W</i>'],'Die eckige Klammer markiert den Anfangspunkt des Strahls.'],
    ['Wie konstruiert man einen 30°-Winkel mit Zirkel und Lineal?',['einen 60°-Winkel konstruieren und halbieren','einen rechten Winkel dritteln','einen 45°-Winkel halbieren','gar nicht, nur mit dem Geodreieck'],'60° aus dem gleichseitigen Dreieck, dann Winkelhalbierende.'],
    ['Warum misst der mit dem Zirkel konstruierte Winkel <i>RST</i> genau 60°?',['Das Dreieck <i>SRT</i> ist gleichseitig.','Das Dreieck <i>SRT</i> ist rechtwinklig.','Weil der Radius 6 cm beträgt.','Weil <i>SR</i> doppelt so lang ist wie <i>RT</i>.'],'Alle drei Seiten sind gleich dem Radius r.'],
    ['Welche Grundkonstruktion braucht man für den <b>Umkreismittelpunkt</b>?',['Mittelsenkrechte','Winkelhalbierende','Lot fällen','Parallele'],'U ist der Schnittpunkt der Mittelsenkrechten.'],
    ['Welche Grundkonstruktion braucht man für den <b>Inkreismittelpunkt</b>?',['Winkelhalbierende','Mittelsenkrechte','Senkrechte errichten','Parallele'],'I ist der Schnittpunkt der Winkelhalbierenden.'],
    ['Welche Grundkonstruktion braucht man für die <b>Höhe</b> <i>h<sub>c</sub></i>?',['Lot von <i>C</i> auf <i>AB</i> fällen','Mittelsenkrechte von <span class="ov">AB</span>','Winkelhalbierende von <i>γ</i>','Parallele zu <i>AB</i> durch <i>C</i>'],'Die Höhe ist das Lot von der Ecke auf die Gegenseite.'],
    ['Bei der Parallelenkonstruktion mit Zirkel und Lineal entsteht das Viereck <i>ABQP</i>. Was für ein Viereck ist es?',['eine Raute','ein Trapez','ein Drachenviereck','ein beliebiges Viereck'],'Alle vier Seiten sind mit dem gleichen Radius konstruiert.'],
    ['Welches Hilfsmittel braucht man zum <b>Konstruieren</b> (im engeren Sinn)?',['Zirkel und Lineal ohne Skala','Geodreieck mit Winkelskala','Massstab und Winkelmesser','Taschenrechner'],'Beim Konstruieren wird nicht gemessen; das Geodreieck ist ein Zeichenhilfsmittel.']])},
  /* ---------- Dreieck ---------- */
  {a:'dr',top:'Bezeichnungen',gen(){const v=pick(['A','B','C']),s=v.toLowerCase(),g={A:'α',B:'β',C:'γ'}[v];const ty=rnd(0,2);
    if(ty===0)return{q:`Welche Seite liegt im Dreieck <i>ABC</i> der Ecke <i>${v}</i> gegenüber?`,opts:[`<i>${s}</i>`,...['a','b','c'].filter(x=>x!==s).map(x=>`<i>${x}</i>`)],expl:'Gegenüberliegende Seite und Ecke tragen den gleichen Buchstaben (klein bzw. gross).'};
    if(ty===1){const o=['A','B','C'].filter(x=>x!==v);return{q:`Die Seite <i>${s}</i> verbindet die Ecken …`,opts:[`<i>${o[0]}</i> und <i>${o[1]}</i>`,`<i>${v}</i> und <i>${o[0]}</i>`,`<i>${v}</i> und <i>${o[1]}</i>`],expl:`Die Seite <i>${s}</i> liegt der Ecke <i>${v}</i> gegenüber, sie verbindet also die beiden anderen Ecken.`}}
    return{q:`Bei welcher Ecke liegt der Winkel <i>${g}</i>?`,opts:[`<i>${v}</i>`,...['A','B','C'].filter(x=>x!==v).map(x=>`<i>${x}</i>`)],expl:'α bei A, β bei B, γ bei C.'}}},
  {a:'dr',top:'Dreiecksarten',gen(){let al=rnd(25,95),be=rnd(20,100);if(Math.random()<.25){al=rnd(25,65);be=90-al}
    const ga=180-al-be;let c;if(ga<=0)c='Ein solches Dreieck gibt es nicht';else{const mx=Math.max(al,be,ga);c=mx<90?'spitzwinklig':mx===90?'rechtwinklig':'stumpfwinklig'}
    const all=['spitzwinklig','rechtwinklig','stumpfwinklig','Ein solches Dreieck gibt es nicht'];
    return{q:`In einem Dreieck ist <i>α</i> = ${al}° und <i>β</i> = ${be}°. Was gilt?`,opts:[c,...all.filter(x=>x!==c)],expl:ga<=0?`<i>α</i> + <i>β</i> = ${al+be}° ist schon 180° oder mehr, für <i>γ</i> bleibt nichts übrig.`:`<i>γ</i> = 180° − ${al}° − ${be}° = ${ga}°. Der grösste Winkel misst ${Math.max(al,be,ga)}°.`}}},
  {a:'dr',top:'Dreiecksarten',gen(){const t=rnd(0,2);const s=rnd(3,8);const sd=t===0?[s,s,s]:t===1?shuffle([s,s,s+rnd(1,3)]):[s,s+1,s+3];
    const n=['gleichseitig','gleichschenklig, aber nicht gleichseitig','unregelmässig (alle Seiten verschieden lang)'];
    return{q:`Ein Dreieck hat die Seitenlängen ${sd[0]} cm, ${sd[1]} cm und ${sd[2]} cm. Wie heisst es nach den Seiten?`,opts:[n[t],...n.filter((_,i)=>i!==t)],expl:'gleichseitig: drei gleich lange Seiten · gleichschenklig: (mindestens) zwei gleich lange Seiten · unregelmässig: alle verschieden.'}}},
  {a:'dr',top:'Dreiecksarten',gen(){const types=[['gleichseitig',60,60],['gleichschenklig und spitzwinklig',70,70],['gleichschenklig-rechtwinklig',45,45],['rechtwinklig (nicht gleichschenklig)',90,35],['stumpfwinklig (nicht gleichschenklig)',115,25],['gleichschenklig und stumpfwinklig',30,30]];
    const i=rnd(0,types.length-1),[name,al,be]=types[i];
    return{q:'Wie heisst das abgebildete Dreieck am genauesten? Beachte die Markierungen.',opts:[name,...shuffle(types.filter((_,j)=>j!==i).map(t=>t[0])).slice(0,3)],expl:'Gleich lange Seiten sind mit Strichen markiert, rechte Winkel mit Bogen und Punkt.',
      draw(f){const T=triAng(al,be);triBase(f,T);const ty=TRI.type(T.A,T.B,T.C);const opp={A:[T.B,T.C],B:[T.C,T.A],C:[T.A,T.B]};
        const s=TRI.sides(T.A,T.B,T.C),eq=(x,y)=>Math.abs(x-y)<1e-6*Math.max(s.a,s.b,s.c);
        if(eq(s.a,s.b))[opp.A,opp.B].forEach(p=>f.ticks(...p,1));if(eq(s.b,s.c))[opp.B,opp.C].forEach(p=>f.ticks(...p,1));if(eq(s.c,s.a)&&!eq(s.a,s.b))[opp.C,opp.A].forEach(p=>f.ticks(...p,1));
        if(ty.w==='recht'){const v=T[ty.at],o=['A','B','C'].filter(x=>x!==ty.at);f.rmark(v,ang2(v,T[o[0]],T[o[1]]).a1,0.55)}}}}},
  {a:'dr',top:'Rechtwinkliges Dreieck',gen(){const at=pick(['A','B','C']);const al={A:90,B:rnd(30,55),C:rnd(30,55)}[at],be={A:rnd(30,55),B:90,C:90-al}[at];
    const T=triAng(al,be);const hyp=at.toLowerCase(),kat=['a','b','c'].filter(x=>x!==hyp);
    return{q:'Welche Seite ist im abgebildeten Dreieck die <b>Hypotenuse</b>?',opts:[`<i>${hyp}</i>`,...kat.map(x=>`<i>${x}</i>`)],expl:`Die Hypotenuse liegt dem rechten Winkel (bei <i>${at}</i>) gegenüber. <i>${kat[0]}</i> und <i>${kat[1]}</i> sind die Katheten.`,
      draw(f){triBase(f,T,true);const v=T[at],o=['A','B','C'].filter(x=>x!==at);f.rmark(v,ang2(v,T[o[0]],T[o[1]]).a1,0.55)}}}},
  {a:'dr',top:'Dreieck',gen:fact([
    ['Kann ein Dreieck zwei rechte Winkel haben?',['Nein, die beiden Winkel ergäben schon 180°.','Ja, wenn es gleichschenklig ist.','Ja, wenn es sehr gross ist.','Nur auf dem Quadratraster.'],'Für den dritten Winkel bliebe 0° übrig.'],
    ['Wie gross ist jeder Winkel im gleichseitigen Dreieck?',['60°','45°','90°','30°'],'180° : 3 = 60°.'],
    ['Im gleichschenkligen Dreieck sind … gleich gross.',['die beiden Basiswinkel','alle drei Winkel','der Winkel an der Spitze und ein Basiswinkel','keine Winkel'],'Die Winkel an der Basis sind gleich.'],
    ['Jedes gleichseitige Dreieck ist auch …',['gleichschenklig','rechtwinklig','stumpfwinklig','unregelmässig'],'Es hat sogar drei gleich lange Seiten.'],
    ['Wie heissen die beiden Seiten am rechten Winkel?',['Katheten','Hypotenusen','Schenkel','Basen'],'Die dritte Seite ist die Hypotenuse.'],
    ['In welche Richtung beschriftet man die Ecken <i>A</i>, <i>B</i>, <i>C</i>?',['gegen den Uhrzeigersinn','im Uhrzeigersinn','von links nach rechts','beliebig'],'Das ist die übliche Normlage.'],
    ['Wie viele stumpfe Winkel kann ein Dreieck höchstens haben?',['einen','zwei','drei','keinen'],'Zwei stumpfe Winkel ergäben schon mehr als 180°.']])},
  /* ---------- Linien und Punkte ---------- */
  {a:'lp',top:'Besondere Punkte',gen(){const F=[
    ['Welcher Punkt ist von allen drei <b>Ecken</b> gleich weit entfernt?',0,'Er ist Mittelpunkt des Umkreises; der Umkreis geht durch alle Ecken.'],
    ['Welcher Punkt ist von allen drei <b>Seiten</b> gleich weit entfernt?',1,'Er ist Mittelpunkt des Inkreises; der Inkreis berührt alle Seiten.'],
    ['Welcher Punkt teilt jede Seitenhalbierende im Verhältnis 2 : 1?',3,'Der Schwerpunkt S: Der längere Teil liegt auf der Seite der Ecke.'],
    ['Der Mittelpunkt des Umkreises ist der Schnittpunkt der …',0,'Jeder Punkt der Mittelsenkrechten von AB ist von A und B gleich weit entfernt.','l'],
    ['Der Mittelpunkt des Inkreises ist der Schnittpunkt der …',1,'Jeder Punkt der Winkelhalbierenden ist von beiden Schenkeln gleich weit entfernt.','l'],
    ['Der Schwerpunkt ist der Schnittpunkt der …',3,'Seitenhalbierende verbinden eine Ecke mit der Mitte der Gegenseite.','l']];const [q,i,e,l]=pick(F);
    const o=P4.map(x=>l?x[1]:x[0]);return{q,opts:[o[i],...o.filter((_,j)=>j!==i)],expl:e}}},
  {a:'lp',top:'Besondere Punkte',gen:fact([
    ['Wo liegt der Umkreismittelpunkt <i>U</i> eines <b>rechtwinkligen</b> Dreiecks?',['in der Mitte der Hypotenuse','innerhalb des Dreiecks','ausserhalb des Dreiecks','in der Ecke mit dem rechten Winkel'],'Die Hypotenuse ist Durchmesser des Umkreises (Thaleskreis).'],
    ['Wo liegt der Höhenschnittpunkt <i>H</i> eines <b>stumpfwinkligen</b> Dreiecks?',['ausserhalb des Dreiecks','innerhalb des Dreiecks','auf der längsten Seite','in der Ecke mit dem stumpfen Winkel'],'Zwei Höhen fallen auf die Verlängerungen der Seiten; ihre Verlängerungen schneiden sich ausserhalb.'],
    ['Wo liegt der Höhenschnittpunkt <i>H</i> eines <b>rechtwinkligen</b> Dreiecks?',['in der Ecke mit dem rechten Winkel','in der Mitte der Hypotenuse','ausserhalb des Dreiecks','innerhalb des Dreiecks'],'Die beiden Katheten sind selbst Höhen.'],
    ['Welche Punkte liegen in <b>jedem</b> Dreieck innerhalb?',['Inkreismittelpunkt I und Schwerpunkt S','Umkreismittelpunkt U und Höhenschnittpunkt H','nur der Umkreismittelpunkt U','alle vier Punkte'],'Winkelhalbierende und Seitenhalbierende verlaufen immer im Innern.'],
    ['Welcher Kreis berührt alle drei Seiten des Dreiecks?',['der Inkreis','der Umkreis','der Thaleskreis','kein Kreis'],'Sein Radius ρ ist der Abstand von I zu den Seiten.'],
    ['Welcher Kreis geht durch alle drei Ecken des Dreiecks?',['der Umkreis','der Inkreis','der Kreis um S','kein Kreis'],'Sein Mittelpunkt ist U.'],
    ['Eine Seitenhalbierende verbindet …',['eine Ecke mit der Mitte der Gegenseite','zwei Seitenmitten','eine Ecke mit dem Höhenfusspunkt','eine Seitenmitte mit U'],'Daher der Name: Sie halbiert die Seite.'],
    ['Wie heisst der Fusspunkt der Höhe <i>h<sub>a</sub></i>?',['<i>H<sub>a</sub></i>, er liegt auf der Geraden <i>BC</i>','<i>M<sub>a</sub></i>, die Mitte von <i>a</i>','<i>H</i>, der Höhenschnittpunkt','<i>A</i>'],'h<sub>a</sub> geht von A senkrecht auf die Gerade BC.'],
    ['Auf welcher Geraden liegen <i>U</i>, <i>S</i> und <i>H</i>?',['auf der Eulerschen Geraden','auf der Mittelsenkrechten von <i>c</i>','auf der Seitenhalbierenden <i>s<sub>a</sub></i>','sie liegen nie auf einer Geraden'],'Das gilt für jedes Dreieck (Zusatzwissen).']])},
  {a:'lp',top:'Schwerpunkt',gen(){const L=3*rnd(2,5);return{q:`Die Seitenhalbierende <i>s<sub>a</sub></i> ist ${L} cm lang. Wie weit ist der Schwerpunkt <i>S</i> von der Ecke <i>A</i> entfernt?`,opts:[`${2*L/3} cm`,`${L/3} cm`,`${L/2} cm`,`${L} cm`],expl:`<i>S</i> teilt <i>s<sub>a</sub></i> im Verhältnis 2 : 1. Von der Ecke aus sind es 2/3 der Länge: ${2*L/3} cm.`}}},
  {a:'lp',top:'Linien im Dreieck',gen(){const t=rnd(0,3);const T=niceTri();const n=['Mittelsenkrechten','Winkelhalbierende','Höhen','Seitenhalbierende'];
    return{q:'Welche Linien sind eingezeichnet?',opts:[n[t],...n.filter((_,i)=>i!==t)],expl:['Sie stehen senkrecht auf den Seiten und gehen durch die Seitenmitten.','Sie teilen die Winkel in zwei gleiche Teile.','Sie gehen durch eine Ecke und stehen senkrecht auf der Gegenseite.','Sie verbinden eine Ecke mit der Mitte der Gegenseite.'][t],
      draw(f){triBase(f,T);drawLines(f,T,t)}}}},
  {a:'lp',top:'Besondere Punkte',gen(){const t=rnd(0,3);const T=niceTri();
    return{q:'Welcher besondere Punkt ist <i>X</i>?',opts:P4.map(x=>x[0]).map((x,i)=>[x,i]).sort((a,b)=>(a[1]===t?-1:b[1]===t?1:0)).map(x=>x[0]),expl:`<i>X</i> ist der Schnittpunkt der ${P4[t][1]}.`,
      draw(f){triBase(f,T);drawLines(f,T,t);const X=[TRI.U,TRI.I,TRI.H,TRI.S][t](T.A,T.B,T.C);f.dot(X,4.5,C.rot);f.text(V.add(X,{x:0.38,y:0.38}),'X','lbl',{fill:C.rot})}}}},
  /* ---------- Winkel an Geraden ---------- */
  {a:'wg',top:'Winkel an Geraden',gen(){const th=rnd(45,135),td=V.dir(th/DEG);const R=[['Stufenwinkel','γ',1,'γ',2,'Gleiche Lage an beiden Parallelen: durch Verschieben entlang g zur Deckung.'],
      ['Wechselwinkel','α',1,'γ',2,'Liegen auf verschiedenen Seiten von g und an verschiedenen Parallelen: durch Drehung um 180° zur Deckung.'],
      ['Gegenwinkel','δ',1,'α',2,'Liegen auf der gleichen Seite von g, an verschiedenen Parallelen: Sie ergänzen sich zu 180°.'],
      ['Scheitelwinkel','α',2,'γ',2,'Am gleichen Schnittpunkt gegenüber: gleich gross.'],
      ['Nebenwinkel','α',2,'β',2,'Am gleichen Schnittpunkt nebeneinander: Sie ergänzen sich zu 180°.']];
    const [name,n1,l1,n2,l2,e]=pick(R);const names=R.map(r=>r[0]);
    return{q:'Es gilt <i>h</i><sub>1</sub> ∥ <i>h</i><sub>2</sub>. Wie heissen die beiden markierten Winkel zueinander?',opts:[name,...shuffle(names.filter(x=>x!==name)).slice(0,3)],expl:e,
      draw(f){const S=parFig(f,td);const [a,b]=parSecs(S[l1],td)[n1];f.angle(S[l1],a,b,{r:0.9,c:C.or,f:C.orh,right:false});const [c,d]=parSecs(S[l2],td)[n2];f.angle(S[l2],c,d,{r:0.9,c:C.blau,f:C.hell,right:false})}}}},
  {a:'wg',top:'Winkel an Parallelen',gen(){const th=rnd(40,140),td=V.dir(th/DEG);const val={'α':th,'β':180-th,'γ':th,'δ':180-th},N=['α','β','γ','δ'];const gv=pick(N),tv=pick(N);const x=val[tv];
    return{q:`Es gilt <i>h</i><sub>1</sub> ∥ <i>h</i><sub>2</sub> und <i>${gv}</i> = ${val[gv]}°. Wie gross ist der orange markierte Winkel <i>${tv}'</i>?`,opts:numOpts(x,shuffle([180-x,90-x>0?90-x:x+30,360-x,Math.abs(x-30)])),expl:`<i>${tv}'</i> = <i>${tv}</i> (Stufenwinkel) = ${x}°. Die Winkel an einem Schnittpunkt sind paarweise gleich (Scheitelwinkel) oder ergänzen sich zu 180° (Nebenwinkel).`,
      draw(f){const S=parFig(f,td);const [a,b]=parSecs(S[2],td)[gv];f.angle(S[2],a,b,{r:0.9,c:C.blau,f:C.hell,right:false,lab:`${gv} = ${val[gv]}°`,lr:1.9,lcls:'lbl sm'});const [c,d]=parSecs(S[1],td)[tv];f.angle(S[1],c,d,{r:0.9,c:C.or,f:C.orh,right:false,lab:tv+"'",lr:1.35})}}}},
  {a:'wg',top:'Scheitel- und Nebenwinkel',gen(){const al=rnd(25,155);const ask=pick(['β','γ','δ']);const x=ask==='γ'?al:180-al;
    return{q:`Zwei Geraden schneiden sich. Es ist <i>α</i> = ${al}°. Wie gross ist <i>${ask}</i>?`,opts:numOpts(x,shuffle([180-x,Math.abs(90-x)||x+20,360-x,x+10])),expl:ask==='γ'?'γ ist Scheitelwinkel von α: gleich gross.':`${ask} ist Nebenwinkel von α: 180° − ${al}° = ${x}°.`,
      draw(f){const t1=rnd(-25,10)/DEG,t2=t1+al/DEG,O={x:0,y:0};f.line(O,V.dir(t1),{w:2.4});f.line(O,V.dir(t2),{w:2.4});
        const S2={'α':[t1,t2],'β':[t2,t1+PI],'γ':[t1+PI,t2+PI],'δ':[t2+PI,t1+2*PI]};
        for(const n of['α','β','γ','δ']){const [p,q]=S2[n];const col=n==='α'?[C.blau,C.hell]:n===ask?[C.or,C.orh]:['#b8c3cb','#eef1f3'];f.angle(O,p,q,{r:1.1,c:col[0],f:col[1],right:false,lab:n,lr:1.6})}f.dot(O,3.6)}}}},
  {a:'wg',top:'Winkel an Parallelen',gen:fact([
    ['Stufenwinkel an parallelen Geraden sind …',['gleich gross','zusammen 180°','zusammen 90°','verschieden gross'],'Durch Verschieben entlang der Schnittgeraden kommen sie zur Deckung.'],
    ['Gegenwinkel an parallelen Geraden …',['ergänzen sich zu 180°','sind gleich gross','ergänzen sich zu 90°','ergänzen sich zu 360°'],'z. B. α + δ\' = 180°.'],
    ['Wechselwinkel an parallelen Geraden sind …',['gleich gross','zusammen 180°','zusammen 90°','nur bei 45° gleich'],'Sie kommen durch eine Drehung um 180° zur Deckung.'],
    ['Die Sätze über Stufen- und Wechselwinkel gelten nur, wenn …',['die beiden geschnittenen Geraden parallel sind','die Schnittgerade senkrecht steht','alle Winkel spitz sind','die Geraden gleich lang sind'],'Ohne Parallelität sind die Winkel im Allgemeinen verschieden.'],
    ['Nebenwinkel ergänzen sich zu …',['180°','90°','360°','gar nichts Bestimmtem'],'Sie bilden zusammen einen gestreckten Winkel.']])},
  /* ---------- Winkel im Dreieck ---------- */
  {a:'wd',top:'Winkelberechnung',gen(){const ty=rnd(0,2);
    if(ty===0){const x=rnd(21,159);return{q:`Ein Winkel misst ${x}°. Wie gross ist sein Nebenwinkel?`,opts:numOpts(180-x,[x,Math.abs(90-x),360-x]),expl:`Nebenwinkel ergänzen sich zu 180°: 180° − ${x}° = ${180-x}°.`}}
    if(ty===1){const a=rnd(30,80),g=rnd(30,80);const ph=a+g;return{q:`Ein Aussenwinkel eines Dreiecks misst ${ph}°. Einer der beiden nicht anliegenden Innenwinkel misst ${a}°. Wie gross ist der andere?`,opts:numOpts(g,[180-ph,180-a,ph-a+10]),expl:`Aussenwinkelsatz: ${ph}° = ${a}° + ? → ? = ${g}°.`}}
    const b=rnd(20,70);return{q:`In einem gleichschenkligen Dreieck misst ein Basiswinkel ${b}°. Wie gross ist der Winkel an der Spitze?`,opts:numOpts(180-2*b,[b,180-b,90-b]),expl:`Die Basiswinkel sind gleich: 180° − 2 · ${b}° = ${180-2*b}°.`}}},
  {a:'wd',top:'Innenwinkelsumme',gen(){const al=rnd(30,80),be=rnd(30,140-al),ga=180-al-be;
    return{q:'Wie gross ist der Winkel <i>γ</i>?',opts:numOpts(ga,shuffle([180-al,180-be,al+be,ga+10,Math.abs(90-ga)])),expl:`<i>γ</i> = 180° − ${al}° − ${be}° = ${ga}°.`,
      draw(f){const T=triAng(al,be);f.poly([T.A,T.B,T.C],{w:0,f:'#f6f9fb',c:'none'});triAngles(f,T,{st:{A:{c:C.blau,f:C.hell,lab:`${al}°`},B:{c:C.blau,f:C.hell,lab:`${be}°`},C:{c:C.or,f:C.orh,lab:'γ'}}});
        for(const [p,q] of[[T.A,T.B],[T.B,T.C],[T.C,T.A]])f.seg(p,q,{w:2.4});for(const p of[T.A,T.B,T.C])f.dot(p,3.6);triLabels(f,T,{sides:false})}}}},
  {a:'wd',top:'Rechtwinkliges Dreieck',gen(){const al=rnd(15,75);return{q:`Im Dreieck <i>ABC</i> ist <i>γ</i> = 90° und <i>α</i> = ${al}°. Wie gross ist <i>β</i>?`,opts:numOpts(90-al,[180-al,al,90+al]),expl:`Die beiden spitzen Winkel ergänzen sich zu 90°: 90° − ${al}° = ${90-al}°.`}}},
  {a:'wd',top:'Aussenwinkel',gen(){const al=rnd(30,80),be=rnd(30,90);const ask=pick(['phi','mu','lam']);const ga=180-al-be;if(ga<15)return this.gen();
    const v={phi:al+ga,mu:be+ga,lam:al+be}[ask],nm={phi:'φ (bei B)',mu:'μ (bei A)',lam:'λ (bei C)'}[ask];
    return{q:`Im Dreieck <i>ABC</i> ist <i>α</i> = ${al}°, <i>β</i> = ${be}°. Wie gross ist der Aussenwinkel <i>${nm}</i>?`,opts:numOpts(v,[180-v,{phi:be,mu:al,lam:ga}[ask],v+ga>0?Math.abs(v-20):v+20]),expl:`Zuerst <i>γ</i> = ${ga}°. Ein Aussenwinkel ist die Summe der beiden nicht anliegenden Innenwinkel: ${v}°. (Oder: 180° minus anliegender Innenwinkel.)`}}},
  {a:'wd',top:'Aussenwinkel',gen:fact([
    ['Die drei Aussenwinkel eines Dreiecks ergeben zusammen …',['360°','180°','540°','270°'],'Jeder Aussenwinkel ist 180° minus Innenwinkel: 3 · 180° − 180° = 360°.'],
    ['Ein Aussenwinkel eines Dreiecks ist gleich …',['der Summe der beiden nicht anliegenden Innenwinkel','dem anliegenden Innenwinkel','der Summe aller Innenwinkel','der Hälfte des anliegenden Innenwinkels'],'Aussenwinkelsatz, z. B. φ = α + γ.'],
    ['Ein Dreieck hat einen stumpfen Aussenwinkel bei jeder Ecke. Dann ist das Dreieck …',['spitzwinklig','rechtwinklig','stumpfwinklig','gleichseitig'],'Aussenwinkel stumpf ⇔ Innenwinkel spitz.']])}
  ];
  function drawLines(f,T,t){const L=[[T.A,T.B,T.C],[T.B,T.C,T.A],[T.C,T.A,T.B]];
    L.forEach(([X,Y,Z],i)=>{if(t===0){const M=V.mid(X,Y),d=V.norm(V.sub(Y,X)),n=V.perp(d);f.line(M,n,{c:C.or,w:1.8});f.ticks(X,M,i+1,C.or);f.ticks(M,Y,i+1,C.or);const inn=V.dot(n,V.sub(Z,M))>0?n:V.mul(n,-1);rmarkBetween(f,M,d,inn,0.4,C.or)}
      if(t===1){const w=ang2(X,Y,Z),m=(w.a1+w.a2)/2;f.wedge(X,w.a1,m,0.8,{c:C.gr,f:C.grh});f.wedge(X,m,w.a2,0.8,{c:C.gr,f:C.grh});const D=lineX(X,V.dir(m),Y,V.sub(Z,Y));f.seg(X,D,{c:C.gr,w:2})}
      if(t===2){const F=footOf(Z,X,Y).p,u=V.norm(V.sub(Z,F)),d=V.norm(V.sub(Y,X));f.seg(Z,F,{c:C.rot,w:2});rmarkBetween(f,F,d,u,0.4,C.rot)}
      if(t===3){const M=V.mid(X,Y);f.seg(Z,M,{c:C.vi,w:2});f.ticks(X,M,i+1,C.vi);f.ticks(M,Y,i+1,C.vi)}})}
  qzRegister('13',{gb:'Grundbegriffe',gk:'Grundkonstruktionen',dr:'Dreieck: Bezeichnungen und Arten',lp:'Linien und Punkte im Dreieck',wg:'Winkel an Geraden',wd:'Winkel im Dreieck'},G);
})();
