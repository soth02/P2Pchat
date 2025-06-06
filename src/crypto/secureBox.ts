import sodium from 'libsodium-wrappers'

await sodium.ready

export function seal(plain: Uint8Array, key: Uint8Array): { nonce: Uint8Array; boxed: Uint8Array } {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
  const boxed = sodium.crypto_secretbox_easy(plain, nonce, key)
  return { nonce, boxed }
}

export function open(boxed: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array | null {
  try {
    return sodium.crypto_secretbox_open_easy(boxed, nonce, key)
  } catch {
    return null
  }
}
