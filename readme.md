# P2Pchat

A lightweight encrypted chat demo built with libp2p and TypeScript.

## Stack

| Area | Technology |
| ---- | ---------- |
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Build Tool | Vite |
| P2P Network | libp2p with WebRTC transport, Noise encryption, GossipSub pubsub |
| Crypto | libsodium |
| Testing | Vitest & Playwright |
| Deployment | Netlify |

## Local development

```bash
npm install
npm run dev        # start the Vite dev server
npm run build      # compile and bundle
npm run preview    # serve the built app
npm run test       # run unit tests
npm run e2e        # run end-to-end tests
```

## Deploy

This project can be deployed to Netlify using the settings in `netlify.toml`.

## Future work

- X25519 key exchange
- mental-poker shuffle
