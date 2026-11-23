# CLAUDE.md — EA Mathe begreifbar

Statisches HTML/CSS/JS-Unterrichtsmaterial Mathematik (IDM EA Mathematik),
gehostet via GitHub Pages unter `ea-mathe.begreifbar.ch` (Repo `go4exercises/ea-mathe`, Branch `main`,
Wurzel), verlinkt von einer Kachel auf `begreifbar.ch`. Eingespielt am 23.11.2026 aus `~/Mathematik-EA.zip`.
Vorbild für Hosting und Repo-Aufbau: `~/sek1-mathe` (sek1-mathe.begreifbar.ch).

## Projektstruktur (flach, alles in der Wurzel)

- `index.html` (Block 1) und `index2.html` (Block 2): Übersicht und Gesamtquiz je Block.
- Kapitelseiten `1-1 … 1-3.html`, `2-1 … 2-3.html`; Übungsaufgaben `aufgaben-11 … aufgaben-23.html`
  (öffnen in neuem Tab).
- **Einzige Quelle der Blöcke und Kapitel ist `BLOCKS` in `nav.js`** (obere Leiste, Kapitelmenü).
  Kapitel ohne Seite (`p:null`) erscheinen als «in Vorbereitung». Neues Kapitel = Seite anlegen
  und dort eintragen.
- `common.css`, `common.js` (Geometrie-Helfer, SVG-Figuren, Quiz-Gerüst `QZ`), `quiz-<kapitel>.js`
  (Quizfragen je Kapitel), dazu kapitelspezifische Skripte (`2-1.js`, `2-2.js`, `2-3.js`, `alg.js`,
  `b2.js`, `kon.js`, `rat.js`).
- **Kopfleiste** (`.blocknav` → `header.site-hdr`, gebaut von `nav.js`) mit Massen, Schrift und Farben
  von sek1-mathe (`.site-hdr`, 54 px, Serif-Logo «IDM EA Mathematik»): ein Menü «Unterrichtsblöcke ▾»
  (gruppiert nach `BLOCKS`), Trennstrich, «Über ▾» mit Reitern Autor/Lizenz (`UEBER_AUTOR`,
  `UEBER_LIZENZ`; Porträt `autor.jpg`). Unter 1024 px Burger-Menü. Akzentfarbe `--titel` statt Petrol.
  Ganz links Rücklink auf https://begreifbar.ch/ nur als Symbol (`begreifbar.svg` = Favicon von begreifbar.ch).
- Keine Klassenbezeichnung auf den Seiten (Entscheid Auftraggeber 24.11.2026).
- `CNAME` (genau `ea-mathe.begreifbar.ch`), `.nojekyll` (leer) — nicht entfernen.

## Keine Drittanbieter

- Schriften lokal: `schriften.css` + `schriften/` (Source Sans 3, Source Serif 4; Fontsource 5.3.0,
  SIL OFL 1.1, aus sek1-mathe). Jede Seite bindet `<link rel="stylesheet" href="schriften.css">` ein.
- MathJax 3.2.2 lokal: `vendor/mathjax/tex-svg.js` (aus sek1-mathe, Apache 2.0). Die Konfiguration
  steht in jeder Seite in `window.MathJax` vor dem Skript.
- Die Druckseiten der Konstruktionsaufgaben (`1-3.html`, `2-3.js`, `buildPrintHtml`) laufen als
  Blob-Dokument; sie binden `schriften.css` deshalb mit absoluter URL ein
  (`new URL('schriften.css',location.href)`). Unter `file://` lädt der Browser die Schriften dort
  nicht — über HTTP (Pages, `python3 -m http.server`) schon.
- Kontrolle: `grep -rn "https\?://" --include=*.html --include=*.js --exclude-dir=vendor .` zeigt nur
  `http://www.w3.org/2000/svg`. Neue externe Quellen nur nach Rückfrage.

## Sprache & Notation (nicht verhandelbar — wie sek1-mathe)

- Schweizer Hochdeutsch. **Kein ß.** Du-Form, kein «wir».
- **Dezimaltrennzeichen ist der Punkt, nie das Komma** — überall: LaTeX, Aufgabentexte,
  Live-Anzeigen, JS-Code.
- MathJax-Delimiter: `\(…\)` inline, `\[…\]` abgesetzt. Niemals `$…$`.
- **Leere Menge als `\{\,\}`**, nie `\emptyset` oder `∅`.
- Zahlenmengen in LaTeX als `\mathbb{N}`, `\mathbb{Z}`, `\mathbb{Q}`; im Menü (kein MathJax) als ℕ, ℤ, ℚ.
- ggT/kgV mit Strichpunkt: `\text{ggT}(12;\ 18)`. Ergebnisse als (unechte) Brüche, keine gemischten Zahlen.
- Kein Gedankenstrich unmittelbar vor oder nach einer Formel — er liest sich als Minus.
- Autorname überall «Raphael Arnold Kohler» (Entscheid Auftraggeber 23.11.2026).
- **Didaktische Farben wie in sek1-mathe:** Blau = Definition/Theorie/Merkkasten · Grün = Beispiel/
  Lösung/Ergebnis · Orange = Aufgabe/Übung · Rot = Fehler/Achtung · Lila = Beweis/Herleitung.
  Nie umdeuten.

## Handybreite

- Ziel: `scrollWidth` = 375 auf allen Seiten. Tabellen stehen in `<div class="tw">` (scrollt
  waagrecht, `common.css`); abgesetzte Formeln scrollen selbst
  (`mjx-container[display="true"]`). Grid-Spalten mit `minmax(0,1fr)`, nicht `1fr`.
  Lange Inline-Formeln in mehrere `\(…\)` teilen, damit sie umbrechen.
- Prüfen (Playwright aus sek1-mathe):
  `PLAYWRIGHT=~/sek1-mathe/node_modules/playwright node scripts/render-check.js`
  — erwartet jede Zeile `sw=375 merr=0`, kein `ERR`, am Schluss `extern: keine`.

## Verifikations-Standard

- **Alle Zahlenwerte vor dem Einbau mit `python3` nachrechnen** — nie aus dem Gedächtnis.
- Geometrie und Graphen von Animationen vorab in Python durchrechnen.
- Render-Check bei 1280 px **und** 375 px (`scripts/render-check.js`, Bilder ansehen).

## Andere Repos — lesen ja, schreiben nie

Aus einer Session in diesem Repo wird nur hier geschrieben. `~/sek1-mathe`, `~/begreifbar`,
`~/tals-mathe` und `~/tals-physik` dürfen gelesen werden (Vorlagen, Werkzeug-Stand vergleichen).
Was dort hingehört, wird dem Auftraggeber gemeldet (was, wo, warum).

## Arbeitsweise

- **Bei klarem Auftrag direkt umsetzen.** Annahme nötig → inline kurz erwähnen.
- **Keine ungebetene Verbesserungs-Initiative.**
- Mehr als 3 gleichartige Edits → ein Skript.

## Automatik: Commit nach jedem Durchgang

Modus `acceptEdits` (`.claude/settings.json`). Nach jedem abgeschlossenen Auftrag ohne
Rückfrage: `scripts/render-check.js` über alle Seiten; **nur wenn jede Zeile `sw=375 merr=0`,
kein `ERR` und `extern: keine`** `git add -A` und `git commit`.
**Niemals `git push`** — der Push bleibt beim Auftraggeber. Auch GitHub-Einstellungen
(Pages, Domain, HTTPS) nur auf ausdrücklichen Auftrag.
