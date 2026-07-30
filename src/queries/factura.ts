import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { ErrorResponseType } from "@/types/error"
import type { InvoiceCreateType, InvoiceResponseType } from "@/types/facturas"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllInvoices = createServerFn({ method: "GET" }).handler(
	async (): Promise<InvoiceResponseType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/transacciones/facturas`, {
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

		return response.json()
	},
)

export const GetOneInvoice = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data: { id } }): Promise<InvoiceCreateType> => {
		const token = getCookie(cookieName)
		const response = await fetch(`${URL}/transacciones/facturas/${id}`, {
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

export const CreateInvoice = createServerFn({ method: "POST" })
	.inputValidator((data: InvoiceCreateType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)
		const response = await fetch(`${URL}/transacciones/facturas`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error)
		}

		return response.json() as Promise<InvoiceResponseType>
	})

export const UpdateInvoice = createServerFn({ method: "POST" })
	.inputValidator((data: InvoiceCreateType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const invoice = { ...data, invoice_date: new Date(data.invoice_date) }

		const response = await fetch(`${URL}/transacciones/facturas/${data.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(invoice),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error)
		}

		return
	})

export const DeleteInvoice = createServerFn({ method: "POST" })
	.inputValidator((data: { id: string }) => data)
	.handler(async ({ data: { id } }) => {
		const token = getCookie(cookieName)
		const response = await fetch(`${URL}/transacciones/facturas/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error)
		}

		return
	})
