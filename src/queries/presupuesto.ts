import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { BudgetResponseType } from "@/types/presupuesto"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllBudgets = createServerFn({ method: "GET" })
	.inputValidator((data: { query?: string; project?: string }) => data)
	.handler(
		async ({ data: { query, project } }): Promise<BudgetResponseType[]> => {
			const token = getCookie(cookieName)

			const params = new URLSearchParams()
			if (query) params.append("query", query)
			if (project) params.append("project", project)

			const response = await fetch(
				`${URL}/transacciones/presupuestos?${params}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			return response.json()
		},
	)
