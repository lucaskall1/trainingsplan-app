/* ==========================================================
   TRAININGSDATEN
   Wird jede Woche aktualisiert: neues Objekt unten ins
   WEEKS-Array anhaengen. durationMin/distanceKm sind fuer die
   Statistik-Auswertung da, *Label ueberschreibt nur die Anzeige.
   ========================================================== */

const RACES = [
  { key:"halbmarathon", name:"Halbmarathon",      date:"2026-10-25" },
  { key:"hamburg",      name:"Hamburg Marathon",  date:"2027-04-25" },
  { key:"ironman",      name:"Ironman Frankfurt", date:"2027-06-27" }
];

/* ==========================================================
   PHASEN & MEILENSTEINE
   Planungsrichtwerte bis zum Ironman. Werden nach Check-ins hier
   angepasst. Phasen muessen lueckenlos aneinander anschliessen
   (end + 1 Tag = start der naechsten Phase).
   ========================================================== */

const PLAN_START = "2026-10-05";
const PLAN_END   = "2027-06-27"; // Ironman Frankfurt

const PHASES = [
  { key:"grundlagen", name:"Grundlagenphase", start:"2026-10-05", end:"2027-01-31",
    tagline:"Basis legen: Ausdauer, Technik, belastbare Schienbeine",
    goals:[
      "Laufumfang von ~15 auf 35–40 km/Woche (max. +10 %/Woche, jede 4. Woche Entlastung)",
      "Schwimmtechnik verbessern (triswim-Plan Einheit 1–15, Retest am Ende)",
      "FTP-Test, danach Rad in Watt-Zonen",
      "Kraft 2×/Woche (Oberkörper/Beine getrennt), regelmäßig Mobility"
    ],
    focus:{ swim:"Technik & Wassergefühl, 2×/Woche", bike:"Zone 2, 4–6 h/Woche, erster FTP-Test",
            run:"nur locker (Z2), Tempo nur als kurze Steigerungsläufe", strength:"2×/Woche, Fokus Waden/Hüfte/Rumpf",
            recovery:"Entlastungswoche alle 4 Wochen" },
    targets:{ run:"15 → 35–40 km/Woche", bike:"4–6 h/Woche", swim:"2 Einheiten, 3–4 km/Woche" },
    readyWhen:["2–3 Wochen in Folge ≥ 35 km Laufen ohne Schienbein-Reaktion","FTP bekannt, Zonen etabliert","Keine Kreislauf-Episoden mehr"],
    watchOut:["Schienbeinschmerz ab 3/10 → Umfang einfrieren","Steigerung nie > 10 %/Woche"] },

  { key:"aufbau", name:"Aufbauphase (Hamburg-Marathon)", start:"2027-02-01", end:"2027-04-25",
    tagline:"Marathon-Form und lange Radeinheiten aufbauen",
    goals:[
      "Laufumfang auf 40–45 km/Woche (Deckel ~45), Long Run schrittweise bis 28–30 km",
      "Long Ride von 2:30 h auf ~4 h in Zone 2, erste Sweetspot/Zone-3-Blöcke",
      "Hamburg Marathon 25.04.2027 als Generalprobe (unter Vorbehalt, siehe Checkpoints)"
    ],
    focus:{ swim:"Ausdauer, 2–3×/Woche, Freiwasser-Planung", bike:"Long Ride am Wochenende, Watt-Zonen aus FTP",
            run:"Wochenumfang + Long Run, Tempo nur kontrolliert", strength:"1–2×/Woche, Erhaltung", recovery:"Entlastungswoche alle 4 Wochen" },
    targets:{ run:"40–45 km/Woche, Long Run bis 28–30 km", bike:"6–9 h/Woche", swim:"2–3 Einheiten, 4–6 km/Woche" },
    readyWhen:["Marathon gesund beendet oder bewusst auf Halbmarathon umgestellt","Schienbeine ruhig"],
    watchOut:["Long Run und Long Ride konkurrieren ums Wochenende (z. B. Sa Lauf, So Rad)","Hamburg nur, wenn Checkpoints erfüllt sind"] },

  { key:"regeneration", name:"Regeneration nach Hamburg", start:"2027-04-26", end:"2027-05-09",
    tagline:"Erholen, dann sauber in den Spitzenblock",
    goals:["Laufen stark reduzieren (erst nach 7–10 Tagen locker wieder einsteigen)","Rad und Schwimmen locker, Schlaf und Ernährung","Schienbein-Check, Material prüfen"],
    focus:{ swim:"locker, Technik", bike:"locker, 3–5 h/Woche", run:"erst nach ~7–10 Tagen locker wieder", strength:"leicht, kein Beine-Schwerpunkt", recovery:"Priorität" },
    targets:{ run:"0 → 15 km/Woche", bike:"3–5 h/Woche", swim:"2 Einheiten" },
    readyWhen:["Beine frisch, schmerzfrei","Keine Müdigkeits- oder Infekt-Zeichen"],
    watchOut:["Zu früh zu viel laufen nach dem Marathon"] },

  { key:"spezifisch", name:"Spezifische Phase (Ironman-Spitze)", start:"2027-05-10", end:"2027-06-06",
    tagline:"Rennspezifisch: lang, Koppeltraining, Verpflegung testen",
    goals:["Long Rides 4–6 h im Ironman-Tempo (ca. 65–72 % FTP)","Koppeltraining Rad → Lauf","Freiwasser, 3,8-km-Schwimmtest","Verpflegung und Material im Training testen"],
    focus:{ swim:"Ausdauer + Freiwasser", bike:"Long Ride 4–6 h, Rennwatt", run:"35–45 km/Woche, 1 Long Run bis ~24 km, locker", strength:"1×/Woche Erhaltung", recovery:"Schlaf, Entlastung in Woche 4" },
    targets:{ run:"35–45 km/Woche", bike:"8–12 h/Woche", swim:"3 Einheiten, 6–8 km/Woche" },
    readyWhen:["Lange Einheiten ohne Einbruch","Verpflegung getestet","Gesund"],
    watchOut:["Überreizung und Infekt-Risiko","Nichts Neues ausprobieren, was nicht schon getestet ist"] },

  { key:"taper", name:"Tapering & Rennwoche", start:"2027-06-07", end:"2027-06-27",
    tagline:"Frisch an die Startlinie",
    goals:["Umfang schrittweise senken (ca. −20 %, −40 %, −60 %), kurze Intensitätsreize bleiben","Schlaf, Ernährung, Anreise, Material"],
    focus:{ swim:"kurz, locker + ein paar Rennpace-Intervalle", bike:"kurz, locker, Opener", run:"kurz, locker, Steigerungen", strength:"leicht oder pausieren", recovery:"Priorität" },
    targets:{ run:"stark reduziert", bike:"stark reduziert", swim:"kurz" },
    readyWhen:[],
    watchOut:["Nervosität/Phantomschmerzen","Infekte vermeiden","Nichts Neues"] }
];

