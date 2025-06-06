export interface ChatMessage { ts: number; author: string; text: string }
export class ChatService {
  constructor(_key: Uint8Array) {}
  start(_cb: (m: ChatMessage) => void) {}
  send(_m: ChatMessage) {}
}
