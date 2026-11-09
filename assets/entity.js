/* ==================================================================
   多源實體標識庫 · 原型數據與頁面（V1.4.0）
   數據取自 entity-lib/deliverables/多源静态资源库_数据字典.xlsx
   與 entity-lib/data/ 去重測試集，全部為源側原值，不譯名、不補寫
   ================================================================== */

/* 上位名稱展示詞典（展示層，不入庫；源見 deliverables/league_code_zh.csv）
   parent_name 值域不限於聯賽：加密資產為 Crypto，電競為遊戲分部碼 kog / lol / ow / csgo / r6siege */
const PARENT_ZH={
  epl:'英格蘭超級聯賽',fl1:'法國甲級聯賽',lal:'西班牙甲級聯賽',ere:'荷蘭甲級聯賽',
  ucl:'歐洲冠軍聯賽',uel:'歐霸盃',col:'歐戰混編',efl:'英格蘭足球聯賽',sea:'意大利甲級聯賽',
  bun:'德國甲級聯賽',bl2:'德國乙級聯賽',spl:'沙特聯賽',chi:'中國足球超級聯賽',
  nba:'NBA',nfl:'NFL',nhl:'NHL',cfb:'大學橄欖球',ufc:'UFC',atp:'ATP 網球',
  wta:'WTA 網球',itf:'ITF 網球',csgo:'CS:GO',lol:'英雄聯盟',dota2:'Dota 2',
  ow:'鬥陣特攻',kog:'王者榮耀',r6siege:'虹彩六號',euroleague:'歐洲籃球聯賽',
  crint:'板球國際賽',cafcl:'非洲冠軍聯賽',col1:'哥倫比亞甲級聯賽',elc:'英格蘭冠軍聯賽',
  es2:'西班牙乙級聯賽',est1:'愛沙尼亞甲級聯賽',bra:'巴西甲級聯賽',bul:'保加利亞甲級聯賽',
  aus:'澳洲超級聯賽',aze1:'阿塞拜疆超級聯賽',bel1:'比利時甲級聯賽',bkcba:'CBA',
  bkisrsl:'以色列籃球聯賽',bkkbl:'韓國 KBL',bknbl:'澳洲 NBL',fr2:'法國乙級聯賽',
  'atp-doubles':'ATP 雙打',Crypto:'加密資產'
};
function parentZh(c){ return PARENT_ZH[c]||c||'–'; }
/* 上位名稱展示：無中文譯名時（如 Sports / Esports）不重複輸出
   收斂實體的上位名稱是多個賽事，按數組橫向並列 */
function parentLabel(c){
  if(Array.isArray(c)){
    return '<span style="display:inline-flex;flex-wrap:wrap;gap:4px 10px;align-items:center">'+
      c.map(function(x){
        const zh=parentZh(x);
        return '<span style="display:inline-flex;align-items:center;gap:4px">'+
          '<span class="chip">'+esc(x)+'</span>'+
          (zh===x?'':'<span class="muted" style="font-size:11px">'+esc(zh)+'</span>')+'</span>';
      }).join('')+'</span>';
  }
  const zh=parentZh(c);
  return '<span class="chip">'+esc(c)+'</span>'+(zh===c?'':' <span class="muted" style="font-size:11px">'+esc(zh)+'</span>');
}
/* 收斂實體：一個實體下掛多個源側編號（同平台多編號來自多賽事，跨平台來自多源對齊） */
function relList(id){
  return RELATIONS.filter(function(r){return r[2]===id;});
}
function sidSame(e){
  const id=e[ECOL.ID],src=e[ECOL.SRC],main=e[ECOL.SID];
  return relList(id).filter(function(r){return r[0]===src&&r[1]!==main;}).map(function(r){return r[1];});
}
function sidCell(e){
  const same=sidSame(e);
  const nums=[e[ECOL.SID]].concat(same).map(function(v){return '<span class="num">'+esc(v)+'</span>';}).join('<span class="muted" style="margin:0 4px">·</span>');
  return '<span style="font-size:11px;color:var(--text-sub)">'+esc(e[ECOL.SRC])+'<br/>'+nums+'</span>';
}
function sidBlock(e){
  const list=relList(e[ECOL.ID]);
  if(!list.length)return '<span class="muted">–</span>';
  return '<div style="display:flex;flex-direction:column;gap:6px">'+list.map(function(r){
    const warn=r[3]==='收斂命中'||r[3]==='重定向命中';
    return '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'+
      '<span class="chip chip-line" style="font-size:11px">'+esc(r[0])+'</span>'+
      '<span class="num" style="font-size:12px">'+esc(r[1])+'</span>'+
      '<span class="chip '+(warn?'chip-blue':'chip-gray')+'" style="font-size:11px">'+esc(r[3])+'</span>'+
      '<span class="muted" style="font-size:11px">'+esc(r[4])+'</span></div>';
  }).join('')+'</div>';
}

/* 01_entity 13 字段節選（1,019 行中取 37 條：28 隊伍 / 6 聯賽 / 1 選手 / 2 加密資產，
   含收斂組、跨源對齊與四類實體樣本），列序與數據字典一致：
   0 entity_id 實體ID · 1 entity_type 實體類別 · 2 name 名稱 · 3 slug 歸一化名
   4 aliases 別名 · 5 abbreviation 縮寫 · 6 logo_url 標誌地址 · 7 parent_name 上位名稱
   8 source_code 主源平台 · 9 source_id 主源側ID · 10 source_ids 其餘平台ID
   11 updated_at 更新時間 · 12 data_status 數據狀態 */
