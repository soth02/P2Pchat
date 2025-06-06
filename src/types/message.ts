export interface ChatMessage {
  ts: number
  author: string
  text: string
}

export const encode = (m: ChatMessage): Uint8Array => {
  const msg: ChatMessage = {
    ts: m.ts ?? Date.now(),
    author: m.author,
    text: m.text,
  }
  return new TextEncoder().encode(JSON.stringify(msg))
}

export const decode = (u: Uint8Array): ChatMessage => {
  return JSON.parse(new TextDecoder().decode(u)) as ChatMessage
}
