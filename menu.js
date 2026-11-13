/* MENÚ PRINCIPAL: navegación entre asignaturas, temas y juegos */
(()=>{
const D=Dylan,$=D.$;

$('btnEnglish').onclick=()=>D.show('english-topics');
$('backToHome').onclick=()=>D.show('home');
$('globalHome').onclick=()=>D.show('home');
$('toMenuFinish').onclick=()=>D.show('home');

// Cada botón con data-game abre la pantalla de aprendizaje de ese juego
document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>D.openGame(b.dataset.game));

// Botón "Volver" dentro del juego: regresa a la pantalla de aprendizaje del juego actual
$('backlearn').onclick=()=>D.openGame(D.state.mode);

// Pantalla final: reiniciar progreso
$('again').onclick=()=>{
 Object.keys(D.state.completed).forEach(k=>D.state.completed[k]=0);
 D.show('home');
};

D.show('home');
})();
