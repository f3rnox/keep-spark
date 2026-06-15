import { bytesToBase64 } from './bytesToBase64'
import { encryptText } from './encryptText'
import { setPasskeyUnlockRecord } from './passkeyUnlockStore'
import { isPlatformAuthenticatorAvailable } from './isPasskeyUnlockAvailable'

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
 * Registers a platform passkey that wraps the master encryption password.
 *
 * @param password Verified master encryption password.
 */
export async function registerPasskeyUnlock(password: string): Promise<void> {
  const platformAvailable: boolean = await isPlatformAuthenticatorAvailable()
  if (!platformAvailable) {
    throw new Error('Platform authenticator is not available on this device.')
  }

  const userIdBuffer: ArrayBuffer = new ArrayBuffer(16)
  const userId: Uint8Array<ArrayBuffer> = new Uint8Array(userIdBuffer)
  crypto.getRandomValues(userId)

  const challenge: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(32))
  crypto.getRandomValues(challenge)

  const credentialResult: Credential | null = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: 'KeepSpark',
        id: window.location.hostname,
      },
      user: {
        id: userId,
        name: 'keepspark-user',
        displayName: 'KeepSpark encryption',
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'required',
        userVerification: 'required',
      },
      extensions: { prf: {} } as AuthenticationExtensionsClientInputs,
    },
  })

  if (credentialResult === null || !(credentialResult instanceof PublicKeyCredential)) {
    throw new Error('Passkey registration was cancelled.')
  }

  const credential: PublicKeyCredential = credentialResult

  const prfSaltBuffer: ArrayBuffer = new ArrayBuffer(32)
  const prfSalt: Uint8Array<ArrayBuffer> = new Uint8Array(prfSaltBuffer)
  crypto.getRandomValues(prfSalt)

  const assertionResult: Credential | null = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId: window.location.hostname,
      allowCredentials: [
        {
          type: 'public-key',
          id: credential.rawId,
        },
      ],
      userVerification: 'required',
      extensions: {
        prf: {
          eval: {
            first: prfSalt,
          },
        },
      } as AuthenticationExtensionsClientInputs,
    },
  })

  if (assertionResult === null || !(assertionResult instanceof PublicKeyCredential)) {
    throw new Error('Passkey verification failed during setup.')
  }

  const assertion: PublicKeyCredential = assertionResult

  const prfOutput: ArrayBuffer | undefined = (
    assertion.getClientExtensionResults() as PrfExtensionResults
  ).prf?.results?.first

  if (prfOutput === undefined) {
    throw new Error('This browser does not support passkey PRF for encryption unlock.')
  }

  const prfKey: CryptoKey = await crypto.subtle.importKey(
    'raw',
    prfOutput,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )

  const encrypted = await encryptText(password, prfKey)

  setPasskeyUnlockRecord({
    credentialId: bytesToBase64(new Uint8Array(credential.rawId)),
    prfSalt: bytesToBase64(prfSalt),
    iv: encrypted.iv,
    ciphertext: encrypted.ciphertext,
  })
}
