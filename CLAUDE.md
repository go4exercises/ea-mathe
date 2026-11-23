# CLAUDE.md — EA Mathe begreifbar

Statisches HTML/CSS/JS-Unterrichtsmaterial Mathematik für die Klasse EA2025 (IDM EA Mathematik),
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

## Sprache & Notation

- Schweizer Hochdeutsch, **kein ß**; Du-Form.
- MathJax-Delimiter `\(…\)` inline, `\[…\]` abgesetzt; nie `$…$`.
- Autorname überall «Raphael Arnold Kohler» (Entscheid Auftraggeber 23.11.2026).

## Handybreite

- Ziel: `scrollWidth` = 375 auf allen Seiten. Tabellen stehen in `<div class="tw">` (scrollt
  waagrecht, `common.css`); abgesetzte Formeln scrollen selbst
  (`mjx-container[display="true"]`). Grid-Spalten mit `minmax(0,1fr)`, nicht `1fr`.
  Lange Inline-Formeln in mehrere `\(…\)` teilen, damit sie umbrechen.
- Prüfen (Playwright aus sek1-mathe):
  `PLAYWRIGHT=~/sek1-mathe/node_modules/playwright node scripts/render-check.js`
  — erwartet jede Zeile `sw=375 merr=0`, kein `ERR`, am Schluss `extern: keine`.

## Arbeitsweise

- Bei klarem Auftrag direkt umsetzen; Annahmen kurz erwähnen. Keine ungebetene Verbesserungs-Initiative.
- Mehr als 3 gleichartige Edits → ein Skript.
- Vor jedem Commit `scripts/render-check.js` laufen lassen.
- Aus einer Session hier wird nur in diesem Repo geschrieben; `~/sek1-mathe` und `~/begreifbar`
  nur lesen.
