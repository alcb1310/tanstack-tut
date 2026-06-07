import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { BudgetItemResponse } from "@/types/partidas"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllPartidas = createServerFn({ method: "GET" })
	.inputValidator((data: { query?: string; accum?: boolean }) => {
		return data
	})
	.handler(
		async ({ data: { query, accum } }): Promise<BudgetItemResponse[]> => {
			const token = getCookie(cookieName)

			const params = new URLSearchParams()
			if (query) params.set("query", query)
			if (accum !== undefined) {
				params.set("accum", accum.toString())
			}

			const response = await fetch(`${URL}/parametros/partidas?${params}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) throw new Error("Network response was not ok")

			return response.json()
		},
	)
