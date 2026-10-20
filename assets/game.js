const STEPS=SETTINGS.steps;
let current=0;
const selected={};
const checked={};
const notes={};
let rewriteText='';
const $=(id)=>document.getElementById(id);
function escapeText(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function isConfirmed(){return Object.prototype.hasOwnProperty.call(checked,current);}
function optHTML(st){
 const choices=Object.prototype.hasOwnProperty.call(selected,current)?selected[current]:[];
 let cls=st.options.length===2?'two':st.options.length>3?'many':'';
 return '<div class="options '+cls+'">'+st.options.map((value,n)=>{
   const chosen=Array.isArray(choices)?choices.includes(n):choices===n;
   return '<button type="button" data-option="'+n+'" class="option'+(chosen?' selected':'')+'" aria-pressed="'+chosen+'" '+(isConfirmed()?'disabled':'')+'>'+escapeText(value)+'</button>';
 }).join('')+'</div>';
}
function countHTML(){
 const chosen=selected[current]||[];
 return '<div class="person-grid">'+Array.from({length:10},(_,i)=>'<button type="button" data-person="'+i+'" class="person'+(chosen.includes(i)?' selected':'')+'" '+(isConfirmed()?'disabled':'')+' aria-label="Persona consultada '+(i+1)+'" aria-pressed="'+chosen.includes(i)+'"><span class="student-avatar" aria-hidden="true"><img src="../assets/${["mora","mati","mari"][i%3]}.png" alt=""></span><small>'+(i+1)+'</small></button>').join('')+'</div><div class="count" role="status">'+chosen.length+' DE 10 TARJETAS MARCADAS</div>';
}
function factHTML(st){return '<div class="facts">'+st.facts.map(([big,txt])=>'<div class="fact"><strong>'+escapeText(big)+'</strong><span>'+escapeText(txt)+'</span></div>').join('')+'</div>'+(st.bottom?'<div class="bottom-note">'+escapeText(st.bottom)+'</div>':'');}
function getFeedback(st){
 const result=checked[current];if(!result)return '';
 const cls=result.neutral?'':result.good?'good':'try';
 let msg=result.neutral?'Es tu primera impresión; ahora vamos a investigar los datos.':result.good?(st.feedback||'¡Bien pensado!'):'Revisá qué datos tenemos y qué podemos afirmar con seguridad. Podés volver a intentarlo.';
 return '<div class="feedback '+cls+'" role="status">'+(result.neutral?'💡':result.good?'⭐':'🔎')+' '+escapeText(msg)+'</div>';
}
function playTone(good=true){
 if(!window._queondaAudioOn)return;
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 const ctx=window._queondaAC||(window._queondaAC=new AC());const t=ctx.currentTime;
 (good?[523,659,784]:[300,230]).forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=f;g.gain.setValueAtTime(.0001,t+i*.11);g.gain.exponentialRampToValueAtTime(.065,t+i*.11+.025);g.gain.exponentialRampToValueAtTime(.0001,t+i*.11+.17);o.connect(g);g.connect(ctx.destination);o.start(t+i*.11);o.stop(t+i*.11+.18);});}catch(e){}
}
function saveCompleted(){try{let k=JSON.parse(localStorage.getItem('queonda-logros')||'{}');k[String(Number(SETTINGS.gameNo))]=true;localStorage.setItem('queonda-logros',JSON.stringify(k));}catch(e){}}