const ECOL={ID:0,TYPE:1,NAME:2,SLUG:3,ALIAS:4,ABBR:5,LOGO:6,PARENT:7,SRC:8,SID:9,SIDS:10,UPD:11,STAT:12};
/* 標誌地址共用前綴，源側原值即為此前綴 + 路徑 */
const LOGO_BASE='https://polymarket-upload.s3.us-east-2.amazonaws.com/';
const TS='2026-11-04 00:00:00';
const ENTITIES=[
  ['100014',1,'AC Monza','ac-monza',['Monza'],'mon',LOGO_BASE+'sea_monza.png','sea','polymarket','101112',{'predict':'122177846'},TS,1],
  ['100016',1,'ACF Fiorentina','acf-fiorentina',['Fiorentina'],'fio',LOGO_BASE+'sea_fiorentina.png','sea','polymarket','101110',{'predict':'231'},TS,1],
  ['100018',1,'AFC Ajax','afc-ajax',['Ajax','Amsterdamsche FC'],'aja',LOGO_BASE+'AFC Ajax-e0170dbdcc.png',['ere','col'],'polymarket','115285',null,TS,1],
  ['100021',1,'AFC Bournemouth','afc-bournemouth',['Bournemouth'],'bou',LOGO_BASE+'AFC Bournemouth-f075521cbf.png',['epl','uel'],'polymarket','100010',{'predict':'2227'},TS,1],
  ['100026',1,'AS Monaco FC','as-monaco-fc',['Monaco'],'asm',LOGO_BASE+'AS Monaco FC-dbed9850c0.png','fl1','polymarket','114312',{'predict':'2052'},TS,1],
  ['100034',3,'Aaron Pico','aaron-pico',null,'aar8',LOGO_BASE+'team_logos/mma/aaron_pico.png','ufc','polymarket','214638',{'predict':'142058'},TS,1],
  ['100076',1,'Arsenal FC','arsenal-fc',['Arsenal'],'ars',LOGO_BASE+'Arsenal FC-c2e42b7ef6.png',['epl','ucl'],'polymarket','100005',null,TS,1],
  ['100373',1,'JD Gaming','jd-gaming',null,'jdg',LOGO_BASE+'team_logos/esports/kog/jd gaming-KhnmsJPveYvf.png','kog','polymarket','229221',{'predict':'86430363'},TS,1],
  ['100374',1,'JD Gaming','jd-gaming',null,'jdg',LOGO_BASE+'team_logos/ow/jd-gaming-138011.png','ow','polymarket','3266407',null,TS,1],
  ['100413',1,'LOS','los',null,'los',LOGO_BASE+'team_logos/esports/lol/league-of-legends_los_133796.png','lol','polymarket','145272',null,TS,1],
  ['100414',1,'LOS','los',null,'los',LOGO_BASE+'team_logos/r6siege/los-135639.png','r6siege','polymarket','3267140',null,TS,1],
  ['100462',1,'Manchester United FC','manchester-united-fc',null,'mnu',LOGO_BASE+'team_logos/soccer/ucl/ucl_mnu_90000517.png','ucl','polymarket','147331',null,TS,1],
  ['100463',1,'Manchester United FC','manchester-united-fc',['Man Utd','Man United','Manchester Utd'],'mun',LOGO_BASE+'Manchester United FC-05ec8891f0.png','epl','polymarket','100016',{'predict':'983'},TS,1],
  ['100493',1,'NEC','nec',null,'nec',LOGO_BASE+'NEC-819f06f2b0.png',['ere','uel'],'polymarket','115294',null,TS,1],
  ['100531',1,'Olympique Lyonnais','olympique-lyonnais',['Lyon'],'lyo',LOGO_BASE+'Olympique Lyonnais-e213170dc9.png',['fl1','uel'],'polymarket','114309',{'predict':'84'},TS,1],
  ['100546',1,'Paris Saint-Germain FC','paris-saint-germain-fc',['PSG','Paris SG','Paris Saint Germain FC'],'psg',LOGO_BASE+'Paris Saint-Germain FC-a86bd04a57.png',['fl1','ucl'],'polymarket','114315',{'predict':'1055'},TS,1],
  ['100579',1,'Racing Club de Lens','racing-club-de-lens',['Lens'],'rcl',LOGO_BASE+'Racing Club de Lens-df0b6d84b8.png',['fl1','ucl'],'polymarket','114306',null,TS,1],
  ['100588',1,'Real Madrid CF','real-madrid-cf',['Real Madrid'],'rea',LOGO_BASE+'Real Madrid CF-766f4e0266.png','lal','polymarket','101034',{'predict':'38'},TS,1],
  ['100589',1,'Real Madrid CF','real-madrid-cf',['Real Madrid'],'rma',LOGO_BASE+'team_logos/soccer/ucl/ucl_rma_90000605.png','ucl','polymarket','147404',null,TS,1],
  ['100735',1,'Virtus.pro','virtuspro',null,'vp',LOGO_BASE+'team_logos/esports/cs2/Virtus.pro-0cCdstQcJAO7.png','csgo','polymarket','177438',null,TS,1],
  ['100736',1,'Virtus.pro','virtuspro',null,'vp',LOGO_BASE+'team_logos/esports/ow/virtus.pro.png','ow','polymarket','3265436',null,TS,1],
  ['100810',1,'Arsenal FC','arsenal-fc',null,'ars',null,'efl','predict','284406',null,TS,1],
  ['100954',4,'BTC','btc',null,null,null,'Crypto','predict','BTCUSDT',null,TS,1],
  ['100955',4,'ETH','eth',null,null,null,'Crypto','predict','ETHUSDT',null,TS,1],
  ['100975',2,'csgo','csgo',null,null,null,'Esports','polymarket','csgo',null,TS,1],
  ['100979',2,'epl','epl',null,null,null,'Sports','polymarket','epl',null,TS,1],
  ['100984',2,'fl1','fl1',null,null,null,'Sports','polymarket','fl1',null,TS,1],
  ['100992',2,'kog','kog',null,null,null,'Esports','polymarket','kog',null,TS,1],
  ['101008',2,'sea','sea',null,null,null,'Sports','polymarket','sea',null,TS,1],
  ['101013',2,'ucl','ucl',null,null,null,'Sports','polymarket','ucl',null,TS,1]
];
const ETYPE={1:'隊伍',2:'聯賽',3:'選手',4:'加密資產'};
function etype(t){return ETYPE[t]||t;}
/* data_status 取值按字典固化；樣本 37 條全部為 1 */
function dstatus(v){
  const n=Number(v);
  if(n===1)return '<span class="chip chip-blue">啟用</span>';
  if(n===0)return '<span class="chip chip-gray">停用</span>';
  return '<span class="chip chip-gray">'+esc(String(v))+'</span>';
}
/* 標誌地址：加載失敗時回退為首字母色塊 */
const LOGO_TINT=['#eaf1ff','#2f6bf6'];
function logoCell(e){
  const t=LOGO_TINT;
  const ini=(String(e[ECOL.NAME]).replace(/[^0-9A-Za-z]/g,'').slice(0,2)||'?').toUpperCase();
  const img=e[ECOL.LOGO]
    ? '<img src="'+encodeURI(e[ECOL.LOGO])+'" alt="" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:contain;padding:4px;box-sizing:border-box" onerror="this.remove()"/>'
    : '';
  return '<span style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;background:'+t[0]+';color:'+t[1]+';font-size:11px;font-weight:600;overflow:hidden;flex:none">'+ini+img+'</span>';
}
function aliasCell(a){
  if(!a||!a.length)return '<span class="muted">–</span>';
  const shown=a.slice(0,2).map(function(x){return '<span class="chip chip-line" style="font-size:11px">'+esc(x)+'</span>';}).join('');
  const more=a.length>2?'<span class="muted" style="font-size:11px">+'+(a.length-2)+'</span>':'';
  return '<span title="別名共 '+a.length+' 個：'+esc(a.join('、'))+'" style="display:inline-flex;flex-wrap:wrap;gap:4px;align-items:center">'+shown+more+'</span>';
}
/* 詳情用：別名全量展開 + 數量 */
function aliasAll(a){
  if(!a||!a.length)return '<span class="muted">–</span>';
  return '<span style="display:inline-flex;flex-wrap:wrap;gap:4px">'+
    a.map(function(x){return '<span class="chip chip-line" style="font-size:11px">'+esc(x)+'</span>';}).join('')+'</span>'+
    '<span class="muted" style="font-size:11px;margin-left:6px">共 '+a.length+' 個</span>';
}
/* 編輯用：可增刪的別名標籤組，多值示意 */
function aliasTag(v){
  return '<span class="chip chip-line" style="font-size:11px">'+esc(v)+
    '<span style="margin-left:6px;cursor:pointer;color:var(--text-help)" title="移除" onclick="this.parentNode.remove()">×</span></span>';
}
function aliasEditor(a){
  const chips=(a||[]).map(aliasTag).join('');
  return '<div class="field"><label class="field-label">別名 <span class="muted" style="font-size:11px;font-weight:400">可多個</span></label>'+
    '<div id="el-alias-box" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;border:1px solid var(--border);border-radius:6px;padding:8px 8px;min-height:38px;background:#fff">'+
      chips+
      '<input id="el-alias-in" style="border:0;outline:0;flex:1;min-width:130px;font-size:12px;background:transparent" placeholder="輸入別名後回車" onkeydown="if(event.key===\'Enter\'){event.preventDefault();elAliasAdd();}" />'+
    '</div>'+
    '<div style="margin-top:6px"><span class="btn-text" onclick="elAliasAdd()">+ 添加別名</span></div>'+
    '<div class="muted" style="font-size:11px;margin-top:4px">別名以數組存儲，容納多平台多寫法；僅在歸一化名精確匹配落空時按數組精確命中，不參與業務展示。</div></div>';
}
function elAliasAdd(){
  const box=document.getElementById('el-alias-box'), inp=document.getElementById('el-alias-in');
  if(!box||!inp)return;
  const v=(inp.value||'').trim();
  if(v){
    const tmp=document.createElement('span'); tmp.innerHTML=aliasTag(v);
    box.insertBefore(tmp.firstChild,inp); inp.value=''; inp.focus(); return;
  }
  /* 空值時新增一個待輸入位：點擊即有可見結果，輸入回車轉為標籤，失焦即收回 */
  const pending=box.querySelector('.alias-pending');
  if(pending){ pending.focus(); return; }
  const el=document.createElement('input');
  el.className='alias-pending';
  el.type='text';
  el.placeholder='輸入別名';
  el.setAttribute('aria-label','新別名');
  el.style.cssText='border:1px solid var(--border-accent);outline:0;min-width:104px;font:inherit;font-size:12px;background:#fff;border-radius:var(--r-sm);padding:2px 8px;height:22px';
  el.onkeydown=function(ev){
    if(ev.key==='Enter'){ ev.preventDefault(); elAliasCommit(el); }
  };
  el.onblur=function(){ if(el.value.trim()) elAliasCommit(el,false); else el.remove(); };
  box.insertBefore(el,inp);
  el.focus();
}
function elAliasCommit(el,refocus){
  const v=(el.value||'').trim();
  const box=document.getElementById('el-alias-box');
  if(!box)return;
  if(v){
    const tmp=document.createElement('span'); tmp.innerHTML=aliasTag(v);
    box.insertBefore(tmp.firstChild,el);
  }
  el.remove();
  if(refocus!==false){
    const inp=document.getElementById('el-alias-in');
    if(inp) inp.focus();
  }
}
function sidsCell(o){
  if(!o)return '<span class="muted">–</span>';
  const ks=Object.keys(o);
  if(!ks.length)return '<span class="muted">–</span>';
  return ks.map(function(k){
    return '<span class="chip chip-line" style="font-size:11px">'+esc(k)+'</span> <span class="num" style="color:var(--text-sub)">'+esc(String(o[k]))+'</span>';
  }).join(' ');
}

