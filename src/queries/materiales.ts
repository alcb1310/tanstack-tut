import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type { ErrorResponseType } from '@/types/error'
import type { MaterialCreateType, MaterialType } from '@/types/materiales'

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = 'BCA-TOKEN'

export const GetAllMaterials = createServerFn({ method: 'GET' }).handler(
	async (): Promise<MaterialType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/materiales`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const res = (await response.json()) as ErrorResponseType
			throw new Error(res.msg)
		}

		return await response.json()
	},
)

export const CreateMaterial = createServerFn({ method: 'POST' })
	.validator((data: MaterialCreateType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/materiales`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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

export const UpdateMaterial = createServerFn({ method: 'POST' })
	.validator((data: MaterialType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/materiales/${data.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
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
