declare module 'libsodium-wrappers' {
  const sodium: {
    ready: Promise<void>
    crypto_generichash(len: number, input: string | Uint8Array): Uint8Array
  }
  export default sodium
}
