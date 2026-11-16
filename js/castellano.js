/* JUEGO: ORTOGRAFÍA Y ACENTUACIÓN (Castellano · 5.º de Primaria)
   Reto 1: b / v · Reto 2: c / z · Reto 3: h / g / j
   Reto 4: agudas, llanas y esdrújulas · Reto 5: la gran adivinanza dictada
   Todos los retos eligen 5 elementos al azar de un banco grande. Si fallas, se reinicia con otros nuevos
   (menos la palabra final de la adivinanza, que se puede intentar todas las veces que se quiera). */
(()=>{
const D=Dylan,{shuffle}=D;
const pick=(arr,n)=>shuffle(arr).slice(0,n);

/* ============================================================
   PANTALLA DE APRENDIZAJE
   ============================================================ */
D.addScreen('learn-ortografia',`
 <div class="panel">
  <button class="btn secondary" data-back>← Temas de Castellano</button>
  <h2 style="margin-top:14px">✏️ Ortografía y acentuación</h2>
  <p class="muted">Antes de salir a la pista, repasa los trucos de los campeones. ¡Te ayudarán en los retos!</p>
  <div class="es-tips">
   <div class="es-tip"><b>B o V</b><br>Después de <b>m</b> siempre <b>b</b>: <span class="ex">hombre, también</span>
    Después de <b>n</b> siempre <b>v</b>: <span class="ex">invierno, enviar</span>
    Los verbos en <b>-aba</b> llevan <b>b</b>: <span class="ex">jugaba, cantaba</span></div>
   <div class="es-tip"><b>C o Z</b><br>Con <b>e, i</b> se escribe <b>c</b>: <span class="ex">cielo, cena</span>
    Con <b>a, o, u</b> suele ir <b>z</b>: <span class="ex">zapato, zumo</span>
    Plural de -z: <span class="ex">lápiz → lápices</span></div>
   <div class="es-tip"><b>H, G o J</b><br>Con <b>hue-</b> y <b>hie-</b> va <b>h</b>: <span class="ex">huevo, hielo</span>
    Los verbos en <b>-ger</b> y <b>-gir</b> llevan <b>g</b>: <span class="ex">coger, dirigir</span>
    Las palabras en <b>-aje</b> llevan <b>j</b>: <span class="ex">viaje, mensaje</span></div>
   <div class="es-tip"><b>¿Dónde está la fuerza?</b><br>
    <b>Aguda</b>: última sílaba → ca-<span class="tonic">fé</span>, re-<span class="tonic">loj</span>
    <b>Llana</b>: penúltima → <span class="tonic">ca</span>-sa, <span class="tonic">ár</span>-bol
    <b>Esdrújula</b>: antepenúltima y <b>siempre con tilde</b> → <span class="tonic">pá</span>-ja-ro</div>
  </div>
  <div class="tb-rule">🕵️ <b>¡Al final te espera la gran adivinanza!</b><br><span class="muted">Escucharás cinco pistas, las escribirás sin faltas y descubrirás la palabra secreta.</span></div>
 </div>
 ${D.routePanel('¡Pasa los 4 retos del circuito y llega hasta la ADIVINANZA final! Allí tendrás que escuchar las pistas, escribirlas bien y descubrir la palabra secreta. ¿Serás capaz, campeón? 🏆','🏍️ ¡EMPEZAR LA AVENTURA DE LAS PALABRAS!')}`,'spanish-topics');

/* ============================================================
   RETOS 1, 2 Y 3: COMPLETAR PALABRAS
   Cada elemento: [palabra con _ , letra correcta, clave de la regla (opcional)]
   Se ha comprobado que solo UNA de las letras ofrecidas forma una palabra correcta.
   ============================================================ */
const RULES={
 // b / v
 bl:'Delante de l o de r siempre se escribe b.',
 aba:'Los verbos acabados en -aba se escriben con b.',
 bir:'Los verbos acabados en -bir se escriben con b (menos hervir, servir y vivir).',
 buir:'Los verbos acabados en -buir se escriben con b.',
 mb:'Después de m se escribe b: nombre, también.',
 bi:'Las palabras que empiezan por bi- o bis- (que significan «dos») se escriben con b.',
 bien:'Las palabras que empiezan por bien- se escriben con b.',
 bibli:'Las palabras que empiezan por bibli- se escriben con b.',
 ir:'Las formas del verbo ir (voy, vas, va, vamos, van) se escriben con v.',
 nue:'Nuevo y nueve se escriben con v.',
 ave:'Los adjetivos acabados en -ave, -eve, -ivo e -iva se escriben con v.',
 ivo:'Los adjetivos acabados en -ivo e -iva se escriben con v.',
 nv:'Después de n se escribe v: invierno, enviar.',
 dv:'Después de d se escribe v: adverbio, advertir.',
 vir:'Los verbos servir, vivir y hervir se escriben con v.',
 uve:'Tuve, estuve y anduve se escriben con v.',
 vice:'Las palabras que empiezan por vice- se escriben con v.',
 // c / z
 ce:'Con e y con i se escribe c: cielo, cena.',
 cer:'Los verbos acabados en -cer se escriben con c (menos coser y toser).',
 cion:'Las palabras acabadas en -ción se escriben con c.',
 pl:'El plural de las palabras acabadas en -z se escribe con c: lápiz → lápices.',
 za:'Con a, o, u suele escribirse z: zapato, zumo.',
 zar:'Los verbos acabados en -zar se escriben con z.',
 azo:'Las palabras acabadas en -azo se escriben con z: abrazo, brazo.',
 eza:'Los nombres acabados en -eza se escriben con z: belleza, tristeza.',
 ez:'Los nombres acabados en -ez se escriben con z: timidez, niñez.',
 anza:'Las palabras acabadas en -anza se escriben con z: esperanza.',
 fin:'Si la palabra acaba con ese sonido, se escribe con z: luz, pez, lápiz.',
 // h / g / j
 hosp:'Las palabras que empiezan por hosp-, horm- e hist- se escriben con h.',
 hue:'Las palabras que empiezan por hue- y hie- se escriben con h.',
 hum:'Las palabras que empiezan por hum- se escriben con h.',
 hid:'Las palabras que empiezan por hidr- e hiper- se escriben con h.',
 prohib:'Detrás de pro- y des- la h se mantiene: prohibir, deshacer.',
 gente:'Las palabras acabadas en -gente y -gencia se escriben con g.',
 geo:'Las palabras que empiezan por geo- se escriben con g.',
 gio:'Las palabras acabadas en -gia y -gio se escriben con g.',
 gion:'Las palabras acabadas en -gión se escriben con g.',
 gen:'Las palabras acabadas en -gen se escriben con g.',
 gico:'Las palabras acabadas en -gico y -gica se escriben con g.',
 logia:'Las palabras acabadas en -logía se escriben con g.',
 ger:'Los verbos acabados en -ger y -gir se escriben con g (menos tejer y crujir).',
 gerir:'Los verbos acabados en -gerir se escriben con g: sugerir, digerir.',
 gue:'Con ue y ui la g lleva una u que no suena: guerra, guitarra.',
 aje:'Las palabras acabadas en -aje se escriben con j: viaje, mensaje.',
 jero:'Las palabras acabadas en -jero y -jera se escriben con j.',
 duj:'Los pasados de decir, traer y de los verbos en -ducir llevan j: dije, trajeron, tradujeron.',
 eja:'Las palabras acabadas en -eja y -ejo se escriben con j: abeja, espejo.',
 dibujo:'Las palabras de la familia de dibujar se escriben con j.'
};

const BV=[
 ['ca_allo','b'],['ár_ol','b'],['ca_eza','b'],['bi_lioteca','b','bibli'],['ha_lar','b','bl'],['pala_ra','b','bl'],
 ['_razo','b','bl'],['_lanco','b','bl'],['canta_a','b','aba'],['juga_a','b','aba'],['salta_a','b','aba'],
 ['escri_ir','b','bir'],['reci_ir','b','bir'],['su_ir','b','bir'],['contri_uir','b','buir'],['nom_re','b','mb'],
 ['tam_ién','b','mb'],['hom_re','b','mb'],['cam_iar','b','mb'],['_icicleta','b','bi'],['_isabuelo','b','bi'],
 ['_ienvenido','b','bien'],['_onito','b'],
 ['_amos','v','ir'],['_entana','v'],['_estido','v'],['_erano','v'],['_iaje','v'],['u_a','v'],['lla_e','v'],
 ['nue_e','v','nue'],['nue_o','v','nue'],['bre_e','v','ave'],['sua_e','v','ave'],['acti_o','v','ivo'],
 ['positi_o','v','ivo'],['in_ierno','v','nv'],['en_iar','v','nv'],['con_ivir','v','nv'],['in_itar','v','nv'],
 ['ad_ertir','v','dv'],['ser_ir','v','vir'],['vi_ir','v','vir'],['her_ir','v','vir'],['tu_e','v','uve'],
 ['estu_e','v','uve'],['andu_e','v','uve'],['_icepresidente','v','vice']
];

const CZ=[
 ['_ielo','c','ce'],['_ena','c','ce'],['_ereza','c','ce'],['_ebolla','c','ce'],['a_eite','c','ce'],['a_ento','c','ce'],
 ['_iudad','c','ce'],['_inturón','c','ce'],['do_e','c','ce'],['tre_e','c','ce'],['on_e','c','ce'],['dul_e','c','ce'],
 ['gra_ias','c','ce'],['pa_iencia','c','ce'],['co_ina','c','ce'],
 ['cono_er','c','cer'],['na_er','c','cer'],['cre_er','c','cer'],['ofre_er','c','cer'],['agrade_er','c','cer'],
 ['can_ión','c','cion'],['esta_ión','c','cion'],['aten_ión','c','cion'],['ora_ión','c','cion'],['educa_ión','c','cion'],['emo_ión','c','cion'],
 ['lápi_es','c','pl'],['pe_es','c','pl'],['lu_es','c','pl'],['ve_es','c','pl'],['nari_es','c','pl'],['feli_es','c','pl'],
 ['_apato','z','za'],['_umo','z','za'],['_anahoria','z','za'],['a_ul','z','za'],['cabe_a','z','za'],['pie_a','z','za'],
 ['ca_ador','z','za'],['almuer_o','z','za'],['cora_ón','z','za'],['ra_ón','z','za'],
 ['empe_ar','z','zar'],['comen_ar','z','zar'],['abra_ar','z','zar'],['cru_ar','z','zar'],['alcan_ar','z','zar'],['lan_ar','z','zar'],
 ['abra_o','z','azo'],
 ['belle_a','z','eza'],['triste_a','z','eza'],['pere_a','z','eza'],['rique_a','z','eza'],
 ['timide_','z','ez'],['niñe_','z','ez'],['veje_','z','ez'],['madure_','z','ez'],['rapide_','z','ez'],
 ['esperan_a','z','anza'],['enseñan_a','z','anza'],
 ['lu_','z','fin'],['pe_','z','fin'],['feli_','z','fin'],['lápi_','z','fin'],['nari_','z','fin'],['ve_','z','fin']
];

const HGJ=[
 // h
 ['_ospital','h','hosp'],['_ormiga','h','hosp'],['_istoria','h','hosp'],
 ['_ueso','h','hue'],['_uevo','h','hue'],['_ielo','h','hue'],['_ierba','h','hue'],['_uerto','h','hue'],['_ierro','h','hue'],['_uérfano','h','hue'],
 ['_umo','h','hum'],['_umano','h','hum'],['_umedad','h','hum'],['_elado','h'],['_ambre','h'],['_otel','h'],
 ['_idrógeno','h','hid'],['_ipermercado','h','hid'],['alco_ol','h'],['pro_ibir','h','prohib'],['des_acer','h','prohib'],
 ['ex_ibir','h'],['ve_ículo','h'],
 // g
 ['_igante','g'],['_irasol','g'],['_imnasio','g'],['_ente','g','gente'],['_eneral','g'],['_eografía','g','geo'],['_enio','g'],
 ['_emelos','g'],['_elatina','g'],['ma_ia','g','gio'],['re_ión','g','gion'],['cole_io','g','gio'],['ori_en','g','gen'],
 ['ima_en','g','gen'],['ló_ico','g','gico'],['biolo_ía','g','logia'],['án_el','g'],['ele_ir','g','ger'],['prote_er','g','ger'],
 ['co_er','g','ger'],['reco_er','g','ger'],['diri_ir','g','ger'],['exi_ir','g','ger'],['corre_ir','g','ger'],['su_erir','g','gerir'],
 ['inteli_ente','g','gente'],['ur_ente','g','gente'],['_uitarra','g','gue'],['_uerra','g','gue'],['_usano','g'],['ami_o','g'],
 ['a_ua','g'],['pe_ar','g'],
 // j
 ['_irafa','j'],['_ardín','j'],['_ueves','j'],['_uez','j'],['_efe','j'],['_inete','j'],['_abalí','j'],['_ersey','j'],
 ['_ugar','j'],['o_o','j'],['ho_a','j'],['via_e','j','aje'],['mensa_e','j','aje'],['paisa_e','j','aje'],
 ['gara_e','j','aje'],['equipa_e','j','aje'],['tra_e','j','aje'],['pasa_ero','j','jero'],['extran_ero','j','jero'],
 ['ca_ero','j','jero'],['mu_er','j'],['pá_aro','j'],['condu_e','j','duj'],['tradu_eron','j','duj'],['tra_eron','j','duj'],
 ['di_e','j','duj'],['dibu_o','j','dibujo'],['relo_','j'],['ti_eras','j'],['naran_a','j'],
 ['vie_o','j','eja'],['abe_a','j','eja'],['ove_a','j','eja'],['espe_o','j','eja'],['conse_o','j','eja'],['me_or','j']
];

function fillWords(bank,letters,title,cols,redraw){
 const items=pick(bank,5).map(([w,a,r])=>({
  label:w.replace('_','<span class="gap">_</span>'),
  correct:a,
  opts:letters,
  why:`Se escribe «${w.replace('_',a)}».`+(RULES[r]?' '+RULES[r]:'')
 }));
 D.drawRows(items,title,cols,redraw,false,'fillword');
}
function reto1(){fillWords(BV,['b','v'],'🔤 ¿Con B o con V?',2,reto1);}
function reto2(){fillWords(CZ,['c','z'],'🔤 ¿Con C o con Z?',2,reto2);}
function reto3(){fillWords(HGJ,['h','g','j'],'🔤 ¿Con H, con G o con J?',3,reto3);}

/* ============================================================
   RETO 4: AGUDAS, LLANAS Y ESDRÚJULAS (unir con cuerdas)
   Las sílabas se separan con guion. Las tildes están ya puestas en la palabra.
   ============================================================ */
const AGUDAS=['ca-fé','ma-má','pa-pá','so-fá','ca-mión','can-ción','co-ra-zón','ba-lón','pan-ta-lón','me-lón','si-llón','ja-ba-lí',
 'be-bé','ju-gar','can-tar','re-loj','ciu-dad','pa-pel','a-ni-mal','co-lor','fe-liz','pa-red','doc-tor','ho-tel','ca-ra-col',
 'man-tel','a-de-más','ja-más','ac-ción'];
const LLANAS=['ca-sa','me-sa','li-bro','ven-ta-na','ca-mi-sa','lu-nes','e-xa-men','jo-ven','ma-ri-po-sa','za-pa-to','na-ran-ja',
 'cua-der-no','ár-bol','lá-piz','fá-cil','a-zú-car','cár-cel','mó-vil','cés-ped','ú-til','dé-bil','ca-rác-ter','ca-ba-llo',
 'es-cue-la','pe-lo-ta','ma-nos','co-le-gio'];
const ESDRUJULAS=['pá-ja-ro','mú-si-ca','te-lé-fo-no','mur-cié-la-go','lám-pa-ra','mé-di-co','pá-gi-na','plá-ta-no','sá-ba-do',
 'nú-me-ro','má-qui-na','pé-ta-lo','cá-ma-ra','cír-cu-lo','o-cé-a-no','pi-rá-mi-de','es-drú-ju-la','ár-bo-les','ú-ni-co',
 'sí-la-ba','lé-xi-co','ro-mán-ti-co','fá-bri-ca','ma-te-má-ti-cas','pú-bli-co','tí-mi-do','tér-mi-no'];

function reto4(){
 const groups=[['aguda',AGUDAS],['llana',LLANAS],['esdrujula',ESDRUJULAS]];
 // una palabra de cada tipo y dos más al azar, sin repetir
 const base=groups.map(([t,l])=>[t,pick(l,1)[0]]);
 const rest=groups.flatMap(([t,l])=>l.map(w=>[t,w])).filter(x=>!base.some(b=>b[1]===x[1]));
 const chosen=shuffle(base.concat(pick(rest,2)));
 const info={};
 const lefts=chosen.map(([t,w],i)=>{
  info['w'+i]={plain:w.replace(/-/g,''),syl:w};
  return {id:'w'+i,target:t,html:`<span class="wd">${info['w'+i].plain}</span>`};
 });
 const cat=(t,s)=>`<span class="cat">${t}<small>${s}</small></span>`;
 const rights=[
  {id:'aguda',html:cat('Aguda','la fuerza, en la última')},
  {id:'llana',html:cat('Llana','la fuerza, en la penúltima')},
  {id:'esdrujula',html:cat('Esdrújula','la fuerza, en la antepenúltima')}
 ];
 D.cablesMulti(lefts,rights,reto4);
 // casilla para ver las palabras separadas en sílabas (ayuda opcional)
 const bar=document.createElement('label');
 bar.className='es-toggle';
 bar.innerHTML='<input type="checkbox" id="sylTog"> 👀 Ver las palabras separadas en sílabas';
 D.$('exercise').querySelector('.instruction').after(bar);
 const tog=D.$('sylTog');
 tog.checked=reto4.showSyl===true;
 const apply=()=>{
  reto4.showSyl=tog.checked;
  D.$('left').querySelectorAll('.cable-item').forEach(b=>{
   const c=info[b.dataset.k];b.innerHTML=`<span class="wd">${tog.checked?c.syl:c.plain}</span>`;
  });
  window.dispatchEvent(new Event('resize'));
 };
 tog.onchange=apply;
 if(tog.checked)apply();
}

/* ============================================================
   RETO 5: LA GRAN ADIVINANZA (dictado)
   Cada adivinanza: a = palabra solución, f = 5 frases-pista.
   ============================================================ */
const RIDDLES=[
 {a:'reloj',f:['Tengo números, pero no sé contar.','Mis dos manos nunca descansan.','Camino siempre en círculo, sin mover los pies.','Te aviso cuando llega la hora del colegio.','A veces me llevas puesto en la muñeca.']},
 {a:'paraguas',f:['Me abro cuando llega la tormenta.','Tengo un mango largo y una tela redonda.','Los días de lluvia me llevas contigo.','Gracias a mí no se moja tu cabeza.','Cuando sale el sol, me cierran y me guardan.']},
 {a:'luna',f:['Salgo por la noche y casi nunca me ves de día.','Unas veces estoy redonda y otras parezco una sonrisa.','Soy la vecina más cercana de la Tierra.','Doy vueltas alrededor de tu planeta.','Brillo en el cielo con la luz que me presta el sol.']},
 {a:'abeja',f:['Vivo en una colmena con muchas hermanas.','Vuelo de flor en flor todo el día.','Con mi trabajo se fabrica algo muy dulce.','Tengo alas pequeñas y el cuerpo a rayas amarillas y negras.','Si me enfadas, puedo picarte con mi aguijón.']},
 {a:'libro',f:['Tengo muchas hojas, pero no soy un árbol.','Guardo historias en mi interior.','Me puedes abrir y cerrar, pero no soy una puerta.','En el colegio y en la biblioteca hay muchos como yo.','Cuanto más me lees, más cosas aprendes.']},
 {a:'bicicleta',f:['Tengo dos ruedas, pero no tengo motor.','Para que me muevas, tienes que dar pedales.','Llevo un timbre que suena por la calle.','Con casco puesto, el paseo es más seguro.','Los domingos me llevas hasta el parque.']},
 {a:'nieve',f:['Soy blanca y muy fría.','Llego desde el cielo en invierno.','Con mi ayuda puedes hacer un muñeco.','En las montañas altas me quedo mucho tiempo.','Cuando llega la primavera, me convierto en agua.']},
 {a:'zapato',f:['Siempre voy en pareja.','Me pisas todos los días.','Algunos llevamos cordones y otros, velcro.','Protejo tu pie del suelo y del frío.','Cuando creces, ya no me quedo bien.']},
 {a:'tren',f:['Soy muy largo y viajo por el campo.','Voy siempre por dos líneas de hierro.','Tengo muchos vagones, uno detrás de otro.','Paro en las estaciones para que subas.','El maquinista me conduce hasta el destino.']},
 {a:'tortuga',f:['Camino muy despacio por la tierra o por el mar.','Llevo mi casa siempre a cuestas.','Tengo un caparazón muy duro.','Puedo vivir muchísimos años.','Escondo la cabeza cuando algo me asusta.']},
 {a:'helado',f:['Soy dulce y estoy muy frío.','Los días de calor, todos me piden.','Puedo ser de fresa, de chocolate o de vainilla.','Me sirven en un cono o en una copa.','Si no te das prisa, me derrito.']},
 {a:'mochila',f:['Voy siempre colgada de tu espalda.','Tengo cremalleras y varios bolsillos.','Dentro llevo libros, estuche y cuadernos.','Cada mañana me preparas para el colegio.','Cuando estoy llena, peso mucho.']},
 {a:'arcoíris',f:['Aparezco después de la lluvia, cuando sale el sol.','Tengo siete colores, uno al lado de otro.','Dibujo una gran curva en el cielo.','Nadie puede tocarme, aunque me vea.','Hay quien dice que al final de mi camino hay un tesoro.']},
 {a:'gato',f:['Tengo bigotes largos y uñas afiladas.','Duermo muchas horas durante el día.','Me encanta cazar ratones.','Cuando estoy contento, ronroneo.','Dicen que siempre caigo de pie.']},
 {a:'mariposa',f:['Antes fui una oruga que comía hojas.','Me encierro en un capullo y luego salgo transformada.','Tengo alas de muchos colores.','Me gusta posarme sobre las flores.','Soy un insecto muy delicado y muy bonito.']}
];

// Si pones true, al fallar una frase se borra lo escrito y hay que escribirla de nuevo desde cero.
const CLEAR_ON_ERROR=false;

// Texto normalizado para comparar: sin mayúsculas, sin signos y sin espacios dobles. Las tildes SÍ cuentan.
const norm=s=>s.normalize('NFC').toLowerCase().replace(/[¿?¡!.,;:…"“”«»()\-–—]/g,' ').replace(/\s+/g,' ').trim();
// Para la palabra final: no se exige la tilde (pero la ñ sigue siendo ñ)
const plain=s=>s.toLowerCase().replace(/ñ/g,'\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\u0001/g,'ñ');

/* ---------- Voz del navegador ----------
   Se elige sola la mejor voz española (las «naturales», «online» o de Google suenan mucho mejor que las básicas),
   se puede cambiar desde el desplegable y, si "por partes" está activado, la frase se dicta en trocitos con pausas. */
const synth=window.speechSynthesis||null;
let voice=null,voiceList=[],rate=0.7,chunkMode=true,speakToken=0,lastRiddle=null;
const store={
 get:k=>{try{return localStorage.getItem(k);}catch(e){return null;}},
 set:(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}}
};
{const v=parseFloat(store.get('dylanRate'));if(v>=0.5&&v<=1.2)rate=v;
 if(store.get('dylanChunk')==='0')chunkMode=false;}
const scoreVoice=v=>{
 let n=0;
 if(/^es[-_]ES/i.test(v.lang))n+=30;else if(/^es/i.test(v.lang))n+=15;
 if(/natural|neural|online|premium|enhanced|mejorada/i.test(v.name))n+=40;
 if(/google|m[oó]nica|paulina|helena|elvira|[aá]lvaro|jorge|luc[ií]a|laura|pablo|alba|abril/i.test(v.name))n+=20;
 if(/espeak|compact|robot/i.test(v.name))n-=30;
 return n;
};
function loadVoices(){
 if(!synth)return;
 voiceList=synth.getVoices().filter(v=>/^es/i.test(v.lang)).sort((a,b)=>scoreVoice(b)-scoreVoice(a));
 voice=voiceList.find(v=>v.name===store.get('dylanVoice'))||voiceList[0]||null;
 const sel=document.getElementById('rdVoice');
 if(sel){
  sel.innerHTML=voiceList.length?voiceList.map(v=>`<option value="${v.name}"${voice&&v.name===voice.name?' selected':''}>${v.name} (${v.lang})</option>`).join(''):'<option>Voz por defecto</option>';
 }
}
if(synth){loadVoices();synth.onvoiceschanged=loadVoices;}
// Frase → trocitos cortos: se corta en las comas y se agrupan las palabras de 3 en 3 (o 4)
function chunks(text){
 const out=[];
 (text.match(/[^,;:.!?]+[,;:.!?]*/g)||[text]).forEach(seg=>{
  const w=seg.trim().split(/\s+/).filter(Boolean);
  const size=w.length>6?3:w.length>4?Math.ceil(w.length/2):w.length;
  for(let i=0;i<w.length;i+=size)out.push(w.slice(i,i+size).join(' '));
 });
 return out;
}
function stopSpeech(){speakToken++;if(synth)synth.cancel();}
D.stopSpeech=stopSpeech;
function speak(text){
 if(!synth)return;
 stopSpeech();
 const tk=speakToken,parts=chunkMode?chunks(text):[text];
 let k=0;
 const next=()=>{
  if(tk!==speakToken||k>=parts.length)return;
  const u=new SpeechSynthesisUtterance(parts[k++]);
  u.lang=voice?voice.lang:'es-ES';
  if(voice)u.voice=voice;
  u.rate=rate;
  u.onend=()=>{if(chunkMode)setTimeout(next,Math.round(450/rate));else next();};
  u.onerror=()=>{};
  synth.speak(u);
 };
 setTimeout(next,120); // pequeña espera: algunos navegadores se «comen» el audio si se habla justo después de cancelar
}

// Compara palabra a palabra (subsecuencia común) y marca en rojo las que sobran o están mal escritas
function diffWords(u,t){
 const n=u.length,m=t.length,dp=Array.from({length:n+1},()=>Array(m+1).fill(0));
 for(let a=n-1;a>=0;a--)for(let b=m-1;b>=0;b--)dp[a][b]=u[a]===t[b]?dp[a+1][b+1]+1:Math.max(dp[a+1][b],dp[a][b+1]);
 const good=Array(n).fill(false);let a=0,b=0;
 while(a<n&&b<m){
  if(u[a]===t[b]){good[a]=true;a++;b++;}
  else if(dp[a+1][b]>=dp[a][b+1])a++;
  else b++;
 }
 return {good,missing:m-dp[0][0],ok:n===m&&good.every(Boolean)};
}

function reto5(){
 const pool=RIDDLES.filter(r=>r.a!==lastRiddle);
 const r=pool[Math.floor(Math.random()*pool.length)];
 lastRiddle=r.a;
 const ex=D.$('exercise');
 let i=0;

 ex.innerHTML=`<div class="exercise-title">🕵️ ¡La gran adivinanza!</div>
  <p class="instruction">Pulsa el altavoz, escucha la pista y escríbela tal como la oyes. Puedes escucharla todas las veces que quieras.</p>
  <div class="rd-dots" id="rdDots"></div>
  <div class="rd-ctrl">
   <button class="btn" id="rdPlay">🔊 Escuchar la pista</button>
   <label class="rd-speed">🐢 <input type="range" id="rdRate" min="0.5" max="1.2" step="0.1" aria-label="Velocidad de la voz"> 🐇 <b id="rdRateTxt"></b></label>
  </div>
  <div class="rd-ctrl">
   <label class="es-toggle" style="margin:0"><input type="checkbox" id="rdChunk"> ✂️ Leer por partes, con pausas</label>
   <label class="rd-speed">🗣️ Voz <select id="rdVoice" class="rd-select" aria-label="Voz"></select></label>
  </div>
  <textarea class="rd-input" id="rdIn" rows="2" placeholder="Escribe aquí lo que has oído…" autocomplete="off" autocorrect="off" spellcheck="false"></textarea>
  <div class="rd-diff hidden" id="rdDiff"></div>
  <button class="btn" id="rdOk" style="width:100%;margin-top:10px">✅ Comprobar la pista</button>`;

 const $=D.$,inp=$('rdIn'),diff=$('rdDiff');
 if(!synth)D.msg('😕 Tu navegador no sabe leer en voz alta. Prueba con Chrome, Edge o Safari.','bad');

 const dots=()=>{$('rdDots').innerHTML=r.f.map((_,k)=>`<div class="rd-dot ${k<i?'done':k===i?'current':''}">${k<i?'✓':k+1}</div>`).join('');};
 dots();

 // velocidad de la voz
 const sl=$('rdRate'),sh=()=>{$('rdRateTxt').textContent=rate.toFixed(1)+'×';};
 sl.value=rate;sh();
 sl.oninput=()=>{rate=parseFloat(sl.value);sh();store.set('dylanRate',rate);};
 const ck=$('rdChunk');ck.checked=chunkMode;
 ck.onchange=()=>{chunkMode=ck.checked;store.set('dylanChunk',chunkMode?'1':'0');speak(r.f[i]);};
 loadVoices();
 $('rdVoice').onchange=e=>{voice=voiceList.find(v=>v.name===e.target.value)||voice;store.set('dylanVoice',voice?voice.name:'');speak(r.f[i]);};
 sl.onchange=()=>speak(r.f[i]); // al soltar el control, se oye la pista a la nueva velocidad

 $('rdPlay').onclick=()=>{speak(r.f[i]);inp.focus();};

 function check(){
  if(!norm(inp.value)){D.msg('Escribe en la caja lo que has oído. 🎧','try');return;}
  const u=norm(inp.value).split(' '),t=norm(r.f[i]).split(' '),res=diffWords(u,t);
  if(res.ok){
   diff.classList.add('hidden');diff.innerHTML='';
   i++;inp.value='';dots();
   if(i<r.f.length){
    D.msg(`¡Pista correcta! 🎉 Ya llevas ${i} de ${r.f.length}. Escucha la siguiente.`,'good');
    setTimeout(()=>speak(r.f[i]),900);
    inp.focus();
   }else showRiddle();
   return;
  }
  // mostrar lo escrito con las palabras mal en rojo
  diff.classList.remove('hidden');diff.innerHTML='';
  u.forEach((w,k)=>{const s=document.createElement('span');s.className='w '+(res.good[k]?'ok':'no');s.textContent=w;diff.appendChild(s);});
  const falta=res.missing>0?` Te ${res.missing===1?'falta 1 palabra':'faltan '+res.missing+' palabras'}.`:'';
  D.msg('¡Casi, Dylan! 🤔 Mira las palabras en rojo: fíjate bien en las letras y en las tildes.'+falta+' Escucha otra vez y vuelve a escribir la frase.','try');
  if(CLEAR_ON_ERROR)inp.value='';
  inp.focus();
 }
 $('rdOk').onclick=check;
 inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();check();}});
 inp.focus();

 /* ---------- Las 5 pistas juntas y la palabra misteriosa ---------- */
 function showRiddle(){
  const letters=[...r.a];
  ex.innerHTML=`<div class="exercise-title">📜 ¡Ya tienes las cinco pistas!</div>
   <ol class="rd-clues">${r.f.map(f=>`<li>${f}</li>`).join('')}</ol>
   <div class="rd-ctrl"><button class="btn secondary" id="rdAll">🔊 Escuchar la adivinanza entera</button></div>
   <div class="exercise-title center" style="margin-top:6px">❓ ¿Qué soy?</div>
   <p class="instruction center">Hay una casilla por cada letra. Puedes intentarlo todas las veces que quieras.</p>
   <div class="rd-boxes" id="rdBoxes">${letters.map(c=>c===' '?'<span class="rd-gapw"></span>':'<input class="rd-box" maxlength="1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" aria-label="Letra">').join('')}</div>
   <button class="btn" id="rdSolve" style="width:100%">🔍 Comprobar mi respuesta</button>`;
  D.msg('🎉 ¡Has escrito las cinco pistas sin fallos! Ahora, ¿sabes qué soy?','good');
  const boxes=[...document.querySelectorAll('.rd-box')];
  const exp=[...plain(r.a.replace(/ /g,''))];
  const shown=[...r.a.replace(/ /g,'')];
  $('rdAll').onclick=()=>speak(r.f.join(' '));

  boxes.forEach((b,k)=>{
   b.addEventListener('focus',()=>b.select());
   b.addEventListener('input',()=>{
    b.classList.remove('bad','ok');
    const v=[...b.value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g,'')];
    if(!v.length){b.value='';return;}
    b.value=v[0];
    v.slice(1).forEach((ch,j)=>{if(boxes[k+1+j]){boxes[k+1+j].value=ch;boxes[k+1+j].classList.remove('bad','ok');}});
    const nx=boxes[Math.min(k+v.length,boxes.length-1)];
    if(nx)nx.focus();
   });
   b.addEventListener('keydown',e=>{
    if(e.key==='Backspace'&&!b.value&&k>0){e.preventDefault();boxes[k-1].value='';boxes[k-1].classList.remove('bad','ok');boxes[k-1].focus();}
    else if(e.key==='ArrowLeft'&&k>0){e.preventDefault();boxes[k-1].focus();}
    else if(e.key==='ArrowRight'&&k<boxes.length-1){e.preventDefault();boxes[k+1].focus();}
    else if(e.key==='Enter'){e.preventDefault();solve();}
   });
  });
  boxes[0].focus();

  function solve(){
   let bien=true,vacias=0;
   boxes.forEach((b,k)=>{
    const g=plain(b.value.trim());
    if(!g)vacias++;
    if(g===exp[k]){b.classList.remove('bad');b.classList.add('ok');}
    else{b.classList.remove('ok');b.classList.add('bad');bien=false;}
   });
   if(bien){
    boxes.forEach((b,k)=>{b.value=shown[k];b.disabled=true;});
    $('rdSolve').disabled=true;
    D.completeStage();
   }else if(vacias===boxes.length){
    boxes.forEach(b=>b.classList.remove('bad'));
    D.msg('Escribe la palabra en las casillas. ¡Piensa en las cinco pistas! 🤔','try');
   }else{
    D.msg('¡Casi, Dylan! 🤔 Las casillas rojas no son correctas. Piensa otra vez en las pistas y corrígelas.','try');
    const first=boxes.find(b=>b.classList.contains('bad'));if(first)first.focus();
   }
  }
  $('rdSolve').onclick=solve;
 }
}

