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
}
