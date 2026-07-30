import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { AnalisisType } from "@/types/analisis"
import type { ErrorResponseType } from "@/types/error"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAnalisis = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }): Promise<AnalisisType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/analisis/${data.id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const res = (await response.json()) as ErrorResponseType
			throw new Error(res.msg)
		}

		return await response.json()
	})
