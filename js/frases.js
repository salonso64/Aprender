/* JUEGO: FRASES Y PALABRAS (Castellano · 5.º de Primaria)
   Reto 1: la letra R (r / rr) · Reto 2: ordena las frases · Reto 3: conectores · Reto 4: Memory de palabras
   Misma filosofía de siempre: si fallas, se reinicia con elementos nuevos al azar (el Memory no se reinicia). */
(()=>{
const D=Dylan,{shuffle}=D;
const pick=(arr,n)=>shuffle(arr).slice(0,n);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// Para comparar frases: sin mayúsculas, sin signos y sin espacios dobles. Las tildes SÍ cuentan.
const norm=s=>s.normalize('NFC').toLowerCase().replace(/[¿?¡!.,;:…"“”«»()\-–—]/g,' ').replace(/\s+/g,' ').trim();

/* ============================================================
   PANTALLA DE APRENDIZAJE
   ============================================================ */
D.addScreen('learn-frases',`
 <div class="panel">
  <button class="btn secondary" data-back>← Temas de Castellano</button>
  <h2 style="margin-top:14px">📝 Frases y palabras</h2>
  <p class="muted">Repasa estos trucos antes de salir a la pista. ¡Te ayudarán en los retos!</p>
  <div class="es-tips">
   <div class="es-tip"><b>R o RR</b><br>
    Entre vocales, sonido fuerte → <b>rr</b>: <span class="ex">guitarra, tierra</span>
    Al principio de palabra → <b>r</b>: <span class="ex">rana, reloj</span>
    Después de n, l, s → <b>r</b>: <span class="ex">honra, alrededor</span>
    Entre vocales, sonido suave → <b>r</b>: <span class="ex">pirata, caramelo</span></div>
   <div class="es-tip"><b>Ordenar frases</b><br>
    Empieza con <b>mayúscula</b> y acaba con <b>punto</b>.
    Los conectores suelen ir al principio y llevan <b>coma</b>:
    <span class="ex">Después, comimos. · Además, jugamos.</span></div>
   <div class="es-tip"><b>Conectores para ordenar</b><br>
    <span class="ex">primero · después · luego · entonces · por último · finalmente</span>
    <b>Para añadir:</b> <span class="ex">además · también</span></div>
   <div class="es-tip"><b>Conectores para explicar</b><br>
    <b>Contraste:</b> <span class="ex">pero · sin embargo · aunque</span>
    <b>Causa y consecuencia:</b> <span class="ex">porque · por eso · así que · por lo tanto</span></div>
  </div>
  <div class="tb-rule">🃏 <b>¡Y al final, un Memory!</b><br><span class="muted">Encuentra las parejas de palabras y fíjate muy bien en cómo se escriben.</span></div>
 </div>
 ${D.routePanel('¡Supera los 4 retos del circuito! Primero la R, luego ordenarás frases, después buscarás los conectores perdidos y al final te espera el Memory de las palabras. ¿Preparado, campeón? 🏆','🏍️ ¡EMPEZAR LA AVENTURA DE LAS FRASES!')}`,'spanish-topics');

/* ============================================================
   RETO 1: LA LETRA R (r o rr)
   [palabra con _ , respuesta, regla]. Solo una de las dos escrituras forma una palabra correcta.
   ============================================================ */
const R_RULES={
 rr:'Entre dos vocales, el sonido fuerte de la r se escribe con rr: guitarra, tierra.',
 ini:'Al principio de una palabra, el sonido fuerte se escribe con una sola r: rana, reloj.',
 nls:'Después de n, l o s, el sonido fuerte se escribe con una sola r: honra, alrededor.',
 sub:'Después del prefijo sub- se escribe una sola r: subrayar.',
 suave:'Entre dos vocales, el sonido suave se escribe con una sola r: pirata, caramelo.'
};
const R_BANK=[
 // rr
 ['guita_a','rr','rr'],['tie_a','rr','rr'],['ca_etera','rr','rr'],['ba_er','rr','rr'],['co_er','rr','rr'],['te_emoto','rr','rr'],
 ['a_oz','rr','rr'],['a_iba','rr','rr'],['abu_ido','rr','rr'],['a_ugar','rr','rr'],['zo_o','rr','rr'],['ce_ar','rr','rr'],
 ['se_ucho','rr','rr'],['ciga_o','rr','rr'],['ba_iga','rr','rr'],['ce_ojo','rr','rr'],['ga_apata','rr','rr'],['piza_a','rr','rr'],
 ['te_aza','rr','rr'],['a_uga','rr','rr'],['a_astrar','rr','rr'],['a_ancar','rr','rr'],['a_eglar','rr','rr'],['a_ebatar','rr','rr'],
 ['sie_a','rr','rr'],
 // r al principio
 ['_ana','r','ini'],['_eloj','r','ini'],['_osa','r','ini'],['_obot','r','ini'],['_egalo','r','ini'],['_ueda','r','ini'],
 ['_ey','r','ini'],['_ío','r','ini'],['_ápido','r','ini'],['_eina','r','ini'],
 // r después de n, l, s
 ['hon_a','r','nls'],['al_ededor','r','nls'],['en_edar','r','nls'],['sub_ayar','r','sub'],['en_ollar','r','nls'],
 ['son_eír','r','nls'],['en_iquecer','r','nls'],['des_atizar','r','nls'],
 // r suave entre vocales
 ['ma_iposa','r','suave'],['o_uga','r','suave'],['lo_o','r','suave'],['made_a','r','suave'],['camare_o','r','suave'],
 ['pi_ata','r','suave'],['ca_amelo','r','suave']
];

function reto1(){
 const items=pick(R_BANK,6);
 const ex=D.$('exercise');
 ex.innerHTML=`<div class="exercise-title">🔤 ¿Una R o dos RR?</div>
  <p class="instruction">Escribe en cada hueco una <b>r</b> o dos <b>rr</b>. Cuando tengas las seis palabras, pulsa Validar.</p>
  <div class="rw-grid">${items.map(([w,a],k)=>{const [p,s]=w.split('_');
   return `<div class="rw-card"><span class="rw-word">${p}<input class="rw-in" data-k="${k}" maxlength="2" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" aria-label="r o rr">${s}</span></div>`;}).join('')}</div>
  <button class="btn" id="rwOk" style="width:100%;margin-top:12px">✅ Validar</button>`;
 const inputs=[...ex.querySelectorAll('.rw-in')],ok=D.$('rwOk');
 let done=false;
 inputs.forEach((el,k)=>{
  el.addEventListener('input',()=>{
   el.value=el.value.toLowerCase().replace(/[^r]/g,'');
   el.classList.remove('bad','ok');
   if(el.value.length===2&&inputs[k+1])inputs[k+1].focus(); // con "rr" salta al siguiente hueco
  });
  el.addEventListener('keydown',e=>{
   if(e.key==='Enter'){e.preventDefault();if(inputs[k+1])inputs[k+1].focus();else validar();}
  });
 });
 inputs[0].focus();
 function validar(){
  if(done)return;
  if(inputs.some(i=>!i.value)){D.msg('Faltan huecos por rellenar. Escribe una r o dos rr en cada palabra. ✏️','try');return;}
  const wrong=[];
  inputs.forEach((el,k)=>{
   const [w,a,r]=items[k];
   if(el.value===a)el.classList.add('ok');
   else{el.classList.add('bad');wrong.push({full:w.replace('_',a),a,r});}
  });
  if(!wrong.length){done=true;inputs.forEach(i=>i.disabled=true);ok.disabled=true;D.completeStage();return;}
  done=true;inputs.forEach(i=>i.disabled=true);ok.disabled=true;
  const fallos=wrong.map(w=>`«${w.full}» se escribe con ${w.a==='rr'?'rr (dos erres)':'una sola r'}`).join(' · ');
  D.msg(`¡Casi, Dylan! 🤔 ${fallos}.<br>${R_RULES[wrong[0].r]}<br>Empezamos de nuevo con palabras nuevas.`,'try');
  D.later(reto1,6500);
 }
 ok.onclick=validar;
}

/* ============================================================
   RETO 2: ORDENA LAS FRASES
   Primera palabra con mayúscula y última con punto: así la frase tiene un único orden posible.
   Si una frase admite otro orden correcto, se añade como segundo elemento: ['frase','otra frase válida'].
   ============================================================ */
const ORDEN=[
 'Primero me lavo las manos.','Después desayuno cereales con leche.','Luego cojo mi mochila azul.',
 'Entonces salimos corriendo de casa.','Además, mi hermana toca el piano.','También me gusta dibujar animales.',
 'Por último, guardamos los juguetes.','Finalmente, nuestro equipo ganó el partido.','Por eso llevo siempre un paraguas.',
 'Sin embargo, hoy no ha llovido.','Primero, Dylan prepara su casco.','Luego, arranca la moto despacio.',
 'Entonces, el piloto saludó al público.','Además, el circuito tenía muchas curvas.','También había una cuesta muy empinada.',
 'Por último, Dylan llegó a la meta.','Finalmente, todos aplaudieron al ganador.','Primero, mezclamos la harina con agua.',
 'Después, añadimos dos huevos grandes.','Luego, metimos el pastel al horno.','Por último, adornamos la tarta con fresas.',
 'Además, mi padre trajo un helado.','También vinieron mis primos de Vigo.','Entonces, mi abuela sopló las velas.',
 'Por eso, hoy estoy muy contento.','Sin embargo, mi perro estaba triste.','Primero, abrimos el libro de lengua.',
 'Luego, leímos un cuento divertido.','Después, contestamos las preguntas del cuaderno.','Por último, la maestra revisó nuestros dibujos.',
 'Además, aprendimos palabras nuevas.','También cantamos una canción en inglés.','Entonces sonó el timbre del recreo.',
 'Finalmente, salimos todos al patio.','Primero, el sol salió detrás del monte.','Después, las nubes cubrieron el cielo.',
 'Entonces empezó a llover muy fuerte.','Por eso, nos refugiamos bajo un árbol.','Además, soplaba un viento muy frío.',
 'Finalmente, apareció un bonito arcoíris.','También recogimos conchas en la playa.','Luego, construimos un castillo de arena.',
 'Tengo hambre, pero no hay pan.','Quiero jugar, pero tengo deberes.','Estudio mucho porque quiero aprobar.',
 'Me quedé en casa porque estaba enfermo.','Iré al cine si termino la tarea.','Corrí muy rápido aunque estaba cansado.',
 ['Mi madre cocina mientras yo pongo la mesa.','Mi madre cocina mientras pongo yo la mesa.'],
 'Por último, apagamos todas las luces.'
].map(x=>Array.isArray(x)?x:[x]);

function reto2(){
 const items=pick(ORDEN,4);
 const ex=D.$('exercise');
 const scramble=t=>{
  const w=t.split(' ');let s=w;
  for(let i=0;i<10&&s.join(' ')===t;i++)s=shuffle(w); // que nunca salga ya ordenada
  return s;
 };
 ex.innerHTML=`<div class="exercise-title">🧩 Ordena las frases</div>
  <p class="instruction">Las palabras están revueltas. Escribe cada frase bien ordenada (con la primera en mayúscula) y pulsa Validar al final de cada una.</p>
  ${items.map((it,k)=>`<div class="od-card" data-k="${k}"><div class="od-num">${k+1}</div><div class="od-main">
   <div class="od-chips">${scramble(it[0]).map(w=>`<span class="od-chip">${esc(w)}</span>`).join('')}</div>
   <div class="od-row"><input class="od-in" data-k="${k}" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Escribe la frase aquí…" aria-label="Frase ${k+1}"><button class="btn od-ok" data-k="${k}">✅ Validar</button></div>
  </div></div>`).join('')}`;
 let aprobadas=0,over=false;
 const cards=[...ex.querySelectorAll('.od-card')],ins=[...ex.querySelectorAll('.od-in')],oks=[...ex.querySelectorAll('.od-ok')];
 ins[0].focus();
 const validar=k=>{
  if(over||cards[k].classList.contains('ok'))return;
  const typed=norm(ins[k].value);
  if(!typed){D.msg('Escribe la frase en la caja antes de validar. ✏️','try');return;}
  const target=items[k][0];
  if(items[k].some(t=>norm(t)===typed)){
   cards[k].classList.add('ok');ins[k].disabled=true;oks[k].classList.add('hidden');aprobadas++;
   if(aprobadas===items.length){over=true;D.completeStage();}
   else{D.msg(`¡Frase ${k+1} correcta! 🎉 Sigue con las demás.`,'good');const nx=ins.find(i=>!i.disabled);if(nx)nx.focus();}
   return;
  }
  // ¿fallan palabras o solo el orden?
  const tw=norm(target).split(' '),uw=typed.split(' '),pool=[...tw];
  const sobran=[];uw.forEach(w=>{const i=pool.indexOf(w);if(i>=0)pool.splice(i,1);else sobran.push(w);});
  let pista;
  if(!pool.length&&!sobran.length)pista='Tienes todas las palabras, pero <b>el orden no es el correcto</b>.';
  else pista=`Revisa las palabras: ${pool.length?`te falta ${pool.map(w=>'«'+esc(w)+'»').join(', ')}`:''}${pool.length&&sobran.length?' y ':''}${sobran.length?`sobra ${sobran.map(w=>'«'+esc(w)+'»').join(', ')}`:''}.`;
  over=true;cards[k].classList.add('bad');ins.forEach(i=>i.disabled=true);oks.forEach(b=>b.disabled=true);
  D.msg(`¡Casi, Dylan! 🤔 La frase ${k+1} no está bien. ${pista}<br>La frase correcta era: <b>${esc(target)}</b><br>Empezamos de nuevo con frases nuevas.`,'try');
  D.later(reto2,6500);
 };
 oks.forEach(b=>b.onclick=()=>validar(+b.dataset.k));
 ins.forEach((i,k)=>i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();validar(k);}}));
}

/* ============================================================
   RETO 3: CONECTORES
   Los conectores que faltan se marcan con [[ ]]. Hay que escribirlos con su ortografía (tildes incluidas).
   ============================================================ */
const CONECT=[
 '[[Primero]] me lavo los dientes, [[después]] me pongo el pijama y [[por último]] leo un cuento antes de dormir.',
 'Quería salir a jugar al parque, [[pero]] estaba lloviendo mucho.',
 'Ana estudió toda la tarde [[porque]] mañana tiene un examen de matemáticas muy difícil.',
 'Llegamos tarde al colegio, [[por eso]] la profesora nos pidió una explicación.',
 'Me encanta el chocolate; [[sin embargo]], el médico me ha dicho que no coma tanto.',
 'Mi hermano juega al fútbol y [[además]] entrena tres días a la semana con su equipo.',
 'Mi prima toca la guitarra y [[también]] canta en el coro del colegio.',
 'Guardé los libros en la mochila, [[luego]] cerré la cremallera y salí de casa.',
 'Hacía mucho calor, [[así que]] nos bañamos en la piscina toda la tarde.',
 'Iremos de excursión a la montaña [[si]] mañana hace buen tiempo.',
 'Dylan siguió corriendo [[aunque]] estaba muy cansado después de la carrera.',
 '[[Cuando]] termine los deberes, me dejarán ver mi serie favorita.',
 'Mi madre prepara la comida [[mientras]] yo pongo la mesa y mi padre lava los platos.',
 'No pude ir a la fiesta [[porque]] estaba enfermo y tenía mucha fiebre.',
 '[[Primero]] cortamos las verduras, [[después]] las echamos a la olla y [[finalmente]] las dejamos cocer una hora.',
 'Mi gato duerme casi todo el día, [[pero]] por la noche sale a cazar ratones.',
 'El museo era enorme; [[además]], la entrada era gratis para los niños.',
 'Estudié mucho para el examen, [[por eso]] saqué una buena nota.',
 'Quiero ser veterinario [[porque]] me encantan los animales y quiero cuidarlos.',
 'Nos levantamos temprano, [[entonces]] desayunamos y salimos de viaje hacia la playa.',
 'No tenía hambre, [[sin embargo]] se comió todo el plato de macarrones.',
 'Hoy he leído un libro [[y]] he dibujado un paisaje, [[pero]] todavía no he terminado los deberes.',
 'Si estudias todos los días, [[entonces]] aprenderás más rápido y sacarás mejores notas.',
 '[[Primero]] lavamos el coche, [[luego]] lo secamos con un trapo y [[por último]] le pusimos cera.',
 'El perro ladró muy fuerte [[porque]] vio un gato en el jardín.',
 'Quería comprar un juego nuevo, [[pero]] no tenía suficiente dinero, [[así que]] ahorró durante dos meses.',
 'Mi abuelo cuenta historias muy divertidas; [[además]], siempre trae caramelos para todos.',
 'Llovió mucho durante la noche, [[por lo tanto]] el río estaba lleno de agua por la mañana.',
 'Me gustan los helados de fresa [[aunque]] prefiero los de chocolate.',
 'Trabajamos en equipo durante tres semanas; [[finalmente]], terminamos el proyecto de ciencias.'
];

function reto3(){
 const set=pick(CONECT,3);
 const ex=D.$('exercise');
 let k=0;
 function show(){
  const p=set[k].split(/\[\[(.+?)\]\]/);              // pares = texto, impares = conector
  const answers=p.filter((_,i)=>i%2);
  ex.innerHTML=`<div class="exercise-title">🧩 Escribe los conectores que faltan</div>
   <p class="instruction">Escribe en cada hueco el conector que falta. Fíjate bien en las tildes.</p>
   <div class="rd-dots">${set.map((_,j)=>`<div class="rd-dot ${j<k?'done':j===k?'current':''}">${j<k?'✓':j+1}</div>`).join('')}</div>
   <div class="cn-sentence">${p.map((x,i)=>i%2?`<input class="cn-in" data-i="${(i-1)/2}" style="width:${Math.max(6,x.length+3)}ch" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" aria-label="Conector ${(i-1)/2+1}">`:esc(x)).join('')}</div>
   <div class="cn-bank"><b>Conectores que faltan:</b> ${shuffle(answers).map(a=>`<span class="cn-chip" data-a="${esc(norm(a))}">${esc(a)}</span>`).join('')}</div>
   <button class="btn" id="cnOk" style="width:100%;margin-top:12px">✅ Validar la frase ${k+1}</button>`;
  const inputs=[...ex.querySelectorAll('.cn-in')],chips=[...ex.querySelectorAll('.cn-chip')];
  const marcar=()=>chips.forEach(c=>c.classList.toggle('used',inputs.some(i=>norm(i.value)===c.dataset.a)));
  inputs.forEach((el,i)=>{
   el.addEventListener('input',()=>{el.classList.remove('bad','ok');marcar();});
   el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(inputs[i+1])inputs[i+1].focus();else validar();}});
  });
  inputs[0].focus();
  function validar(){
   const wrong=[];
   inputs.forEach((el,i)=>{
    const got=norm(el.value),exp=norm(answers[i]);
    if(got===exp)el.classList.add('ok');
    else{el.classList.add('bad');wrong.push({n:i+1,got,exp:answers[i],raw:el.value.trim()});}
   });
   if(!wrong.length){
    if(k<set.length-1){k++;D.msg(`¡Frase correcta! 🎉 Vamos con la frase ${k+1}.`,'good');show();}
    else{inputs.forEach(i=>i.disabled=true);D.$('cnOk').disabled=true;D.completeStage();}
    return;
   }
   inputs.forEach(i=>i.disabled=true);D.$('cnOk').disabled=true;
   const fallos=wrong.map(w=>w.got
     ?`en el hueco ${w.n} has escrito «${esc(w.raw)}», pero el conector correcto es «${esc(w.exp)}»`
     :`el hueco ${w.n} está vacío y faltaba «${esc(w.exp)}»`).join('; ');
   D.msg(`¡Ay, Dylan! 🤔 Has fallado en la frase ${k+1}: ${fallos}.<br>${k>0?'Tienes que volver a la primera frase. ':''}Empezamos de nuevo con frases nuevas.<br><button class="btn" id="cnAgain" style="margin-top:10px">🔄 Entendido, ¡otra vez!</button>`,'try');
   D.$('cnAgain').onclick=reto3;
  }
  D.$('cnOk').onclick=validar;
 }
 show();
}

/* ============================================================
   RETO 4: MEMORY DE PALABRAS (r/rr, b/v, c/z)
   ============================================================ */
const MEMORY=[
 // r / rr
 ['perro','🐕'],['cerro','⛰️'],['torre','🗼'],['ratón','🐭'],['rana','🐸'],['rosa','🌹'],['arroz','🍚'],['guitarra','🎸'],
 ['ardilla','🐿️'],['reloj','⏰'],['regalo','🎁'],['robot','🤖'],['corona','👑'],['tierra','🌍'],['tortuga','🐢'],
 ['mariposa','🦋'],['serpiente','🐍'],
 // b / v
 ['bicicleta','🚲'],['ballena','🐋'],['búho','🦉'],['abeja','🐝'],['cabra','🐐'],['caballo','🐴'],['avión','✈️'],
 ['vaca','🐄'],['uva','🍇'],['violín','🎻'],['volcán','🌋'],['vaso','🥛'],['llave','🔑'],['vela','🕯️'],['balón','⚽'],
 ['bota','🥾'],['biberón','🍼'],
 // c / z
 ['zapato','👞'],['zanahoria','🥕'],['zorro','🦊'],['cebolla','🧅'],['cereza','🍒'],['cebra','🦓'],['cine','🎬'],
 ['coche','🚗'],['circo','🎪'],['ciervo','🦌'],['cisne','🦢'],['cuchara','🥄'],['pizza','🍕'],['pez','🐟'],
 ['caramelo','🍬'],['zumo','🧃']
];

function reto4(){
 const chosen=pick(MEMORY,6);
 const cards=shuffle(chosen.concat(chosen));
 const ex=D.$('exercise');
 ex.innerHTML=`<div class="exercise-title">🃏 Encuentra las 6 parejas</div>
  <p class="instruction">Toca una carta para darle la vuelta y busca su pareja. Si son iguales, se quedan a la vista; si no, se vuelven a tapar.</p>
  <div class="mem-info" id="memInfo"></div>
  <div class="mem-grid">${cards.map(([w,e],i)=>`<button class="mcard" data-w="${esc(w)}" aria-label="Carta ${i+1}"><div class="inner"><div class="face back">🏍️</div><div class="face front"><span class="em">${e}</span><span class="wd">${esc(w)}</span></div></div></button>`).join('')}</div>`;
 const btns=[...ex.querySelectorAll('.mcard')];
 let first=null,lock=false,tries=0,found=0;
 const info=()=>{D.$('memInfo').textContent=`Parejas: ${found} de 6 · Intentos: ${tries}`;};
 info();
 btns.forEach(b=>b.onclick=()=>{
  if(lock||b.classList.contains('flip'))return;
  b.classList.add('flip');
  if(!first){first=b;return;}
  tries++;
  const a=first;first=null;
  if(a.dataset.w===b.dataset.w){
   a.classList.add('done');b.classList.add('done');found++;info();
   if(found===6)D.completeStage();
   else D.msg(`¡Pareja encontrada! 🎉 «${a.dataset.w}»`,'good');
  }else{
   lock=true;info();
   D.later(()=>{a.classList.remove('flip');b.classList.remove('flip');lock=false;},1100);
  }
 });
}

/* ============================================================
   REGISTRO DEL JUEGO
   ============================================================ */
D.registerGame({
 id:'frases',name:'Frases y palabras',
 labels:['La letra R: ¿r o rr?','Ordena las frases','Los conectores perdidos','Memory de palabras'],
 stages:[
  {title:'¿Una R o dos RR?',desc:'Escribe en el hueco una R o dos RR y pulsa Validar. Si fallas, te cuento el error y empiezas de nuevo con palabras nuevas.',run:reto1},
  {title:'¡Ordena las frases!',desc:'Las palabras están revueltas. Escribe cada frase bien ordenada y pulsa Validar. Si fallas, salen frases nuevas.',run:reto2},
  {title:'¡Los conectores perdidos!',desc:'Escribe el conector que falta en cada frase. Si fallas, te digo el error y vuelves a empezar por la primera.',run:reto3},
  {title:'¡El Memory de las palabras!',desc:'Da la vuelta a las cartas y encuentra las seis parejas. ¡Fíjate bien en cómo se escriben!',run:reto4}
 ]
});
})();
