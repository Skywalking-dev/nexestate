import { z } from 'zod'

export const CRM_PROVIDERS = ['tokko', 'deinmobiliarios'] as const
export type CrmProvider = (typeof CRM_PROVIDERS)[number]

/** Payload for connecting a CRM integration */
export const connectCrmSchema = z.object({
  provider: z.enum(CRM_PROVIDERS),
  api_key: z.string().min(10, 'API key must be at least 10 characters'),
})

export type ConnectCrmInput = z.infer<typeof connectCrmSchema>

/** Response from POST /api/crm/connect */
export const crmConnectResponseSchema = z.object({
  id: z.string().uuid(),
  provider: z.string(),
  status: z.string(),
  created_at: z.string(),
})

export type CrmConnectResponse = z.infer<typeof crmConnectResponseSchema>

/** Response from GET /api/crm/status */
export const crmStatusResponseSchema = z.object({
  connected: z.boolean(),
  provider: z.string().optional(),
  status: z.string().optional(),
  last_sync_at: z.string().nullable().optional(),
  healthy: z.boolean().optional(),
})

export type CrmStatusResponse = z.infer<typeof crmStatusResponseSchema>
