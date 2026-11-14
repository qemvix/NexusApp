# Maintaining NexusApp

## Facts, design and accessibility

Keep utility descriptions in `src/data.mjs` aligned with the actual desktop release. Current limitations belong beside the feature, not only in a hidden roadmap. Do not imply support for a platform, protected capture, arbitrary app blur or guaranteed frame rates that the desktop app has not validated.

All screenshots in `public/assets/media` are real app captures. Replace them with fresh captures when the app changes. Keep informative alternative text and intrinsic dimensions. Do not add visitor tracking or remote fonts without revisiting the privacy page and security headers.

Filters and dialogs enhance static links: the entire feature guide must remain usable without JavaScript. Native dialogs provide focus containment; Escape closes them and returns focus. The website uses reduced-motion and forced-color fallbacks. Keep custom scrollbars usable with touch, keyboard and native browser fallbacks.

The `public/assets/site.mjs` file contains no desktop integration or global input hooks. The browser motion illustration was removed in 0.2.2. Keep all native behavior in the separate desktop app.

## A new desktop release

1. Build and test the application in the `nexus` monorepo. Review its license and dependency notices. Do not move private desktop source or diagnostic data here.
2. Prepare the installer and portable ZIP. Record their byte sizes and SHA-256 values; put those values in `src/release-files.json`.
3. Make a new **draft** GitHub release in qemvix/nexus using a versioned desktop tag. Upload the installer, portable ZIP, `SHA256SUMS.txt` and the desktop license. Keep desktop source archives out of public releases.
4. Verify uploaded asset sizes/hashes. Publish the release, then check the exact download URLs without authentication. Never use an expiring or authenticated CI artifact URL for the website's primary download.
5. Update `release` and copy in `src/data.mjs`, the changelog template, version labels and all applicable known limits. Rebuild and verify the site. Release assets and website checksums must agree.
6. Push changes, wait for CI, and check the deployed download page. Do not mark the build signed until it has a verified Authenticode signature. Hashes do not identify the publisher.

## Verification

```sh
npm ci
npx playwright install chromium
npm run build
npm run check
npm test
git diff --exit-code public
```

Use `npm exec playwright show-report` to inspect the browser report. Check desktop/mobile screenshots visually as well as automated tests. The workflow uploads screenshots and test reports with limited retention. Test output is excluded from source control.

To check the release publicly, use a clean browser or an unauthenticated HTTP request to each URL in `public/assets/release.json`. A working repository page alone does not prove the installer is downloadable.
