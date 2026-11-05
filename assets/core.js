/* ==========================================================
   數據中台管理系統 · 原型公共運行庫
   被 dmp.html / rule.html 共用；修改此處會同時影響兩端
   ========================================================== */

const VERSION='V1.1.0';
const BUILD_DATE='2026-11-05';
const BASE_REF='V1.5.5';

const ICONS={
  dashboard:'<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>',
  tree:'<path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor"/>',
  shop:'<path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  gear:'<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  user:'<circle cx="12" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 20c.7-3.6 3.7-5.6 7.5-5.6s6.8 2 7.5 5.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  doc:'<path d="M6 3h8l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3v4h4M9 12h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  chevron:'<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  close:'<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  lock:'<rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 10V7.5a4 4 0 018 0V10" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  eyeOff:'<path d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M6.5 6.6C4.6 7.8 3.2 9.7 2.5 12c1.6 4 5.1 6.5 9.5 6.5 1.9 0 3.6-.5 5-1.4M9.9 5.7c.7-.2 1.4-.2 2.1-.2 4.4 0 7.9 2.5 9.5 6.5-.5 1.2-1.1 2.3-1.9 3.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  eye:'<path d="M2.5 12C4.1 8 7.6 5.5 12 5.5S19.9 8 21.5 12c-1.6 4-5.1 6.5-9.5 6.5S4.1 16 2.5 12z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  plus:'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  check:'<path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  warn:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5v5.5M12 16.4v.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  info:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5.5M12 7.6v.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 01-8 0V4z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 5H5v2a3 3 0 003 3M16 5h3v2a3 3 0 01-3 3M10 17h4M9 20h6M12 13v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  file:'<path d="M6 3h8l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3v4h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  clock:'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  pause:'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.5 9v6M13.5 9v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5 9-5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M15 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h3" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  grid:'<path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" fill="currentColor" opacity=".85"/>',
  list:'<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  logout:'<path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M10 8l-4 4 4 4M6 12h9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  globe:'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5S14.4 18.2 12 20.5C9.6 18.2 8.4 15.2 8.4 12S9.6 5.8 12 3.5z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  book:'<path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 3v18" stroke="currentColor" stroke-width="1.7"/>',
  box:'<path d="M3 8l9-4 9 4-9 4-9-4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 8v8l9 4 9-4V8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  history:'<path d="M4 4v5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6 14a8 8 0 1015.2-4.4A8 8 0 005 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 8v4.5l3 1.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  wifi:'<path d="M2 8.5a15 15 0 0120 0M5 12a10.5 10.5 0 0114 0M8.5 15.5a5.5 5.5 0 017 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/>',
  shield:'<path d="M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  inbox:'<path d="M3 12l3-7h12l3 7v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3 12h5l1 2h6l1-2h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  refresh:'<path d="M4 4v5h5M20 20v-5h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6 14a8 8 0 0013.4 3M19.4 10A8 8 0 006 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  moon:'<path d="M20.5 14.3A8.5 8.5 0 019.7 3.5a8.5 8.5 0 1010.8 10.8z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  google:'<path d="M21 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.1a4.4 4.4 0 01-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7.1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 21.5c2.4 0 4.4-.8 5.9-2.2l-3.1-2.4c-.8.6-1.9.9-2.8.9-2.2 0-4-1.5-4.7-3.5H4.1v2.5A9.5 9.5 0 0012 21.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7.3 14.3a5.7 5.7 0 010-4.6V7.2H4.1a9.5 9.5 0 000 9.6l3.2-2.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 6.3c1.3 0 2.5.5 3.4 1.3l2.7-2.7A9.5 9.5 0 004.1 7.2l3.2 2.5c.7-2 2.5-3.4 4.7-3.4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  chevronRight:'<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
};
function icon(n,s){return '<svg width="'+(s||16)+'" height="'+(s||16)+'" viewBox="0 0 24 24" fill="none" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function statusBadge(s){
  const m={live:['d-live','進行中'],created:['d-created','已創建'],ended:['d-ended','已結束'],on:['d-on','已控'],off:['d-off','未控'],pending:['d-pending','待處理']}[s]||['d-off',s];
  return '<span class="dot-badge"><span class="d '+m[0]+'"></span>'+m[1]+'</span>';
}
function toast(msg,type){
  const root=document.getElementById('toast-root');
  const el=document.createElement('div');
  el.className='toast '+(type||'ok');
  const ic=type==='err'?'warn':(type==='info'?'info':'check');
  el.innerHTML='<span class="ti">'+icon(ic,15)+'</span><span>'+esc(msg)+'</span>';
  root.appendChild(el);
  setTimeout(function(){
    el.style.transition='.2s';el.style.opacity='0';el.style.transform='translateY(-6px)';
    setTimeout(function(){el.remove();},220);
  },2200);
}

let modalStack=[];
function openModal(html,opts){
  opts=opts||{};
  const root=document.getElementById('modal-root');
  const wrap=document.createElement('div');
  wrap.className='modal-mask';wrap.innerHTML=html;
  root.appendChild(wrap);modalStack.push(wrap);
  wrap.addEventListener('mousedown',function(e){if(e.target===wrap&&!opts.locked)closeModal();});
  document.body.style.overflow='hidden';
  const f=wrap.querySelector('input:not([readonly]),textarea');
  if(f)setTimeout(function(){f.focus();},60);
  return wrap;
}
function closeModal(){
  const w=modalStack.pop();
  if(w)w.remove();
  if(!modalStack.length)document.body.style.overflow='';
  // 彈窗關閉時清理驗證碼倒計時，避免殘留計時器
  if(typeof stopMfaCountdown==='function' && !document.getElementById('mfa-code')) stopMfaCountdown();
}
function modalShell(o){
  return '<div class="modal '+(o.size||'')+'"><div class="modal-head"><div class="modal-title">'+o.title+'</div>'+
    '<button class="modal-close" onclick="closeModal()">'+icon('close',15)+'</button></div>'+
    '<div class="modal-body">'+o.body+'</div>'+
    (o.foot===false?'':'<div class="modal-foot">'+(o.foot||'')+'</div>')+'</div>';
}
function pager(total,page){
  page=page||1;let nums='';
  [1,2,3,4,5].forEach(function(n){
    nums+='<span class="pg '+(n===page?'active':'')+'" onclick="toast(\'原型示意：切換至第 '+n+' 頁\',\'info\')">'+n+'</span>';
  });
  nums+='<span class="pg disabled">…</span><span class="pg" onclick="toast(\'原型示意：末頁\',\'info\')">'+total+'</span>';
  return '<div class="pager"><span class="total">合共 '+total+' 條</span>'+
    '<span class="pg disabled">'+icon('chevron',12)+'</span>'+nums+
    '<span class="pg">'+icon('chevron',12)+'</span>'+
    '<select><option>20 條 / 頁</option><option>50 條 / 頁</option><option>100 條 / 頁</option></select>'+
    '<span class="jump">前往 <input value="1" /></span></div>';
}

