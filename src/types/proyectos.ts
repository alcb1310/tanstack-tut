import { z } from 'zod'

export const projectSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, { message: 'El nombre es requerido' }),
	net_area: z
		.custom<number>(val => {
			const num = Number.parseFloat(val as string)
			return !Number.isNaN(num) || val === ''
		}, 'El valor debe ser un número')
		.optional(),
	gross_area: z
		.custom<number>(val => {
			const num = Number.parseFloat(val as string)
			return !Number.isNaN(num) || val === ''
		}, 'El valor debe ser un número')
		.optional(),
	is_active: z.boolean(),
})

export type ProjectType = z.infer<typeof projectSchema>

const filesDataSchema = z.object({
	project_id: z.string().uuid(),
	project_name: z.string(),
	file_name: z.string(),
	file_url: z.string(),
	file_type: z.string(),
})

const filesSchema = z.object({
	key: z.string(),
	data: z.array(filesDataSchema),
})

export type FilesType = z.infer<typeof filesSchema>
