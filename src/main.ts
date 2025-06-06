import './style.css'
import sodium from 'libsodium-wrappers'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <textarea id="log" rows="8" readonly></textarea>
  <input id="msg" type="text" />
  <button id="send">Send</button>
`

async function setup() {
  await sodium.ready
  const pass = prompt('Enter passphrase') ?? ''
  const roomKey = sodium.crypto_generichash(32, pass)
  const { ChatService } = await import('./chat/chatService.ts')
  const svc = new ChatService(roomKey)
  svc.start(append)

  const input = document.querySelector<HTMLInputElement>('#msg')!
  const button = document.querySelector<HTMLButtonElement>('#send')!

  const send = () => {
    const text = input.value.trim()
    if (!text) return
    svc.send({ ts: Date.now(), author: 'me', text })
    input.value = ''
  }

  button.addEventListener('click', send)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  })
}

function append(m: { ts: number; author: string; text: string }) {
  const log = document.querySelector<HTMLTextAreaElement>('#log')!
  const d = new Date(m.ts)
  const hhmm = d.toTimeString().slice(0, 5)
  log.value += `[${hhmm}] ${m.author}: ${m.text}\n`
  log.scrollTop = log.scrollHeight
}

setup()
