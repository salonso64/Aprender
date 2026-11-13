/* MOTOR COMÚN: lo usan todos los juegos (pantallas, retos de opciones, cables y letras) */
(()=>{
const $=id=>document.getElementById(id);
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const range=n=>Array.from({length:n},(_,i)=>i);
const D=window.Dylan={$,shuffle,range,games:{},state:{mode:null,stage:0,completed:{},lives:5}};
const S=D.state;
let locked=false,selected=null,matched=[],dragging=null,cableTotal=0,rowDone=0;

/* ---------- Pantallas ---------- */
D.show=id=>{
 document.querySelectorAll('.screen').forEach(el=>el.classList.toggle('hidden',el.id!==id));
 $('hero').classList.toggle('hidden',id==='play');
 window.scrollTo(0,0);
};
D.msg=(t,type='try')=>{$('feedback').innerHTML=`<div class="feedback ${type}">${t}</div>`};
D.addScreen=(id,html)=>{
 const sec=document.createElement('section');
 sec.id=id;sec.className='screen hidden';sec.innerHTML=html;
 $('screens').appendChild(sec);
 sec.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>D.show('english-topics'));
 sec.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>D.setupStage(0));
};
D.routePanel=(text,btn)=>`<div class="panel"><h2>🏁 Tu recorrido de motocross</h2><p class="muted">${text}</p><div class="route"></div><div class="stagecards"></div><button class="btn" data-start style="width:100%;margin-top:15px">${btn}</button></div>`;

/* ---------- Registro de juegos ----------
   game = {id, name, labels:[4 textos], stages:[{title,desc,run}] x4} */
D.registerGame=g=>{D.games[g.id]=g;S.completed[g.id]=0;};
D.openGame=id=>{S.mode=id;D.renderMap(id);D.show('learn-'+id);};
D.renderMap=id=>{
 const g=D.games[id],comp=S.completed[id],sec=$('learn-'+id);
 sec.querySelector('.route').innerHTML=g.labels.map((_,i)=>`<div class="dot ${i<comp?'done':i===comp?'current':''}">${i<comp?'✓':i+1}</div>`).join('<span style="color:#aab8ac">━━</span>');
 sec.querySelector('.stagecards').innerHTML=g.labels.map((x,i)=>`<div class="stagecard ${i<comp?'done':i===comp?'active':''}"><b>${i<comp?'✓':(i+1)+'.'}</b> ${x}</div>`).join('');
};

/* ---------- Flujo de retos ---------- */
D.setupStage=n=>{
 const g=D.games[S.mode];
 S.stage=n;locked=false;selected=null;matched=[];rowDone=0;dragging=null;
 S.lives=5;
 $('feedback').innerHTML='';$('next').classList.add('hidden');
 $('counter').textContent=`RETO ${n+1} DE ${g.stages.length} (${g.name})`;
 $('progress').style.width=(n/g.stages.length*100)+'%';
 $('title').textContent=g.stages[n].title;$('description').textContent=g.stages[n].desc;
 D.show('play');g.stages[n].run();
};
D.completeStage=()=>{
 locked=true;$('next').classList.remove('hidden');
 const last=S.stage===D.games[S.mode].stages.length-1;
 $('next').textContent=last?'🏆 ¡VER MI TROFEO!':'🏍️ ¡SIGUIENTE RETO!';
 D.msg(last?'🌟 ¡Fantástico, Dylan! ¡Has completado todos los retos!':'🎉 ¡Muy bien, Dylan! ¡Reto superado!','good');
 $('next').onclick=()=>{
  S.completed[S.mode]=Math.max(S.completed[S.mode],S.stage+1);
  last?D.show('finish'):D.setupStage(S.stage+1);
 };
};
// Vuelve a dibujar un reto tras una pausa, solo si seguimos en el mismo reto
function later(redraw,ms){const s=S.stage,m=S.mode;setTimeout(()=>{if(S.stage===s&&S.mode===m)redraw();},ms);}

/* ---------- Reto de opciones (filas) ----------
   items: [{label(html), correct(texto), opts[textos]}] */
