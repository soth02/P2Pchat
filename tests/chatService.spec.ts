import { describe, it, expect, beforeAll } from 'vitest'
import sodium from 'libsodium-wrappers'
import { ChatService } from '../src/chat/chatService'
import { ChatMessage } from '../src/types/message'

beforeAll(async () => {
  await sodium.ready
})

describe('ChatService', () => {
  it('two instances with same key exchange messages successfully', async () => {
    const key = sodium.randombytes_buf(32)
    const a = new ChatService(key)
    const b = new ChatService(key)

    const received: ChatMessage[] = []

    await a.start(() => {})
    await b.start(msg => received.push(msg))

    const msg: ChatMessage = { ts: Date.now(), author: 'alice', text: 'hi' }
    await a.send(msg)
    await new Promise(r => setTimeout(r, 10))

    expect(received[0]).toEqual(msg)
  })

  it('wrong key fails to decrypt', async () => {
    const keyA = sodium.randombytes_buf(32)
    const keyB = sodium.randombytes_buf(32)
    const a = new ChatService(keyA)
    const b = new ChatService(keyB)

    const received: ChatMessage[] = []

    await a.start(() => {})
    await b.start(msg => received.push(msg))

    const msg: ChatMessage = { ts: Date.now(), author: 'alice', text: 'secret' }
    await a.send(msg)
    await new Promise(r => setTimeout(r, 10))

    expect(received.length).toBe(0)
  })
})
