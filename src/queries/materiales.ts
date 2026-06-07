import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { MaterialType } from "@/types/materiales"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllMaterials = createServerFn({ method: "GET" }).handler(
	async (): Promise<MaterialType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/materiales`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error("Network response was not ok")
		}

		return await response.json()
	},
)
