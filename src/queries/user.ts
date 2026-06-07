import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { UserResponse } from "@/types/user"

const URL = import.meta.env.VITE_BACKEND_SERVER

export const MeQuery = createServerFn({ method: "GET" }).handler(async () => {
	const token = getCookie("BCA-TOKEN")
	if (!token) {
		throw new Error("Usuario no autenticado")
	}

	const response = await fetch(`${URL}/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	if (!response.ok) {
		const err = await response.json()
		throw new Error(err.error)
	}

	return (await response.json()) as UserResponse
})
