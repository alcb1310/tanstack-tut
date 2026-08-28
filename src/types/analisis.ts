import { z } from 'zod'

const analisysDataSchema = z.object({
	project_name: z.string(),
	category_name: z.string(),
	material_name: z.string(),
	unit: z.string(),
	quantity: z.number(),
})

export type AnalisysDataType = z.infer<typeof analisysDataSchema>

const analisysSchema = z.object({
	key: z.string(),
	data: z.array(analisysDataSchema),
})

export type AnalisisType = z.infer<typeof analisysSchema>
