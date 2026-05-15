/**
 * Markwell — HMAC request signing for browser
 *
 * Genera la firma HMAC-SHA256 que espera el endpoint /score.
 * Usa Web Crypto API nativa del navegador — sin dependencias externas.
 *
 * Algoritmo idéntico al de auth.py:
 *   stringToSign = "{apiKey}\n{timestampMs}\n{body}"
 *   signature    = HMAC-SHA256(secret, stringToSign) en hex lowercase
 *
 * ⚠️  Nota de seguridad: este código vive en el navegador, por lo que el
 *     secret HMAC es accesible vía DevTools. Para producción real, el secret
 *     debe vivir en un backend intermedio o usar tokens de corta duración.
 *     Para demos y dev local está OK.
 *
 * Uso:
 *   const { headers, body } = await signRequest({ apiKey, secret, payload })
 *   await fetch(url, { method: 'POST', headers, body })
 */

/**
 * Convierte un ArrayBuffer a string hexadecimal en minúsculas.
 */
function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }
  
  /**
   * Calcula HMAC-SHA256 y devuelve el resultado en hex lowercase.
   * @param {string} secret  - Clave secreta (mws_live_...)
   * @param {string} message - Cadena a firmar
   * @returns {Promise<string>} firma hex
   */
  async function hmacSha256Hex(secret, message) {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
    return bufferToHex(signature)
  }
  
  /**
   * Firma un request para Markwell API.
   *
   * @param {object} opts
   * @param {string} opts.apiKey  - API key del tenant (mw_...)
   * @param {string} opts.secret  - Secret HMAC del tenant (mws_live_...)
   * @param {object} opts.payload - Cuerpo de la request (será serializado a JSON)
   * @returns {Promise<{headers: object, body: string}>}
   *
   * El body devuelto es el JSON exacto que fue firmado — usalo tal cual en el fetch,
   * NO vuelvas a serializar el payload ni lo modifiques, porque la firma dejaría de coincidir.
   */
  export async function signRequest({ apiKey, secret, payload }) {
    if (!apiKey || !secret) {
      throw new Error('signRequest: faltan apiKey o secret')
    }
  
    const body = JSON.stringify(payload)
    const timestamp = Date.now().toString()
    const stringToSign = `${apiKey}\n${timestamp}\n${body}`
    const signature = await hmacSha256Hex(secret, stringToSign)
  
    return {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key':    apiKey,
        'X-Timestamp':  timestamp,
        'X-Signature':  signature,
      },
      body,
    }
  }
