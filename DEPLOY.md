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
5. Build pack: **Static**
6. Install Command: `npm install`
7. Build Command: `npm run build`
8. Publish Directory: `dist`
9. Save

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

## 5. Headers (optional but recommended)

The model is ~700 MB on first load and cached in the browser's Cache Storage.
To give the WASM runtime full performance, Coolify's Nginx layer should send:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These enable `SharedArrayBuffer`, which Transformers.js uses for multi-threaded
WASM when WebGPU is not available. Configure under the resource's **Custom
Nginx Configuration** if your Coolify version exposes it; otherwise the model
still works, just single-threaded WASM.

## 6. Smoke test

After the first successful deploy:

- Open https://LocalMask.winsonwu.com
- Watch the model-status pill in the workbench. It should progress from
  `Loading model · NN%` to `Ready · WebGPU · q4f16`.
- Paste a snippet of test content; entities should highlight within ~1s.
