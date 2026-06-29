# Shiliang Shao — personal academic homepage

A clean, static personal homepage built for GitHub Pages. No build step, no
framework — just three files (`index.html`, `assets/css/site.css`,
`assets/js/main.js`) plus the CV PDF.

## Quick deploy to GitHub Pages

1. **Create the repo.** On GitHub, create a new public repository named
   exactly `<your-username>.github.io` (this makes the URL
   `https://<your-username>.github.io`). Example: if your GitHub handle is
   `ssl020104`, the repo is `ssl020104.github.io`.

2. **Push these files** to the `main` branch of that repo:

   ```bash
   git init
   git add .
   git commit -m "initial homepage"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```

3. **Enable Pages.** In the repo, go to **Settings → Pages**. Under "Build
   and deployment", set the **Source** to "Deploy from a branch", the
   **Branch** to `main`, and the **Folder** to `/ (root)`. Save.

4. Wait ~30 seconds. Your site is live at `https://<your-username>.github.io`.

The `.nojekyll` file in the repo root tells GitHub Pages not to run the
content through Jekyll, which it does by default. Leave it there.

## File layout

```
.
├── index.html                       ← single-page site
├── .nojekyll                        ← disables Jekyll processing
├── README.md                        ← this file
└── assets/
    ├── css/site.css                 ← all styles (1 file)
    ├── js/main.js                   ← theme toggle, email copy
    ├── images/portrait.jpg          ← YOUR PHOTO GOES HERE
    └── pdf/Shiliang_Shao_CV.pdf     ← your CV
```

## Things to fill in before going live

These are the items that need your real values — search the codebase for
each placeholder:

| Where               | What to replace                                                      |
| ------------------- | -------------------------------------------------------------------- |
| `index.html` head   | The canonical URL (`shiliangshao.github.io`) — update to your handle |
| About section links | The Google Scholar, ORCID, GitHub URLs are currently placeholders    |
| `assets/images/`    | Add `portrait.jpg` (recommended 600×750 px, JPEG, < 200 kB)          |
| Advisor links       | Currently `#` — point to your advisors' Beihang pages                |
| Email button        | Already set to `ssl020104@163.com` — change in `index.html` if needed |

If you don't have a portrait ready yet, the page renders a tasteful
cross-hatched placeholder card with the filename — fine for review, just
swap in the real image before going public.

## Customizing the look

All design tokens live in `:root { … }` at the top of `assets/css/site.css`.
Change one variable and the whole site follows. Most likely tweaks:

- `--accent` — the single accent color. Currently a deep teal (`#0E5C5C`).
  Other options that work with this palette: `#1F4E79` (navy),
  `#7B3F1D` (clay), `#5B2C82` (plum).
- `--bg` and `--bg-tint` — page background and alternating section tint.
- `--font-sans` — currently Inter from Google Fonts. To switch, edit the
  `<link>` in `index.html` and update this variable.

The `html.dark` block below `:root` overrides the same variables for dark
mode. Adjust there if you change the light palette and want dark to follow.

## Adding a publication

In `index.html`, find the `<ol class="pubs">` block and copy one `<li class="pub">`
entry. The structure is:

```html
<li class="pub">
  <div class="pub-year">2027</div>
  <div class="pub-body">
    <h3>Title of the paper</h3>
    <p class="pub-meta">
      <strong>S. Shao</strong>, Author B, Author C.
      <span class="venue">Venue Name</span>.
      <span class="status published">Published</span>
      <span class="badge q1">JCR Q1 · IF X.X</span>
      <a class="pub-link" href="https://doi.org/…" target="_blank" rel="noopener">DOI ↗</a>
    </p>
  </div>
</li>
```

`status` accepts `published` or `review`. `badge` accepts `q1` or `q2`
(both styled).

## Adding a news item

Same pattern in the `<ul class="news">` block. One `<li>` per item, with a
`<span class="news-date">` and a `<span class="news-text">`.

## Custom domain (optional)

If you own `shiliangshao.com` (or any domain), add a `CNAME` file at the
repo root containing just the hostname:

```
shiliangshao.com
```

…then create a CNAME DNS record at your registrar pointing the domain to
`<your-username>.github.io`. Pages will serve the site from your domain and
issue a free TLS cert automatically.

## License

The text content of this site is © Shiliang Shao. The HTML/CSS/JS
scaffolding is yours to modify freely.
