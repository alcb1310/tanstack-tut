import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type { InvoiceDetailsResponseType } from "@/types/detalle"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllInvoiceDetails = createServerFn({ method: "GET" })
	.inputValidator((data: { id: string }) => data)
	.handler(async ({ data: { id } }): Promise<InvoiceDetailsResponseType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(
			`${URL}/transacciones/facturas/${id}/detalle`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		)

		if (!response.ok) {
			throw new Error("Network response was not ok")
		}

		return await response.json()
	})
