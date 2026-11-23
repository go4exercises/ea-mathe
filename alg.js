/* ======================= Algebra-Kern: Parser, Polynome, Prüfungen ======================= */
/* Polynom: Map Monom-Schlüssel -> Koeffizient. Schlüssel z. B. "a^1*x^2" (alphabetisch), "" = Konstante */
class Poly{
  constructor(m){this.m=new Map();if(m)for(const [k,v] of m)if(Math.abs(v)>1e-12)this.m.set(k,v)}
  static c(v){return new Poly([['',v]])}
  static v(n,e=1){return new Poly([[e?`${n}^${e}`:'',1]])}
  static parseKey(k){const o={};if(!k)return o;k.split('*').forEach(p=>{const [n,e]=p.split('^');o[n]=+e});return o}
  static key(o){return Object.keys(o).filter(n=>o[n]).sort().map(n=>`${n}^${o[n]}`).join('*')}
  add(p){const r=new Map(this.m);for(const [k,v] of p.m)r.set(k,(r.get(k)||0)+v);return new Poly(r)}
  neg(){return new Poly([...this.m].map(([k,v])=>[k,-v]))}
  sub(p){return this.add(p.neg())}
  scale(c){return new Poly([...this.m].map(([k,v])=>[k,v*c]))}
  mul(p){const r=new Map();for(const [k1,v1] of this.m)for(const [k2,v2] of p.m){const a=Poly.parseKey(k1),b=Poly.parseKey(k2);for(const n in b)a[n]=(a[n]||0)+b[n];const k=Poly.key(a);r.set(k,(r.get(k)||0)+v1*v2)}return new Poly(r)}
  pow(e){let r=Poly.c(1);for(let i=0;i<e;i++)r=r.mul(this);return r}
  deg(){let d=0;for(const k of this.m.keys()){const o=Poly.parseKey(k);d=Math.max(d,Object.values(o).reduce((s,x)=>s+x,0))}return d}
  isConst(){return this.deg()===0}
  constVal(){return this.m.get('')||0}
  terms(){return this.m.size}
  eq(p){const d=this.sub(p);return d.m.size===0}
  content(){let g=0;for(const v of this.m.values())g=gcd(g,Math.round(v));return g}
  divMono(c,o){const r=new Map();for(const [k,v] of this.m){const a=Poly.parseKey(k);for(const n in o){a[n]=(a[n]||0)-o[n];if(a[n]<0)return null}r.set(Poly.key(a),v/c)}return new Poly(r)}
  sorted(){return[...this.m].sort((A,B)=>{const a=Poly.parseKey(A[0]),b=Poly.parseKey(B[0]);const da=Object.values(a).reduce((s,x)=>s+x,0),db=Object.values(b).reduce((s,x)=>s+x,0);if(da!==db)return db-da;
    const vs=[...new Set(Object.keys(a).concat(Object.keys(b)))].sort();for(const n of vs){if((a[n]||0)!==(b[n]||0))return(b[n]||0)-(a[n]||0)}return 0})}
  static monoTex(k,v,first){const o=Poly.parseKey(k);const vars=Object.keys(o).sort().map(n=>n+(o[n]>1?`^{${o[n]}}`:'')).join('');const av=Math.abs(v);
    const coef=vars&&av===1?'':String(Number(av.toPrecision(12)));const sign=v<0?(first?'-':'-'):(first?'':'+');return sign+coef+vars}
  tex(){const s=this.sorted();if(!s.length)return'0';return s.map(([k,v],i)=>Poly.monoTex(k,v,i===0)).join('')}
  html(){return texToHtml(this.tex())}
}
/* einfache TeX→HTML-Umsetzung für Polynome (für Quiz-Knöpfe ohne MathJax nicht nötig; MathJax wird benutzt) */
function texToHtml(t){return t.replace(/\^\{(\d+)\}/g,'<sup>$1</sup>').replace(/-/g,' − ').replace(/\+/g,' + ').replace(/([a-z])/g,'<i>$1</i>')}
const PT=p=>`\\(${p.tex()}\\)`;

/* ---------- Parser für Eingaben der Lernenden ---------- */
function algParse(str){
  let s=String(str).replace(/\s+/g,'').replace(/[−–]/g,'-').replace(/[·×∙]/g,'*').replace(/:/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\[/g,'(').replace(/\]/g,')').replace(/,/g,'.');
  let i=0;const peek=()=>s[i];const err=m=>{throw new Error(m)};
  function expr(){let a=term();while(peek()==='+'||peek()==='-'){const op=s[i++];const b=term();a={t:op==='+'?'add':'sub',a,b}}return a}
  function term(){let a=unary();for(;;){const c=peek();if(c==='*'||c==='/'){i++;const b=unary();a={t:c==='*'?'mul':'div',a,b}}else if(c&&(c==='('||/[a-zA-Z]/.test(c))){const b=power();a={t:'mul',a,b,imp:true}}else break}return a}
  function unary(){if(peek()==='-'){i++;return{t:'neg',a:unary()}}if(peek()==='+'){i++;return unary()}return power()}
  function power(){let a=atom();if(peek()==='^'){i++;let b;if(peek()==='('){i++;b=expr();if(s[i++]!==')')err('Klammer fehlt')}else if(peek()==='-'){i++;b={t:'neg',a:atom()}}else b=atom();a={t:'pow',a,b}}return a}
  function atom(){const c=peek();if(c===undefined)err('Ausdruck unvollständig');
    if(/[0-9.]/.test(c)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const v=parseFloat(s.slice(i,j));i=j;return{t:'num',v}}
    if(/[a-zA-Z]/.test(c)){i++;return{t:'var',n:c}}
    if(c==='('){i++;const e=expr();if(s[i++]!==')')err('Klammer fehlt');return{t:'par',a:e}}
    err('Unerwartetes Zeichen «'+c+'»')}
  const r=expr();if(i<s.length)err('Unerwartetes Zeichen «'+s[i]+'»');return r}
