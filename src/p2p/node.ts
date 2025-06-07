
import { createLibp2p } from 'libp2p'
import { webRTC } from '@libp2p/webrtc'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { noise } from '@chainsafe/libp2p-noise'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { identify } from '@libp2p/identify'
import { FaultTolerance } from '@libp2p/interface'

export async function createPeer() {
  return createLibp2p({
    addresses: {
      listen: ['/dns4/relay.signal.libp2p.io/tcp/443/wss/p2p-webrtc-star/']
    },
    transports: [circuitRelayTransport(), webRTC()],
    connectionEncryption: [noise()],
    transportManager: {
      faultTolerance: FaultTolerance.NO_FATAL
    },
    services: {
      identify: identify(),
      pubsub: gossipsub()
    }
  })

interface PubSub {
  subscribe(topic: string, handler: (data: Uint8Array) => void): void
  publish(topic: string, data: Uint8Array): void
}

interface Peer {
  pubsub: PubSub
}

const topics: Record<string, Set<(data: Uint8Array) => void>> = {}

export async function createPeer(): Promise<Peer> {
  const pubsub: PubSub = {
    subscribe(topic, handler) {
      if (!topics[topic]) topics[topic] = new Set()
      topics[topic].add(handler)
    },
    publish(topic, data) {
      const handlers = topics[topic]
      if (!handlers) return
      for (const h of handlers) {
        // async delivery
        setTimeout(() => h(data), 0)
      }
    }
  }
  return { pubsub }
}
