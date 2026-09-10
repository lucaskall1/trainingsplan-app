# Trainingsplan – PWA

Eine kleine, eigenständige Web-App (kein Framework, kein Build-Schritt) mit
Tages- und Wochenansicht deines Trainingsplans. Läuft als installierbare
PWA (Progressive Web App) auf dem Handy, inkl. Offline-Cache.

## Projektstruktur

```
trainingsplan-app/
├── index.html        Grundgerüst der Seite
├── styles.css         Alles Optische
├── data.js             Trainingsdaten – DIESE Datei wird jede Woche aktualisiert
├── app.js               Anzeigelogik (Tages-/Wochenansicht, "erledigt"-Status)
├── manifest.json    macht die Seite als App installierbar
├── service-worker.js  Offline-Cache
├── icons/                 App-Icons
└── README.md          diese Datei
```

## 1. Projekt öffnen

**VS Code:** Ordner `trainingsplan-app` per „Datei → Ordner öffnen" laden.
Installiere die Erweiterung **„Live Server"** (Ritwick Dey), dann Rechtsklick
auf `index.html` → **„Open with Live Server"**. Öffnet sich automatisch im
Browser unter `http://localhost:5500`.

**IntelliJ IDEA:** Ordner als Projekt öffnen. `index.html` öffnen, oben
rechts auf das Browser-Icon klicken (oder Rechtsklick → „Open in Browser").
IntelliJ startet einen eingebauten Mini-Server.

Beides reicht zum Entwickeln/Testen am Rechner. **Auf dein Handy kommt die
App darüber aber noch nicht** – `localhost` kennt nur dein Laptop.

## 2. Auf dem Handy nutzbar machen

Dafür braucht die App eine echte URL. Am einfachsten kostenlos über
**GitHub Pages**:

1. Kostenloses Konto auf [github.com](https://github.com) (falls noch nicht vorhanden).
2. Neues Repository anlegen, z. B. `trainingsplan`.
3. Alle Dateien aus diesem Ordner hochladen (im Browser reicht „Add file → Upload files" und die Dateien reinziehen – kein Git-Kommandozeilen-Wissen nötig).
4. Im Repo: **Settings → Pages** → unter „Branch" `main` und Ordner `/ (root)` wählen → Save.
5. Nach 1–2 Minuten ist die Seite live unter `https://DEINNAME.github.io/trainingsplan/`.
6. Diesen Link auf dem Handy in Safari (iPhone) oder Chrome (Android) öffnen.
7. **iPhone:** Teilen-Symbol → „Zum Home-Bildschirm" → Hinzufügen.
   **Android:** Drei-Punkte-Menü → „App installieren" / „Zum Startbildschirm hinzufügen".

Weil jetzt ein echtes `manifest.json` + Service Worker dabei sind, installiert
sich die Seite als richtige App (eigenes Icon, Vollbild ohne Adressleiste,
funktioniert auch mal kurz offline) – zuverlässiger als das reine
„Zum Home-Bildschirm" bei einer normalen Webseite.

*Alternative zu GitHub Pages:* [Netlify Drop](https://app.netlify.com/drop) –
Ordner per Drag&Drop hochladen, sofort eine URL, kein Account nötig für den
ersten Test.

## 3. Wöchentliches Update

Jede Woche nach unserem Check-in bekommst du von mir den neuen Inhalt für
`data.js` (neues Wochen-Objekt fürs `WEEKS`-Array). Du musst nur:

1. `data.js` im Editor öffnen, neuen Block einfügen, speichern.
2. Bei GitHub: Datei im Repo ersetzen (Upload überschreibt automatisch) –
   die Seite aktualisiert sich innerhalb von ca. einer Minute von selbst.
3. Handy-App einmal schließen und neu öffnen (der Service Worker zeigt bei
   verfügbarem Update einen kleinen "Aktualisieren"-Hinweis unten an).

Der "erledigt"-Status wird lokal auf dem jeweiligen Gerät gespeichert
(`localStorage`) – geht beim Löschen der Browserdaten verloren, ist aber
sonst dauerhaft.
