import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { UserResponse } from "@/types/user"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const MeQuery = createServerFn({ method: "GET" }).handler(
	async (): Promise<UserResponse> => {
		const token = getCookie(cookieName)
		if (!token) {
			throw new Error("Usuario no autenticado")
		}

		const response = await fetch(`${URL}/users/me`, {
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
