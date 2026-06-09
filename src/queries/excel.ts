import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { ActualReportTypes } from "@/types/reportes"

const URL = import.meta.env.VITE_BACKEND_SERVER

export const actualExcelExport = createServerFn({ method: "GET" })
	.inputValidator((data: ActualReportTypes) => data)
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
			const error = await res.json()
			throw new Error(error.error)
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
