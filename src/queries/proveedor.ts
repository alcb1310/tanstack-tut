import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { SupplierCreateType, SupplierType } from "@/types/proveedor"

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

export const CreateSupplier = createServerFn({ method: "POST" })
	.inputValidator((data: SupplierCreateType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/proveedores`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const data = await response.json()

			throw new Error(data.error)
		}

		return
	})

export const UpdateSupplier = createServerFn({ method: "POST" })
	.inputValidator((data: { data: SupplierCreateType; id: string }) => data)
	.handler(async ({ data: { data, id } }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/proveedores/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const data = await response.json()

			throw new Error(data.error)
		}
		return
	})
