import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import type {
	RubroMaterialResponseTye,
	RubroMaterialType,
} from "@/types/rubro-material"

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

export const CreateRubroMaterial = createServerFn({ method: "POST" })
	.inputValidator((data: RubroMaterialType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(
			`${URL}/parametros/rubros/${data.item_id}/materiales`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			},
		)

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error)
		}

		return
	})

export const UpdateRubroMaterial = createServerFn({ method: "POST" })
	.inputValidator((data: RubroMaterialType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(
			`${URL}/parametros/rubros/${data.item_id}/materiales/${data.material_id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			},
		)

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error)
		}

		return
	})
