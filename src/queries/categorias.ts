import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type { CategoryType } from '@/types/categorias'

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = 'BCA-TOKEN'

export const GetAllCategories = createServerFn({ method: 'GET' }).handler(
	async (): Promise<CategoryType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/categorias`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		return await response.json()
	},
)

export const CreateCategory = createServerFn({ method: 'POST' })
	.validator((data: CategoryType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/categorias`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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

export const UpdateCategory = createServerFn({ method: 'POST' })
	.validator((data: CategoryType) => data)
	.handler(async ({ data }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/parametros/categorias/${data.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
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