/* 關係記錄（源側編號 → 實體標識，含命中方式） */
const RELATIONS=[
  ['polymarket','100005','100076','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:12:31','清洗服務','128'],
  ['polymarket','147325','100076','收斂命中','epl + ucl 國內/洲際白名單','2026-11-04 09:12:31','清洗服務','64'],
  ['predict','284406','100810','初始建庫','簽字清單','2026-11-04 08:00:00','初始建庫','22'],
  ['polymarket','114315','100546','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:14:02','清洗服務','97'],
  ['polymarket','147399','100546','收斂命中','fl1 + ucl 國內/洲際白名單','2026-11-04 09:14:02','清洗服務','51'],
  ['polymarket','115285','100018','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:15:44','清洗服務','83'],
  ['polymarket','177573','100018','收斂命中','ere + col 國內/洲際白名單','2026-11-04 09:15:44','清洗服務','39'],
  ['polymarket','115294','100493','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:16:20','清洗服務','71'],
  ['polymarket','3288540','100493','收斂命中','ere + uel 國內/洲際白名單','2026-11-04 09:16:20','清洗服務','36'],
  ['polymarket','100010','100021','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:17:10','清洗服務','112'],
  ['polymarket','3288538','100021','收斂命中','epl + uel 國內/洲際白名單','2026-11-04 09:17:10','清洗服務','41'],
  ['polymarket','114309','100531','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:18:52','清洗服務','88'],
  ['polymarket','147682','100531','收斂命中','fl1 + uel 國內/洲際白名單','2026-11-04 09:18:52','清洗服務','44'],
  ['polymarket','114306','100579','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:19:30','清洗服務','63'],
  ['polymarket','147576','100579','收斂命中','fl1 + ucl 國內/洲際白名單','2026-11-04 09:19:30','清洗服務','29'],
  ['polymarket','229221','100373','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:20:05','清洗服務','58'],
  ['polymarket','3266407','100374','衝突新建','電競跨遊戲各自獨立（分部級）','2026-11-04 09:20:05','清洗服務','31'],
  ['polymarket','100016','100463','直接命中','名稱歸一化 + 縮寫','2026-11-04 09:22:18','清洗服務','104'],
  ['polymarket','147331','100462','衝突新建','同名縮寫不一致（mnu / mun）','2026-11-04 09:22:18','清洗服務','27'],
  ['predict','2052','100026','直接命中','跨源對齊','2026-11-04 09:25:36','清洗服務','76'],
  ['predict','142058','100034','直接命中','跨源對齊','2026-11-04 09:25:36','清洗服務','19'],
  ['predict','BTCUSDT','100954','初始建庫','簽字清單','2026-11-04 08:00:00','初始建庫','14']
];
/* 批量查詢結果（提交 12 條，已找到 9 / 未找到 3） */
const BATCH_RESULT=[
  ['polymarket','100005','100076','Arsenal FC','—','已找到','直接命中'],
  ['polymarket','147325','100076','Arsenal FC','—','已找到','收斂命中'],
  ['polymarket','114315','100546','Paris Saint-Germain FC','—','已找到','直接命中'],
  ['polymarket','100010','100021','AFC Bournemouth','—','已找到','直接命中'],
  ['predict','2052','100026','AS Monaco FC','—','已找到','直接命中'],
  ['predict','2227','100021','AFC Bournemouth','—','已找到','直接命中'],
  ['polymarket','229221','100373','JD Gaming','—','已找到','直接命中'],
  ['polymarket','100016','100463','Manchester United FC','—','已找到','直接命中'],
  ['predict','BTCUSDT','100954','BTC','—','已找到','初始建庫'],
  ['polymarket','999999','—','—','不存在','未找到','—'],
  ['predict','888888','—','—','格式錯誤','未找到','—'],
  ['polymarket','777777','—','—','未知編號體系','未找到','—']
];
/* 收斂判定明細（8 組合併 + 3 組各自獨立） */
const CONVERGE=[
  ['Arsenal FC','ars','epl / ucl','國內 + 洲際','合併','100076'],
  ['Paris Saint-Germain FC','psg','fl1 / ucl','國內 + 洲際','合併','100546'],
  ['Villarreal CF','vil','lal / ucl','國內 + 洲際','合併','100732'],
  ['AFC Ajax','aja','ere / col','國內 + 洲際','合併','100018'],
  ['Olympique Lyonnais','lyo','fl1 / uel','國內 + 洲際','合併','100531'],
  ['NEC','nec','ere / uel','國內 + 洲際','合併','100493'],
  ['AFC Bournemouth','bou','epl / uel','國內 + 洲際','合併','100021'],
  ['Racing Club de Lens','rcl','fl1 / ucl','國內 + 洲際','合併','100579'],
  ['JD Gaming','jdg','kog / ow','電競跨遊戲','各自獨立','100373 · 100374'],
  ['LOS','los','lol / r6siege','電競跨遊戲','各自獨立','100413 · 100414'],
  ['Virtus.pro','vp','csgo / ow','電競跨遊戲','各自獨立','100735 · 100736']
];
/* 去重測試集（兩平台相似事件，標題餘弦 + 結束時間接近度） */
const DEDUP_PAIRS=[
  ['Sports','AS Monaco FC vs. Lille OSC','598148','AS Monaco FC vs. Lille OSC','1174962','AS Monaco FC vs. Lille OSC','1.0000','2026-10-25 16:00','2026-10-25 14:00'],
  ['Sports','FC Barcelona vs. Real Madrid CF','598621','FC Barcelona vs. Real Madrid CF','1175548','FC Barcelona vs. Real Madrid CF','1.0000','2026-10-25 22:00','2026-10-25 20:00'],
  ['Sports','FC Barcelona vs. Real Madrid CF','598613','FC Barcelona vs. Real Madrid CF - Exact Score','1175556','FC Barcelona vs. Real Madrid CF - Exact Score','1.0000','2026-10-25 22:00','2026-10-25 20:00'],
  ['Sports','FC Barcelona vs. Real Madrid CF','598792','FC Barcelona vs. Real Madrid CF - More Markets','1175738','FC Barcelona vs. Real Madrid CF - More Markets','1.0000','2026-10-25 22:00','2026-10-25 20:00'],
  ['Sports','FC Internazionale Milano vs. ACF Fiorentina','597246','FC Internazionale Milano vs. ACF Fiorentina','1173929','FC Internazionale Milano vs. ACF Fiorentina','1.0000','2026-10-25 13:30','2026-10-25 11:30'],
  ['Sports','Liverpool FC vs. Brighton & Hove Albion FC','598116','Liverpool FC vs. Brighton & Hove Albion FC','1174996','Liverpool FC vs. Brighton & Hove Albion FC','1.0000','2026-10-25 16:00','2026-10-25 14:00'],
  ['Sports','Manchester United FC vs. AFC Bournemouth','598127','Manchester United FC vs. AFC Bournemouth','1175015','Manchester United FC vs. AFC Bournemouth','1.0000','2026-10-25 16:00','2026-10-25 14:00'],
  ['Sports','Hull City AFC vs. Brentford FC','598108','Hull City AFC vs. Brentford FC','1175028','Hull City AFC vs. Brentford FC','1.0000','2026-10-25 16:00','2026-10-25 14:00'],
  ['Sports','Sunderland AFC vs. Leeds United FC','598148','AS Monaco FC vs. Lille OSC','1175038','Sunderland AFC vs. Leeds United FC','0.1280','2026-10-25 16:00','2026-10-25 16:30'],
  ['Sports','FC Barcelona vs. Real Madrid CF','598621','FC Barcelona vs. Real Madrid CF','1175738','FC Barcelona vs. Real Madrid CF - More Markets','0.8905','2026-10-25 22:00','2026-10-25 20:00'],
  ['Sports','FC Barcelona vs. Real Madrid CF','598621','FC Barcelona vs. Real Madrid CF','1175556','FC Barcelona vs. Real Madrid CF - Exact Score','0.8552','2026-10-25 22:00','2026-10-25 20:00'],
  ['Sports','Manchester United FC vs. AFC Bournemouth','598127','Manchester United FC vs. AFC Bournemouth','1175323','Manchester United FC vs. AFC Bournemouth - More Markets','0.9131','2026-10-25 16:00','2026-10-25 14:00']
];

