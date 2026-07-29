import { z } from "zod"

export const errorSchema = z.object({
	code: z.number(),
	msg: z.string(),
	info: z.any().nullable(),
})

export type ErrorResponseType = z.infer<typeof errorSchema>
