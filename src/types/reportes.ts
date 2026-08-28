import { z } from 'zod'
import type { InvoiceResponseType } from './facturas'
import type { BudgetItem } from './partidas'

export type LevelType = {
	key: string
	value: string
}

export const actualReportSchema = z.object({
	project_id: z
		.string({ message: 'Seleccione un proyecto' })
		.uuid('Seleccione un proyecto'),
	level: z
		.string({ message: 'Seleccione un nivel' })
		.min(1, 'Seleccione un nivel'),
})

export type ActualReportTypes = z.infer<typeof actualReportSchema>

export type BalanceResponseType = {
	invoices: InvoiceResponseType[]
	total: number
}

export const balanceReportSchema = z.object({
	project_id: z
		.string({ message: 'Seleccione un proyecto' })
		.uuid('Seleccione un proyecto'),
	date: z.string().min(1, 'Seleccione una fecha'),
})

export type BalanceReportType = z.infer<typeof balanceReportSchema>

export const reportSchema = z.object({
	project_id: z
		.string({ message: 'Seleccione un proyecto' })
		.uuid('Seleccione un proyecto'),
	level: z
		.string({ message: 'Seleccione un nivel' })
		.min(1, 'Seleccione un nivel'),
	date: z.string().min(1, 'Seleccione una fecha'),
})
export type ReportTypes = z.infer<typeof reportSchema>

export type Spent = {
	spent: number
	budget_item: BudgetItem
}

export type SpentResponseType = {
	spent: Spent[]
	total: number
	project: string
}

export type SpentDetailsType = {
	budget_item_code: string
	budget_item_id: string
	budget_item_name: string
	budget_item_level: number
	company_id: string
	cost: number
	invoice_date: string
	invoice_id: string
	invoice_number: string
	invoice_total: number
	project_id: string
	project_name: string
	quantity: number
	supplier_id: string
	supplier_name: string
	supplier_number: string
	total: number
}
