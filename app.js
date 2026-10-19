const WEEKDAY_LABELS = ["Mo","Di","Mi","Do","Fr","Sa","So"];
const MONTH_LABELS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const STORAGE_KEY = "trainingsplan-done-flags";
const CHECKIN_KEY = "trainingsplan-checkins";
const STORAGE_PREFIX = "trainingsplan-"; // alle App-Daten im localStorage, fuer Backup
const MONTH_SHORT = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const DAY_MS = 86400000;

function pad(n){ return String(n).padStart(2,"0"); }
function ymd(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseDate(key){ const [y,m,d]=key.split("-").map(Number); return new Date(y,m-1,d); }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function shortDate(d){ return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.`; }
function longDate(d){ return `${shortDate(d)}${d.getFullYear()}`; }
function todayDate(){ return parseDate(ymd(new Date())); }
// Ganze Kalendertage von a nach b (beide Mitternacht; round faengt Zeitumstellung ab)
function dayDiff(a,b){ return Math.round((b-a)/DAY_MS); }
function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }
function inDays(n){
  if(n===0) return "heute";
  if(n===1) return "morgen";
  if(n===-1) return "gestern";
  return n>0 ? `in ${n} Tagen` : `vor ${-n} Tagen`;
}
function esc(str){ return String(str).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

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
  phases: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M12 5h6l2.2 2.5L18 10h-6"/><path d="M12 12H6l-2.2 2.5L6 17h6"/><path d="M9 21h6"/></svg>'
};
const MILESTONE_ICONS = {
  race: ICONS.race,
  test: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.5 1.5"/><path d="M10 2.5h4"/><path d="M12 2.5V6"/></svg>',
  checkpoint: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.4 2.4 4.8-5"/></svg>'
};
const ACCENT = { swim:"var(--swim)", bike:"var(--bike)", run:"var(--run)", strength:"var(--strength)", rest:"var(--rest)", race:"var(--gold)" };
const SPORT_LABEL = { swim:"Schwimmen", bike:"Rad", run:"Laufen", strength:"Kraft", rest:"Ruhe", race:"Rennen" };
const FOCUS_ROWS = [["swim","Schwimmen"],["bike","Rad"],["run","Laufen"],["strength","Kraft"],["recovery","Erholung"]];
const WEEK_TYPE_LABEL = { build:"Aufbau", deload:"Entlastung", recovery:"Erholung", race:"Renn-Woche", taper:"Taper" };
const UNRATED_WEEK_TYPES = ["race","recovery"]; // zaehlen nicht fuer die 10-%-Regel

function loadJson(key){
  try{ return JSON.parse(localStorage.getItem(key) || "{}") || {}; }catch(e){ return {}; }
}
let doneFlags = loadJson(STORAGE_KEY);
let checkins = loadJson(CHECKIN_KEY); // { "YYYY-MM-DD": { energy, shin, circ, note } }

let selectedKey = ymd(new Date());
if(!DAY_MAP[selectedKey]){
  const keys = Object.keys(DAY_MAP).sort();
  selectedKey = new Date(selectedKey) < parseDate(keys[0]) ? keys[0] : keys[keys.length-1];
}
let activeTab = "today";
let openPhases = null; // Set der aufgeklappten Phasen im Phasen-Tab; null = Standard (aktuelle Phase)

function flagKey(dateKey, idx){ return dateKey+"#"+idx; }
function saveFlags(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(doneFlags)); }
  catch(e){ console.error("Konnte Fortschritt nicht speichern:", e); }
}
function isDone(s, dateKey, idx){ return s.logged || !!doneFlags[flagKey(dateKey, idx)]; }
function saveCheckins(){
  try{ localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkins)); }
  catch(e){ console.error("Konnte Check-in nicht speichern:", e); }
}

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

/* ---------- Phasen ----------
   Alles wird nur aus dem Datum und PHASES berechnet, nichts gespeichert. */
function phaseDays(p){ return dayDiff(parseDate(p.start), parseDate(p.end)) + 1; }
function phaseWeeks(p){ return Math.ceil(phaseDays(p)/7); }
function shortPhaseName(p){ return p.name.replace(/\s*\(.*\)\s*$/,""); } // "Aufbauphase (Hamburg-Marathon)" → "Aufbauphase"
function planTotalWeeks(){ return Math.ceil((dayDiff(parseDate(PLAN_START), parseDate(PLAN_END)) + 1)/7); }

// mode: "before" (vor PLAN_START) | "in" | "after" (nach PLAN_END)
function phaseStatus(t){
  const start = parseDate(PLAN_START), end = parseDate(PLAN_END);
  const totalWeeks = planTotalWeeks();
  if(t < start) return { mode:"before", daysToStart: dayDiff(t,start), next: PHASES[0], totalWeeks };
  if(t > end) return { mode:"after", totalWeeks };
  let idx = PHASES.findIndex(p=> t>=parseDate(p.start) && t<=parseDate(p.end));
  // Lücke zwischen zwei Phasen: die zuletzt begonnene gilt weiter, bis die nächste startet
  if(idx<0) idx = PHASES.reduce((acc,p,i)=> parseDate(p.start)<=t ? i : acc, 0);
  const phase = PHASES[idx];
  const ps = parseDate(phase.start);
  const weeks = phaseWeeks(phase);
  const elapsed = dayDiff(ps,t);
  const next = PHASES[idx+1] || null;
  return {
    mode:"in", idx, phase, weeks, totalWeeks, next,
    week: Math.min(weeks, Math.floor(elapsed/7)+1),
    pct: clamp(Math.round((elapsed+1)/phaseDays(phase)*100), 0, 100),
    daysToNext: next ? dayDiff(t, parseDate(next.start)) : null,
    overallWeek: Math.min(totalWeeks, Math.floor(dayDiff(start,t)/7)+1)
  };
}
// "done" | "current" | "upcoming"
function phaseState(p, st, t){
  if(st.mode==="in") return p.key===st.phase.key ? "current" : (parseDate(p.end) < t ? "done" : "upcoming");
  return st.mode==="after" ? "done" : "upcoming";
}
function nextPhaseLine(st){
  if(!st.next) return `Als Nächstes: ${raceName()} am ${longDate(parseDate(PLAN_END))} (${inDays(dayDiff(todayDate(), parseDate(PLAN_END)))})`;
  return `Als Nächstes: ${shortPhaseName(st.next)} ab ${longDate(parseDate(st.next.start))} (${inDays(st.daysToNext)})`;
}
function raceName(){ return (RACES.find(r=> r.date===PLAN_END) || {name:"Ironman"}).name; }

function phaseBannerHtml(){
  const st = phaseStatus(todayDate());
  let kicker, right, line, total, target = "";
  if(st.mode==="before"){
    kicker = "Vorbereitung";
    right = `Start ${inDays(st.daysToStart)}`;
    line = `Als Nächstes: ${shortPhaseName(st.next)} ab ${longDate(parseDate(st.next.start))}`;
    total = `Gesamt: ${st.totalWeeks} Wochen bis Ironman`;
    target = st.next.key;
  } else if(st.mode==="after"){
    kicker = "Nach dem Rennen · Regeneration";
    right = "";
    line = `${raceName()} · ${longDate(parseDate(PLAN_END))}`;
    total = "";
  } else {
    kicker = shortPhaseName(st.phase);
    right = `Woche <b>${st.week}</b> von ${st.weeks}`;
    line = nextPhaseLine(st);
    total = `Gesamt: Woche ${st.overallWeek} von ${st.totalWeeks} bis Ironman`;
    target = st.phase.key;
  }
  const bar = st.mode==="in"
    ? `<span class="progress-track xs" role="progressbar" aria-label="Fortschritt ${esc(st.phase.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${st.pct}"><span class="progress-fill" style="width:${st.pct}%"></span></span>`
    : "";
  return `<button class="phase-banner" data-goto-phase="${target}" aria-label="Phase: ${esc(kicker)}${st.mode==="in"?`, Woche ${st.week} von ${st.weeks}`:""}. Details im Tab Phasen">
    <span class="phase-banner-top"><span class="phase-kicker">${kicker}</span>${right?`<span class="phase-banner-week">${right}</span>`:""}</span>
    ${bar}
    <span class="phase-banner-next">${line}</span>
    ${total?`<span class="phase-banner-total">${total}</span>`:""}
  </button>`;
}

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
  const tabs = [["today","Heute"],["stats","Statistik"],["phases","Phasen"]];
  let html = `<nav class="tabbar" aria-label="Hauptnavigation">`;
  tabs.forEach(([key,label])=>{
    html += `<button class="tab-btn ${activeTab===key?"active":""}" data-tab="${key}" ${activeTab===key?'aria-current="page"':""}>${TAB_ICONS[key]}<span>${label}</span></button>`;
  });
  html += `</nav>`;
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

/* ---------- Tages-Check-in ---------- */
function chipGroupHtml(field, label, values, current){
  let html = `<div class="ci-row"><span class="ci-label" id="ci-${field}">${label}</span><div class="ci-chips ci-${field}" role="group" aria-labelledby="ci-${field}">`;
  values.forEach(([val,txt])=>{
    html += `<button type="button" class="ci-chip" data-ci-field="${field}" data-ci-val="${val}" aria-pressed="${current===val}">${txt}</button>`;
  });
  return html + `</div></div>`;
}
function checkinCardHtml(dateKey){
  const c = checkins[dateKey] || {};
  const d = parseDate(dateKey);
  const range = (a,b)=> [...Array(b-a+1)].map((_,i)=> [a+i, String(a+i)]);
  return `<section class="checkin-card" aria-labelledby="checkin-title">
    <div class="stat-title" id="checkin-title">Wie fühlst du dich?</div>
    ${chipGroupHtml("energy", "Energie", range(1,5), c.energy)}
    ${chipGroupHtml("shin", "Schienbein", range(0,10), c.shin)}
    ${chipGroupHtml("circ", "Kreislauf", [["ok","ok"],["komisch","komisch"]], c.circ)}
    <textarea class="ci-note" data-ci-note rows="2" placeholder="Notiz (optional)" aria-label="Notiz zum ${shortDate(d)}">${esc(c.note||"")}</textarea>
    <div class="ci-hint">Gespeichert für ${WEEKDAY_LABELS[(d.getDay()+6)%7]} ${shortDate(d)} · nur auf diesem Gerät</div>
  </section>`;
}
function updateCheckin(dateKey, field, value){
  const entry = {...(checkins[dateKey]||{})};
  if(value===undefined || value==="") delete entry[field]; else entry[field] = value;
  if(Object.keys(entry).length) checkins[dateKey] = entry; else delete checkins[dateKey];
  saveCheckins();
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
  // .today-side / .today-main: auf dem Handy display:contents (unsichtbar),
  // am Desktop ab 1200px zwei Spalten (Kopf+Woche links, Einheiten rechts)
  let html = `<div class="today-side">
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
      <div class="week-row">
        <span class="week-label">${week.label}</span>
        ${WEEK_TYPE_LABEL[week.type] ? `<span class="week-type ${week.type}">${WEEK_TYPE_LABEL[week.type]}</span>` : ""}
      </div>
    </header>
    ${phaseBannerHtml()}
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
  html += `</div><div class="today-main">`;

  const dayData = DAY_MAP[selectedKey];
  if(!dayData){
    html += `<div class="empty">Noch kein Plan hinterlegt.<br>Schick deine Woche, dann kommt der nächste Block in data.js.</div>`;
  } else {
    if(dayData.dayNote) html += `<div class="day-note">${dayData.dayNote}</div>`;
    if(dayData.sessions.length===0 && !dayData.dayNote) html += `<div class="empty">Ruhetag – bewusst nichts tun.</div>`;
    dayData.sessions.forEach((s,idx)=>{ html += sessionCardHtml(s, selectedKey, idx, todayKey); });
  }
  if(selectedKey <= todayKey) html += checkinCardHtml(selectedKey);
  html += `<div class="footer-note">Lokal gespeichert auf diesem Gerät · Stand ${new Date().toLocaleDateString("de-DE")}</div>`;
  html += `</div>`;
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
/* Laufumfang je Woche + 10-%-Regel (Schienbein-Schutz).
   Steigerung bezieht sich auf die geplanten km der letzten gewerteten Woche. */
function fmtKm(km){ return `${km.toLocaleString("de-DE",{maximumFractionDigits:1})} km`; }
function runVolume(week){
  let planned = 0, done = 0;
  weekDateKeys(week).forEach(key=>{
    (DAY_MAP[key]?.sessions || []).forEach((s,idx)=>{
      if(s.sport!=="run" || !s.distanceKm) return;
      planned += s.distanceKm;
      if(isDone(s,key,idx)) done += s.distanceKm;
    });
  });
  return { planned, done };
}
function runVolumeRows(){
  let prevRated = null;
  return WEEKS.map(w=>{
    const vol = runVolume(w);
    const rated = !UNRATED_WEEK_TYPES.includes(w.type);
    let delta = null, level = "";
    if(rated){
      if(prevRated && prevRated.planned>0){
        delta = Math.round((vol.planned/prevRated.planned - 1)*100);
        level = delta>20 ? "high" : delta>10 ? "warn" : "ok";
      }
      prevRated = vol;
    }
    return { week:w, ...vol, rated, delta, level };
  });
}
function runVolumeHtml(){
  const rows = runVolumeRows();
  const lastRated = [...rows].reverse().find(r=> r.rated && r.planned>0);
  let html = `<div class="stat-card">
    <div class="stat-title">Laufumfang &amp; 10-%-Regel</div>
    <div class="vol-table" role="table" aria-label="Laufumfang pro Woche">
      <div class="vol-row vol-head" role="row"><span class="vol-week" role="columnheader">Woche</span><span role="columnheader">geplant</span><span role="columnheader">erledigt</span><span role="columnheader">Δ</span></div>`;
  [...rows].reverse().forEach(r=>{
    const start = parseDate(r.week.start);
    const deltaTxt = !r.rated ? "–" : r.delta===null ? "–" : `${r.delta>0?"+":""}${r.delta} %`;
    html += `<div class="vol-row ${r.rated?"":"unrated"}" role="row">
      <span class="vol-week" role="cell">${shortDate(start)}${!r.rated ? `<small>${WEEK_TYPE_LABEL[r.week.type]} · nicht gewertet</small>` : ""}</span>
      <span role="cell">${fmtKm(r.planned)}</span>
      <span role="cell">${fmtKm(r.done)}</span>
      <span class="vol-delta ${r.level}" role="cell">${deltaTxt}</span>
    </div>`;
  });
  html += `</div>`;
  html += lastRated
    ? `<div class="vol-limit">Limit nächste Woche: <b>≤ ${fmtKm(lastRated.planned*1.1)}</b> (+10 %)</div>`
    : `<div class="vol-limit">Limit nächste Woche: noch keine gewertete Woche</div>`;
  html += `<div class="vol-legend"><span class="ok">≤ +10 % ok</span><span class="warn">+10–20 % Vorsicht</span><span class="high">&gt; +20 % zu viel</span></div>
  </div>`;
  return html;
}

/* Wochen-Check-in als Text für den Coaching-Chat */
function weekCheckinText(week){
  const todayKey = ymd(new Date());
  const keys = weekDateKeys(week);
  const done = [], skipped = [], open = [];
  keys.forEach((key,i)=>{
    (DAY_MAP[key]?.sessions || []).forEach((s,idx)=>{
      const name = `${WEEKDAY_LABELS[i]} ${s.title}`;
      if(isDone(s,key,idx)) done.push(name);
      else if(key < todayKey) skipped.push(name);
      else open.push(name);
    });
  });
  const vol = runVolume(week);
  const start = parseDate(week.start);
  const lines = [
    `Wochen-Check-in ${shortDate(start)}–${shortDate(addDays(start,6))} · ${week.label}`,
    `Erledigt (${done.length}): ${done.join(", ") || "–"}`,
    `Ausgelassen (${skipped.length}): ${skipped.join(", ") || "–"}`
  ];
  if(open.length) lines.push(`Noch offen (${open.length}): ${open.join(", ")}`);
  lines.push(`Laufen: ${fmtKm(vol.done)} von ${fmtKm(vol.planned)} geplant`);
  const feel = [];
  keys.forEach((key,i)=>{
    const c = checkins[key];
    if(!c) return;
    const parts = [];
    if(c.energy!=null) parts.push(`Energie ${c.energy}/5`);
    if(c.shin!=null) parts.push(`Schienbein ${c.shin}/10`);
    if(c.circ) parts.push(`Kreislauf ${c.circ}`);
    if(c.note) parts.push(`Notiz: ${c.note.replace(/\s+/g," ").trim()}`);
    if(parts.length) feel.push(`${WEEKDAY_LABELS[i]} ${shortDate(parseDate(key))}: ${parts.join(" · ")}`);
  });
  lines.push(feel.length ? "Befinden:\n" + feel.join("\n") : "Befinden: keine Einträge");
  return lines.join("\n");
}
function copyText(text){
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(text).catch(()=> copyFallback(text));
  }
  return Promise.resolve(copyFallback(text));
}
function copyFallback(text){
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly","");
  ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try{ ok = document.execCommand("copy"); }catch(e){ ok = false; }
  ta.remove();
  if(!ok) throw new Error("Kopieren nicht möglich");
}

/* Backup: alle localStorage-Keys der App als JSON */
function exportData(){
  const data = {};
  for(let i=0;i<localStorage.length;i++){
    const key = localStorage.key(i);
    if(!key || !key.startsWith(STORAGE_PREFIX)) continue;
    try{ data[key] = JSON.parse(localStorage.getItem(key)); }catch(e){ data[key] = localStorage.getItem(key); }
  }
  const payload = { app:"trainingsplan", version:1, exportedAt:new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trainingsplan-backup-${ymd(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 1000);
}
function importData(file, statusEl){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const payload = JSON.parse(reader.result);
      const data = payload && payload.app==="trainingsplan" ? payload.data : null;
      const keys = data && typeof data==="object" ? Object.keys(data).filter(k=> k.startsWith(STORAGE_PREFIX)) : [];
      if(keys.length===0) throw new Error("keine Trainingsplan-Daten");
      if(!confirm("Die Daten auf diesem Gerät werden durch das Backup ersetzt. Fortfahren?")) return;
      keys.forEach(k=> localStorage.setItem(k, typeof data[k]==="string" ? data[k] : JSON.stringify(data[k])));
      doneFlags = loadJson(STORAGE_KEY);
      checkins = loadJson(CHECKIN_KEY);
      render();
      const el = document.querySelector("[data-backup-status]");
      if(el) el.textContent = "Backup importiert.";
    }catch(e){
      statusEl.textContent = "Import fehlgeschlagen: Datei ist kein gültiges Backup.";
    }
  };
  reader.onerror = ()=>{ statusEl.textContent = "Datei konnte nicht gelesen werden."; };
  reader.readAsText(file);
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
    ${runVolumeHtml()}

    <div class="stat-card">
      <div class="stat-title">Wochen-Check-in</div>
      <p class="card-hint">Erledigte und ausgelassene Einheiten, Laufumfang und dein Befinden dieser Woche als Text für den Coaching-Chat.</p>
      <button type="button" class="action-btn" data-copy-checkin>Wochen-Check-in kopieren</button>
      <div class="action-status" data-copy-status role="status" aria-live="polite"></div>
    </div>

    <div class="stat-card">
      <div class="stat-title">Datensicherung</div>
      <p class="card-hint">Häkchen und Check-ins liegen nur auf diesem Gerät. Ein Backup schützt vor Verlust beim Löschen der Browserdaten.</p>
      <div class="action-row">
        <button type="button" class="action-btn" data-export>Daten exportieren</button>
        <button type="button" class="action-btn" data-import-trigger>Importieren</button>
        <input type="file" accept="application/json,.json" data-import hidden>
      </div>
      <div class="action-status" data-backup-status role="status" aria-live="polite"></div>
    </div>
    <div class="footer-note">Basiert auf den Einheiten, die du in dieser App als erledigt markierst.</div>
  `;
  return html;
}

/* ---------- Tab: Phasen ---------- */
function timelineHtml(t, st){
  const start = parseDate(PLAN_START), end = parseDate(PLAN_END);
  const span = dayDiff(start,end) + 1;
  const pos = d=> clamp(dayDiff(start,d)/span*100, 0, 100);
  let segs = "";
  PHASES.forEach(p=>{
    segs += `<span class="tl-seg ${phaseState(p,st,t)}" style="flex-grow:${phaseDays(p)}" title="${esc(p.name)}"></span>`;
  });
  let dots = "";
  MILESTONES.forEach(m=>{
    const d = parseDate(m.date);
    dots += `<span class="tl-dot ${m.type} ${d<t?"done":""}" style="left:${pos(d)}%" title="${esc(m.title)}"></span>`;
  });
  let months = "";
  for(let m = new Date(start.getFullYear(), start.getMonth(), 1); m <= end; m = new Date(m.getFullYear(), m.getMonth()+1, 1)){
    months += `<span class="tl-month" style="left:${pos(m<start?start:m)}%">${MONTH_SHORT[m.getMonth()]}</span>`;
  }
  let marker = "";
  if(st.mode==="in"){
    const p = clamp((dayDiff(start,t)+0.5)/span*100, 0, 100);
    const edge = p<8 ? "edge-l" : p>92 ? "edge-r" : "";
    marker = `<span class="tl-today ${edge}" style="left:${p}%"><span class="tl-today-lbl">Heute</span><span class="tl-today-line"></span></span>`;
  }
  const label = st.mode==="in"
    ? `Zeitleiste der Vorbereitung: ${st.phase.name}, Gesamtwoche ${st.overallWeek} von ${st.totalWeeks}`
    : `Zeitleiste der Vorbereitung, ${st.totalWeeks} Wochen`;
  return `<div class="timeline" role="img" aria-label="${esc(label)}">
    <div class="tl-area">
      ${marker}
      <div class="tl-bar">${segs}</div>
      <div class="tl-dots">${dots}</div>
      <div class="tl-months">${months}</div>
    </div>
  </div>`;
}
function hereCardHtml(st){
  if(st.mode==="before"){
    return `<div class="here-card">
      <div class="stat-title">Du bist hier</div>
      <div class="here-name">Vor dem Start</div>
      <div class="here-meta">Start ${inDays(st.daysToStart)} · ${st.totalWeeks} Wochen bis Ironman</div>
      <div class="here-next">Als Nächstes: ${shortPhaseName(st.next)} ab ${longDate(parseDate(st.next.start))}</div>
    </div>`;
  }
  if(st.mode==="after"){
    return `<div class="here-card">
      <div class="stat-title">Du bist hier</div>
      <div class="here-name">Nach dem Rennen · Regeneration</div>
      <div class="here-meta">${raceName()} · ${longDate(parseDate(PLAN_END))}</div>
    </div>`;
  }
  return `<div class="here-card current">
    <div class="stat-title">Du bist hier</div>
    <div class="here-name">${st.phase.name}</div>
    <div class="here-tagline">${st.phase.tagline}</div>
    <div class="week-progress-top"><span>Woche <b>${st.week}</b> von ${st.weeks}</span><span>${st.pct} %</span></div>
    <span class="progress-track" role="progressbar" aria-label="Fortschritt ${esc(st.phase.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${st.pct}"><span class="progress-fill" style="width:${st.pct}%"></span></span>
    <div class="here-next">${nextPhaseLine(st)}</div>
  </div>`;
}
function listHtml(items){ return `<ul class="phase-list">${items.map(i=>`<li>${i}</li>`).join("")}</ul>`; }
function phaseItemHtml(p, state){
  const ps = parseDate(p.start), pe = parseDate(p.end);
  const chip = { done:"abgeschlossen", current:"aktuell", upcoming:"kommend" }[state];
  const weeks = phaseWeeks(p);
  let body = `<p class="phase-tagline">${p.tagline}</p>`;
  if(p.goals?.length) body += `<div class="phase-sub">Ziele</div>${listHtml(p.goals)}`;
  if(p.focus){
    body += `<div class="phase-sub">Schwerpunkte</div><div class="phase-rows">`;
    FOCUS_ROWS.forEach(([k,label])=>{
      if(p.focus[k]) body += `<div class="block" style="--accent-c:${ACCENT[k]||"var(--rest)"}"><span class="block-label">${label}</span><span class="block-text">${p.focus[k]}</span></div>`;
    });
    body += `</div>`;
  }
  if(p.targets){
    body += `<div class="phase-sub">Richtwerte</div><div class="phase-rows">`;
    ["run","bike","swim"].forEach(k=>{
      if(p.targets[k]) body += `<div class="block" style="--accent-c:${ACCENT[k]}"><span class="block-label">${SPORT_LABEL[k]}</span><span class="block-text">${p.targets[k]}</span></div>`;
    });
    body += `</div>`;
  }
  if(p.readyWhen?.length) body += `<div class="phase-sub">Bereit für die nächste Phase, wenn …</div>${listHtml(p.readyWhen)}`;
  if(p.watchOut?.length) body += `<div class="phase-sub">Worauf achten</div>${listHtml(p.watchOut)}`;
  return `<details class="phase-item ${state}" id="phase-${p.key}" data-phase="${p.key}" ${openPhases.has(p.key)?"open":""}>
    <summary>
      <span class="phase-sum-main">
        <span class="phase-name">${p.name}</span>
        <span class="phase-range">${longDate(ps)} – ${longDate(pe)} · ${weeks} Woche${weeks===1?"":"n"}</span>
      </span>
      <span class="status-chip ${state}">${chip}</span>
      <span class="phase-chevron" aria-hidden="true">›</span>
    </summary>
    <div class="phase-body">${body}</div>
  </details>`;
}
function milestonesHtml(t){
  const nextIdx = MILESTONES.findIndex(m=> parseDate(m.date) >= t);
  let html = `<ol class="ms-list">`;
  MILESTONES.forEach((m,i)=>{
    const d = parseDate(m.date);
    const diff = dayDiff(t,d);
    const state = diff<0 ? "done" : i===nextIdx ? "next" : "upcoming";
    const when = state==="done" ? "erledigt" : inDays(diff);
    html += `<li class="ms-item ${state} ${m.type}">
      <span class="ms-icon" aria-hidden="true">${MILESTONE_ICONS[m.type] || MILESTONE_ICONS.checkpoint}</span>
      <span class="ms-main">
        <span class="ms-title">${m.title}</span>
        <span class="ms-meta">${longDate(d)} · ${when}${state==="next"?' · <b>nächster</b>':""}${m.tentative ? ` <span class="status-chip tentative">unter Vorbehalt</span>` : ""}</span>
        ${m.note && !(m.tentative && /^unter vorbehalt$/i.test(m.note)) ? `<span class="ms-note">${m.note}</span>` : ""}
      </span>
    </li>`;
  });
  return html + `</ol>`;
}
function renderPhases(){
  const t = todayDate();
  const st = phaseStatus(t);
  if(!openPhases) openPhases = new Set(st.mode==="in" ? [st.phase.key] : []);
  const dRace = dayDiff(t, parseDate(PLAN_END));
  const raceInfo = dRace>1 ? `noch ${dRace} Tage` : dRace===1 ? "noch 1 Tag" : dRace===0 ? "heute" : "vorbei";
  let html = `<div class="section-title">Phasen</div>
    <div class="section-sub">${raceName()} · ${longDate(parseDate(PLAN_END))} · ${raceInfo}</div>
    ${timelineHtml(t, st)}
    ${hereCardHtml(st)}
    <div class="stat-title phase-section-title">Alle Phasen</div>`;
  PHASES.forEach(p=>{ html += phaseItemHtml(p, phaseState(p,st,t)); });
  html += `<div class="stat-title phase-section-title">Meilensteine</div>${milestonesHtml(t)}`;
  html += `<div class="footer-note">Phasen sind Planungsrichtwerte und werden nach jedem Check-in angepasst.</div>`;
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

/* ---------- Event-Handler (neue Bereiche) ---------- */
function bindPhaseHandlers(app){
  app.querySelector("[data-goto-phase]")?.addEventListener("click", e=>{
    const key = e.currentTarget.dataset.gotoPhase;
    if(!openPhases) openPhases = new Set();
    if(key) openPhases.add(key);
    activeTab = "phases";
    render("tab");
    const el = key && document.getElementById("phase-"+key);
    if(el && el.scrollIntoView){
      const smooth = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      el.scrollIntoView({ block:"start", behavior: smooth ? "smooth" : "auto" });
    } else window.scrollTo(0,0);
  });
  app.querySelectorAll("details.phase-item").forEach(d=>{
    d.addEventListener("toggle", ()=>{
      if(d.open) openPhases.add(d.dataset.phase); else openPhases.delete(d.dataset.phase);
    });
  });
}
function bindCheckinHandlers(app){
  // Kein render(): nur die Chips der Gruppe umschalten, damit Fokus/Scroll bleiben
  app.querySelectorAll(".ci-chip").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const field = btn.dataset.ciField;
      const raw = btn.dataset.ciVal;
      const val = field==="circ" ? raw : Number(raw);
      const wasOn = btn.getAttribute("aria-pressed")==="true";
      updateCheckin(selectedKey, field, wasOn ? undefined : val);
      btn.parentElement.querySelectorAll(".ci-chip").forEach(c=> c.setAttribute("aria-pressed", String(c===btn && !wasOn)));
    });
  });
  const note = app.querySelector("[data-ci-note]");
  if(note) note.addEventListener("input", ()=> updateCheckin(selectedKey, "note", note.value.trim() ? note.value : undefined));
}
function bindStatsHandlers(app){
  const copyBtn = app.querySelector("[data-copy-checkin]");
  if(copyBtn) copyBtn.addEventListener("click", ()=>{
    const status = app.querySelector("[data-copy-status]");
    copyText(weekCheckinText(weekForKey(ymd(new Date()))))
      .then(()=>{ status.textContent = "Kopiert – jetzt im Coaching-Chat einfügen."; })
      .catch(()=>{ status.textContent = "Kopieren nicht möglich."; });
  });
  app.querySelector("[data-export]")?.addEventListener("click", ()=>{
    const status = app.querySelector("[data-backup-status]");
    try{ exportData(); status.textContent = "Backup-Datei erstellt."; }
    catch(e){ status.textContent = "Export fehlgeschlagen."; }
  });
  const fileInput = app.querySelector("[data-import]");
  app.querySelector("[data-import-trigger]")?.addEventListener("click", ()=> fileInput.click());
  if(fileInput) fileInput.addEventListener("change", ()=>{
    if(fileInput.files && fileInput.files[0]) importData(fileInput.files[0], app.querySelector("[data-backup-status]"));
  });
}

/* ---------- Haupt-Render ---------- */
function render(reason, detail){
  const app = document.getElementById("app");
  const prevFillWidth = app.querySelector(".week-progress .progress-fill")?.style.width;
  let html = "";
  if(activeTab==="today") html = renderToday();
  else if(activeTab==="stats") html = renderStats();
  else if(activeTab==="phases") html = renderPhases();

  app.innerHTML = `<main class="view view-${activeTab}">${html}</main>` + tabbarHtml();
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
  bindPhaseHandlers(app);
  bindCheckinHandlers(app);
  bindStatsHandlers(app);
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
