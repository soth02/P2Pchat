import { describe, expect, it } from 'vitest'
import { seal, open } from '../src/crypto/secureBox'
import sodium from 'libsodium-wrappers'

describe('secureBox', () => {
  it('seals and opens a message', async () => {
    await sodium.ready
    const key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES)
    const msg = sodium.from_string('hello world')
    const { nonce, boxed } = seal(msg, key)
    const opened = open(boxed, nonce, key)
    expect(opened && sodium.to_string(opened)).toBe('hello world')
  })
})
