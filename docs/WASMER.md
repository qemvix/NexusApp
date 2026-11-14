# Deploy NexusApp on Wasmer

The site follows Wasmer's [static-site guide](https://docs.wasmer.io/edge/guides/static-site/) and [GitHub deployment flow](https://docs.wasmer.io/edge/git/). It uses the same `Staticfile`, `public/` and `settings/config.toml` structure as the [official static-website template](https://github.com/wasmer-examples/static-website).

## Import the repository

1. Sign in to Wasmer and start a new app from a GitHub repository.
2. Select **qemvix/NexusApp**, branch **main**, and use the repository root (no subdirectory).
3. Let Wasmer detect the **Staticfile**. Its `root: public` selects the committed static output. No Node runtime or `npm run dev` process is required in production.
4. Choose the app name/namespace available in your Wasmer account and the plan offered there, then deploy. No environment variables or secrets are required.
5. Open the assigned URL. Check `/`, `/modules/`, `/downloads/`, `/guide/`, a screenshot, and a nonexistent route. The latter should display the designed 404 page with a 404 response. Test both real download choices.

Wasmer may generate account-specific application configuration during import. Do not replace it with an invented package name from another account. This repository deliberately does not hardcode a Wasmer namespace, package ID, app ID, paid plan or domain. Consult the linked current guides if the dashboard wording changes.

## Why this fits a static/free hosting setup

Production consists of ordinary HTML, CSS, JavaScript, JSON and local images. There is no server application, database, runtime package installation or paid API. Large Windows downloads live on GitHub Releases. The site's initial uncompressed public payload is below 1 MB. Any free-plan usage, bandwidth, request or project limits are determined by Wasmer's current terms; this repository cannot guarantee a particular quota.

`settings/config.toml` supplies compression, disables listings and sets a same-origin content security policy, MIME sniffing protection and a restrictive permissions policy. It does not allow third-party scripts, embedding or camera/microphone/geolocation access. Static server defaults may provide additional headers.

## Domains and search metadata

Once the final public origin is known, set it **at build time** and commit the regenerated output:

```sh
NEXUS_SITE_URL=https://your-real-domain npm run build
npm run check
```

For PowerShell, use `$env:NEXUS_SITE_URL='https://your-real-domain'` before the build. That adds canonical links, absolute social-image URLs, `sitemap.xml` and a robots sitemap reference. No imaginary domain is included by default. Domain/DNS configuration is handled in Wasmer and at the domain registrar.

## Updates and rollback

Edit the source, rebuild, verify and push `main`. If the Wasmer Git integration has automatic deployment enabled, it imports the new commit; otherwise trigger deployment from the dashboard. Revert the problematic website commit to return to earlier pages. Desktop release binaries are separately versioned and are not modified by a website deployment.

This site is designed for an origin root, not a GitHub Pages repository subpath. Asset and page URLs start with `/`. Deploy it at the root of the assigned Wasmer app or domain.