D.drawRows=(items,title,cols,redraw,two)=>{
 locked=false;rowDone=0;const N=items.length;
 $('exercise').innerHTML=`<div class="exercise-title">${title}</div><div class="wordrows${two?' two':''}" id="rows">${items.map((r,k)=>`<div class="wordrow" data-row="${k}"><div class="wordnum">${r.label}</div><div class="opts" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${r.opts.map(o=>`<button class="opt" data-v="${o}">${o}</button>`).join('')}</div></div>`).join('')}</div><p class="muted center" id="rowCount">0 de ${N} correctas</p>`;
 $('rows').querySelectorAll('.wordrow').forEach(el=>el.querySelectorAll('button').forEach(b=>b.onclick=()=>{
  if(locked||el.dataset.done)return;
  const ok=items[+el.dataset.row].correct;
  if(b.dataset.v===ok){
   el.dataset.done='1';
   el.querySelectorAll('button').forEach(x=>{x.disabled=true;if(x.dataset.v===ok)x.classList.add('correct')});
   rowDone++;$('rowCount').textContent=`${rowDone} de ${N} correctas`;
   if(rowDone===N){locked=true;D.msg('🎉 ¡Excelente, Dylan! ⭐','good');setTimeout(D.completeStage,1000);}
   else D.msg('¡Correcto! Sigue así ⭐','good');
  }else{
   locked=true;D.msg('¡No pasa nada, Dylan! 😊 Empezamos de nuevo este reto.');
   later(redraw,1300);
  }
 }));
};

