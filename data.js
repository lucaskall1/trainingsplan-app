/* ==========================================================
   TRAININGSDATEN
   Wird jede Woche aktualisiert: neues Objekt unten ins
   WEEKS-Array anhaengen. durationMin/distanceKm sind fuer die
   Statistik-Auswertung da, *Label ueberschreibt nur die Anzeige.
   ========================================================== */

const RACES = [
  { key:"erkner",   name:"Erkner 80.3",         date:"2026-09-13" },
  { key:"marathon", name:"Marathon",            date:"2026-10-25" },
  { key:"ironman",  name:"Ironman Frankfurt",   date:"2027-06-27" }
];

const WEEKS = [
  {
    start: "2026-09-07",
    label: "Renn-Woche · Erkner 70.3",
    days: {
      "2026-09-07": { sessions: [
        { sport:"swim", title:"Schwimmen", durationMin:44, distanceKm:1.95, intensity:"locker (Taper)", logged:true }
      ]},
      "2026-09-08": { sessions: [
        { sport:"run", title:"Laufen", durationMin:59, distanceKm:9.8, intensity:"locker", logged:true }
      ]},
      "2026-09-09": { sessions: [], dayNote:"Ruhetag." },
      "2026-09-10": { sessions: [
        { sport:"bike", altSport:"swim", title:"Opener – Rad ODER Schwimmen", durationLabel:"30–35 min", durationMin:32, intensity:"locker + kurze Reize",
          blocks:[
            {label:"Warm-up", text:"10 min ganz locker einrollen"},
            {label:"Hauptteil", text:"4× 1 min knapp unter Renntempo / hohe Trittfrequenz, dazwischen 2 min locker"},
            {label:"Cool-down", text:"Rest der Zeit komplett locker ausrollen"}
          ],
          note:"Alternativ Schwimmen: 20 min locker inkl. 4×50 m im Zielrenntempo-Gefühl. Kein Lauf heute."
        }
      ]},
      "2026-09-11": { sessions: [
        { sport:"bike", altSport:"swim", title:"Nur aktivieren", durationLabel:"15–20 min", durationMin:18, intensity:"ganz locker",
          blocks:[
            {label:"Inhalt", text:"15–20 min lockeres Radfahren oder Schwimmen, nur zur Durchblutung – kein Trainingsreiz"},
            {label:"Optional", text:"8–10 min Trab mit 3–4 Steigerungen à 20 s, NUR wenn Schienbeine 100% beschwerdefrei sind – sonst weglassen"}
          ],
          note:"Fokus heute: Schlaf, Kohlenhydrate langsam hochfahren, Rad & Ausrüstung final checken."
        }
      ]},
      "2026-09-12": { sessions: [
        { sport:"rest", title:"Ruhetag", durationMin:15, intensity:"aktive Erholung",
          blocks:[
            {label:"Bewegung", text:"Höchstens 15 min Spaziergang oder ganz lockeres Spinnen"},
            {label:"Sonst", text:"Carb-Loading, Startbeutel packen, Neopren/Rad/Schuhe final checken, früh schlafen"}
          ]
        }
      ]},
      "2026-09-13": { sessions: [
        { sport:"race", title:"Renntag: Erkner 70.3", intensity:"1,9 km Swim · 90 km Bike · 21,1 km Run", excludeFromStats:true,
          blocks:[
            {label:"Warm-up", text:"8–10 min lockeres Einlaufen + ein paar Steigerungen, kurze Wasseraktivierung falls möglich"},
            {label:"Swim", text:"Entspannt starten, nicht im Feld verausgaben"},
            {label:"Bike", text:"Erste 20 km bewusst NICHT überpacen – die Beine sind nach der Taper-Woche nicht 100% frisch. Alle 20–25 min Kohlenhydrate, Elektrolyte je nach Temperatur"},
            {label:"Run", text:"Erste 2–3 km ruhig angehen, erst danach vorsichtig steigern, wenn die Schienbeine mitspielen"}
          ]
        }
      ]}
    }
  },
  {
    start: "2026-09-14",
    label: "Recovery-Woche nach Erkner",
    days: {
      "2026-09-14": { sessions: [
        { sport:"rest", title:"Ruhetag", intensity:"Beine hoch",
          blocks:[{label:"Inhalt", text:"Kein Training. Spazieren erlaubt, sonst komplett passiv regenerieren."}] }
      ]},
      "2026-09-15": { sessions: [
        { sport:"swim", title:"Lockeres Schwimmen", durationLabel:"20–25 min", durationMin:22, intensity:"sehr locker",
          blocks:[{label:"Inhalt", text:"Kein Zug, kein Zeitdruck – reine Beweglichkeit und Technikgefühl"}] }
      ]},
      "2026-09-16": { sessions: [
        { sport:"bike", title:"Lockerer Spin", durationLabel:"30–40 min", durationMin:35, intensity:"sehr niedrige Watt/Trittfrequenz",
          blocks:[{label:"Hinweis", text:"Bei starkem Muskelkater lieber ausfallen lassen – Gefühl schlägt Plan diese Woche"}] }
      ]},
      "2026-09-17": { sessions: [
        { sport:"rest", title:"Mobility (optional)", durationLabel:"15–20 min", durationMin:18, intensity:"ganz locker",
          blocks:[{label:"Inhalt", text:"Spaziergang oder leichtes Mobility/Yoga, kein strukturiertes Training"}] }
      ]},
      "2026-09-18": { sessions: [
        { sport:"swim", title:"Schwimmen – Technik", durationLabel:"~25 min", durationMin:25, distanceKm:0.8, intensity:"locker",
          blocks:[
            {label:"Einschwimmen", text:"200 m locker, freie Wahl"},
            {label:"Technik", text:"4× 50 m Fokus Rotation, 20 Sek Pause"},
            {label:"Kräftigung", text:"4× 50 m mit Paddles, locker, 20 Sek Pause"},
            {label:"Ausschwimmen", text:"200 m ganz locker"}
          ]}
      ]},
      "2026-09-19": { sessions: [
        { sport:"run", altSport:"bike", title:"Testlauf ODER Rad locker", durationLabel:"20–25 min", durationMin:22, intensity:"nur wenn schienbeinfrei",
          blocks:[{label:"Regel", text:"Nur laufen, wenn absolut schmerzfrei. Im Zweifel: locker Rad fahren statt laufen."}] }
      ]},
      "2026-09-20": { sessions: [], dayNote:"Ruhetag. Heute Abend: Woche + Zeitfenster für 21.–27.9. schicken, dann startet der erste Aufbau-Block Richtung Marathon." }
    }
  }
];
