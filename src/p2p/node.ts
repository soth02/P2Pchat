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
