import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type { BudgetResponseType } from '@/types/presupuesto'
import type {
	BalanceResponseType,
	LevelType,
	SpentDetailsType,
	SpentResponseType,
} from '@/types/reportes'

const URL = import.meta.env.VITE_BACKEND_SERVER
const cookieName = 'BCA-TOKEN'

export const GetAllLevels = createServerFn({ method: 'GET' }).handler(
	async (): Promise<LevelType[]> => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/reportes/levels`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		return await response.json()
	},
)
export const GetAllBugetsByProjectAndLevel = createServerFn({ method: 'GET' })
	.validator((data: { project_id: string; level: string }) => data)
	.handler(
		async ({ data: { project_id, level } }): Promise<BudgetResponseType[]> => {
			const token = getCookie(cookieName)

			const params = new URLSearchParams()
			params.append('project_id', project_id)
			params.append('level', level)

			const response = await fetch(`${URL}/reportes/actual?${params}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			return response.json()
		},
	)

export const GetAllHistoric = createServerFn({ method: 'GET' })
	.validator(
		(data: { project_id: string; level: string; date: string }) => data,
	)
	.handler(
		async ({
			data: { project_id, level, date },
		}): Promise<BudgetResponseType[]> => {
			const token = getCookie(cookieName)

			const params = new URLSearchParams()
			params.append('project_id', project_id)
			params.append('level', level)
			params.append('date', new Date(date).toISOString())

			const response = await fetch(`${URL}/reportes/historico?${params}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error('Network error')
			}

			if (response.status === 204) return [] as BudgetResponseType[]

			return response.json()
		},
	)

export const GetBalanceReport = createServerFn({ method: 'GET' })
	.validator((data: { project_id: string; date: string }) => data)
	.handler(
		async ({ data: { project_id, date } }): Promise<BalanceResponseType> => {
			const token = getCookie(cookieName)

			const dateVal = new Date(date).toISOString()

			const params = new URLSearchParams()
			params.append('project_id', project_id)
			params.append('date', dateVal)

			const response = await fetch(`${URL}/reportes/cuadre?${params}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error('Network error')
			}

			return response.json()
		},
	)

export const SetBalancedInvoice = createServerFn({ method: 'POST' })
	.validator((data: { invoice_id: string }) => data)
	.handler(async ({ data: { invoice_id } }) => {
		const token = getCookie(cookieName)

		const response = await fetch(`${URL}/reportes/cuadre/${invoice_id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const err = await response.json()
			throw new Error(err.error)
		}

		return
	})

export const GetSpentReport = createServerFn({ method: 'GET' })
	.validator(
		(data: { project_id: string; level: string; date: string }) => data,
	)
	.handler(
		async ({
			data: { project_id, level, date },
		}): Promise<SpentResponseType> => {
			const token = getCookie(cookieName)

			const params = new URLSearchParams()
			params.append('project_id', project_id)
			params.append('level', level)
			params.append('date', date)

			const response = await fetch(`${URL}/reportes/gastado?${params}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			return response.json()
		},
	)

export const GetSpentDetails = createServerFn({ method: 'GET' })
	.validator(
		(data: { project_id: string; budget_item_id: string; date: string }) =>
			data,
	)
	.handler(
		async ({
			data: { project_id, budget_item_id, date },
		}): Promise<SpentDetailsType[]> => {
			const token = getCookie(cookieName)

			const response = await fetch(
				`${URL}/reportes/gastado/${project_id}/${budget_item_id}/${date}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)

			return response.json()
		},
	)
