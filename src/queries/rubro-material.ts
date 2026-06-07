import {
	RubroMaterialResponseTye,
	RubroMaterialType,
} from "@/types/rubro-material"
import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = "BCA-TOKEN"

export const GetAllRubrosMaterials = createServerFn({ method: "GET" })
	.inputValidator((data: { rubroId: string }) => data)
	.handler(
		async ({ data: { rubroId } }): Promise<RubroMaterialResponseTye[]> => {
			const token = getCookie(cookieName)

			const response = await fetch(
				`${URL}/parametros/rubros/${rubroId}/materiales`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error)
			}

			return response.json()
		},
	)
