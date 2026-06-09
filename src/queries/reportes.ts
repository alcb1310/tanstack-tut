import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { BudgetResponseType } from "@/types/presupuesto"
import type { LevelType } from "@/types/reportes"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllLevels = createServerFn({ method: "GET" }).handler(
	async (): Promise<LevelType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/reportes/levels`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
		return await response.json()
	},
)
