import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { SupplierType } from "@/types/proveedor"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllSuppliers = createServerFn({ method: "GET" })
	.inputValidator((data: { search?: string }) => data)
	.handler(async ({ data: { search } }): Promise<SupplierType[]> => {
		const token = getCookie(cookieName)

		const params = new URLSearchParams()
		if (search) params.append("query", search)

		const response = await fetch(`${URL}/parametros/proveedores?${params}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error("Network response was not ok")
		}

		return response.json()
	})
