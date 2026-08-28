import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CircleXIcon, SaveIcon } from 'lucide-react'
import { toast } from 'sonner'
import { FormBackground } from '@/components/layout/form-background'
import PageTitle from '@/components/layout/page-title'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { useAppForm } from '@/hooks/app-form'
import { CreateProject } from '@/queries/proyectos'
import { type ProjectType, projectSchema } from '@/types/proyectos'

export const Route = createFileRoute('/_authed/parametros/proyectos/crear')({
	component: RouteComponent,
})

function RouteComponent() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const createProjectMutation = useMutation({
		mutationFn: CreateProject,
		onSuccess: data => {
			toast.success('Proyecto creado exitosamente')
			queryClient.invalidateQueries({ queryKey: ['proyectos'] })
			navigate({
				to: '/parametros/proyectos/$proyectoId',
				params: { proyectoId: data.id as string },
			})
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
			name: '',
			is_active: false,
		} as ProjectType,
		validators: {
			onSubmit: projectSchema,
		},
		onSubmit: data => {
			const realData: ProjectType = {
				name: data.value.name,
				is_active: data.value.is_active,
				gross_area: Number.parseFloat(data.value.gross_area?.toString() || '0'),
				net_area: Number.parseFloat(data.value.net_area?.toString() || '0'),
			}

			createProjectMutation.mutate({ data: realData })
		},
	})
	return (
		<div>
			<PageTitle title='Editar Proyecto' />

			<FormBackground>
				<form
					onSubmit={e => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='name'>
								{field => (
									<field.TextField
										name='name'
										label='Nombre'
										placeholder='Nombre del proyecto'
									/>
								)}
							</form.AppField>

							<form.AppField name='gross_area'>
								{field => (
									<field.TextField
										name='gross_area'
										label='Area Bruta'
										placeholder='Area Bruta en m2'
									/>
								)}
							</form.AppField>

							<form.AppField name='net_area'>
								{field => (
									<field.TextField
										name='net_area'
										label='Area Neta'
										placeholder='Area Neta en m2'
									/>
								)}
							</form.AppField>

							<form.AppField name='is_active'>
								{field => <field.SwitchField name='is_active' label='Activo' />}
							</form.AppField>
						</FieldSet>
					</FieldGroup>
					<div className='flex justify-start items-center space-x-2'>
						<Button type='submit'>
							<SaveIcon size={10} />
							Guardar
						</Button>
						<Button
							type='button'
							variant='secondary'
							onClick={() => navigate({ to: '/parametros/proyectos' })}
						>
							<CircleXIcon size={10} />
							Cancelar
						</Button>
					</div>
				</form>
			</FormBackground>
		</div>
	)
}
