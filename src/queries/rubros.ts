import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { RubrosType } from "@/types/rubros"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllRubros = createServerFn({ method: "GET" }).handler(
	async (): Promise<RubrosType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/rubros`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const data = await response.json()

			throw new Error(data.error)
		}

		return await response.json()
	},
)
