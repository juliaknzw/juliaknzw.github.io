# Julia Kasanzewa — Portfolio

Static site (no build step) — HTML/CSS/vanilla JS. Design system based on the Juliakas® brand styleguide (Instrument Sans + Instrument Serif, warm neutral palette with rose/bronze/sage category accents).

## Structure
- `index.html` — all content/sections
- `style.css` — design system + layout
- `script.js` — island nav, dev/creator mode switch, scroll reveals, hero spotlight, custom cursor
- `assets/resume-ios.pdf` — résumé tailored for iOS/backend developer applications
- `assets/resume-creator.pdf` — résumé tailored for content creator/social media manager applications
- `assets/og.png` — social share image
- `assets/profile.jpg`, `assets/sneak-peek/`, `assets/media-kit.pdf`, `assets/wellbeing-ai-concept.mp4` — real media assets
- `robots.txt`, `sitemap.xml`, `.nojekyll` — SEO / GitHub Pages hygiene

## Deploy to GitHub Pages
This folder is deploy-ready as-is. To publish to `juliaknzw.github.io`:

```bash
# from inside a clone of the juliaknzw.github.io repo, with its contents cleared:
cp -r /path/to/this/website/* /path/to/this/website/.[!.]* /path/to/juliaknzw.github.io/
cd /path/to/juliaknzw.github.io
git add -A
git commit -m "Rebuild portfolio site"
git push origin main
```

GitHub Pages will serve it automatically at `https://juliaknzw.github.io/` — no build step, no dependencies.

## Local preview
```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
```
