# Kamal Dhaliwal Realtor Website

A modern responsive remake of Kamal Dhaliwal's real-estate homepage. The site is a dependency-free static build using HTML, CSS, and JavaScript.

## Preview

From this directory, run:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

Property and community links continue to the existing live MLS pages. The contact form opens the visitor's configured email client.

The Zero Down program is included locally at `/zero-down/index.html`, with all required images and audio stored under `public/zero-down/`. It does not depend on the separate `D:\Zero Down` project. Explicit HTML paths allow the site to work from both a web server and the local `file://` protocol.
