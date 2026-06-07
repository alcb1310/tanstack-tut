import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { ProjectType } from "@/types/proyectos"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllProjects = createServerFn({ method: "GET" })
	.inputValidator((data: { query?: string; active?: boolean }) => data)
	.handler(async ({ data: { query, active } }): Promise<ProjectType[]> => {
		const token = getCookie(cookieName)

		const params = new URLSearchParams()
		if (query) params.append("query", query)
		if (active) params.append("active", active.toString())

		const response = await fetch(`${URL}/parametros/proyectos?${params}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
		return response.json()
	})