/* 本地檢索狀態 */
const EL={kw:'',type:'',parent:'',stat:'1',tab:'found',batchTab:'found',dedupScore:'0.8'};
function elSet(k,v){EL[k]=v;renderShell();}
function elReset(){EL.kw='';EL.type='';EL.parent='';EL.stat='1';renderShell();}

/* ---------- 頁面：實體標識庫總覽 ---------- */
function pageEntityDashboard(){
  const stat=[
    ['實體總量','1,019','件','layers','#2f6bf6','#eaf1ff'],
    ['隊伍','866','件','trophy','#2f6bf6','#eaf1ff'],
    ['選手','86','件','user','#2f6bf6','#eaf1ff'],
    ['衝突新建','12','件','warn','#2f6bf6','#eaf1ff'],
    ['跨源對齊','185','條','refresh','#2f6bf6','#eaf1ff'],
    ['聯賽碼變動','0','件','clock','#2f6bf6','#eaf1ff']
  ];
  const cards='<div class="cards-row" style="grid-template-columns:repeat(6,1fr)">'+
    stat.map(function(s){
      return '<div class="card" style="padding:14px 16px"><div style="display:flex;align-items:center;gap:8px;color:var(--text-help);font-size:12px">'+
        '<span style="width:26px;height:26px;border-radius:6px;background:'+s[5]+';color:'+s[4]+';display:flex;align-items:center;justify-content:center">'+icon(s[3],16)+'</span>'+s[0]+'</div>'+
        '<div style="font-size:24px;font-weight:600;margin-top:8px;font-variant-numeric:tabular-nums">'+s[1]+'<span style="font-size:12px;color:var(--text-help);font-weight:400;margin-left:4px">'+s[2]+'</span></div></div>';
    }).join('')+'</div>';
  const typeRows=[['隊伍','866','85.0%'],['聯賽','64','6.3%'],['選手','86','8.4%'],['加密資產','3','0.3%']];
  const dist='<div class="card"><div class="card-head"><div class="card-title">實體類型分佈</div></div>'+
    '<div style="display:flex;flex-direction:column;gap:12px">'+
    typeRows.map(function(r){
      const w=parseFloat(r[2]);
      return '<div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-sub);margin-bottom:6px"><span>'+r[0]+'</span><span class="num">'+r[1]+' 條 · '+r[2]+'</span></div>'+
        '<div style="height:8px;border-radius:4px;background:var(--bg-hover);overflow:hidden"><div style="height:100%;width:'+Math.max(w,2)+'%;border-radius:4px;background:#2f6bf6"></div></div></div>';
    }).join('')+'</div></div>';
  const flow=[['① 採集','拉取 Polymarket / predict.fun 事件與市場'],['② 清洗','解析源數據，產出實體鍵清單'],['③ 出庫','FR-05 批量取標識'],['④ 關係記錄','FR-06 標記對應關係'],['⑤ 補錄','FR-01 + FR-02 入庫'],['⑥ 寫入業務庫','清洗流程落庫']];
  const chain='<div class="card"><div class="card-head"><div class="card-title">端到端鏈路</div></div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">'+
    flow.map(function(f,i){
      return '<div style="background:var(--bg-soft);border:1px solid var(--border);border-radius:8px;padding:10px 12px;min-width:120px">'+
        '<div style="font-weight:600;font-size:13px;color:var(--text)">'+f[0]+'</div>'+
        '<div style="font-size:11px;color:var(--text-help);margin-top:4px;line-height:1.5">'+f[1]+'</div></div>'+
        (i<flow.length-1?'<span style="color:var(--text-disabled)">'+icon('chevronRight',12)+'</span>':'');
    }).join('')+'</div>'+
    '<div class="alert-tip" style="margin-top:14px"><span class="i">'+icon('info',16)+'</span><span>出庫在入庫之前，同一批數據先查後錄；庫內數據為準，快取失效上限 60 秒。</span></div></div>';
  return '<div class="card"><div class="card-head"><div class="card-title" style="font-size:16px">多源實體標識庫</div>'+
    '<span class="chip chip-line">MVP · 六項 P0 功能</span></div>'+
    '<p style="color:var(--text-sub);font-size:13px;line-height:1.8">為清洗流程提供「這條數據屬於哪個實體」的唯一標識。匹配只做三元組精確匹配與已建立的收斂關係，不做模糊匹配。</p></div>'+
    cards+'<div class="grid-2" style="margin-top:14px">'+dist+chain+'</div>';
}