function render(){
 const st=STEPS[current], done=isConfirmed();
 $('game-num').textContent=SETTINGS.gameNo;
 $('progress-label').textContent='PASO '+(current+1)+' DE '+STEPS.length;
 $('step-time').textContent=st.time;
 $('track').innerHTML=STEPS.map((_,i)=>'<span class="'+(i<=current?'active':'')+'"></span>').join('');
 let panel='<h2 class="step-title">'+escapeText(st.title)+'</h2>';
 panel+='<section class="blue">';
 if(st.lead)panel+='<div class="lead">'+escapeText(st.lead)+'</div>';
 if(st.headline)panel+='<div class="headline">'+escapeText(st.headline)+'</div>';
 panel+='<div class="prompt">'+escapeText(st.prompt)+'</div></section>';
 if(['poll','single','multi'].includes(st.type))panel+=optHTML(st);
 if(st.type==='multi'&&!done)panel+='<p class="mini-note">PODÉS SELECCIONAR MÁS DE UNA OPCIÓN.</p>';
 if(st.type==='counter')panel+=countHTML();
 if(['reveal','outro'].includes(st.type))panel+=factHTML(st);
 if(st.type==='rewrite'){
  panel+='<label class="mini-note" for="rewrite">TU PROPUESTA (SOLO SE MUESTRA EN ESTE DISPOSITIVO):</label><textarea id="rewrite" placeholder="'+escapeText(st.placeholder)+'" '+(done?'readonly':'')+'>'+escapeText(rewriteText)+'</textarea>';
  if(done)panel+='<div class="model"><strong>EJEMPLO DE REESCRITURA</strong>'+escapeText(st.model)+'</div>';
 }
 if(notes[current]&&!done)panel+='<div class="feedback try" role="status">'+escapeText(notes[current])+'</div>';
 panel+=getFeedback(st); if(checked[current]&&!checked[current].good&&!checked[current].neutral)panel+='<div class="retry-row"><button type="button" class="secondary" id="retry">↻ INTENTAR DE NUEVO</button></div>';
 if(st.type==='outro')panel+='<div class="finish">⭐ ¡DESAFÍO COMPLETADO!</div>';if(current===STEPS.length-1&&(done||st.type==='outro')){panel+='<div class="mission-complete">🏆 ¡Misión cumplida! Volvé a la prueba piloto para seguir jugando.</div>';saveCompleted();}
 panel+='<div class="controls">';
 if(current>0)panel+='<button class="secondary" type="button" id="back">VOLVER</button>';
 if(done||['reveal','outro'].includes(st.type)){
  panel+='<button class="action" type="button" id="next">'+(current===STEPS.length-1?'↻ REPETIR MISIÓN':'CONTINUAR')+'</button>';
 }else{
  const label=st.type==='poll'?'CONTINUAR SIN CALIFICACIÓN':st.type==='counter'?'COMPROBAR 8 DE 10':st.type==='rewrite'?'VER EJEMPLO DE REESCRITURA':'COMPROBAR RESPUESTA';
  const hasSelection=(st.type==='rewrite'?rewriteText.trim().length>=10:((selected[current]||[]).length>0)||(typeof selected[current]==='number'));
  panel+='<button class="action" type="button" id="check" '+(!hasSelection?'disabled':'')+'>'+label+'</button>';
 }
 panel+='</div>';
 panel+='<details class="teacher"><summary>ORIENTACIONES PARA LA CONDUCCIÓN DOCENTE</summary><p>'+escapeText(st.teacher||'')+'</p></details>';
 $('content').innerHTML=panel;
 $('content').querySelectorAll('[data-option]').forEach(btn=>btn.onclick=()=>{
  const n=Number(btn.dataset.option);
  if(st.type==='multi'){
   let values=Array.isArray(selected[current])?selected[current].slice():[];
   values=values.includes(n)?values.filter(x=>x!==n):[...values,n];selected[current]=values;
  }else{ selected[current]=n; }
  delete notes[current];render();
 });
 $('content').querySelectorAll('[data-person]').forEach(btn=>btn.onclick=()=>{
  const n=Number(btn.dataset.person);let values=selected[current]||[];
  values=values.includes(n)?values.filter(x=>x!==n):[...values,n];
  if(values.length>10)values.length=10;
  selected[current]=values;delete notes[current];render();
 });
 const rewrite=$('rewrite'); if(rewrite)rewrite.oninput=(e)=>{rewriteText=e.target.value;const check=$('check');if(check)check.disabled=e.target.value.trim().length<10};
 if($('retry'))$('retry').onclick=()=>{delete checked[current];delete selected[current];delete notes[current];render();scrollToTop();};
 if($('back'))$('back').onclick=()=>{current=Math.max(0,current-1);render();scrollToTop()};
 if($('next'))$('next').onclick=()=>{
  if(current===STEPS.length-1){current=0;Object.keys(selected).forEach(k=>delete selected[k]);Object.keys(checked).forEach(k=>delete checked[k]);Object.keys(notes).forEach(k=>delete notes[k]);rewriteText='';}
  else current++;
  render();scrollToTop();
 };
 if($('check'))$('check').onclick=()=>{
  let good=true,neutral=false;
  if(st.type==='poll'){neutral=true;good=true;}
  if(st.type==='single')good=selected[current]===st.correct;
  if(st.type==='multi'){let a=(selected[current]||[]).slice().sort().join(','),b=st.correct.slice().sort().join(',');good=a===b;}
  if(st.type==='counter'){
   if((selected[current]||[]).length!==st.target){notes[current]='SELECCIONÁ EXACTAMENTE OCHO DE LAS DIEZ TARJETAS Y VOLVÉ A INTENTAR.';render();return;}
  }
  if(st.type==='rewrite')rewriteText=($('rewrite')?.value||'');
  checked[current]={good,neutral};delete notes[current];playTone(good);render();scrollToTop();
 };
}
function scrollToTop(){try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}}
const soundButton=document.createElement('button');
soundButton.className='sound-switch';soundButton.type='button';soundButton.textContent='🔈 SONIDO';
soundButton.setAttribute('aria-pressed','false');
soundButton.onclick=()=>{window._queondaAudioOn=!window._queondaAudioOn;soundButton.textContent=window._queondaAudioOn?'🔊 SONIDO ON':'🔈 SONIDO';soundButton.setAttribute('aria-pressed',String(!!window._queondaAudioOn));if(window._queondaAudioOn)playTone(true)};
document.querySelector('.meta')?.appendChild(soundButton);
render();
