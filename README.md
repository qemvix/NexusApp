# Nexus

**Windows desktop utilities.** The official website and public Windows downloads for Nexus, a modular native desktop utility hub by qemvix.

This is **NexusApp**, the website repository. The desktop application lives in the separate `nexus` monorepo, with `nexus-cursor`, `nexus-desktop`, `nexus-productivity` and `nexus-core`. The desktop application is maintained in [qemvix/nexus](https://github.com/qemvix/nexus). This repository contains no desktop application source, credentials or local user settings.

## Download Nexus

- [Windows installer — Nexus 0.2.2 preview](https://github.com/qemvix/nexus/releases/download/desktop-v0.2.2/Nexus-Setup.exe)
- [Portable Windows x64 ZIP](https://github.com/qemvix/nexus/releases/download/desktop-v0.2.2/Nexus-0.2.2-win-x64-portable.zip)
- [Checksums and release notes](https://github.com/qemvix/nexus/releases/tag/desktop-v0.2.2)

Windows 11 x64 is the primary tested platform. The preview is self-contained and unsigned. It requires no separate .NET runtime. Installation is per user. A matching checksum confirms file integrity, not publisher identity. Read the license and release notes before installing.

## What is on the website?

- A responsive dark-glass landing page with real application captures.
- Search and category filters for all 13 utilities, accessible detail dialogs and a complete static feature guide.
- Custom scrollbars with touch/forced-color fallbacks, visible focus states and reduced-motion support.
- App screenshot gallery, installation guide, permissions explanation, privacy information, release notes, roadmap and supplied license.
- Direct installer and portable links with SHA-256 values and copy controls.

Product pages describe the actual 0.2.2 build and its current limitations. They do not claim guaranteed 240 FPS, persistent clipboard storage, macOS/Linux binaries or features that have not shipped.

## Deploy on Wasmer

Import **`qemvix/NexusApp`**, branch **`main`**, repository root **`/`** into Wasmer's GitHub deployment flow. The committed `Staticfile` points to **`public`**; generated HTML and assets are already committed, so production needs no Node server, database, account keys or build step. Follow [the deployment guide](docs/WASMER.md).

This is a small static website (under 1 MB of uncompressed files at initial release). Installer downloads are served by GitHub Releases rather than using the website host's bandwidth. Wasmer plan limits and availability still apply. The repository is prepared for import; it is not itself a claim that a Wasmer app has been deployed.

## Develop and verify

Use Node.js 22 or later. Dependencies are development/test tools only; no third-party JavaScript is shipped to visitors.

```sh
npm ci
npx playwright install chromium
npm run build
npm run check
npm test
npm run dev
```

Open `http://127.0.0.1:4173`. `PORT` can override the local preview port. Browser tests use 4173. On Linux, `npx playwright install --with-deps chromium` also installs the browser's system libraries.

```text
src/data.mjs              Product facts and module descriptions
src/release-files.json    Release file sizes and SHA-256 values
scripts/build.mjs         Generates all HTML pages and public metadata
scripts/check.mjs         Local links, images, anchors, license and size budget
scripts/serve.mjs         Local preview server with production-like headers
public/                  Ready-to-host output, including handwritten CSS/JS
settings/config.toml     Wasmer static server settings and security headers
Staticfile               Selects the static directory for Wasmer
tests/                   Browser, accessibility and responsive checks
docs/                    Hosting, editing and release instructions
.github/workflows/       Automated build and test workflow
```

Edit facts in `src/data.mjs`, page templates in `scripts/build.mjs`, and styles/interactions in `public/assets/`. Run `npm run build` and commit generated `public` changes together. Do not edit generated HTML directly. Optional `NEXUS_SITE_URL=https://your-real-domain` at build time adds canonical links, social image URLs and a sitemap; it must be the real deployed origin. See [maintenance](docs/MAINTAINING.md).

CI checks every internal link/anchor, feature count, image metadata, checksum URL and license copy, then runs Chromium interaction tests, WCAG accessibility checks and responsive checks at 320, 768 and 1440 pixels. Generated output drift fails CI. Screenshots and a static artifact are retained for review. Automated checks do not replace hardware testing of the desktop app.

## Privacy and license

No analytics, advertising cookies, login or third-party runtime scripts are included. No visitor input is sent to a backend. Hosting providers and GitHub apply their own operational policies. The website links to the public releases, not authenticated build artifacts.

Copyright © 2026 qemvix. All rights reserved. Nexus and the original code/assets in this repository use the supplied **proprietary [LICENSE](LICENSE)**. Official desktop releases are permitted for personal desktop use under those terms. Public visibility does not grant an open-source license. Third-party dependencies retain their own licenses.

Contact: electrolighxt@outlook.com. Report reproducible website problems through an issue; please avoid posting sensitive data or private desktop source. Proposed modifications require the permission described in the license.
