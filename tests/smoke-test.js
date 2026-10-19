/* ==========================================================
   SMOKE-TEST – rendert alle drei Tabs fuer mehrere Stichtage
   Aufruf aus dem Projektordner:  node tests/smoke-test.js
   (laeuft auch mit macOS-JavaScriptCore: jsc tests/smoke-test.js)
   Kein DOM noetig: document/localStorage/Date werden simuliert,
   data.js + app.js laufen in einer Funktion mit diesen Stubs.
   ========================================================== */

const isNode = typeof require === "function" && typeof process !== "undefined";
const log = isNode ? console.log : print;
function read(file){
  if(isNode){
    const path = require("path");
    return require("fs").readFileSync(path.join(__dirname, "..", file), "utf8");
  }
  return readFile(file); // jsc: relativ zum Arbeitsverzeichnis
}

const SRC = read("data.js") + "\n" + read("app.js");
const CASES = [
  { date:"2026-09-01", expect:["Vorbereitung", "Start in 34 Tagen", "Gesamt: 38 Wochen bis Ironman"] },
  { date:"2026-10-19", expect:["Grundlagenphase", "Woche <b>3</b> von 17", "Gesamt: Woche 3 von 38 bis Ironman", "Als Nächstes: Aufbauphase ab 01.02.2027 (in 105 Tagen)"] },
  { date:"2027-02-01", expect:["Aufbauphase", "Woche <b>1</b> von 12", "Gesamt: Woche 18 von 38"] },
  { date:"2027-04-30", expect:["Regeneration nach Hamburg", "Woche <b>1</b> von 2"] },
  { date:"2027-06-20", expect:["Tapering &amp; Rennwoche", "Woche <b>2</b> von 3", "Ironman Frankfurt am 27.06.2027 (in 7 Tagen)"] },
  { date:"2027-07-01", expect:["Nach dem Rennen · Regeneration"] }
];

let failures = 0;
function check(cond, msg){ if(!cond){ failures++; log("  ✗ " + msg); } }

// Grobe Strukturpruefung: oeffnende/schliessende Tags muessen zusammenpassen
function checkTags(html, where){
  const re = /<(\/?)(div|span|button|details|summary|section|ul|ol|li|nav|main|p|textarea|header|b|small)\b[^>]*>/g;
  const stack = [];
  let m;
  while((m = re.exec(html))){
    if(!m[1]) stack.push(m[2]);
    else if(stack.pop() !== m[2]) return check(false, `${where}: </${m[2]}> passt nicht`);
  }
  check(stack.length === 0, `${where}: ${stack.length} Tag(s) nicht geschlossen (${stack.slice(-3).join(",")})`);
}

function makeEnv(dateKey){
  const [y,mo,d] = dateKey.split("-").map(Number);
  const FIXED = new Date(y, mo-1, d, 9, 30).getTime();
  class FakeDate extends Date {
    constructor(...args){ if(args.length === 0) super(FIXED); else super(...args); }
    static now(){ return FIXED; }
  }
  const store = {
    "trainingsplan-done-flags": JSON.stringify({ "2026-10-19#0": true, "2026-10-20#0": true }),
    "trainingsplan-checkins": JSON.stringify({ "2026-10-19": { energy:4, shin:1, circ:"ok", note:"<b>Test</b> & Notiz" } })
  };
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k,v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
    key: i => Object.keys(store)[i] ?? null,
    get length(){ return Object.keys(store).length; }
  };
  const stubEl = () => ({ innerHTML:"", className:"", style:{}, classList:{ add(){} },
    querySelector(){ return null; }, querySelectorAll(){ return []; }, addEventListener(){} });
  const appEl = stubEl();
  const document = {
    getElementById: id => (id === "app" ? appEl : stubEl()),
    querySelector: () => null, createElement: () => stubEl(), addEventListener(){}, body:{ appendChild(){} }
  };
  const window = { addEventListener(){}, scrollTo(){}, matchMedia: () => ({ matches:false }), isSecureContext:true };
  return { FakeDate, localStorage, document, window, navigator:{}, appEl };
}

CASES.forEach(c=>{
  log(`▸ ${c.date}`);
  const env = makeEnv(c.date);
  let api;
  try{
    api = new Function("Date","localStorage","document","window","navigator",
      SRC + `
      ;return {
        render,
        setTab: t => { activeTab = t; },
        phaseStatus, todayDate, weekCheckinText, weekForKey, ymd
      };`
    )(env.FakeDate, env.localStorage, env.document, env.window, env.navigator);
  }catch(e){
    check(false, "Laden fehlgeschlagen: " + e.message);
    return;
  }
  const out = {};
  ["today","stats","phases"].forEach(tab=>{
    try{
      api.setTab(tab);
      api.render("tab");
      out[tab] = env.appEl.innerHTML;
      check(out[tab].length > 500, `${tab}: Ausgabe zu kurz`);
      check(!/undefined|NaN|\[object /.test(out[tab]), `${tab}: enthält undefined/NaN/[object`);
      check(!/history|Verlauf/.test(out[tab]), `${tab}: Reste vom Verlauf-Tab`);
      checkTags(out[tab], tab);
    }catch(e){
      check(false, `${tab}: ${e.stack || e.message}`);
      out[tab] = "";
    }
  });
  c.expect.forEach(txt=> check(out.today.includes(txt) || out.phases.includes(txt), `erwartet: "${txt}"`));
  const st = api.phaseStatus(api.todayDate());
  const currentCount = (out.phases.match(/class="phase-item current"/g) || []).length;
  check(currentCount === (st.mode === "in" ? 1 : 0), `Anzahl aktueller Phasen: ${currentCount}`);
  check(out.phases.includes("Phasen sind Planungsrichtwerte"), "Fußnote fehlt");
  check(out.stats.includes("Laufumfang") && out.stats.includes("Renn-Woche · nicht gewertet"), "Laufumfang-Karte fehlt");
  check(!out.today.includes("<b>Test</b>"), "Check-in-Notiz nicht escaped");
  log(`  ${st.mode === "in" ? `${st.phase.name} · Woche ${st.week}/${st.weeks} · gesamt ${st.overallWeek}/${st.totalWeeks}` : st.mode}`);
  if(c.date === "2026-10-19"){
    log("  --- Wochen-Check-in-Text ---");
    api.weekCheckinText(api.weekForKey(api.ymd(new env.FakeDate()))).split("\n").forEach(l=> log("  | " + l));
  }
});

// Jeder Tag zwischen PLAN_START und PLAN_END liegt in genau einer Phase (keine Lücken)
{
  const env = makeEnv("2026-10-19");
  const api = new Function("Date","localStorage","document","window","navigator",
    SRC + ";return { PHASES, PLAN_START, PLAN_END, parseDate, addDays, ymd };"
  )(env.FakeDate, env.localStorage, env.document, env.window, env.navigator);
  const { PHASES, PLAN_START, PLAN_END, parseDate, addDays, ymd } = api;
  check(PHASES[0].start === PLAN_START && PHASES[PHASES.length-1].end === PLAN_END, "Phasen decken PLAN_START–PLAN_END nicht ab");
  for(let i=1;i<PHASES.length;i++){
    check(ymd(addDays(parseDate(PHASES[i-1].end),1)) === PHASES[i].start, `Lücke/Überlappung vor ${PHASES[i].key}`);
  }
}

log(failures ? `\n${failures} Fehler` : "\nAlle Checks bestanden.");
if(failures){ if(isNode) process.exitCode = 1; else throw new Error(`${failures} Fehler`); }
