import { z } from 'zod'
import { materialSchema } from './materiales'
import { rubrosSchema } from './rubros'

export const rubroMaterialResponseSchema = z.object({
	item: rubrosSchema,
	material: materialSchema,
	quantity: z.custom<number>(val => {
		const num = Number.parseFloat(val as string)
		return !Number.isNaN(num)
	}, 'La cantidad deber ser un  número'),
})

export type RubroMaterialResponseTye = z.infer<
	typeof rubroMaterialResponseSchema
>

export const rubroMaterialSchema = z.object({
	item_id: z.string().uuid('Seleccione un rubro'),
	material_id: z.string().uuid('Seleccione un material'),
	quantity: z.custom<number>(val => {
		const num = Number.parseFloat(val as string)
		return !Number.isNaN(num)
	}, 'La cantidad deber ser un  número'),
})

export type RubroMaterialType = z.infer<typeof rubroMaterialSchema>
