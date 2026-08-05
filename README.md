My portfolio which contains my resume, publications, projects, education, and skills.

## Portfolio versions

The root site is the simplified resume site. The immersive React portfolio source lives in `cool-portfolio/`, and its GitHub Pages build is committed in `Portfolio/` so it is available at `/Portfolio/`.

```bash
npm run setup:portfolio
npm run build:portfolio
```

`npm run setup:portfolio` is only needed once, or after dependency changes.

## Scholar publications

The homepage publication list is generated from my Google Scholar profile. Do not edit the generated block in `index.html` by hand.

```bash
npm run update:scholar
```

The script writes `data/scholar-publications.json` and refreshes the marked Scholar block in `index.html`.
