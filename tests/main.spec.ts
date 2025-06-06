import { describe, it, expect, beforeEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'

let lastStart: ((m: any) => void) | undefined
const sendMock = vi.fn()

class MockService {
  constructor(public key: Uint8Array) {}
  start(cb: (m: any) => void) {
    lastStart = cb
  }
  send = sendMock
}

vi.mock('../src/chat/chatService.ts', () => ({ ChatService: MockService }))
vi.mock('libsodium-wrappers', () => ({
  __esModule: true,
  default: { ready: Promise.resolve(), crypto_generichash: () => new Uint8Array(32) }
}))

describe('main ui wiring', () => {
  beforeEach(() => {
    vi.resetModules()
    sendMock.mockReset()
    lastStart = undefined
    const dom = new JSDOM('<!DOCTYPE html><div id="app"></div>')
    ;(global as any).window = dom.window as any
    ;(global as any).document = dom.window.document
    ;(global as any).prompt = vi.fn(() => 'pass')
  })

  it('appends incoming messages to log', async () => {
    await import('../src/main.ts')
    await new Promise((r) => setTimeout(r, 0))
    if (!lastStart) throw new Error('service not started')
    const log = document.querySelector<HTMLTextAreaElement>('#log')!
    lastStart({ ts: 0, author: 'a', text: 'hi' })
    expect(log.value).toContain('[00:00] a: hi')
  })

  it('sends message on click', async () => {
    await import('../src/main.ts')
    await new Promise((r) => setTimeout(r, 0))
    const input = document.querySelector<HTMLInputElement>('#msg')!
    const button = document.querySelector<HTMLButtonElement>('#send')!
    input.value = 'hello'
    button.dispatchEvent(new window.Event('click'))
    expect(sendMock).toHaveBeenCalled()
    expect(input.value).toBe('')
  })
})
