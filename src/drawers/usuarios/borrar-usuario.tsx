import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "lucide-react"
import { Dialog } from "radix-ui"
import { useEffect } from "react"
import { toast } from "sonner"
import z from "zod"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { useAppForm } from "@/hooks/app-form"
import { DeleteUser } from "@/queries/user"
import type { UserResponse } from "@/types/user"

type UserDeleteDialogProps = {
	user: UserResponse
}

export function UserDeleteDialog({ user }: UserDeleteDialogProps) {
	const queryClient = useQueryClient()

	const useDeleteUserMutation = useMutation({
		mutationFn: DeleteUser,
		onSuccess: () => {
			toast.success("Usuario eliminado exitosamente")
			queryClient.invalidateQueries({ queryKey: ["usuarios"] })
		},
		onError: error => {
			toast.error(error.message, {
				position: "top-center",
				style: {
					color: "red",
				},
			})
		},
	})

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<DeleteIcon size={16} className='text-red-600' />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className='bg-white'>
						<DeleteIcon size={16} className='bg-white text-red-600' />
					</AlertDialogMedia>
					<AlertDialogTitle className='text-red-600'>
						Eliminar Usuario
					</AlertDialogTitle>
					<AlertDialogDescription>
						¿Estás seguro de eliminar el usuario{" "}
						<span className='font-bold'>{user.name}</span>?. Esta acción no se
						puede deshacer
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							useDeleteUserMutation.mutate({ data: { id: user.id } })
						}}
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function UserChangePasswordDialog() {
	const useUpdatePasswordMutation = useMutation({
		mutationFn: UpdatePassword,
		onSuccess: () => {
			toast.success("Contraseña actualizada exitosamente")
		},
		onError: error => {
			toast.error(error.message, {
				position: "top-center",
				style: {
					color: "red",
				},
			})
		},
	})

	const form = useAppForm({
		defaultValues: {
			password: "",
		},
		validators: {
			onSubmit: z.object({
				password: z
					.string()
					.min(6, "La contraseña debe tener al menos 6 caracteres"),
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
