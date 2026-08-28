import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'

const URL = import.meta.env.VITE_BACKEND_SERVER

type LoginResponse = {
	token: string
	user: {
		id: string
		name: string
		email: string
		role_id: string
		company_id: string
	}
}

export const LoginMutation = createServerFn({ method: 'POST' })
	.validator((data: { email: string; password: string }) => data)
	.handler(async ({ data: { email, password } }) => {
		const response = await fetch(`${URL}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})

		if (!response.ok) {
			const err = await response.json()
			throw new Error(err.error)
		}

		const auth = (await response.json()) as LoginResponse
		setCookie('BCA-TOKEN', auth.token, { httpOnly: true })

		return auth
	})
