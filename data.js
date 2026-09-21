/* ==========================================================
   TRAININGSDATEN
   Wird jede Woche aktualisiert: neues Objekt unten ins
   WEEKS-Array anhaengen. durationMin/distanceKm sind fuer die
   Statistik-Auswertung da, *Label ueberschreibt nur die Anzeige.
   ========================================================== */

const RACES = [
  { key:"erkner",   name:"Erkner 70.3",         date:"2026-09-13" },
  { key:"marathon", name:"Marathon",            date:"2026-10-25" },
  { key:"ironman",  name:"Ironman Frankfurt",   date:"2027-06-27" }
];

const WEEKS = [
 {
  start: "2026-09-21",
  label: "Aufbau-Woche 1 · Richtung Marathon",
  days: {
    "2026-09-21": { sessions: [
      { sport:"swim", title:"Schwimmen locker", durationMin:30, distanceKm:1.3, intensity:"locker, Technikfokus" },
      { sport:"strength", title:"Kraft Beine", durationMin:48, intensity:"moderat, kontrolliert",
        blocks:[
          {label:"Fokus", text:"Kniebeuge, Rumänisches Kreuzheben, Beinpresse, Wadenheben – kontrolliert, kein Plyo/Sprünge"},
          {label:"Hinweis", text:"Eccentric-Wadenarbeit bewusst mit drin, wirkt schienbeinschützend"}
        ] }
    ]},
    "2026-09-22": { sessions: [
      { sport:"bike", title:"Rad locker", durationMin:35, intensity:"locker, Z1-Z2" },
      { sport:"run", title:"Laufen locker", durationMin:36, distanceKm:6, intensity:"locker, ca. 6:10/km" }
    ]},
    "2026-09-23": { sessions: [
      { sport:"rest", title:"Mobility", durationMin:18, intensity:"locker" },
      { sport:"bike", title:"FTP-Test (Rolle)", durationMin:45, intensity:"Ramp-Test – Warm-up locker, Test maximal, Cooldown locker",
        blocks:[
          {label:"Warm-up", text:"10–15 min locker einrollen (Zwift führt meist automatisch durch)"},
          {label:"Test", text:"Ramp-Test bis zum Abbruch – volle Anstrengung, nicht selbst pacen"},
          {label:"Cooldown", text:"5–10 min ganz locker ausrollen"}
        ],
        note:"Legs heute sonst freihalten – Mobility morgens stört den Test nicht." }
    ]},
    "2026-09-24": { sessions: [
      { sport:"swim", title:"Schwimmen locker", durationMin:35, distanceKm:1.5, intensity:"locker, mit Technik-Drills" },
      { sport:"run", title:"Laufen locker", durationMin:39, distanceKm:6.5, intensity:"locker" }
    ]},
    "2026-09-25": { sessions: [
      { sport:"bike", title:"Rad locker/Z2", durationMin:50, intensity:"locker bis Z2" },
      { sport:"strength", title:"Kraft Oberkörper", durationMin:48, intensity:"moderat" }
    ]},
    "2026-09-26": { sessions: [
      { sport:"run", title:"Long Run", durationLabel:"9–10 km", durationMin:58, distanceKm:9.5, intensity:"locker, Z2" }
    ]},
    "2026-09-27": { sessions: [
      { sport:"bike", title:"Lange Rad-Einheit", durationLabel:"1:30–2:00 h", durationMin:105, intensity:"Zone 2, Rolle oder outdoor" },
      { sport:"rest", title:"Mobility", durationMin:18, intensity:"locker" }
    ]}
  }
  }
];
