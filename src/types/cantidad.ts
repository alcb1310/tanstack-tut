import z from "zod"

export const quantityResponseSchema = z.object({
	id: z.string().uuid(),
	project: projectSchema,
	rubro: rubrosSchema,
	quantity: z.number(),
	company_id: z.string().uuid().optional(),
})

export type QuantityResponseType = z.infer<typeof quantityResponseSchema>
