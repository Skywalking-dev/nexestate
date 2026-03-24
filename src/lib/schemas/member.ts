import { z } from 'zod'

export const MEMBER_ROLES = ['admin', 'agent'] as const
export type MemberRole = (typeof MEMBER_ROLES)[number]

/** Payload for inviting a new member to an organization */
export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(MEMBER_ROLES),
})

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
