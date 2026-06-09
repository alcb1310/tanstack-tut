import { z } from "zod"
import { InvoiceResponseType } from "./facturas"

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

export type BalanceResponseType = {
	invoices: InvoiceResponseType[]
	total: number
}

export const balanceReportSchema = z.object({
	project_id: z
		.string({ message: "Seleccione un proyecto" })
		.uuid("Seleccione un proyecto"),
	date: z.string().min(1, "Seleccione una fecha"),
})

export type BalanceReportType = z.infer<typeof balanceReportSchema>
