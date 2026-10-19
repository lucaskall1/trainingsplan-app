/* ==========================================================
   TRAININGSDATEN
   Wird jede Woche aktualisiert: neues Objekt unten ins
   WEEKS-Array anhaengen. durationMin/distanceKm sind fuer die
   Statistik-Auswertung da, *Label ueberschreibt nur die Anzeige.
   ========================================================== */

const RACES = [
  { key:"halbmarathon", name:"Halbmarathon",            date:"2026-10-25" },
  { key:"ironman",  name:"Ironman Frankfurt",   date:"2027-06-27" }
];

const WEEKS = [
{
  start: "2026-10-19",
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
