/* JUEGO: LAS HORAS EN INGLÉS */
(()=>{
const {shuffle}=Dylan;

/* ---------- Relojes SVG ---------- */
// Reloj de los retos (con números 1-12 y marcas de minutos)
function createClockSvg(h,m){
 const degM=m*6,degH=(h%12)*30+m*0.5;
 let ticks='',nums='';
 for(let i=0;i<60;i++){
  const a=i*6*Math.PI/180,big=i%5===0,r1=big?84:88;
  ticks+=`<line x1="${100+r1*Math.sin(a)}" y1="${100-r1*Math.cos(a)}" x2="${100+93*Math.sin(a)}" y2="${100-93*Math.cos(a)}" stroke="${big?'#20332e':'#9aa9a0'}" stroke-width="${big?2.5:1}"/>`;
 }
 for(let i=1;i<=12;i++){
  const a=i*30*Math.PI/180;
  nums+=`<text x="${100+68*Math.sin(a)}" y="${100-68*Math.cos(a)+8}" font-size="24" font-weight="900" fill="#20332e" text-anchor="middle">${i}</text>`;
 }
 return `<svg class="clock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="97" fill="#fff"/>${ticks}${nums}
  <g transform="rotate(${degH} 100 100)"><line x1="100" y1="100" x2="100" y2="55" stroke="#20332e" stroke-width="8" stroke-linecap="round"/></g>
  <g transform="rotate(${degM} 100 100)"><line x1="100" y1="100" x2="100" y2="30" stroke="#c84d4d" stroke-width="5" stroke-linecap="round"/></g>
  <circle cx="100" cy="100" r="7" fill="#246b50"/></svg>`;
}
// Reloj de la guía (las 4:00, con las mitades To / Past)
function guideClockSvg(){
 let t='',n='';
 for(let i=0;i<60;i++){const a=i*6*Math.PI/180,big=i%5===0,r1=big?80:85;
  t+=`<line x1="${100+r1*Math.sin(a)}" y1="${100-r1*Math.cos(a)}" x2="${100+89*Math.sin(a)}" y2="${100-89*Math.cos(a)}" stroke="#20332e" stroke-width="${big?3:1}"/>`;}
 for(let i=1;i<=12;i++){const a=i*30*Math.PI/180,q=i%3===0;
  n+=`<text x="${100+66*Math.sin(a)}" y="${100-66*Math.cos(a)+(q?9:7)}" font-size="${q?26:19}" font-weight="900" fill="#20332e" text-anchor="middle">${i}</text>`;}
 return `<svg class="gclock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="99" fill="#35b24a"/><circle cx="100" cy="100" r="91" fill="#d9ddd3"/>
  <path d="M100 11 A89 89 0 0 0 100 189 Z" fill="#fff9d6"/><path d="M100 11 A89 89 0 0 1 100 189 Z" fill="#ffe3a0"/>${t}${n}
  <text x="64" y="106" font-size="20" font-weight="900" fill="#35b24a" text-anchor="middle">To</text>
  <text x="138" y="106" font-size="20" font-weight="900" fill="#35b24a" text-anchor="middle">Past</text>
  <g transform="rotate(120 100 100)"><line x1="100" y1="100" x2="100" y2="55" stroke="#20332e" stroke-width="7" stroke-linecap="round"/></g>
  <line x1="100" y1="100" x2="100" y2="24" stroke="#35b24a" stroke-width="5" stroke-linecap="round"/>
  <circle cx="100" cy="100" r="7" fill="#35b24a"/></svg>`;
}

/* ---------- Pantalla de aprendizaje con la guía ---------- */
const card=(en,es)=>`<div class="tc"><b>${en}</b><span class="es">(${es})</span></div>`;
const L=[["It's five <em>to</em> five","Son las cinco menos cinco"],["It's ten <em>to</em> five","Son las cinco menos diez"],["It's a quarter <em>to</em> five","Son las cinco menos cuarto"],["It's twenty <em>to</em> five","Son las cinco menos veinte"],["It's twenty-five <em>to</em> five","Son las cinco menos veinticinco"]];
const R=[["It's five <em>past</em> four","Son las cuatro y cinco"],["It's ten <em>past</em> four","Son las cuatro y diez"],["It's a quarter <em>past</em> four","Son las cuatro y cuarto"],["It's twenty <em>past</em> four","Son las cuatro y veinte"],["It's twenty-five <em>past</em> four","Son las cuatro y veinticinco"]];

Dylan.addScreen('learn-hours',`
 <div class="panel">
  <button class="btn secondary" data-back>← Temas de Inglés</button>
  <h2 style="margin-top:14px">⏰ ¿Qué hora es? (What time is it?)</h2>
  <p class="muted">Observa la guía antes de empezar. Aquí son <b>las 4 en punto</b>: la aguja negra corta marca la hora y la aguja verde larga marca los minutos.</p>
  <div class="tg">
   <div class="tg-col">${L.map(x=>card(x[0],x[1])).join('')}</div>
   <div class="tg-mid">${card("It is four o'clock","Son las cuatro en punto")}${guideClockSvg()}${card("It's half <em>past</em> four","Son las cuatro y media")}</div>
   <div class="tg-col">${R.map(x=>card(x[0],x[1])).join('')}</div>
  </div>
  <p class="muted"><b>o'clock</b> = en punto · <b>past</b> = y (lado derecho del reloj, decimos la hora actual) · <b>to</b> = menos (lado izquierdo, decimos la hora siguiente)</p>
 </div>
 ${Dylan.routePanel('Hay cuatro retos de las horas. ¡Supera todos para ganar el trofeo!','🏍️ ¡EMPEZAR LA AVENTURA DE LAS HORAS!')}`);

/* ---------- Datos ---------- */
const hourPhrases=[
 {h:12,m:0,text:"twelve o'clock",type:"o'clock"},{h:3,m:0,text:"three o'clock",type:"o'clock"},
 {h:6,m:0,text:"six o'clock",type:"o'clock"},{h:9,m:0,text:"nine o'clock",type:"o'clock"},
 {h:4,m:15,text:"quarter past four",type:"past"},{h:2,m:15,text:"quarter past two",type:"past"},
 {h:10,m:30,text:"half past ten",type:"past"},{h:5,m:30,text:"half past five",type:"past"},
 {h:9,m:45,text:"quarter to ten",type:"to"},{h:1,m:45,text:"quarter to two",type:"to"},
 {h:4,m:5,text:"five past four",type:"past"},{h:5,m:55,text:"five to six",type:"to"}];

/* ---------- Retos ---------- */
function reto1(){
 Dylan.drawRows(shuffle(hourPhrases).slice(0,5).map(p=>({label:createClockSvg(p.h,p.m),correct:p.type,opts:shuffle(["o'clock",'past','to'])})),
  "🕒 ¿To, Past u O'clock?",3,reto1,true);
}
function reto2(){
 const base=[{h:4,m:0,t:"o'clock"},{h:3,m:15,t:'quarter past'},{h:10,m:30,t:'half past'},{h:9,m:45,t:'quarter to'}];
 Dylan.drawRows(shuffle(base).map(p=>({label:createClockSvg(p.h,p.m),correct:p.t,opts:shuffle(base.map(x=>x.t))})),
  '⏱️ Relojes y expresiones clave',2,reto2,true);
}
function reto3(){
 Dylan.cables(shuffle(hourPhrases).slice(0,5).map(p=>({key:p.text,left:createClockSvg(p.h,p.m),right:p.text})),true,reto3);
}
function reto4(){
 Dylan.spelling(shuffle(hourPhrases).slice(0,4).map(p=>({label:createClockSvg(p.h,p.m),text:p.text})),reto4);
}

Dylan.registerGame({
 id:'hours',name:'Horas',
 labels:["Reloj y clasificar To / Past / O'clock",'Relojes y expresiones clave','Unir relojes con cables','Completar letras con vidas'],
 stages:[
  {title:"Reloj grande: To, Past u O'clock",desc:"Observa el reloj e indica si usa to, past u o'clock. Si fallas, se resetea.",run:reto1},
  {title:'Relojes y frases clave',desc:'Mira el reloj y elige su expresión correcta en inglés.',run:reto2},
  {title:'¡Conecta los relojes con cables!',desc:'Une cada reloj con su frase: haz clic o arrastra.',run:reto3},
  {title:'Completar letras de las horas',desc:'Mira el reloj y escribe las letras que faltan. Tienes 5 vidas.',run:reto4}
 ]
});
})();
