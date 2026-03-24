import { z } from 'zod'

/** Valid UUID v4 string */
export const uuidSchema = z.string().uuid()

/** URL-safe slug: lowercase alphanumeric + hyphens, 3-50 chars */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens only')
  .min(3, 'Slug must be at least 3 characters')
  .max(50, 'Slug must be at most 50 characters')

/** Pagination params with safe defaults */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/** Search + pagination combined */
export const searchSchema = paginationSchema.extend({
  search: z.string().trim().optional(),
})

export type PaginationParams = z.infer<typeof paginationSchema>
export type SearchParams = z.infer<typeof searchSchema>
