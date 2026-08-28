import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { useAppForm } from '@/hooks/app-form'
import { UpdatePassword } from '@/queries/user'

export function UserChangePasswordDialog() {
	const useUpdatePasswordMutation = useMutation({
		mutationFn: UpdatePassword,
		onSuccess: () => {
			toast.success('Contraseña actualizada exitosamente')
		},
		onError: error => {
			toast.error(error.message, {
				position: 'top-center',
				style: {
					color: 'red',
				},
			})
		},
	})

	const form = useAppForm({
		defaultValues: {
			password: '',
		},
		validators: {
			onSubmit: z.object({
				password: z
					.string()
					.min(6, 'La contraseña debe tener al menos 6 caracteres'),
			}),
		},
		onSubmit: data => {
			useUpdatePasswordMutation.mutate({ data: data.value })
		},
	})

	useEffect(() => {
		form.reset()
	}, [form.reset])

	return (
		<Dialog>
			<DialogTrigger className='my-2 px-2 text-xs hover:bg-accent'>
				Cambiar Contraseña
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={e => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<DialogHeader>
						<DialogTitle>Cambiar Contraseña</DialogTitle>
						<DialogDescription>
							Cambia la contraseña del usuario
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='password'>
								{field => (
									<field.TextField
										label='Contraseña'
										type='password'
										name='password'
										placeholder='*******'
									/>
								)}
							</form.AppField>
						</FieldSet>
					</FieldGroup>

					<DialogFooter>
						<DialogClose asChild>
							<Button type='button' variant='outline'>
								Cancelar
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button type='submit'>Guardar</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
