import { z } from "zod"

export const userResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	company_id: z.string(),
})

export type UserResponse = z.infer<typeof userResponseSchema>
