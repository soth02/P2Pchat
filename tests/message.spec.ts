import { describe, it, expect } from 'vitest'
import { encode, decode, ChatMessage } from '../src/types/message'

describe('message encoding', () => {
  it('round trips message', () => {
    const msg: ChatMessage = { ts: Date.now(), author: 'alice', text: 'hi' }
    const bytes = encode(msg)
    const decoded = decode(bytes)
    expect(decoded).toEqual(msg)
  })

  it('fills missing timestamp on encode', () => {
    const partial = { author: 'bob', text: 'hello' } as unknown as ChatMessage
    const bytes = encode(partial)
    const decoded = decode(bytes)
    expect(typeof decoded.ts).toBe('number')
    expect(decoded.author).toBe('bob')
    expect(decoded.text).toBe('hello')
  })
})
