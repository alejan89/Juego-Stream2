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
 return '<div class="person-grid">'+Array.from({length:10},(_,i)=>'<button type="button" data-person="'+i+'" class="person'+(chosen.includes(i)?' selected':'')+'" '+(isConfirmed()?'disabled':'')+' aria-label="Persona consultada '+(i+1)+'" aria-pressed="'+chosen.includes(i)+'"><span aria-hidden="true" class="student-avatar"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="6"/><path d="M3 30v-3c0-7 5-11 13-11s13 4 13 11v3z"/></svg></span><small>'+(i+1)+'</small></button>').join('')+'</div><div class="count" role="status">'+chosen.length+' DE 10 TARJETAS MARCADAS</div>';
}
function factHTML(st){return '<div class="facts">'+st.facts.map(([big,txt])=>'<div class="fact"><strong>'+escapeText(big)+'</strong><span>'+escapeText(txt)+'</span></div>').join('')+'</div>'+(st.bottom?'<div class="bottom-note">'+escapeText(st.bottom)+'</div>':'');}
function getFeedback(st){
 const result=checked[current]; if(!result)return '';
 const type=result.good?'good':result.neutral?'':'try';
 let msg=st.feedback||'';
 if(!result.good&&!result.neutral){
  if(st.type==='single')msg='PARA REVISAR: '+msg+' LA OPCIÓN ADECUADA ES: «'+st.options[st.correct]+'».';
  else if(st.type==='multi')msg='PARA REVISAR: '+msg+' RESPUESTAS QUE CORRESPONDEN: '+st.correct.map(i=>st.options[i]).join(' · ')+'.';
 }
 return '<div class="feedback '+type+'" role="status">'+escapeText(msg)+'</div>';
}
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
 panel+=getFeedback(st);
 if(st.type==='outro')panel+='<div class="finish">¡DESAFÍO COMPLETADO!</div>';
 panel+='<div class="controls">';
 if(current>0)panel+='<button class="secondary" type="button" id="back">VOLVER</button>';
 if(done||['reveal','outro'].includes(st.type)){
  panel+='<button class="action" type="button" id="next">'+(current===STEPS.length-1?'VOLVER A JUGAR':'CONTINUAR')+'</button>';
 }else{
  const label=st.type==='poll'?'CONTINUAR SIN CALIFICACIÓN':st.type==='counter'?'COMPROBAR 8 DE 10':st.type==='rewrite'?'VER EJEMPLO DE REESCRITURA':'COMPROBAR RESPUESTA';
  const hasSelection=(st.type==='rewrite')||((selected[current]||[]).length>0)||(typeof selected[current]==='number');
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
 const rewrite=$('rewrite'); if(rewrite)rewrite.oninput=(e)=>{rewriteText=e.target.value};
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
  checked[current]={good,neutral};delete notes[current];render();scrollToTop();
 };
}
function scrollToTop(){try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}}
render();