function algEval(n,env){switch(n.t){case'num':return n.v;case'var':return env[n.n]??NaN;case'par':return algEval(n.a,env);case'neg':return-algEval(n.a,env);
  case'add':return algEval(n.a,env)+algEval(n.b,env);case'sub':return algEval(n.a,env)-algEval(n.b,env);case'mul':return algEval(n.a,env)*algEval(n.b,env);
  case'div':return algEval(n.a,env)/algEval(n.b,env);case'pow':return Math.pow(algEval(n.a,env),algEval(n.b,env))}return NaN}
function algVars(n,set=new Set()){if(n.t==='var')set.add(n.n);for(const k of['a','b'])if(n[k])algVars(n[k],set);return set}
function toPoly(n){switch(n.t){case'num':return Poly.c(n.v);case'var':return Poly.v(n.n);case'par':return toPoly(n.a);case'neg':return toPoly(n.a).neg();
  case'add':return toPoly(n.a).add(toPoly(n.b));case'sub':return toPoly(n.a).sub(toPoly(n.b));case'mul':return toPoly(n.a).mul(toPoly(n.b));
  case'div':{const b=toPoly(n.b);if(!b.isConst())throw new Error('Division durch Variable');return toPoly(n.a).scale(1/b.constVal())}
  case'pow':{const e=toPoly(n.b);if(!e.isConst())throw new Error('Exponent');const v=e.constVal();if(v<0||!Number.isInteger(v))throw new Error('Exponent');return toPoly(n.a).pow(v)}}}
/* Gleichwertigkeit mit Zufallswerten prüfen */
function algEquiv(ast,target){const vars=new Set([...algVars(ast),...(target.vars||[])]);for(let t=0;t<6;t++){const env={};vars.forEach(v=>env[v]=Math.round((Math.random()*6-3)*100)/100+0.37);
  const a=algEval(ast,env),b=target.eval(env);if(!isFinite(a)||Math.abs(a-b)>1e-6*Math.max(1,Math.abs(b)))return false}return true}
function polyTarget(p){const vars=new Set();for(const k of p.m.keys())Object.keys(Poly.parseKey(k)).forEach(v=>vars.add(v));
  return{vars,eval:env=>{let s=0;for(const [k,v] of p.m){const o=Poly.parseKey(k);let t=v;for(const n in o)t*=Math.pow(env[n],o[n]);s+=t}return s}}}
function topTerms(n){if(n.t==='add'||n.t==='sub')return topTerms(n.a)+topTerms(n.b);if(n.t==='neg')return topTerms(n.a);return 1}
function hasPar(n){if(n.t==='par')return true;return['a','b'].some(k=>n[k]&&hasPar(n[k]))}
/* Faktoren eines Produkts (Vorzeichen und Zahlenfaktoren werden zusammengefasst) */
function factorsOf(n){if(n.t==='neg')return factorsOf(n.a);if(n.t==='par')return factorsOf(n.a).length>1&&false?[]:[n];if(n.t==='mul')return factorsOf(n.a).concat(factorsOf(n.b));
  if(n.t==='pow'&&n.b.t==='num'&&Number.isInteger(n.b.v)&&n.b.v>0){return Array(n.b.v).fill(n.a.t==='par'?n.a:n.a)}return[n]}
/* Antwort prüfen: art = 'vereinfacht' | 'faktor' */
function checkAlg(input,poly,art,expectLin){let ast;try{ast=algParse(input)}catch(e){return{ok:false,msg:'Eingabe nicht lesbar: '+e.message+'. Schreibe z. B. 3x^2-2x+1 oder 2(x+3)(x-3).'}}
  if(!algEquiv(ast,polyTarget(poly)))return{ok:false,msg:'Der Term ist nicht gleichwertig zur Aufgabe.'};
  if(art==='vereinfacht'){if(hasPar(ast))return{ok:false,msg:'Gleichwertig, aber es stehen noch Klammern. Löse sie auf.'};
    if(topTerms(ast)>poly.terms())return{ok:false,msg:'Gleichwertig, aber noch nicht vollständig vereinfacht: Fasse gleichartige Terme zusammen.'};return{ok:true}}
  if(art==='faktor'){if(ast.t==='add'||ast.t==='sub')return{ok:false,msg:'Gleichwertig, aber kein Produkt. Zerlege in Faktoren.'};
    const fs=factorsOf(ast);let lin=0;
    for(const f of fs){let p;try{p=toPoly(f)}catch(e){return{ok:false,msg:'Unerwartete Form.'}}const d=p.deg();if(d===0)continue;
      if(d>1&&f.t!=='var')return{ok:false,msg:'Gleichwertig, aber ein Faktor lässt sich noch weiter zerlegen.'};
      if(p.terms()>1&&p.content()>1)return{ok:false,msg:'Gleichwertig, aber in einer Klammer steckt noch ein gemeinsamer Faktor. Klammere ihn aus.'};lin+=d}
    if(expectLin&&lin<expectLin)return{ok:false,msg:'Gleichwertig, aber noch nicht vollständig zerlegt.'};return{ok:true}}
  return{ok:true}}
