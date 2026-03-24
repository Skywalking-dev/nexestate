/**
 * AES-256-GCM encryption for API keys at rest.
 * ENCRYPTION_KEY env var must be a 64-char hex string (= 32 bytes).
 *
 * Ciphertext format (base64 of): iv(12B) + authTag(16B) + ciphertext(nB)
 * Stored as a single base64 string: "<iv_b64>:<ciphertext_b64>:<authTag_b64>"
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // 96-bit IV — recommended for GCM
const AUTH_TAG_LENGTH = 16

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes).')
  }
  return Buffer.from(hex, 'hex')
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64 string in the format: iv:ciphertext:authTag
 */
export function encryptApiKey(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [
    iv.toString('base64'),
    encrypted.toString('base64'),
    authTag.toString('base64'),
  ].join(':')
}

/**
 * Decrypts a base64 string produced by encryptApiKey.
 * Throws if tampered or key mismatch.
 */
export function decryptApiKey(encrypted: string): string {
  const key = getKey()
  const parts = encrypted.split(':')
  if (parts.length !== 3) throw new Error('Formato de clave cifrada inválido.')

  const [ivB64, ciphertextB64, authTagB64] = parts
  const iv = Buffer.from(ivB64, 'base64')
  const ciphertext = Buffer.from(ciphertextB64, 'base64')
  const authTag = Buffer.from(authTagB64, 'base64')

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}
