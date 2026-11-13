/* JUEGO: LOS NÚMEROS (0 al 20) */
(()=>{
const {shuffle,range}=Dylan;
const words=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];

// Pantalla de aprendizaje
Dylan.addScreen('learn-numbers',`
 <div class="panel"><button class="btn secondary" data-back>← Temas de Inglés</button><h2 style="margin-top:14px">🔢 Los números del 0 al 20</h2><p class="muted">Antes de empezar, vamos a conocer los números en inglés. Lee cada uno en voz alta.</p>
  <div class="numgrid">${words.map((w,i)=>`<div class="numcard"><b>${i}</b><span>${w}</span></div>`).join('')}</div></div>
 ${Dylan.routePanel('Hay cuatro retos. Cada vez que completes uno, tu moto avanzará por el circuito.','🏍️ ¡EMPEZAR LA AVENTURA!')}`);

// Reto 1: leer la palabra y marcar el número
function reto1(){
 const nums=shuffle(range(21)).slice(0,5);
 Dylan.drawRows(nums.map(n=>({label:words[n],correct:String(n),opts:shuffle([n,...shuffle(range(21).filter(i=>i!==n)).slice(0,3)]).map(String)})),
  '🔢 Lee la palabra y marca el número',4,reto1);
}
// Reto 2: elegir el nombre correcto
function reto2(){
 const nums=shuffle([11,12,13,14,15]);
 Dylan.drawRows(nums.map(n=>({label:n,correct:words[n],opts:shuffle([n,...shuffle(range(21).filter(i=>i!==n)).slice(0,2)]).map(i=>words[i])})),
  '📝 Elige la palabra correcta',3,reto2);
}
// Reto 3: unir con cables
function reto3(){
 const nums=shuffle(range(21)).slice(0,10);
 Dylan.cables(nums.map(n=>({key:String(n),left:n,right:words[n]})),false,reto3);
}
// Reto 4: completar letras
function reto4(){
 Dylan.spelling(shuffle(range(20).map(i=>i+1)).slice(0,5).map(n=>({label:n,text:words[n]})),reto4);
}

Dylan.registerGame({
 id:'numbers',name:'Números',
 labels:['Lee la palabra y marca el número','Elegir el nombre correcto','Unir números y palabras','Completa las letras'],
 stages:[
  {title:'¡Selecciona el número correcto!',desc:'Lee la palabra en inglés y pulsa el número correcto. Si fallas, se resetea.',run:reto1},
  {title:'¿Cómo se escribe?',desc:'Elige la palabra correcta en cada fila.',run:reto2},
  {title:'¡Conecta con cables!',desc:'Une cada número con su nombre: haz clic o arrastra el cable.',run:reto3},
  {title:'Completa las palabras',desc:'Escribe las letras que faltan. Tienes 5 vidas.',run:reto4}
 ]
});
})();
