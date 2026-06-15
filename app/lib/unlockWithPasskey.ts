import { base64ToBytes } from './base64ToBytes'
import { decryptText } from './decryptText'
import { getPasskeyUnlockSnapshot } from './passkeyUnlockStore'
import { isPasskeyUnlockAvailable } from './isPasskeyUnlockAvailable'

/**
 * WebAuthn extension output carrying PRF results.
 */
interface PrfExtensionResults {
  prf?: {
    results?: {
      first?: ArrayBuffer
    }
  }
}

/**
 * Unlocks the master encryption password using a registered platform passkey.
 */
export async function unlockWithPasskey(): Promise<string> {
  if (!isPasskeyUnlockAvailable()) {
    throw new Error('Passkey unlock is not available in this browser.')
  }

  const record = getPasskeyUnlockSnapshot()
  if (record === null) {
    throw new Error('No passkey is configured for encryption unlock.')
  }

  const challenge: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(32))
  crypto.getRandomValues(challenge)

  const assertionResult: Credential | null = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId: window.location.hostname,
      allowCredentials: [
        {
          type: 'public-key',
          id: base64ToBytes(record.credentialId),
        },
      ],
      userVerification: 'required',
      extensions: {
        prf: {
          eval: {
            first: base64ToBytes(record.prfSalt),
          },
        },
      } as AuthenticationExtensionsClientInputs,
    },
  })

  if (assertionResult === null || !(assertionResult instanceof PublicKeyCredential)) {
    throw new Error('Passkey unlock was cancelled.')
  }

  const assertion: PublicKeyCredential = assertionResult

  const prfOutput: ArrayBuffer | undefined = (
    assertion.getClientExtensionResults() as PrfExtensionResults
  ).prf?.results?.first

  if (prfOutput === undefined) {
    throw new Error('Passkey PRF output was not returned by this browser.')
  }

  const prfKey: CryptoKey = await crypto.subtle.importKey(
    'raw',
    prfOutput,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )

  return decryptText(record.ciphertext, record.iv, prfKey)
}
