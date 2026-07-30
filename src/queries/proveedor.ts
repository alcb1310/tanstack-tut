import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { ErrorResponseType } from "@/types/error"
import type { SupplierCreateType, SupplierType } from "@/types/proveedor"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllSuppliers = createServerFn({ method: "GET" })
	.validator((data: { search?: string }) => data)
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
			const res = (await response.json()) as ErrorResponseType
			throw new Error(res.msg)
		}

		return response.json()
	})

export const CreateSupplier = createServerFn({ method: "POST" })
	.validator((data: SupplierCreateType) => data)
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
			const data = (await response.json()) as ErrorResponseType
			throw new Error(data.msg)
		}

		return
	})

export const UpdateSupplier = createServerFn({ method: "POST" })
	.validator((data: { data: SupplierCreateType; id: string }) => data)
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
			const data = (await response.json()) as ErrorResponseType
			throw new Error(data.msg)
		}
		return
	})
