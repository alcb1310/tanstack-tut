import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { InvoiceResponseType } from "@/types/facturas"

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
			console.log(await response.json())
			throw new Error("Network response was not ok")
		}
		console.log(response)

		return response.json()
	},
)
