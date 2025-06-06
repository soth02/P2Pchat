
export interface ChatMessage { ts: number; author: string; text: string }
export class ChatService {
  constructor(_key: Uint8Array) {}
  start(_cb: (m: ChatMessage) => void) {}
  send(_m: ChatMessage) {}

import { seal, open } from '../crypto/secureBox'
import { createPeer } from '../p2p/node'
import { encode, decode, ChatMessage } from '../types/message'

const NONCE_LEN = 24
const TOPIC = 'chat'

export class ChatService {
  private key: Uint8Array
  private peerPromise: Promise<ReturnType<typeof createPeer>> | null = null

  constructor(roomKey: Uint8Array) {
    this.key = roomKey
  }

  async start(onMsg: (m: ChatMessage) => void): Promise<void> {
    const peer = await createPeer()
    this.peerPromise = Promise.resolve(peer)
    peer.pubsub.subscribe(TOPIC, (data: Uint8Array) => {
      const nonce = data.slice(0, NONCE_LEN)
      const boxed = data.slice(NONCE_LEN)
      const plain = open(boxed, nonce, this.key)
      if (!plain) return
      const msg = decode(plain)
      onMsg(msg)
    })
  }

  async send(m: ChatMessage): Promise<void> {
    if (!this.peerPromise) throw new Error('not started')
    const peer = await this.peerPromise
    const plain = encode(m)
    const { nonce, boxed } = seal(plain, this.key)
    const payload = new Uint8Array(nonce.length + boxed.length)
    payload.set(nonce, 0)
    payload.set(boxed, nonce.length)
    peer.pubsub.publish(TOPIC, payload)
  }
}