/* ---------- Reto de cables ---------- */
const elOf=(side,k)=>[...$(side).querySelectorAll('button')].find(b=>b.dataset.k===k);
let cLefts=[],cMulti=false,cThree=false;
// Uno a uno: pairs [{key,left(html),right(html)}]
D.cables=(pairs,tall,redraw)=>cableBuild(pairs.map(p=>({id:p.key,html:p.left,target:p.key})),shuffle(pairs).map(p=>({id:p.key,html:p.right})),tall,redraw,false);
// Varios a uno (una derecha puede recibir varias cuerdas): lefts [{id,html,target}], rights [{id,html}]
D.cablesMulti=(lefts,rights,redraw)=>cableBuild(shuffle(lefts),shuffle(rights),false,redraw,true);
function cableBuild(lefts,rights,tall,redraw,multi){
 matched=[];selected=null;dragging=null;locked=false;cLefts=lefts;cMulti=multi;cThree=false;
 const cls=tall?' tall':'',rcls=multi?' big':'';
 $('exercise').innerHTML=`<div class="exercise-title">🔌 ¡Conecta con cables!</div><p class="instruction">Toca un elemento de la izquierda y luego su pareja, o arrástralo hasta ella.</p><div class="cable-wrap" id="cableWrap"><svg id="cables"></svg><div class="cable-col" id="left">${lefts.map(p=>`<button class="cable-item left${cls}" data-k="${p.id}">${p.html}</button>`).join('')}</div><div class="cable-col" id="right"${multi?' style="justify-content:space-around"':''}>${rights.map(p=>`<button class="cable-item right${cls}${rcls}" data-k="${p.id}">${p.html}</button>`).join('')}</div></div><p class="muted center" id="mc">0 de ${lefts.length} parejas unidas</p>`;
 const clearSel=()=>$('left').querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));
 $('left').querySelectorAll('button').forEach(b=>{
  b.onclick=()=>{if(locked||b.disabled)return;clearSel();selected=b.dataset.k;b.classList.add('selected');dragging=null;drawLines();};
  b.onmousedown=e=>{if(locked||b.disabled)return;clearSel();dragging=b.dataset.k;selected=null;b.classList.add('selected');e.preventDefault();};
 });
 $('cableWrap').onmousemove=e=>{if(dragging!==null)drawLines(e.clientX,e.clientY)};
 window.onmouseup=e=>{
  if(dragging===null)return;
  const t=document.elementFromPoint(e.clientX,e.clientY),r=t&&t.closest?t.closest('.cable-item.right'):null;
  const k=dragging;dragging=null;
  if(r&&!r.disabled){selected=k;checkMatch(r.dataset.k,redraw);}else drawLines();
 };
 $('right').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  if(locked||b.disabled||selected===null)return;
  checkMatch(b.dataset.k,redraw);
 });
 requestAnimationFrame(()=>drawLines());
}
function checkMatch(rk,redraw){
 const cur=selected;dragging=null;
 const L=cLefts.find(x=>x.id===cur);
 if(!L||rk!==L.target){
  selected=null;locked=true;D.msg('¡No pasa nada, Dylan! 💪 Vamos a mezclar los cables y empezamos otra vez.');
  later(redraw,1250);return;
 }
 const l=elOf('left',cur),r=elOf('right',rk);
 l.classList.remove('selected');l.classList.add('matched');l.disabled=true;r.classList.add('matched');
 if(!cMulti)r.disabled=true;
 matched.push({l:cur,r:rk});selected=null;
 $('mc').textContent=`${matched.length} de ${cLefts.length} parejas unidas`;
 drawLines();
 if(matched.length===cLefts.length)D.completeStage();
 else D.msg(['¡Cable conectado!','¡Muy bien!','¡Pareja perfecta!'][Math.floor(Math.random()*3)],'good');
}
function drawLines(mx,my){
 const wrap=$('cableWrap'),svg=$('cables');if(!wrap||!svg)return;
 const r=wrap.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);svg.innerHTML='';
 const add=(x1,y1,x2,y2,c)=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M${x1} ${y1} C${x1+35} ${y1},${x2-35} ${y2},${x2} ${y2}`);p.setAttribute('class',c);svg.appendChild(p);};
 matched.forEach(m=>{
  const a=elOf('left',m.l).getBoundingClientRect(),b=elOf(m.side||'right',m.r).getBoundingClientRect();
  const same=matched.filter(x=>x.r===m.r&&x.side===m.side),off=(same.indexOf(m)-(same.length-1)/2)*8;
  add(a.right-r.left,a.top+a.height/2-r.top,b.left-r.left,b.top+b.height/2-r.top+off,'cable-line'+(cThree&&m.side==='right'?' alt':''));
 });
 if(dragging!==null&&mx!==undefined){
  const el=elOf('left',dragging);
  if(el){const a=el.getBoundingClientRect();add(a.right-r.left,a.top+a.height/2-r.top,mx-r.left,my-r.top,'cable-line drag');}
 }
}
window.addEventListener('resize',()=>drawLines());

/* ---------- Reto de completar letras con 5 vidas ----------
   items: [{label(html), text}] */
D.spelling=(items,redraw)=>{
 locked=false;
 const hearts=()=>'❤️'.repeat(S.lives)+'🖤'.repeat(5-S.lives);
 $('exercise').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div class="exercise-title" style="margin:0">✏️ ¡Completa las letras!</div><div style="font-size:18px;font-weight:900">Vidas: <span id="livesDisplay">${hearts()}</span></div></div><p class="instruction">Escribe las letras que faltan. Se comprueba letra a letra.</p><div id="spellRows" style="display:flex;flex-direction:column;gap:10px">${items.map((r,k)=>{
  const t=r.text,idx=shuffle([...t].map((c,i)=>/[a-z]/.test(c)?i:-1).filter(i=>i>=0));
  const hide=new Set(idx.slice(0,Math.max(2,Math.floor(idx.length*0.5))));
  return `<div class="panel spellrow" style="margin:0;padding:11px"><div class="spellnum">${r.label}</div><div class="letters">${[...t].map((ch,j)=>ch===' '?'<span style="width:12px"></span>':hide.has(j)?`<input class="letter" maxlength="1" autocomplete="off" autocapitalize="none" data-row="${k}" data-pos="${j}">`:`<span class="letter fixed">${ch}</span>`).join('')}</div></div>`;}).join('')}</div>`;
 const inputs=[...$('spellRows').querySelectorAll('input')];
 inputs.forEach((el,i)=>el.addEventListener('input',()=>{
  if(locked)return;
  const v=el.value.toLowerCase().replace(/[^a-z]/g,'').slice(0,1);el.value=v;if(!v)return;
  const exp=items[+el.dataset.row].text[+el.dataset.pos];
  if(v===exp){
   el.classList.add('correct-input');el.disabled=true;
   const nx=inputs.slice(i+1).find(x=>!x.disabled);if(nx)nx.focus();
   if(inputs.every(x=>x.disabled))D.completeStage();
  }else{
   el.value='';S.lives--;$('livesDisplay').textContent=hearts();
   if(S.lives<=0){
    locked=true;S.lives=5;D.msg('¡Te has quedado sin vidas! 💔 Cargamos palabras nuevas con 5 vidas.');
    later(redraw,1500);
   }else D.msg(`¡Letra incorrecta, Dylan! Te quedan ${S.lives} vidas. ⚠️`,'bad');
  }
 }));
};

/* ---------- Reto de escribir palabras ----------
   items: [{before(html), answer, after(html)}]. Si una letra no encaja, se reinicia. */
