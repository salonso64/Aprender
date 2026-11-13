/* JUEGO: EL VERBO TO BE (I am, you are, he is...) */
(()=>{
const {shuffle}=Dylan;

// [id, pronombre, verbo, dibujo, traducción]
const P=[
 ['i','I','am','🙋','Yo soy'],
 ['you1','You','are','👉🧒','Tú eres'],
 ['he','He','is','👦','Él es'],
 ['she','She','is','👧','Ella es'],
 ['it','It','is','🐱','Eso es'],
 ['we','We','are','🙋🧒','Nosotros somos'],
 ['you2','You','are','👉🧒🧒🧒','Vosotros sois'],
 ['they','They','are','👧👦','Ellos son']
];

/* ---------- Pantalla de aprendizaje con la imagen explicativa ---------- */
Dylan.addScreen('learn-tobe',`
 <div class="panel">
  <button class="btn secondary" data-back>← Temas de Inglés</button>
  <h2 style="margin-top:14px">🙋 El verbo To BE (ser / estar)</h2>
  <p class="muted">Observa los dibujos. Según quién hable o de quién hablemos, el verbo cambia: <b>am</b>, <b>is</b> o <b>are</b>.</p>
  <div class="tb-guide">${P.map(p=>`<div class="tb-cell"><b>${p[1]} <i>${p[2]}</i></b><div class="em">${p[3]}</div></div>`).join('')}</div>
  <div class="tb-tr">${P.map(p=>`<div class="tb-en">${p[1]} ${p[2]}</div><div class="tb-es">${p[4]}</div>`).join('')}</div>
  <div class="tb-rule"><b>I</b> → <b>am</b> · <b>He / She / It</b> → <b>is</b> · <b>You / We / They</b> → <b>are</b><br><span class="muted">"You" sirve para una persona (tú) y para varias (vosotros).</span></div>
 </div>
 ${Dylan.routePanel('Hay cinco retos. ¡Supera todos para ganar el trofeo!','🏍️ ¡EMPEZAR LA AVENTURA DEL VERBO TO BE!')}`);

/* ---------- Reto 1: unir inglés con español ---------- */
function reto1(){
 const hint={you1:' <span class="hint">👤</span>',you2:' <span class="hint">👥</span>'};
 Dylan.cables(shuffle(P).map(p=>({key:p[0],left:`${p[1]} ${p[2]}${hint[p[0]]||''}`,right:p[4]})),false,reto1);
}

/* ---------- Reto 2: unir pronombre con am / is / are (varias cuerdas a la misma) ---------- */
function reto2(){
 const lefts=P.map(p=>({id:p[0],target:p[2],html:`<span class="pro"><span class="em">${p[3]}</span><span>${p[1]}</span></span>`}));
 const rights=['am','is','are'].map(v=>({id:v,html:v}));
 Dylan.cablesMulti(lefts,rights,reto2);
}

/* ---------- Reto 3: escribir am / is / are en frases ---------- */
const bank=[
 ['You','are','funny.'],['Kate','is','my friend.'],['Bob and Gina','are','happy.'],['We','are','sad.'],
 ['The desk','is','green.'],['My books','are','new.'],['I','am','a champion.'],['Dad','is','here.'],
 ['She','is','my sister.'],['He','is','tall.'],['It','is','a dog.'],['They','are','at school.'],
 ['The cats','are','black.'],['Mum','is','in the kitchen.'],['You and I','are','friends.'],['The ball','is','red.'],
 ['I','am','ready.'],['Tom and Sam','are','brothers.'],['The sun','is','hot.'],['My shoes','are','blue.'],
 ['Anna','is','a teacher.'],['We','are','in the park.'],['The apple','is','big.'],['You','are','my best friend.'],
 ['The boys','are','tired.'],['I','am','hungry.']
];
function reto3(){
 const items=shuffle(bank).slice(0,6).map(b=>({before:`<span>${b[0]}</span>`,answer:b[1],after:`<span>${b[2]}</span>`}));
 Dylan.typing(items,'✏️ Escribe am, is o are','Escribe el verbo que falta. Si te equivocas en una, empiezas de nuevo con frases nuevas.',
  '<div class="typehead">AM &nbsp;·&nbsp; IS &nbsp;·&nbsp; ARE</div>',reto3);
}

/* ---------- Reto 4: escribir el pronombre que sustituye a cada palabra ---------- */
const subjects=[
 ['Mum','she'],['Dad','he'],['Brother','he'],['Sister','she'],['Grandma','she'],['Grandpa','he'],['Uncle','he'],['Aunt','she'],
 ['Cats','they'],['Dogs','they'],['Mary and Lisa','they'],['Tom and Ben','they'],['Mum and Dad','they'],
 ['Jim and I','we'],['Anna and I','we'],['Dad and I','we'],['Eva and you','you'],['Bob and you','you'],
 ['Apple','it'],['The cat','it'],['The table','it'],['The car','it'],['The ball','it'],['Books','they'],
 ['The boys','they'],['The girl','she'],['The boy','he'],['Birds','they'],['Flowers','they'],['The sun','it']
];
function reto4(){
 const items=shuffle(subjects).slice(0,6).map(x=>({before:`<span class="who">${x[0]}</span><span class="arr">➜</span>`,answer:x[1]}));
 Dylan.typing(items,'🔤 ¿Qué pronombre es?','Escribe el pronombre que sustituye a cada palabra. Si te equivocas en una, empiezas de nuevo.',
  '<div class="typehead">YOU &nbsp;·&nbsp; HE &nbsp;·&nbsp; SHE &nbsp;·&nbsp; IT &nbsp;·&nbsp; WE &nbsp;·&nbsp; THEY</div>',reto4);
}

/* ---------- Reto 5: la negación (completa y abreviada) ---------- */
function reto5(){
 const neg=[['i','I am','I am not',"I'm not"],['you','You are','You are not',"You aren't"],['he','He is','He is not',"He isn't"],
  ['she','She is','She is not',"She isn't"],['it','It is','It is not',"It isn't"],['we','We are','We are not',"We aren't"],['they','They are','They are not',"They aren't"]];
 Dylan.cables3(shuffle(neg).map(n=>({id:n[0],a:n[1],b:n[2],c:n[3]})),reto5);
}

Dylan.registerGame({
 id:'tobe',name:'Verbo To BE',
 labels:['Unir inglés con español (I am = yo soy)','Unir el pronombre con am / is / are','Escribir am, is o are en frases','Escribir el pronombre de cada palabra','La negación: completa y abreviada'],
 stages:[
  {title:'¡Une cada frase con su traducción!',desc:'Une con cuerdas I am, You are... con su significado en español. Si fallas, las palabras cambian de sitio.',run:reto1},
  {title:'¿Am, is o are?',desc:'Une cada dibujo con su verbo. ¡Varias cuerdas pueden llegar al mismo verbo!',run:reto2},
  {title:'Completa las frases',desc:'Escribe am, is o are. Si fallas una, se reinicia con frases nuevas.',run:reto3},
  {title:'Sustituye por un pronombre',desc:'Escribe he, she, it, we, you o they. Si fallas una, se reinicia.',run:reto4},
  {title:'La negación',desc:'Une cada pronombre con su negación completa y con su negación abreviada. Si fallas, se reinicia.',run:reto5}
 ]
});
})();
