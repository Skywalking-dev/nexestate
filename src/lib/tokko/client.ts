/**
 * Tokko Broker API client.
 * Auth: API key appended as ?key= query param on every request.
 * Base: https://www.tokkobroker.com/api/v1/
 */
import type { TokkoApiResponse, TokkoContact, TokkoProperty } from '@/lib/tokko/types'

const BASE_URL = 'https://www.tokkobroker.com/api/v1'
const TIMEOUT_MS = 10_000

// ── Custom error types ────────────────────────────────────────────────────────

export class TokkoConnectionError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'TokkoConnectionError'
  }
}

export class TokkoAuthError extends Error {
  constructor() {
    super('API key inválida o sin permisos suficientes en Tokko.')
    this.name = 'TokkoAuthError'
  }
}

export class TokkoRateLimitError extends Error {
  constructor() {
    super('Límite de solicitudes alcanzado en la API de Tokko. Intenta más tarde.')
    this.name = 'TokkoRateLimitError'
  }
}

// ── Client ───────────────────────────────────────────────────────────────────

export class TokkoClient {
  constructor(private readonly apiKey: string) {}

  /** Build URL with key param + optional extra params. */
  private buildUrl(path: string, params: Record<string, string | number> = {}): string {
    const url = new URL(`${BASE_URL}${path}/`)
    url.searchParams.set('key', this.apiKey)
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v))
    }
    return url.toString()
  }

  /** Fetch wrapper with timeout + typed error handling. */
  private async request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(this.buildUrl(path, params), {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new TokkoConnectionError('Tiempo de respuesta agotado al conectar con Tokko.', err)
      }
      throw new TokkoConnectionError('No se pudo conectar con la API de Tokko.', err)
    } finally {
      clearTimeout(timer)
    }

    if (response.status === 401 || response.status === 403) throw new TokkoAuthError()
    if (response.status === 429) throw new TokkoRateLimitError()

    if (!response.ok) {
      throw new TokkoConnectionError(`Error inesperado de Tokko: HTTP ${response.status}`)
    }

    return response.json() as Promise<T>
  }

  /**
   * Validates the API key by fetching a single property.
   * Returns true if the key is accepted, false otherwise.
   */
  async validateConnection(): Promise<boolean> {
    try {
      await this.request<TokkoApiResponse<TokkoProperty>>('/property', { limit: 1 })
      return true
    } catch (err) {
      if (err instanceof TokkoAuthError) return false
      throw err
    }
  }

  /** Fetch properties with optional pagination. */
  async getProperties(
    params: { limit?: number; offset?: number } = {},
  ): Promise<TokkoApiResponse<TokkoProperty>> {
    const query: Record<string, number> = {}
    if (params.limit !== undefined) query['limit'] = params.limit
    if (params.offset !== undefined) query['offset'] = params.offset
    return this.request<TokkoApiResponse<TokkoProperty>>('/property', query)
  }

  /** Fetch contacts with optional pagination. */
  async getContacts(
    params: { limit?: number; offset?: number } = {},
  ): Promise<TokkoApiResponse<TokkoContact>> {
    const query: Record<string, number> = {}
    if (params.limit !== undefined) query['limit'] = params.limit
    if (params.offset !== undefined) query['offset'] = params.offset
    return this.request<TokkoApiResponse<TokkoContact>>('/contact', query)
  }
}
