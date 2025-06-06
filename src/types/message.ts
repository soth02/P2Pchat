export interface ChatMessage {
  ts: number
  author: string
  text: string
}


const enc = new TextEncoder()
const dec = new TextDecoder()

export function encode(m: Partial<ChatMessage>): Uint8Array {
  const msg: ChatMessage = {
    ts: m.ts ?? Date.now(),
    author: m.author ?? '',
    text: m.text ?? ''
  }
  return enc.encode(JSON.stringify(msg))
}

export function decode(u: Uint8Array): ChatMessage {
  const obj = JSON.parse(dec.decode(u))
  return {
    ts: obj.ts ?? Date.now(),
    author: obj.author,
    text: obj.text
  }
main
}
