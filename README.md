# Aster Resume Studio

A browser-based résumé builder with a live preview, structured editing and print-to-PDF export. Built to replace an old folder of disconnected static pages with something you can actually use.

## Features

- **Structured editor** — profile, summary, experience, education, projects and skills
- **Live preview** — changes appear instantly in a clean, print-ready layout
- **Add / remove entries** for roles, schools and projects
- **Print / Save as PDF** — a dedicated print stylesheet hides the editor and chrome
- **Import / Export JSON** — take your data with you, or back it up
- **Local autosave** — everything is stored in `localStorage`; no account and no server

## Run it

```bash
# open index.html directly, or
python3 -m http.server 8000  # then visit http://localhost:8000
```

## Privacy

Nothing leaves your device. The sample content is illustrative; replace it with your own details. Data lives under the `aster:resume:v1` key in your browser's local storage.

## Stack

Plain HTML, CSS and JavaScript. No dependencies, build step or API keys.

## License

MIT — see [LICENSE](LICENSE).
