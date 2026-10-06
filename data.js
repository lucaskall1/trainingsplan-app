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
  label: "Aufbau-Woche 2 · Wiedereinstieg",
  days: {
    "2026-10-05": { sessions: [
      { sport:"rest", title:"Mobility", durationMin:20, intensity:"locker", logged:true }
    ]},
    "2026-10-06": { sessions: [
      { sport:"swim", title:"Schwimmen", durationMin:40, distanceKm:1.5, intensity:"locker, Technik", logged:true,
        note:"→ Einheit 3 (Beinschlag-Schwerpunkt) aus deinem triswim-Plan." },
      { sport:"run", title:"Laufen locker", durationMin:24, distanceKm:4, intensity:"locker", logged:true }
    ]},
    "2026-10-07": { sessions: [
      { sport:"bike", title:"Lange Rad-Einheit", durationLabel:"2:00–2:30 h", durationMin:135, intensity:"Zone 2, ca. 140–155 W",
        note:"Gegen 10–12:30 Uhr, nach dem Frühstück, mit Trinken und Kohlenhydraten ab der 2. Stunde. Bei Müdigkeit bei 1:30 h aufhören, bei komischem Gefühl sofort abbrechen." },
      { sport:"strength", title:"Kraft Oberkörper (optional)", durationMin:40, intensity:"moderat",
        note:"Abends, nur wenn Energie und Lernplan passen." }
    ]},
    "2026-10-08": { sessions: [
      { sport:"swim", title:"Schwimmen", durationLabel:"45–60 min", durationMin:50, distanceKm:1.8, intensity:"locker bis zügig, Tempo-Teile moderater",
        note:"→ Einheit 4 (Intensität) aus deinem triswim-Plan." },
      { sport:"strength", title:"Kraft Beine + Stabi", durationMin:45, intensity:"moderat, 2–3 Wdh. im Tank",
        blocks:[
          {label:"Fokus", text:"Kniebeuge, Rumänisches Kreuzheben, Beinpresse, Wadenheben – kontrolliert, kein Plyo"},
          {label:"Stabi", text:"Hüfte/Fuß/Schienbein-Stabilisation, Eccentric-Waden"}
        ],
        note:"Kein Muskelkater provozieren, am Samstag steht der Long Run." }
    ]},
    "2026-10-09": { sessions: [
      { sport:"run", title:"Laufen locker", durationMin:27, distanceKm:4.5, intensity:"locker, ca. 6:05/km",
        note:"Vor der Uni. Vorher Banane und Wasser, nie nüchtern. Bei Schienbein-Reaktion ausfallen lassen." },
      { sport:"rest", title:"Mobility", durationMin:15, intensity:"locker" }
    ]},
    "2026-10-10": { sessions: [
      { sport:"run", title:"Long Run", durationMin:67, distanceKm:11, intensity:"locker, ca. 6:05/km, nicht schneller",
        note:"Checkpoint 1 für die Marathon-Frage: Schienbeine und Kreislauf bei km 8–11 beobachten. Gut frühstücken, Wasser mitnehmen." }
    ]},
    "2026-10-11": { sessions: [
      { sport:"bike", title:"Rad-Ausfahrt draußen", durationLabel:"60–90 min", durationMin:75, intensity:"Z1–Z2, flach, locker",
        note:"Frühstück vorher, Wasser, Helm, Handy, Ausweis. Bei Schwindel sofort abbrechen." },
      { sport:"rest", title:"Mobility", durationMin:15, intensity:"locker" }
    ]}
  }
}
];
