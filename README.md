# Julia Kasanzewa — Portfolio

Static site (no build step) — HTML/CSS/vanilla JS. Design system based on the Juliakas® brand styleguide (Instrument Sans + Instrument Serif, warm neutral palette with rose/bronze/sage category accents).

## Structure
- `index.html` — all content/sections
- `style.css` — design system + layout
- `script.js` — nav, scroll reveals, hero typewriter, project/experience filter, back-to-top
- `assets/resume.pdf` — English CV (download button)
- `assets/resume-de.pdf` — German CV (footer link)
- `assets/og.png` — social share image
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
