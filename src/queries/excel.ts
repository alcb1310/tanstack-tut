import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { ErrorResponseType } from "@/types/error"
import type {
	ActualReportTypes,
	BalanceReportType,
	ReportTypes,
} from "@/types/reportes"

const URL = import.meta.env.VITE_BACKEND_SERVER

export const actualExcelExport = createServerFn({ method: "GET" })
	.validator((data: ActualReportTypes) => data)
	.handler(async ({ data }): Promise<Response> => {
		const token = getCookie("BCA-TOKEN")

		const res = await fetch(
			`${URL}/reportes/excel/actual?proyecto=${data.project_id}&nivel=${data.level}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)

		if (!res.ok) {
			const error = (await res.json()) as ErrorResponseType
			throw new Error(error.msg)
		}

		const blob = await res.blob()

		return new Response(blob, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": 'attachment; filename="reporte.xlsx"',
			},
		})
	})

export const balanceExcelExport = createServerFn({ method: "GET" })
	.validator((data: BalanceReportType) => data)
	.handler(async ({ data }): Promise<Response> => {
		const token = getCookie("BCA-TOKEN")
		const date = new Date(data.date).toISOString()

		const res = await fetch(
			`${URL}/reportes/excel/cuadre?project=${data.project_id}&date=${date}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)

		if (!res.ok) {
			const error = (await res.json()) as ErrorResponseType
			throw new Error(error.msg)
		}

		const blob = await res.blob()

		return new Response(blob, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": 'attachment; filename="reporte.xlsx"',
			},
		})
	})

export const histroricExcelExport = createServerFn({ method: "GET" })
	.validator((data: ReportTypes) => data)
	.handler(async ({ data }) => {
		const token = getCookie("BCA-TOKEN")
		const date = new Date(data.date).toISOString()

		const res = await fetch(
			`${URL}/reportes/excel/historico?proyecto=${data.project_id}&nivel=${data.level}&fecha=${date}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)

		if (!res.ok) {
			const error = (await res.json()) as ErrorResponseType
			throw new Error(error.msg)
		}

		const blob = await res.blob()

		return new Response(blob, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": 'attachment; filename="reporte.xlsx"',
			},
		})
	})

export const spentExcelExport = createServerFn({ method: "GET" })
	.inputValidator((data: ReportTypes) => data)
	.handler(async ({ data }) => {
		const token = getCookie("BCA-TOKEN")
		const date = new Date(data.date).toISOString()

		const res = await fetch(
			`${URL}/reportes/excel/gastado?proyecto=${data.project_id}&nivel=${data.level}&fecha=${date}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)

		const blob = await res.blob()

		return new Response(blob, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": 'attachment; filename="reporte.xlsx"',
			},
		})
	})