/* ---------- 頁面：實體列表 · FR-07 ---------- */
function pageEntityList(){
  const kw=EL.kw.trim().toLowerCase();
  const rows=ENTITIES.filter(function(e){
    if(EL.type&&String(e[ECOL.TYPE])!==EL.type)return false;
    if(EL.parent){
      const ps=Array.isArray(e[ECOL.PARENT])?e[ECOL.PARENT]:[e[ECOL.PARENT]];
      if(ps.indexOf(EL.parent)<0&&ps.map(parentZh).indexOf(EL.parent)<0)return false;
    }
    if(EL.stat&&String(e[ECOL.STAT])!==EL.stat)return false;
    if(kw){
      const hay=[e[ECOL.ID],e[ECOL.NAME],e[ECOL.SLUG],e[ECOL.ABBR]||'',e[ECOL.SID],(e[ECOL.ALIAS]||[]).join(' ')].join(' ').toLowerCase();
      if(hay.indexOf(kw)<0)return false;
    }
    return true;
  });
  rows.sort(function(a,b){
    if(a[ECOL.UPD]!==b[ECOL.UPD])return a[ECOL.UPD]<b[ECOL.UPD]?1:-1;
    return Number(a[ECOL.ID])-Number(b[ECOL.ID]);
  });
  const trs=rows.map(function(e){
    const id=e[ECOL.ID];
    /* 聯賽行源侧 name 即聯賽碼，中文名由展示層詞典按需生成，不入庫 */
    const zh=String(e[ECOL.TYPE])==='2'?parentZh(e[ECOL.NAME]):'';
    const zhTxt=(zh&&zh!==e[ECOL.NAME])?zh:'';
    const slugTxt=e[ECOL.SLUG]!==e[ECOL.NAME]?e[ECOL.SLUG]:'';
    const sub=[slugTxt,zhTxt].filter(Boolean).join(' · ')||'—';
    return '<tr><td class="num" style="color:var(--text-help);white-space:nowrap">'+id+'</td>'+
      '<td><div style="display:flex;align-items:center;gap:8px;min-width:200px">'+logoCell(e)+
        '<div style="min-width:0"><div class="cell-clip" style="font-weight:500" title="'+esc(e[ECOL.SLUG])+'">'+esc(e[ECOL.NAME])+'</div>'+
        '<div class="muted" style="font-size:11px;margin-top:2px">'+esc(sub)+'</div></div></div></td>'+
      '<td>'+aliasCell(e[ECOL.ALIAS])+'</td>'+
      '<td class="num">'+(e[ECOL.ABBR]?esc(e[ECOL.ABBR]):'<span class="muted">–</span>')+'</td>'+
      '<td><span class="chip chip-line">'+etype(e[ECOL.TYPE])+'</span></td>'+
      '<td style="white-space:nowrap">'+parentLabel(e[ECOL.PARENT])+'</td>'+
      '<td>'+sidCell(e)+'</td>'+
      '<td style="font-size:11px">'+sidsCell(e[ECOL.SIDS])+'</td>'+
      '<td>'+dstatus(e[ECOL.STAT])+'</td>'+
      '<td class="num" style="white-space:nowrap;color:var(--text-sub);font-size:11px">'+e[ECOL.UPD]+'</td>'+
      '<td class="actions"><span class="btn-text" onclick="openEntityDetail(\''+id+'\')">詳情</span>'+
      '<span class="btn-text" onclick="openEntityEdit(\''+id+'\')">編輯</span></td></tr>';
  }).join('');
  const parents=Array.from(new Set(ENTITIES.reduce(function(a,e){
    return a.concat(Array.isArray(e[ECOL.PARENT])?e[ECOL.PARENT]:[e[ECOL.PARENT]]);
  },[]))).sort();
  return '<div class="card"><div class="filters">'+
    '<div class="f-item"><span class="f-label">搜尋</span><input class="f-input" placeholder="名稱 / 別名 / 縮寫 / 歸一化名 / 實體ID" style="min-width:230px" value="'+esc(EL.kw)+'" onchange="elSet(\'kw\',this.value)" /></div>'+
    '<div class="f-item"><select class="f-select" onchange="elSet(\'type\',this.value)"><option value="">全部實體類別</option>'+
      ['1','2','3','4'].map(function(t){return '<option value="'+t+'"'+(EL.type===t?' selected':'')+'>'+etype(Number(t))+'</option>';}).join('')+'</select></div>'+
    '<div class="f-item"><select class="f-select" onchange="elSet(\'parent\',this.value)"><option value="">全部上位名稱</option>'+
      parents.map(function(c){return '<option value="'+esc(c)+'"'+(EL.parent===c?' selected':'')+'>'+esc(c)+(parentZh(c)===c?'':' · '+esc(parentZh(c)))+'</option>';}).join('')+'</select></div>'+
    '<div class="f-item"><select class="f-select" onchange="elSet(\'stat\',this.value)"><option value="1"'+(EL.stat==='1'?' selected':'')+'>啟用</option><option value="0"'+(EL.stat==='0'?' selected':'')+'>停用</option><option value=""'+(EL.stat===''?' selected':'')+'>全部數據狀態</option></select></div>'+
    '<button class="btn btn-ghost" onclick="elReset()">重置</button>'+
    '<button class="btn btn-primary" onclick="toast(\'已套用篩選條件\')">搜尋</button>'+
    '<span style="margin-left:auto"><button class="btn btn-primary" onclick="openEntityAdd()">'+icon('plus',16)+' 實體錄入</button></span></div>'+
    '<div class="table-wrap"><table style="min-width:1320px"><thead><tr>'+
    '<th>實體ID</th><th>名稱 / 標誌 / 歸一化名</th><th>別名</th><th>縮寫</th><th>實體類別</th><th>上位名稱</th><th>主源平台 / 源側編號</th><th>其餘平台ID</th><th>數據狀態</th><th>更新時間</th><th>操作</th>'+
    '</tr></thead><tbody>'+(trs||'<tr><td colspan="11"><div class="empty-state">'+icon('file',24)+'<p>無符合條件的實體</p></div></td></tr>')+'</tbody></table></div>'+
    '<div class="alert-tip" style="margin-top:12px"><span class="i">'+icon('info',16)+'</span><span>11 列取自 01_entity 13 字段。每個實體一行：收斂後的多個賽事歸屬在上位名稱格並列，多個源側編號在源側編號格並列，編號與實體的對應以關係記錄為準。歸一化名、別名、主源平台、源側編號、其餘平台ID 為庫內匹配字段，業務側不讀；更新時間為增量拉取的比對依據。別名多值樣本為界面示意。</span></div>'+
    pager(1019,1)+'</div>';
}
function openEntityDetail(id){
  const e=ENTITIES.find(function(x){return x[ECOL.ID]===id;})||ENTITIES[0];
  const g=function(k,v){return '<div class="info-item"><div class="k">'+k+'</div><div class="v">'+v+'</div></div>';};
  const body='<div class="info-grid" style="grid-template-columns:1fr 1fr">'+
    g('實體ID',e[ECOL.ID])+g('實體類別',etype(e[ECOL.TYPE]))+
    g('名稱',esc(e[ECOL.NAME]))+g('歸一化名',esc(e[ECOL.SLUG]))+
    g('別名',aliasAll(e[ECOL.ALIAS]))+g('縮寫',e[ECOL.ABBR]?esc(e[ECOL.ABBR]):'–')+
    g('上位名稱',parentLabel(e[ECOL.PARENT]))+g('數據狀態',dstatus(e[ECOL.STAT]))+
    g('主源平台',esc(e[ECOL.SRC]))+g('源側編號',sidBlock(e))+
    g('其餘平台ID',sidsCell(e[ECOL.SIDS]))+g('更新時間',e[ECOL.UPD])+'</div>'+
    '<div style="margin-top:14px"><div style="color:var(--text-help);font-size:12px;margin-bottom:6px">標誌地址</div>'+
    '<div style="display:flex;align-items:center;gap:10px;background:var(--bg-soft);border-radius:6px;padding:10px 12px">'+logoCell(e)+
    '<span class="num" style="font-size:11px;color:var(--text-sub);word-break:break-all">'+(e[ECOL.LOGO]?esc(e[ECOL.LOGO]):'<span class="muted">源側未提供，界面顯示首字母色塊</span>')+'</span></div></div>'+
    '<div class="alert-tip" style="margin-top:14px"><span class="i">'+icon('lock',16)+'</span><span>實體ID、實體類別、主源平台、主源側ID 為不可變字段，任何入口均不可寫；業務側只存實體ID，名稱與標誌按 ID 讀取，以更新時間判斷緩存是否過期。</span></div>';
  openModal(modalShell({title:'實體詳情 · '+esc(e[ECOL.NAME]),body:body,
    foot:'<button class="btn btn-ghost" onclick="closeModal()">關閉</button>'+
      '<button class="btn btn-primary" onclick="closeModal();openEntityEdit(\''+e[ECOL.ID]+'\')">編輯實體</button>'}));
}
function openEntityEdit(id){
  const e=ENTITIES.find(function(x){return x[ECOL.ID]===id;})||ENTITIES[0];
  const body='<div class="alert-tip"><span class="i">'+icon('warn',16)+'</span><span>上位名稱相同、名稱與縮寫同時相同時，系統提示疑似重複並要求二次確認。</span></div>'+
    '<div class="field"><label class="field-label"><span class="req">*</span>名稱</label><input class="input" value="'+esc(e[ECOL.NAME])+'" /></div>'+
    '<div class="field"><label class="field-label">縮寫</label><input class="input" value="'+esc(e[ECOL.ABBR]||'')+'" /></div>'+
    '<div class="field"><label class="field-label">上位名稱</label><input class="input" placeholder="單個賽事碼，多個以逗號分隔" value="'+esc(Array.isArray(e[ECOL.PARENT])?e[ECOL.PARENT].join(', '):(e[ECOL.PARENT]||''))+'" />'+
    (Array.isArray(e[ECOL.PARENT])?'<div class="muted" style="font-size:11px;margin-top:4px">收斂實體的多個賽事歸屬，改動會影響收斂判定依據。</div>':'')+'</div>'+
    aliasEditor(e[ECOL.ALIAS])+
    '<div class="field"><label class="field-label">標誌地址</label><input class="input" placeholder="選填，源側 logo URL" value="'+esc(e[ECOL.LOGO]||'')+'" /></div>'+
    '<div class="info-grid" style="grid-template-columns:1fr 1fr;margin-top:6px">'+
      '<div class="info-item"><div class="k">實體ID（不可改）</div><div class="v">'+e[ECOL.ID]+'</div></div>'+
      '<div class="info-item"><div class="k">主源平台 / 源側ID（不可改）</div><div class="v">'+esc(e[ECOL.SRC])+' / '+esc(e[ECOL.SID])+'</div></div></div>';
  openModal(modalShell({title:'編輯實體 · '+esc(e[ECOL.NAME]),body:body,
    foot:'<button class="btn btn-ghost" onclick="closeModal()">取消</button>'+
      '<button class="btn btn-primary" onclick="closeModal();toast(\'實體已更新，更新時間已刷新\')">保存</button>'}));
}
function openEntityAdd(){
  const body='<div class="field"><label class="field-label"><span class="req">*</span>主源平台</label><select class="input"><option>polymarket</option><option>predict</option></select></div>'+
    '<div class="field"><label class="field-label"><span class="req">*</span>主源側ID</label><input class="input" placeholder="輸入源側編號，與平台聯合唯一" /></div>'+
    '<div class="field"><label class="field-label"><span class="req">*</span>名稱</label><input class="input" placeholder="源側規範名（不譯名）" /></div>'+
    '<div class="field"><label class="field-label"><span class="req">*</span>實體類別</label><select class="input"><option>隊伍</option><option>聯賽</option><option>選手</option><option>加密資產</option></select></div>'+
    '<div class="field"><label class="field-label">縮寫 / 上位名稱 / 標誌地址</label><input class="input" placeholder="選填；歸一化名由名稱自動生成" /></div>'+
    aliasEditor([])+
    '<div class="alert-tip"><span class="i">'+icon('info',16)+'</span><span>同一實體重複提交返回同一實體ID；命中佔位符詞表（79 個值）直接拒收；缺主源側ID 時不建實體，留在清洗暫存區。</span></div>';
  openModal(modalShell({title:'實體錄入 · FR-01',body:body,
    foot:'<button class="btn btn-ghost" onclick="closeModal()">取消</button>'+
      '<button class="btn btn-primary" onclick="closeModal();toast(\'錄入完成，已返回實體ID\')">確認錄入</button>'}));
}

