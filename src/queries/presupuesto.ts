import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { ErrorResponseType } from "@/types/error"
import type { BudgetEditType, BudgetResponseType } from "@/types/presupuesto"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllBudgets = createServerFn({ method: "GET" })
	.validator((data: { query?: string; project?: string }) => data)
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

			if (!response.ok) {
				const res = (await response.json()) as ErrorResponseType
				throw new Error(res.msg)
			}

			return response.json()
		},
	)

export const CreateBudget = createServerFn({ method: "POST" })
	.inputValidator((data: BudgetEditType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/transacciones/presupuestos`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error)
		}

		return
	})

export const UpdateBudget = createServerFn({ method: "POST" })
	.inputValidator((data: BudgetEditType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(
			`${URL}/transacciones/presupuestos/${data.project_id}/${data.budget_item_id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			},
		)

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error)
		}

		return
	})
