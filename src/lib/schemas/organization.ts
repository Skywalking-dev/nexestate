import { z } from 'zod'
import { slugSchema } from '@/lib/schemas/common'

export const ORG_TIERS = ['starter', 'pro', 'enterprise'] as const
export type OrgTier = (typeof ORG_TIERS)[number]

/** Payload for creating a new organization */
export const createOrgSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: slugSchema,
})

/** Payload for updating an existing organization */
export const updateOrgSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  tier: z.enum(ORG_TIERS).optional(),
})

export type CreateOrgInput = z.infer<typeof createOrgSchema>
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>
