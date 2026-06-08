import { z } from "zod"
import { supplierSchema } from "./proveedor"
import { projectSchema } from "./proyectos"

export const invoiceResponseSchema = z.object({
	id: z.string().uuid(),
	data: z.date(),
	project: projectSchema,
	supplier: supplierSchema,
	invoice_date: z.date(),
	invoice_number: z.string(),
	invoice_total: z.number(),
	company_id: z.string().uuid().optional(),
	is_balanced: z.boolean().optional(),
})

export type InvoiceResponseType = z.infer<typeof invoiceResponseSchema>
