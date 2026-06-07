import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { CategoryType } from "@/types/categorias"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/categorias`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error("Network response was not ok")
		}

		const data = await response.json()

		return data as CategoryType[]
	},
)