/* ---------- 頁面：批量查詢與收斂判定 ---------- */
function pageEntityBatch(){
  const bar='<div class="sub-tabs">'+
    [['found','批量查詢 · FR-05'],['converge','多賽事識別 · FR-02'],['dedup','去重測試集']].map(function(x){
      return '<div class="sub-tab'+(EL.tab===x[0]?' active':'')+'" onclick="elSet(\'tab\',\''+x[0]+'\')">'+x[1]+'</div>';
    }).join('')+'</div>';
  let body='';
  if(EL.tab==='found'){
    const f=BATCH_RESULT.filter(function(r){return r[5]==='已找到'&&(EL.batchTab==='all'||EL.batchTab==='found');});
    const nf=BATCH_RESULT.filter(function(r){return r[5]==='未找到'&&(EL.batchTab==='all'||EL.batchTab==='missing');});
    const shown=EL.batchTab==='all'?BATCH_RESULT:(EL.batchTab==='found'?f:nf);
    const trs=shown.map(function(r){
      const hit=r[5]==='已找到'?'<span class="chip chip-blue">'+r[6]+'</span>':'<span class="chip chip-gray">'+r[4]+'</span>';
      return '<tr><td>'+esc(r[0])+'</td><td class="num">'+esc(r[1])+'</td>'+
        '<td class="num">'+(r[2]==='—'?'<span class="muted">–</span>':esc(r[2]))+'</td>'+
        '<td class="name">'+(r[3]==='—'?'<span class="muted">–</span>':esc(r[3]))+'</td>'+
        '<td>'+(r[5]==='已找到'?'<span class="chip chip-blue">已找到</span>':'<span class="chip chip-gray">未找到</span>')+'</td><td>'+hit+'</td></tr>';
    }).join('');
    body='<div class="card"><div class="card-head"><div class="card-title">批量查詢結果</div>'+
      '<div style="display:flex;gap:6px">'+
      [['found','已找到 9'],['missing','未找到 3'],['all','全部 12']].map(function(t){
        return '<button class="btn '+(EL.batchTab===t[0]?'btn-primary':'btn-ghost')+'" style="height:28px;padding:0 12px;font-size:12px" onclick="elSet(\'batchTab\',\''+t[0]+'\')">'+t[1]+'</button>';
      }).join('')+'</div></div>'+
      '<div class="alert-tip"><span class="i">'+icon('info',16)+'</span><span>單批上限 2000 條；條數守恆：已找到 + 未找到 = 提交條數；整批失敗不返回部分結果。</span></div>'+
      '<div class="table-wrap"><table style="min-width:860px"><thead><tr>'+
      '<th>來源平台</th><th>平台編號</th><th>實體標識</th><th>名稱</th><th>結果</th><th>命中方式 / 原因碼</th>'+
      '</tr></thead><tbody>'+trs+'</tbody></table></div></div>';
  }else if(EL.tab==='converge'){
    const trs=CONVERGE.map(function(r){
      const ok=r[4]==='合併';
      return '<tr><td class="name">'+esc(r[0])+'</td><td class="num">'+esc(r[1])+'</td>'+
        '<td><span class="chip chip-line">'+esc(r[2])+'</span></td><td>'+esc(r[3])+'</td>'+
        '<td>'+(ok?'<span class="chip chip-blue">合併</span>':'<span class="chip chip-gray">各自獨立</span>')+'</td>'+
        '<td class="num" style="font-size:11px">'+esc(r[5])+'</td></tr>';
    }).join('');
    body='<div class="card"><div class="card-head"><div class="card-title">多賽事識別 · 收斂 11 組</div></div>'+
      '<div class="alert-tip"><span class="i">'+icon('warn',16)+'</span><span>三條件同時滿足才收斂：名稱歸一化相同 + 縮寫相同 + 賽事性質不同。聯賽碼語義查對照表取得，不按碼面推斷；不建聯賽父子層級。</span></div>'+
      '<div class="table-wrap"><table style="min-width:940px"><thead><tr>'+
      '<th>名稱</th><th>縮寫</th><th>聯賽碼</th><th>判定依據</th><th>處置</th><th>實體標識</th>'+
      '</tr></thead><tbody>'+trs+'</tbody></table></div></div>';
  }else{
    const min=parseFloat(EL.dedupScore);
    const trs=DEDUP_PAIRS.filter(function(r){return parseFloat(r[6])>=min;}).map(function(r){
      const strong=parseFloat(r[6])>=0.8;
      return '<tr><td><span class="chip chip-line">'+r[0]+'</span></td>'+
        '<td class="name"><div class="cell-clip" title="'+esc(r[1])+'">'+esc(r[1])+'</div></td>'+
        '<td class="num">'+r[2]+'</td>'+
        '<td class="name"><div class="cell-clip" title="'+esc(r[3])+'">'+esc(r[3])+'</div></td>'+
        '<td class="num">'+r[4]+'</td>'+
        '<td class="name"><div class="cell-clip" title="'+esc(r[5])+'">'+esc(r[5])+'</div></td>'+
        '<td class="num" style="color:'+(strong?'#00b42a':'#ff7d00')+';font-weight:600">'+r[6]+'</td>'+
        '<td class="num" style="font-size:11px;color:var(--text-help)">'+r[7]+'<br/>'+r[8]+'</td></tr>';
    }).join('');
    body='<div class="card"><div class="card-head"><div class="card-title">兩平台相似事件 · 去重測試集</div>'+
      '<select class="f-select" onchange="elSet(\'dedupScore\',this.value)" style="min-width:150px">'+
      [['0.8','相似度 ≥ 0.8'],['0.5','相似度 ≥ 0.5'],['0','全部']].map(function(o){
        return '<option value="'+o[0]+'"'+(EL.dedupScore===o[0]?' selected':'')+'>'+o[1]+'</option>';
      }).join('')+'</select></div>'+
      '<div class="alert-tip"><span class="i">'+icon('info',16)+'</span><span>字符 3-gram TF-IDF 餘弦 0.75 + 結束時間接近度 1/(1+Δt/24) 加權 0.25；同分類內取 Top10。全量 20,960 行候選對、疑似重複候選 401 行。</span></div>'+
      '<div class="table-wrap"><table style="min-width:1180px"><thead><tr>'+
      '<th>分類</th><th>賽事主體</th><th>Predict ID</th><th>Predict 標題</th><th>PM ID</th><th>PM 標題</th><th>標題相似度</th><th>結束時間（Pred / PM）</th>'+
      '</tr></thead><tbody>'+(trs||'<tr><td colspan="8"><div class="empty-state">'+icon('file',24)+'<p>無符合門檻的候選對</p></div></td></tr>')+'</tbody></table></div>'+
      '<div style="margin-top:12px;display:flex;gap:8px"><span class="chip chip-line">強命中集 381 組</span><span class="chip chip-line">全高相似集 245 組</span><span class="chip chip-line">均衡混合集 344 組</span><span class="chip chip-line">疑似重複候選 401 行</span></div></div>';
  }
  return '<div class="card">'+bar+'</div>'+body;
}

