# Trainingsplan-PWA – Hinweise für Claude

Kleine PWA (Vanilla HTML/CSS/JS, kein Build, keine Libraries/CDNs/Fonts) für den
Trainingsplan Richtung **Ironman Frankfurt (27.06.2027)**. Läuft auf GitHub Pages
und als Home-Screen-App auf dem iPhone.

## Dateien
- `index.html` – Grundgerüst, lädt `data.js` und `app.js`.
- `data.js` – **alle Inhalte**: `RACES`, `PLAN_START`/`PLAN_END`, `PHASES`, `MILESTONES`, `WEEKS`.
- `app.js` – Rendering (`render()` baut den DOM bei jeder Interaktion neu als HTML-String).
- `styles.css` – Design-System (Tokens in `:root`), neue Styles unten anhängen.
- `service-worker.js` – Offline-Cache. **Bei jeder Änderung `CACHE_NAME` hochzählen.**
- `tests/smoke-test.js` – `node tests/smoke-test.js` (oder `jsc tests/smoke-test.js`) rendert
  alle Tabs für mehrere Stichtage mit simuliertem Datum/DOM.

## Tabs
**Heute · Statistik · Phasen**. Der frühere Tab „Verlauf“ wurde entfernt (die
Statistik nutzt `WEEKS` weiter).
- *Heute*: Datum, Wochenlabel + Wochentyp-Badge, Phasen-Banner (tippen → Tab Phasen,
  aktuelle Phase aufgeklappt), Renn-Chips, Tagesleiste, Einheiten, Tages-Check-in.
- *Statistik*: Zeit/Distanz, Laufumfang & 10-%-Regel, Wochen-Check-in kopieren, Backup.
- *Phasen*: Zeitleiste, „Du bist hier“, Phasen-Akkordeon, Meilensteine.

## Datenmodell (`data.js`)
- `WEEKS[]`: `{ start:"YYYY-MM-DD" (Montag), label, type?, days:{ "YYYY-MM-DD": { sessions:[…], dayNote? } } }`
  - `type` (optional): `"build" | "deload" | "recovery" | "race" | "taper"` → Badge im Heute-Tab.
    `race`/`recovery` werden bei der 10-%-Regel nicht gewertet. Fehlt `type`, kein Badge.
  - Session: `sport` (`swim|bike|run|strength|rest|race`), `title`, `durationMin`, `distanceKm`,
    optional `durationLabel`, `distanceLabel`, `intensity`, `blocks:[{label,text}]`, `note`,
    `excludeFromStats`, `logged`, `altSport`. Laufumfang zählt nur `sport:"run"` mit `distanceKm`.
- `RACES[]`: `{ key, name, date }` – Countdown-Chips. Halbmarathon muss Index 0 bleiben
  (steuert, ab wann Renn-Einheiten abhakbar sind).
- `PLAN_START`, `PLAN_END` (= Ironman-Datum).
- `PHASES[]`: `{ key, name, start, end, tagline, goals[], focus:{swim,bike,run,strength,recovery},
  targets:{run,bike,swim}, readyWhen[], watchOut[] }`. Phasen müssen **lückenlos** aneinander
  anschließen (der Smoke-Test prüft das). Kurzname im Banner = `name` ohne Klammerzusatz.
- `MILESTONES[]`: `{ date, title, type:"race"|"test"|"checkpoint", note, tentative? }`, chronologisch.

**Phasen und Meilensteine werden nach Check-ins direkt in `data.js` angepasst**
(Daten verschieben, Texte ändern). Die App berechnet Phase/Woche nur aus dem
aktuellen Datum, nichts davon liegt im localStorage. Keine Trainingsinhalte erfinden.

## localStorage (nur auf dem Gerät)
- `trainingsplan-done-flags` – `{ "YYYY-MM-DD#idx": true }`
- `trainingsplan-checkins` – `{ "YYYY-MM-DD": { energy:1–5, shin:0–10, circ:"ok"|"komisch", note } }`
- Backup exportiert/importiert alle Keys mit Präfix `trainingsplan-`.

## Konventionen
- Relative Pfade (GitHub Pages im Unterordner), deutschsprachige UI.
- Tokens: Abstände `--s1…--s8` (4–40 px), Radien `--r-sm/--r-md/--r-pill`, Farben aus `:root`.
  Keine neuen Farben, keine Gradients in neuen Komponenten, keine neuen Pixelwerte.
  Koralle `--accent` im Phasen-Bereich nur für aktuelle Phase und „Heute“-Marker.
- Mobile-first, bis 360 px ohne horizontales Scrollen, `env(safe-area-inset-*)`,
  `prefers-reduced-motion` respektieren, ARIA bei interaktiven Elementen.
- Nutzertexte (Check-in-Notizen) immer mit `esc()` ausgeben.