/* ============================================================
   REGISTRO DEL JUEGO
   ============================================================ */
D.registerGame({
 id:'ortografia',name:'Ortografía',
 labels:['Completa con b o v','Completa con c o z','Completa con h, g o j','Agudas, llanas y esdrújulas','🕵️ ¡La gran adivinanza!'],
 stages:[
  {title:'¿B de burro o V de vaca?',desc:'Pulsa la letra que falta en cada palabra. Si te equivocas, empiezas de nuevo con palabras nuevas.',run:reto1},
  {title:'¿C de cielo o Z de zapato?',desc:'Pulsa la letra que falta en cada palabra. Si te equivocas, empiezas de nuevo con palabras nuevas.',run:reto2},
  {title:'H, G o J: ¡tres letras traviesas!',desc:'Pulsa la letra que falta. Si te equivocas, te explico la regla y empiezas de nuevo.',run:reto3},
  {title:'¡Une cada palabra con su acento!',desc:'Une con cuerdas cada palabra con su tipo: aguda, llana o esdrújula. Si fallas, se mezclan las cuerdas.',run:reto4},
  {title:'🕵️ ¡La gran adivinanza!',desc:'Escucha cinco pistas, escríbelas sin faltas y descubre la palabra secreta. ¡Es el reto final!',run:reto5}
 ]
});
})();
