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
  start: "2026-10-05",
  label: "Aufbau-Woche 2 · Wiedereinstieg & FTP",
  days: {
    "2026-10-05": { sessions: [
      { sport:"rest", title:"Mobility", durationMin:20, intensity:"locker",
        note:"Heute bewusst nur Mobility (Halskratzen, schlapp)." }
    ]},
    "2026-10-06": { sessions: [
      { sport:"swim", title:"Schwimmen locker", durationLabel:"35–50 min", durationMin:40, distanceKm:1.5, intensity:"locker, Technik",
        note:"→ Einheit 3 (Beinschlag-Schwerpunkt) aus deinem triswim-Plan. Nur bei Ampel Grün/Gelb. Vorher essen, nachher langsam aufstehen." },
      { sport:"run", title:"Laufen locker", durationMin:24, distanceKm:4, intensity:"locker, ca. 6:05/km",
        note:"Nur bei Ampel Grün (Hals nicht schlimmer, normale Energie). Sonst entfällt der Lauf." }
    ]},
    "2026-10-07": { sessions: [
      { sport:"bike", title:"Rad locker", durationMin:45, intensity:"Z1–Z2, ca. 125–145 W" },
      { sport:"strength", title:"Kraft Beine + Stabi", durationMin:45, intensity:"moderat, kontrolliert",
        blocks:[
          {label:"Fokus", text:"Kniebeuge, Rumänisches Kreuzheben, Beinpresse, Wadenheben – kontrolliert, kein Plyo"},
          {label:"Stabi", text:"Hüfte/Fuß/Schienbein-Stabilisation, Eccentric-Waden"}
        ] }
    ]},
    "2026-10-08": { sessions: [
      { sport:"swim", title:"Schwimmen", durationLabel:"45–60 min", durationMin:50, distanceKm:1.8, intensity:"locker bis zügig, Tempo-Teile moderater",
        note:"→ Einheit 4 (Intensität) aus deinem triswim-Plan." },
      { sport:"run", title:"Laufen locker", durationMin:27, distanceKm:4.5, intensity:"locker, ca. 6:05/km" },
      { sport:"rest", title:"Mobility", durationMin:15, intensity:"locker" }
    ]},
    "2026-10-09": { sessions: [
      { sport:"strength", title:"Kraft Oberkörper", durationMin:40, intensity:"moderat" },
      { sport:"bike", title:"FTP-Test (Rolle)", durationMin:45, intensity:"Ramp-Test, Test maximal, drumherum locker",
        blocks:[
          {label:"Warm-up", text:"10–15 min locker einrollen"},
          {label:"Test", text:"Ramp-Test bis zum Abbruch, nicht selbst pacen"},
          {label:"Cooldown", text:"5–10 min ganz locker, danach erst hinsetzen, dann aufstehen"}
        ],
        note:"Nur wenn komplett symptomfrei und Hausarzt-Check erledigt. Mit Mahlzeit davor, jemand in der Wohnung. Sonst lockerer Spin statt Test." }
    ]},
    "2026-10-10": { sessions: [
      { sport:"bike", title:"Lange Rad-Einheit", durationLabel:"2:00–2:30 h", durationMin:135, intensity:"Zone 2 (56–75 % FTP)",
        note:"Wenn die Beine nach dem Test schwer sind: bei 1:30 h aufhören. Ohne FTP-Wert: wie zuletzt bei ca. 140–155 W." }
    ]},
    "2026-10-11": { sessions: [
      { sport:"run", title:"Long Run", durationMin:67, distanceKm:11, intensity:"locker, ca. 6:05/km, nicht schneller",
        note:"Checkpoint 1 für die Marathon-Frage: Schienbeine und Kreislauf bei km 8–11 beobachten." },
      { sport:"rest", title:"Mobility", durationMin:15, intensity:"locker" }
    ]}
  }
}
];
