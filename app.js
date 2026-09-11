const WEEKDAY_LABELS = ["Mo","Di","Mi","Do","Fr","Sa","So"];
const MONTH_LABELS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const STORAGE_KEY = "trainingsplan-done-flags";

function pad(n){ return String(n).padStart(2,"0"); }
function ymd(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseDate(key){ const [y,m,d]=key.split("-").map(Number); return new Date(y,m-1,d); }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function shortDate(d){ return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.`; }

const DAY_MAP = {};
WEEKS.forEach(w=>{ for(const [k,v] of Object.entries(w.days)){ DAY_MAP[k]={...v, weekLabel:w.label}; } });

const ICONS = {
  swim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M2 8c2-2.2 4-2.2 6 0s4 2 6 0 4-2.2 6 0"/><path d="M2 13c2-2.2 4-2.2 6 0s4 2 6 0 4-2.2 6 0"/><path d="M2 18c2-2.2 4-2.2 6 0s4 2 6 0 4-2.2 6 0"/></svg>',
  bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17l4-8h4l4 8"/><path d="M10 9h3"/><path d="M6 17h6l4-8"/></svg>',
  run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="4.5" r="1.6" fill="currentColor" stroke="none"/><path d="M11 9l3-2 3 3-2 3 3 4-2 3"/><path d="M14 10l-4 1-3 5"/><path d="M10 11l3 2-1 4"/></svg>',
  strength: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2.2" y="9.3" width="3.4" height="5.4" rx="1"/><rect x="18.4" y="9.3" width="3.4" height="5.4" rx="1"/><path d="M5.6 12h12.8"/></svg>',
  rest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3.5a7.5 7.5 0 1 0 6 8.6 6 6 0 0 1-6-8.6z"/></svg>',
  race: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 4h13l-3 4 3 4H5"/></svg>'
};
const TAB_ICONS = {
  today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="14.5" r="2" fill="currentColor" stroke="none"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-7"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/></svg>'
};
const ACCENT = { swim:"var(--swim)", bike:"var(--bike)", run:"var(--run)", strength:"var(--strength)", rest:"var(--rest)", race:"var(--gold)" };
const SPORT_LABEL = { swim:"Schwimmen", bike:"Rad", run:"Laufen", strength:"Kraft", rest:"Ruhe", race:"Rennen" };

let doneFlags = {};
try{ doneFlags = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }catch(e){ doneFlags = {}; }

let selectedKey = ymd(new Date());
if(!DAY_MAP[selectedKey]){
  const keys = Object.keys(DAY_MAP).sort();
  selectedKey = new Date(selectedKey) < parseDate(keys[0]) ? keys[0] : keys[keys.length-1];
}
let activeTab = "today";

function flagKey(dateKey, idx){ return dateKey+"#"+idx; }
function saveFlags(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(doneFlags)); }
  catch(e){ console.error("Konnte Fortschritt nicht speichern:", e); }
}
function isDone(s, dateKey, idx){ return s.logged || !!doneFlags[flagKey(dateKey, idx)]; }

function weekForKey(key){
  const d = parseDate(key);
  for(const w of WEEKS){
    const start = parseDate(w.start);
    const end = addDays(start,6);
    if(d>=start && d<=end) return w;
  }
  return d < parseDate(WEEKS[0].start) ? WEEKS[0] : WEEKS[WEEKS.length-1];
}

function fmtDuration(min){
  if(!min) return null;
  if(min>=60){ const h=Math.floor(min/60); const m=Math.round(min%60); return m? `${h} h ${m} min` : `${h} h`; }
  return `${Math.round(min)} min`;
}
function fmtDistance(sport, km){
  if(km==null) return null;
  if(sport==="swim" && km<3) return `${Math.round(km*1000).toLocaleString("de-DE")} m`;
  return `${km.toLocaleString("de-DE",{maximumFractionDigits:1})} km`;
}
function metaText(s){
  const parts = [];
  const d = s.durationLabel || fmtDuration(s.durationMin);
  const dist = s.distanceLabel || fmtDistance(s.sport, s.distanceKm);
  if(d) parts.push(d);
  if(dist) parts.push(dist);
  if(s.intensity) parts.push(s.intensity);
  return parts.join(" · ");
}

/* ---------- Statistik-Aggregation ---------- */
function aggregate(dateKeys){
  const bySport = {};
  let totalMin = 0, doneCount = 0, totalCount = 0;
  dateKeys.forEach(key=>{
    const day = DAY_MAP[key];
    if(!day) return;
    day.sessions.forEach((s,idx)=>{
      if(s.excludeFromStats) return;
      totalCount++;
      if(!isDone(s,key,idx)) return;
      doneCount++;
      totalMin += s.durationMin||0;
      if(!bySport[s.sport]) bySport[s.sport] = {min:0, km:0};
      bySport[s.sport].min += s.durationMin||0;
      if(s.distanceKm) bySport[s.sport].km += s.distanceKm;
    });
  });
  return {bySport, totalMin, doneCount, totalCount};
}
function weekDateKeys(week){
  const start = parseDate(week.start);
  return [...Array(7)].map((_,i)=> ymd(addDays(start,i)));
}
function allDateKeys(){ return Object.keys(DAY_MAP); }

/* ---------- Renn-Countdown-Chips ---------- */
function raceChipsHtml(){
  const today = new Date();
  const items = RACES.map(r=>{
    const d = parseDate(r.date);
    const diff = Math.round((d - today)/86400000);
    return {...r, diff};
  }).filter(r=> r.diff >= -30);
  if(items.length===0) return "";
  const nextIdx = items.findIndex(r=> r.diff>=0);
  let html = `<div class="race-row">`;
  items.forEach((r,i)=>{
    let label;
    if(r.diff>0) label = `in ${r.diff} Tag${r.diff===1?"":"en"}`;
    else if(r.diff===0) label = "heute";
    else label = `vor ${-r.diff} Tag${-r.diff===1?"":"en"}`;
    const cls = i===nextIdx ? "primary" : (r.diff<0 ? "past" : "");
    html += `<div class="race-chip ${cls}"><span class="name">${r.name}</span><span class="days">${label}</span></div>`;
  });
  html += `</div>`;
  return html;
}

/* ---------- Tab-Bar ---------- */
function tabbarHtml(){
  const tabs = [["today","Heute"],["stats","Statistik"],["history","Verlauf"]];
  let html = `<div class="tabbar">`;
  tabs.forEach(([key,label])=>{
    html += `<button class="tab-btn ${activeTab===key?"active":""}" data-tab="${key}">${TAB_ICONS[key]}<span>${label}</span></button>`;
  });
  html += `</div>`;
  return html;
}

/* ---------- Session-Karte ---------- */
function sessionCardHtml(s, dateKey, idx, todayKey){
  const accent = ACCENT[s.sport];
  const isRace = s.sport==="race";
  const flag = flagKey(dateKey, idx);
  const done = isDone(s, dateKey, idx);
  const titleSuffix = s.altSport ? ` <span style="color:var(--muted);font-weight:500;">(oder ${SPORT_LABEL[s.altSport]})</span>` : "";
  let html = `<div class="session-card ${isRace?"race-card":""} ${done?"is-done":""}" style="--accent-c:${accent}">
    <div class="session-head">
      <div class="session-icon">${ICONS[s.sport]}</div>
      <div class="session-headings">
        <div class="session-title">${s.title}${titleSuffix}</div>
        <div class="session-meta">${metaText(s) || SPORT_LABEL[s.sport]}</div>
      </div>
      ${done && !s.logged ? `<span class="done-badge" aria-label="erledigt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg></span>` : ""}
    </div>`;
  if(s.blocks && s.blocks.length){
    html += `<div class="session-blocks">`;
    s.blocks.forEach(b=>{ html += `<div class="block"><span class="block-label">${b.label}</span><span class="block-text">${b.text}</span></div>`; });
    html += `</div>`;
  }
  if(s.note) html += `<div class="session-note">${s.note}</div>`;
  if(s.logged){
    html += `<div class="logged-tag">✓ bereits protokolliert</div>`;
  } else if(!isRace || todayKey >= RACES[0].date){
    html += `<button class="done-toggle ${done?"active":""}" data-flag="${flag}" style="--accent-c:${accent}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>
      ${done?"erledigt":"als erledigt markieren"}
    </button>`;
  }
  html += `</div>`;
  return html;
}

/* ---------- Tab: Heute ---------- */
function renderToday(){
  const today = new Date();
  const todayKey = ymd(today);
  const sel = parseDate(selectedKey);
  const week = weekForKey(selectedKey);
  const weekStart = parseDate(week.start);
  const weekdayName = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][sel.getDay()];

  const viewingToday = selectedKey === todayKey;
  let html = `
    <header class="day-header">
      <div class="kicker-row">
        <span class="weekday">${weekdayName}</span>
        ${viewingToday
          ? `<span class="today-pill">Heute</span>`
          : `<button class="back-today" data-jump-today>Zu heute</button>`}
      </div>
      <div class="date-row">
        <span class="day-num">${sel.getDate()}</span>
        <span class="month-lbl">${MONTH_LABELS[sel.getMonth()]}</span>
      </div>
      <span class="week-label">${week.label}</span>
    </header>
    ${raceChipsHtml()}
  `;

  html += `<div class="day-strip">`;
  for(let i=0;i<7;i++){
    const d = addDays(weekStart,i);
    const key = ymd(d);
    const dayData = DAY_MAP[key];
    const isSelected = key===selectedKey;
    const isToday = key===todayKey;
    const sessions = dayData ? dayData.sessions : [];
    const primary = sessions.length ? sessions[0].sport : "rest";
    const allDone = sessions.length>0 && sessions.every((s,idx)=> isDone(s,key,idx));
    const hasTraining = sessions.some(s=> s.sport!=="rest");
    html += `<button class="day-btn ${isSelected?"selected":""} ${isToday?"today":""} ${allDone?"all-done":""}" data-key="${key}" style="--day-c:${ACCENT[primary]}">
        <span class="lbl">${WEEKDAY_LABELS[i]}</span>
        <span class="num">${d.getDate()}</span>
        <span class="dot-wrap">
          <span class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg></span>
          <span class="dot ${hasTraining?"":"rest"}"></span>
        </span>
      </button>`;
  }
  html += `</div>`;

  const agg = aggregate(weekDateKeys(week));
  if(agg.totalCount>0){
    const pct = Math.round((agg.doneCount/agg.totalCount)*100);
    html += `<div class="week-progress">
      <div class="week-progress-top">
        <span>Diese Woche</span>
        <span><b>${agg.doneCount}</b> / ${agg.totalCount} Einheiten</span>
      </div>
      <span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span>
    </div>`;
  }

  const dayData = DAY_MAP[selectedKey];
  if(!dayData){
    html += `<div class="empty">Noch kein Plan hinterlegt.<br>Schick deine Woche, dann kommt der nächste Block in data.js.</div>`;
  } else {
    if(dayData.dayNote) html += `<div class="day-note">${dayData.dayNote}</div>`;
    if(dayData.sessions.length===0 && !dayData.dayNote) html += `<div class="empty">Ruhetag – bewusst nichts tun.</div>`;
    dayData.sessions.forEach((s,idx)=>{ html += sessionCardHtml(s, selectedKey, idx, todayKey); });
  }
  html += `<div class="footer-note">Lokal gespeichert auf diesem Gerät · Stand ${new Date().toLocaleDateString("de-DE")}</div>`;
  return html;
}

/* ---------- Tab: Statistik ---------- */
function barsHtml(bySport){
  const sports = ["swim","bike","run","strength"];
  const maxMin = Math.max(1, ...sports.map(sp=> (bySport[sp]?.min)||0));
  let html = "";
  sports.forEach(sp=>{
    const min = bySport[sp]?.min || 0;
    if(min===0) return;
    const pct = Math.round((min/maxMin)*100);
    html += `<div class="bar-row">
      <span class="bar-label">${SPORT_LABEL[sp]}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${pct}%;background:${ACCENT[sp]}"></span></span>
      <span class="bar-value">${fmtDuration(min)}</span>
    </div>`;
  });
  return html || `<div class="empty">Noch keine erledigten Einheiten in diesem Zeitraum.</div>`;
}
function distanceHtml(bySport){
  const sports = ["swim","bike","run"];
  const rows = sports.filter(sp=> (bySport[sp]?.km||0) > 0);
  if(rows.length===0) return "";
  const maxKm = Math.max(...rows.map(sp=> bySport[sp].km));
  let html = "";
  rows.forEach(sp=>{
    const km = bySport[sp].km;
    const pct = Math.round((km/maxKm)*100);
    html += `<div class="bar-row">
      <span class="bar-label">${SPORT_LABEL[sp]}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${pct}%;background:${ACCENT[sp]}"></span></span>
      <span class="bar-value">${fmtDistance(sp, km)}</span>
    </div>`;
  });
  return html;
}
function renderStats(){
  const today = new Date();
  const week = weekForKey(ymd(today));
  const weekAgg = aggregate(weekDateKeys(week));
  const allAgg = aggregate(allDateKeys());

  let html = `
    <div class="section-title">Statistik</div>
    <div class="section-sub">${week.label}</div>

    <div class="stat-hero-row">
      <div class="stat-tile">
        <div class="stat-hero-figure">${fmtDuration(weekAgg.totalMin) || "0 min"}</div>
        <div class="stat-hero-label">Trainingszeit diese Woche</div>
      </div>
      <div class="stat-tile">
        <div class="stat-hero-figure">${weekAgg.doneCount}/${weekAgg.totalCount}</div>
        <div class="stat-hero-label">Einheiten erledigt</div>
      </div>
    </div>

    <div class="stat-block">
      <div class="stat-title">Zeit nach Sportart – diese Woche</div>
      ${barsHtml(weekAgg.bySport)}
    </div>
    ${distanceHtml(weekAgg.bySport) ? `<div class="stat-block"><div class="stat-title">Distanz nach Sportart – diese Woche</div>${distanceHtml(weekAgg.bySport)}</div>` : ""}

    <div class="stat-card">
      <div class="stat-title">Insgesamt in dieser App (seit ${shortDate(parseDate(WEEKS[0].start))})</div>
      <div class="stat-hero-row compact">
        <div class="stat-tile">
          <div class="stat-hero-figure">${fmtDuration(allAgg.totalMin) || "0 min"}</div>
          <div class="stat-hero-label">Gesamtzeit</div>
        </div>
        <div class="stat-tile">
          <div class="stat-hero-figure">${allAgg.doneCount}/${allAgg.totalCount}</div>
          <div class="stat-hero-label">Einheiten</div>
        </div>
      </div>
      ${barsHtml(allAgg.bySport)}
    </div>
    <div class="footer-note">Basiert auf den Einheiten, die du in dieser App als erledigt markierst.</div>
  `;
  return html;
}

/* ---------- Tab: Verlauf ---------- */
function renderHistory(){
  const today = new Date();
  const pastWeeks = WEEKS.filter(w=> addDays(parseDate(w.start),6) < today).reverse();

  let html = `<div class="section-title">Verlauf</div><div class="section-sub">Abgeschlossene Wochen</div>`;
  if(pastWeeks.length===0){
    html += `<div class="empty">Noch keine abgeschlossene Woche.<br>Die erste erscheint hier automatisch, sobald eine Trainingswoche vorbei ist.</div>`;
  } else {
    pastWeeks.forEach(w=>{
      const agg = aggregate(weekDateKeys(w));
      const start = parseDate(w.start), end = addDays(start,6);
      const pct = agg.totalCount ? Math.round((agg.doneCount/agg.totalCount)*100) : 0;
      html += `<div class="history-row" data-jump="${w.start}">
        <div class="history-main">
          <div class="history-week">${w.label}</div>
          <div class="history-range">${shortDate(start)} – ${shortDate(end)}</div>
          <span class="progress-track sm"><span class="progress-fill" style="width:${pct}%"></span></span>
        </div>
        <div class="history-side">
          <div class="history-metric"><b>${agg.doneCount}/${agg.totalCount}</b><span>${fmtDuration(agg.totalMin) || "0 min"}</span></div>
          <span class="history-arrow">›</span>
        </div>
      </div>`;
    });
  }
  return html;
}

/* ---------- Enter-Animationen ----------
   Der DOM wird bei jedem render() neu aufgebaut, CSS-Transitions auf
   Zustandsklassen greifen deshalb nicht. Stattdessen: fx-Klasse auf .app
   (steuert das Einblenden) und .pop / .check-in nur auf dem Element, das
   sich gerade geändert hat. reason: "load" | "tab" | "day" | "toggle" */
function applyEnterFx(app, reason, detail, prevFillWidth){
  app.className = "app" + (reason ? " fx-"+reason : "");
  if(reason==="tab"){
    app.querySelector(".tab-btn.active")?.classList.add("pop");
  } else if(reason==="day"){
    app.querySelector(".day-btn.selected")?.classList.add("pop");
  } else if(reason==="toggle"){
    const btn = app.querySelector(`.done-toggle[data-flag="${detail}"]`);
    if(btn){
      btn.classList.add("pop");
      btn.closest(".session-card")?.querySelector(".done-badge")?.classList.add("pop");
    }
    app.querySelector(".day-btn.selected.all-done")?.classList.add("check-in");
    // Wochenbalken von alter zu neuer Breite gleiten lassen statt springen
    const fill = app.querySelector(".week-progress .progress-fill");
    if(fill && prevFillWidth){
      const target = fill.style.width;
      fill.style.width = prevFillWidth;
      fill.getBoundingClientRect(); // Reflow erzwingen, sonst startet die Transition nicht
      fill.style.width = target;
    }
  }
}

/* ---------- Haupt-Render ---------- */
function render(reason, detail){
  const app = document.getElementById("app");
  const prevFillWidth = app.querySelector(".week-progress .progress-fill")?.style.width;
  let html = "";
  if(activeTab==="today") html = renderToday();
  else if(activeTab==="stats") html = renderStats();
  else if(activeTab==="history") html = renderHistory();

  app.innerHTML = html + tabbarHtml();
  applyEnterFx(app, reason, detail, prevFillWidth);

  app.querySelectorAll(".day-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{ selectedKey = btn.dataset.key; render("day"); });
  });
  const backBtn = app.querySelector("[data-jump-today]");
  if(backBtn) backBtn.addEventListener("click", ()=>{
    let key = ymd(new Date());
    if(!DAY_MAP[key]){
      const keys = Object.keys(DAY_MAP).sort();
      key = new Date(key) < parseDate(keys[0]) ? keys[0] : keys[keys.length-1];
    }
    selectedKey = key;
    render("day");
    window.scrollTo(0,0);
  });
  app.querySelectorAll(".done-toggle").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const key = btn.dataset.flag;
      doneFlags[key] = !doneFlags[key];
      saveFlags();
      render("toggle", key);
    });
  });
  app.querySelectorAll(".history-row").forEach(row=>{
    row.addEventListener("click", ()=>{
      selectedKey = row.dataset.jump;
      activeTab = "today";
      render("tab");
      window.scrollTo(0,0);
    });
  });
  app.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      activeTab = btn.dataset.tab;
      render("tab");
      window.scrollTo(0,0);
    });
  });
}

render("load");

if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("service-worker.js").then(reg=>{
      reg.addEventListener("updatefound", ()=>{
        const nw = reg.installing;
        nw.addEventListener("statechange", ()=>{
          if(nw.state === "installed" && navigator.serviceWorker.controller){
            document.getElementById("update-banner").classList.add("show");
          }
        });
      });
    }).catch(e=> console.warn("Service Worker Registrierung fehlgeschlagen:", e));
  });
}
document.addEventListener("click", (e)=>{
  if(e.target && e.target.id === "reload-btn") window.location.reload();
});
