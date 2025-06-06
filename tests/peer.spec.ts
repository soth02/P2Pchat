import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { Libp2p } from 'libp2p'
import { createPeer } from '../src/p2p/node'

if (!(Promise as any).withResolvers) {
  (Promise as any).withResolvers = () => {
    let resolve: (value?: unknown) => void
    let reject: (reason?: any) => void
    const promise = new Promise((res, rej) => { resolve = res; reject = rej })
    return { promise, resolve: resolve!, reject: reject! }
  }
}

let a: Libp2p
let b: Libp2p

beforeAll(async () => {
  a = await createPeer()
  b = await createPeer()
  await a.dial(b.getMultiaddrs()[0])
})

afterAll(async () => {
  await a.stop()
  await b.stop()
})

describe('createPeer', () => {
  it('peers can ping each other', async () => {
    const res = await a.ping(b.getMultiaddrs()[0])
    expect(res).toBeDefined()
  })
})
