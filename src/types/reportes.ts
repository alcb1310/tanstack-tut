import { z } from "zod"

export type LevelType = {
	key: string
	value: string
}

export const actualReportSchema = z.object({
	project_id: z
		.string({ message: "Seleccione un proyecto" })
		.uuid("Seleccione un proyecto"),
	level: z
		.string({ message: "Seleccione un nivel" })
		.min(1, "Seleccione un nivel"),
})

export type ActualReportTypes = z.infer<typeof actualReportSchema>
