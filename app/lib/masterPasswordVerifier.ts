/**
 * Stored verifier used to confirm the master encryption password.
 */
export interface MasterPasswordVerifier {
  salt: string
  hash: string
  iterations: number
}