D.typing=(items,title,instr,head,redraw)=>{
 locked=false;rowDone=0;const N=items.length;
 $('exercise').innerHTML=`<div class="exercise-title">${title}</div><p class="instruction">${instr}</p>${head||''}<div class="typerows" id="typeRows">${items.map((r,k)=>`<div class="typerow">${r.before}<input class="typein" data-k="${k}" maxlength="${r.answer.length}" autocomplete="off" autocapitalize="none" spellcheck="false">${r.after||''}</div>`).join('')}</div><p class="muted center" id="rowCount">0 de ${N} correctas</p>`;
 const inputs=[...$('typeRows').querySelectorAll('input')];
 inputs.forEach(el=>el.addEventListener('input',()=>{
  if(locked)return;
  const v=el.value.toLowerCase().replace(/[^a-z]/g,'');el.value=v;if(!v)return;
  const ans=items[+el.dataset.k].answer.toLowerCase();
  if(!ans.startsWith(v)){
   locked=true;el.classList.add('bad');D.msg('¡Ups, esa palabra no es! 🔄 Empezamos de nuevo con frases nuevas.');
   later(redraw,1400);return;
  }
  if(v===ans){
   el.classList.add('ok');el.disabled=true;rowDone++;$('rowCount').textContent=`${rowDone} de ${N} correctas`;
   const nx=inputs.find(x=>!x.disabled);if(nx)nx.focus();
   if(rowDone===N){locked=true;D.msg('🎉 ¡Excelente, Dylan! ⭐','good');setTimeout(D.completeStage,1000);}
   else D.msg('¡Correcto! ⭐','good');
  }
 }));
 inputs[0].focus();
};

/* ---------- Reto de cables en tres columnas ----------
   rows: [{id, a(html), b(html), c(html)}]. Cada elemento de la izquierda se une con su b y con su c. */
D.cables3=(rows,redraw)=>{
 matched=[];selected=null;dragging=null;locked=false;cThree=true;cLefts=rows;
 const N=rows.length,mids=shuffle(rows),rts=shuffle(rows);
 $('exercise').innerHTML=`<div class="exercise-title">🔌 ¡Conecta con cables!</div><p class="instruction">Toca un elemento de la izquierda y únelo con su pareja de la columna central y también con la de la derecha.</p><div class="cable-wrap three" id="cableWrap"><svg id="cables"></svg><div class="cable-col" id="left">${rows.map(r=>`<button class="cable-item left" data-k="${r.id}">${r.a}</button>`).join('')}</div><div class="cable-col" id="mid">${mids.map(r=>`<button class="cable-item target" data-k="${r.id}">${r.b}</button>`).join('')}</div><div class="cable-col" id="right">${rts.map(r=>`<button class="cable-item target right" data-k="${r.id}">${r.c}</button>`).join('')}</div></div><p class="muted center" id="mc">0 de ${2*N} cuerdas unidas</p>`;
 const clearSel=()=>$('left').querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));
 const tryMatch=(side,k)=>{
  if(selected===null)return;
  if(k!==selected){selected=null;locked=true;D.msg('¡No pasa nada, Dylan! 💪 Vamos a mezclar los cables y empezamos otra vez.');later(redraw,1250);return;}
  const t=elOf(side,k),l=elOf('left',k);
  t.classList.add('matched');t.disabled=true;l.classList.remove('selected');
  matched.push({l:k,r:k,side});selected=null;
  if(matched.filter(m=>m.l===k).length===2){l.classList.add('matched');l.disabled=true;}
  $('mc').textContent=`${matched.length} de ${2*N} cuerdas unidas`;
  drawLines();
  if(matched.length===2*N)D.completeStage();
  else D.msg(['¡Cable conectado!','¡Muy bien!','¡Pareja perfecta!'][Math.floor(Math.random()*3)],'good');
 };
 $('left').querySelectorAll('button').forEach(b=>{
  b.onclick=()=>{if(locked||b.disabled)return;clearSel();selected=b.dataset.k;b.classList.add('selected');dragging=null;drawLines();};
  b.onmousedown=e=>{if(locked||b.disabled)return;clearSel();dragging=b.dataset.k;selected=null;b.classList.add('selected');e.preventDefault();};
 });
 $('cableWrap').onmousemove=e=>{if(dragging!==null)drawLines(e.clientX,e.clientY)};
 window.onmouseup=e=>{
  if(dragging===null)return;
  const t=document.elementFromPoint(e.clientX,e.clientY),r=t&&t.closest?t.closest('.cable-item.target'):null;
  const k=dragging;dragging=null;
  if(r&&!r.disabled){selected=k;tryMatch(r.parentNode.id,r.dataset.k);}else drawLines();
 };
 document.querySelectorAll('#mid button,#right button').forEach(b=>b.onclick=()=>{
  if(locked||b.disabled)return;tryMatch(b.parentNode.id,b.dataset.k);
 });
 requestAnimationFrame(()=>drawLines());
};
})();