const MILESTONES = [
  { date:"2026-10-25", title:"Halbmarathon", type:"race", note:"Zwischenziel, danach 1 Woche kein Laufen" },
  { date:"2026-11-02", title:"FTP-Test (Ramp)", type:"test", note:"Danach Rad-Zonen in Watt" },
  { date:"2026-12-06", title:"Schwimm-Retest (triswim Einheit 15)", type:"test", note:"Termin voraussichtlich, je nach Fortschritt", tentative:true },
  { date:"2027-01-31", title:"Checkpoint: 40 km/Woche ohne Schienbein-Reaktion", type:"checkpoint", note:"Entscheidet über Hamburg" },
  { date:"2027-03-21", title:"Checkpoint: Long Run ≥ 24 km", type:"checkpoint", note:"Sonst Halbmarathon statt Marathon in Hamburg" },
  { date:"2027-04-25", title:"Hamburg Marathon", type:"race", note:"Unter Vorbehalt", tentative:true },
  { date:"2027-06-07", title:"Taper-Start", type:"checkpoint", note:"" },
  { date:"2027-06-27", title:"Ironman Frankfurt", type:"race", note:"Hauptziel" }
];

/* WEEKS: type (optional) = "build" | "deload" | "recovery" | "race" | "taper"
   → Badge im Heute-Tab; "race"/"recovery" zaehlen nicht fuer die 10-%-Regel. */

