import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"
import z from "zod"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { useAppForm } from "@/hooks/app-form"
import { LoginMutation } from "@/queries/auth"

export const Route = createFileRoute("/login")({
	component: RouteComponent,
})

const inputSchema = z.object({
	email: z
		.string({ message: "Ingrese un correo" })
		.min(1, { message: "Ingrese un correo" }),
	password: z
		.string({ message: "Ingrese una contraseña" })
		.min(3, { message: "La contraseña debe tener al menos 3 caracteres" }),
})

function RouteComponent() {
	const loginMutation = useMutation({
		mutationFn: LoginMutation,
		onSuccess: () => {
			toast.success("login exitoso")
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
		} satisfies z.infer<typeof inputSchema>,
		validators: {
			onSubmit: inputSchema,
		},
		onSubmit: values => {
			const data = values.value
			loginMutation.mutate({ data })
		},
	})

	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Ingrese sus credenciales</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={e => {
							e.preventDefault()
							e.stopPropagation()
							form.handleSubmit()
						}}
					>
						<FieldGroup>
							<FieldSet>
								<form.AppField name='email'>
									{field => (
										<field.TextField
											label='Email'
											name={field.name}
											type='email'
										/>
									)}
								</form.AppField>
								<form.AppField name='password'>
									{field => (
										<field.TextField
											label='Contraseña'
											name={field.name}
											type='password'
										/>
									)}
								</form.AppField>
							</FieldSet>
						</FieldGroup>

						<Field className='mt-6'>
							<form.AppForm>
								<form.FormButton label='Ingresar' />
							</form.AppForm>
						</Field>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