/* ---------- 頁面：關係記錄 ---------- */
function pageEntityRelation(){
  const trs=RELATIONS.map(function(r,i){
    return '<tr><td class="num" style="color:var(--text-help)">'+(i+1)+'</td>'+
      '<td><span class="chip chip-line">'+esc(r[0])+'</span></td><td class="num">'+esc(r[1])+'</td>'+
      '<td class="num">'+esc(r[2])+'</td><td>'+esc(r[3])+'</td>'+
      '<td style="color:var(--text-sub);font-size:11px">'+esc(r[4])+'</td>'+
      '<td class="num" style="font-size:11px">'+r[5]+'</td>'+
      '<td>'+esc(r[6])+'</td><td class="num">'+r[7]+'</td>'+
      '<td class="actions"><span class="btn-text" onclick="openRelationDetail('+i+')">依據</span></td></tr>';
  }).join('');
  return '<div class="card"><div class="filters">'+
    '<div class="f-item"><span class="f-label">搜尋</span><input class="f-input" placeholder="源側編號 / 實體標識" style="min-width:220px" /></div>'+
    '<div class="f-item"><select class="f-select"><option>全部命中方式</option><option>直接命中</option><option>收斂命中</option><option>重定向命中</option><option>初始建庫</option><option>衝突新建</option></select></div>'+
    '<div class="f-item"><select class="f-select"><option>全部來源平台</option><option>polymarket</option><option>predict.fun</option></select></div>'+
    '<button class="btn btn-ghost" onclick="toast(\'已重置篩選條件\',\'info\')">重置</button>'+
    '<button class="btn btn-primary" onclick="toast(\'已套用篩選條件\')">搜尋</button></div>'+
    '<div class="alert-tip" style="margin-top:2px"><span class="i">'+icon('info',16)+'</span><span>統計口徑固定「記錄條數」與「命中次數之和」兩個數；只記編號與實體，不記源數據內容；變更記錄與關係記錄不可編輯、不可刪除。</span></div>'+
    '<div class="table-wrap"><table style="min-width:1160px"><thead><tr>'+
    '<th style="width:48px">序號</th><th>來源平台</th><th>源側編號</th><th>實體標識</th><th>命中方式</th><th>依據</th><th>產生時間</th><th>產生來源</th><th>命中次數</th><th>操作</th>'+
    '</tr></thead><tbody>'+trs+'</tbody></table></div>'+pager(842,1)+'</div>';
}
function openRelationDetail(i){
  const r=RELATIONS[i]||RELATIONS[0];
  const g=function(k,v){return '<div class="info-item"><div class="k">'+k+'</div><div class="v">'+v+'</div></div>';};
  openModal(modalShell({title:'關係記錄依據',body:'<div class="info-grid" style="grid-template-columns:1fr 1fr">'+
    g('來源平台',esc(r[0]))+g('源側編號',esc(r[1]))+
    g('實體標識',esc(r[2]))+g('命中方式',esc(r[3]))+
    g('產生時間',r[5])+g('產生來源',esc(r[6]))+'</div>'+
    '<div style="margin-top:14px"><div style="color:var(--text-help);font-size:12px;margin-bottom:6px">判定依據</div>'+
    '<div style="background:var(--bg-soft);border-radius:6px;padding:10px 12px;color:var(--text-sub);line-height:1.7">'+esc(r[4])+'</div></div>',
    foot:'<button class="btn btn-primary" onclick="closeModal()">關閉</button>'}));
}
