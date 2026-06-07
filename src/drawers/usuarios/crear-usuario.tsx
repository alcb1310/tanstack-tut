import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleXIcon, PlusIcon, SaveIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { useAppForm } from "@/hooks/app-form"
import { CreateUser } from "@/queries/user"
import { type UserCreate, userCreateSchema } from "@/types/user"

export function UserCreateDrawer() {
	const queryClient = useQueryClient()

	const [open, setOpen] = useState(false)

	const useCreateUserMutation = useMutation({
		mutationFn: CreateUser,
		onSuccess: () => {
			setOpen(false)
			toast.success("Usuario creado exitosamente")
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

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		} satisfies UserCreate as UserCreate,
		validators: {
			onSubmit: userCreateSchema,
		},
		onSubmit: data => {
			useCreateUserMutation.mutate({ data: data.value })
		},
	})

	useEffect(() => {
		if (open) {
			form.reset()
		}
	}, [open, form.reset])

	return (
		<Drawer direction='right' open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant='default' className='my-3'>
					<PlusIcon />
					Crear Usuario
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<form
					onSubmit={e => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<DrawerHeader>
						<DrawerTitle>Crear Usuario</DrawerTitle>
						<DrawerDescription>Crear un nuevo usuario</DrawerDescription>
					</DrawerHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='name'>
								{field => (
									<field.TextField
										name='name'
										label='Nombre'
										placeholder='Juan Perez'
									/>
								)}
							</form.AppField>

							<form.AppField name='email'>
								{field => (
									<field.TextField
										name='email'
										label='Email'
										placeholder='usuario@correo.com'
									/>
								)}
							</form.AppField>

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
					<DrawerFooter>
						<div className='flex justify-start items-center space-x-2'>
							<Button type='submit'>
								<SaveIcon size={10} />
								Guardar
							</Button>
							<DrawerClose asChild>
								<Button type='button' variant='secondary'>
									<CircleXIcon size={10} />
									Cancelar
								</Button>
							</DrawerClose>
						</div>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	)
}
