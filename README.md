# Chroniq website

`Website/` contains the dependency-free source for Chroniq's public product
site. The tracked brand masters remain authoritative under `Brand/`; the CI
build copies the approved vectors and raster exports into the deployable
`assets/` directory.

Build and validate locally:

```sh
output="$(mktemp -d)"
Scripts/ci/build-website.sh "$output/site"
python3 -m http.server 8080 --directory "$output/site"
```

The site contains no analytics, cookies, remote fonts, API credentials, or
application secrets. Its release resolver calls the unauthenticated public
GitHub API for `SysCake/chroniq-site` and falls back to that repository's latest
release page when the API is unavailable.
