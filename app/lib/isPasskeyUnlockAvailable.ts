/**
 * Returns whether WebAuthn and the PRF extension are available in this browser.
 */
export function isPasskeyUnlockAvailable(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.isSecureContext) return false
  if (typeof PublicKeyCredential === 'undefined') return false
  if (typeof navigator.credentials?.create !== 'function') return false
  if (typeof navigator.credentials?.get !== 'function') return false
  return typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
}

/**
 * Returns whether a platform authenticator is available for passkey unlock.
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isPasskeyUnlockAvailable()) return false
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
}