const WEEKS = [
{
  start: "2026-10-19",
  type: "race",
  label: "Halbmarathon-Woche · Pace-Tesst & Rennen",
  days: {
    "2026-10-19": { sessions: [
      { sport:"swim", title:"Schwimmen", durationLabel:"40–55min", durationMin:45, distanceKm:1.7, intensity:"locker, Technik",
        note:"→ Einheit 5 (Effizienz) aus deinem triswim-Plan." },
      { sport:"strength", title:"Kraft Oberkörper", durationMin:40, intensity:"moderat, 2–3 Wdh. im Tank",
        note:"Keine Beine diese Woche." }
    ]},
    "2026-10-20": { sessions: [
      { sport:"run", title:"Pace-Test Halbmarathon", durationMin:50, distanceKm:8, intensity:"3 × 1 km @ 5:00/km",
        blocks:[
          {label:"Warm-up", text:"15 min locker (~6:15/km), 4 × 20 s Steigerungen"},
          {label:"Test", text:"3 × 1 km bei 5:00/km, dazwischen 2:30 min Trab. Nicht schneller, im Zweifel eine Wiederholung weglassen"},
          {label:"Cool-down", text:"10 min locker auslaufen"}
        ],
        note:"HF und Gefühl am Ende jedes km notieren und mir schicken. Entscheidet die Race-Pace: kontrolliert → 5:03–5:05, zäh → 5:10–5:15." }
    ]},
    "2026-10-21": { sessions: [
      { sport:"bike", title:"Rad locker", durationMin:60, intensity:"Z1–Z2, ca. 130–150 W" },
      { sport:"rest", title:"Mobility", durationMin:15, intensity:"locker" }
    ]},
    "2026-10-22": { sessions: [
      { sport:"run", title:"Lauf locker + Steigerungen", durationMin:30, distanceKm:5, intensity:"locker, ca. 6:00/km",
        note:"Am Ende 4 × 20 s Steigerungen. Früh vor der Arbeit, vorher etwas essen." },
      { sport:"swim", title:"Schwimmen", durationLabel:"50–65 min", durationMin:50, distanceKm:1.7, intensity:"locker, leichtere Option",
        note:"→ Einheit 6 (Volumen) aus deinem triswim-Plan, die leichtere Option wählen." }
    ]},
    "2026-10-23": { sessions: [
      { sport:"rest", title:"Ruhetag", durationMin:15, intensity:"Mobility, locker",
        note:"Startunterlagen holen, Sachen packen, viel trinken. Keine Sauna." }
    ]},
    "2026-10-24": { sessions: [
      { sport:"run", title:"Shakeout", durationMin:22, distanceKm:3.5, intensity:"ganz locker + 3 Steigerungen" }
    ]},
    "2026-10-25": { sessions: [
      { sport:"race", title:"Halbmarathon", durationLabel:"1:46–1:52 h", durationMin:108, distanceKm:21.1, intensity:"Ziel 5:03–5:13/km", excludeFromStats:true,
        blocks:[
          {label:"Vorher", text:"Frühstück 2,5–3 h vorher, Wasser + Elektrolyte. Nicht lange stehen, sitzen bis kurz vor dem Start"},
          {label:"Km 1–3", text:"5:10–5:12, auch wenn es zu locker wirkt"},
          {label:"Ab km 10", text:"Tempo nach Gefühl und Test-Ergebnis. Bei HF > ~165 bis km 10 Tempo rausnehmen"},
          {label:"Abbruch", text:"Schienbeinschmerz ab 3/10 oder Schwindel/Schwäche/Tunnelblick → gehen, hinsetzen, Sanitäter"}
        ],
        note:"Danach 1 Woche kein Laufen, nur Rad/Schwimmen/Mobility." }
    ]}
  }
}
];
