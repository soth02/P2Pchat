################################################################################

## BIG2-CHAT • MULTI-AGENT WORK PLAN • PHASE-2

################################################################################

## CONTEXT

We already have:
• Vite + TypeScript scaffold (src/, tsconfig.json, vite.config.ts)
• Empty Git repo on main
• Node 20+, npm, Vitest installed

We still need to implement all runtime code, tests, Netlify config, and docs.

## GROUND RULES

• One pull request **per task card** below.
• Each task edits **exactly one file or folder** named in the card title.
• Follow red → green → refactor TDD (use Vitest).
• Typescript `"strict": true` is enabled—no `any`.
• Use the public WebRTC-Star multi-addr for signalling.
• No external stateful services other than that signalling bootstrap.
• Commit message format: `task-<N>: <summary>`.

==============================================================================

## CARD 1 – pkg updates & deps (file: package.json only)

Add runtime deps and test/dev deps.

RUN-TIME DEPS
"libp2p", "@libp2p/webrtc",
"@chainsafe/libp2p-gossipsub", "@chainsafe/libp2p-noise",
"libsodium-wrappers"

DEV DEPS
"vitest", "@vitest/ui", "playwright"

Add npm scripts:
"dev": "vite",
"build": "vite build",
"preview":"vite preview",
"test": "vitest run --coverage",
"test:ui":"vitest --ui",
"e2e": "playwright test"

Done-when:
✔ `npm i` succeeds.
✔ `npm run dev` starts Vite.

==============================================================================

## CARD 2 – secureBox helpers (folder: src/crypto/)

Create `src/crypto/secureBox.ts`:

await sodium.ready
export function seal(plain,key) -> {nonce,boxed}
export function open(boxed,nonce,key) -> Uint8Array|null

Use XChaCha20-Poly1305 (`crypto_secretbox_easy/open_easy`).

Tests file: `tests/crypto.spec.ts` (create).

Done-when:
✔ unit tests pass.

==============================================================================

## CARD 3 – ChatMessage types & codec (folder: src/types/)

`src/types/message.ts`

export interface ChatMessage { ts:number; author:string; text:string }
export const encode(m) -> Uint8Array
export const decode(u) -> ChatMessage

Tests: `tests/message.spec.ts`

Done-when:
✔ encode(decode(x)) round-trips.
✔ ts auto-fills when absent.

==============================================================================

## CARD 4 – libp2p peer factory (folder: src/p2p/)

`src/p2p/node.ts`

import { createLibp2p } from 'libp2p'
export async function createPeer()

Use WebRTC transport, Noise, GossipSub,
listen addr = /dns4/relay.signal.libp2p.io/tcp/443/wss/p2p-webrtc-star/

Tests: `tests/peer.spec.ts`
• two in-proc peers connect & ping.

==============================================================================

## CARD 5 – ChatService (core) (folder: src/chat/)

`src/chat/chatService.ts`

constructor(roomKey:Uint8Array)
start(onMsg:(m:ChatMessage)=>void) // subscribes + decrypts
send(m:ChatMessage) // encrypts + publishes

Depend only on secureBox and createPeer.

Tests: `tests/chatService.spec.ts`
• two ChatService instances exchange plaintext with same key
• wrong key fails to decrypt

==============================================================================

## CARD 6 – Minimal UI wiring (file: src/main.ts)

Wire DOM:
textarea#log (append “[HH:MM] author: text”)
input#msg + button#send
Prompt once for passphrase → derive roomKey via `crypto_generichash(32, pass)`.

No unit tests (covered by e2e).

==============================================================================

## CARD 7 – Netlify config (file: netlify.toml)

[build]
command = "npm run build"
publish = "dist"

==============================================================================

## CARD 8 – Playwright E2E (file: tests/e2e.spec.ts)

Launch two browser contexts → navigate to `vite preview`
→ enter same passphrase → type from context A → assert appears in B.

E2E runs on `npm run e2e`.

==============================================================================

## CARD 9 – CI workflow (file: .github/workflows/ci.yml)

jobs:
build-and-test:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4 - uses: actions/setup-node@v4
with: { node-version: '20' } - run: npm ci - run: npm run test - run: npm run e2e --if-present

==============================================================================

## CARD 10 – README (file: README.md)

Include: stack table, local dev commands, Netlify deploy note,
future-work bullet list (“X25519 key exchange”, “mental-poker shuffle”).

################################################################################

## END OF TASK CARDS

################################################################################
