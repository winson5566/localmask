# Deployment: Coolify · LocalMask.winsonwu.com

## 1. DNS

Add an `A` record at your DNS provider:

```
LocalMask.winsonwu.com   A   169.224.224.211
```

Set TTL to 5 minutes (or whatever you prefer). Wait for propagation:

```bash
dig +short LocalMask.winsonwu.com
# should return 169.224.224.211
```

## 2. Coolify resource

1. https://coolify.winsonwu.com → log in
2. **+ New** → **Public Repository** (or **Private Repository** if you used a private GitHub repo and have the GitHub App installed)
3. Repository URL: the URL of the `localmask` repo
4. Branch: `main`
5. Build pack: **Dockerfile**
6. Dockerfile location: `/Dockerfile`
7. Ports exposes: `80`
8. Save

The repo ships a multi-stage `Dockerfile`: it builds the Vite app with
Node (`npm ci && npm run build`), then serves `dist/` from nginx with an
SPA fallback (see `nginx.conf`). Do NOT use the **Static** build pack — it
only copies the repo into nginx without ever running the build, so the site
would serve the unbuilt `index.html` (referencing `/src/main.tsx`) and fail.

## 3. Domain + TLS

Inside the resource:
- **Domains** → add `https://LocalMask.winsonwu.com`
- Coolify-proxy will request a Let's Encrypt cert automatically (give it ~30s)

## 4. Auto-deploy on push

Inside the resource → **Webhooks**:
- Enable **GitHub auto-deploy**
- Copy the webhook URL Coolify shows
- GitHub repo → Settings → Webhooks → Add webhook → paste URL, content type
  `application/json`, secret = Coolify-provided secret, events = "Just the push event"

After this, every push to `main` triggers a Coolify build.

## 5. Headers (intentionally omitted)

`Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy:
require-corp` would enable `SharedArrayBuffer` for multi-threaded WASM. They
are deliberately NOT set, because `require-corp` blocks cross-origin fetches
that lack CORP/CORS headers — including the model download from the
HuggingFace CDN — which would break loading entirely.

The primary path is WebGPU (`q4f16`), which needs no `SharedArrayBuffer`. The
WASM fallback runs single-threaded without these headers, which is slower but
functional. If you later self-host the model weights same-origin, you can add
the headers back in `nginx.conf`.

## 6. Smoke test

After the first successful deploy:

- Open https://LocalMask.winsonwu.com
- Watch the model-status pill in the workbench. It should progress from
  `Loading model · NN%` to `Ready · WebGPU · q4f16`.
- Paste a snippet of test content; entities should highlight within ~1s.
