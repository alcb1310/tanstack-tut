import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CircleXIcon, SaveIcon, UploadIcon } from 'lucide-react'
import { toast } from 'sonner'
import { FilesCollapsible } from '@/collapsibles/files'
import { FormBackground } from '@/components/layout/form-background'
import PageTitle from '@/components/layout/page-title'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { useAppForm } from '@/hooks/app-form'
import { UploadButton } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import {
	AddFile,
	GetFiles,
	GetOneProject,
	UpdateProject,
} from '@/queries/proyectos'
import { type ProjectType, projectSchema } from '@/types/proyectos'

export const Route = createFileRoute(
	'/_authed/parametros/proyectos/$proyectoId',
)({
	component: RouteComponent,
	loader: async ({
		context: { queryClient },
		params: { proyectoId: facturaId },
	}) => {
		Promise.all([
			await queryClient.query({
				queryKey: ['proyectos', facturaId],
				queryFn: () => GetOneProject({ data: { id: facturaId } }),
			}),
			await queryClient.query({
				queryKey: ['files', facturaId],
				queryFn: () => GetFiles({ data: { id: facturaId } }),
			}),
		])
	},
})

function RouteComponent() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { proyectoId } = Route.useParams()
	const { data: project } = useSuspenseQuery({
		queryKey: ['proyectos', proyectoId],
		queryFn: () => GetOneProject({ data: { id: proyectoId } }),
	})

	const { data: files } = useSuspenseQuery({
		queryKey: ['files', proyectoId],
		queryFn: () => GetFiles({ data: { id: proyectoId } }),
	})

	const show = files?.map(item => (
		<FilesCollapsible key={item.key} data={item} />
	))

	const addFile = useMutation({
		mutationFn: AddFile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files'] })
			toast.success('Archivo subido exitosamente')
		},
	})

	const editProjectMutation = useMutation({
		mutationFn: UpdateProject,
		onSuccess: () => {
			toast.success('Proyecto actualizado exitosamente')
			queryClient.invalidateQueries({ queryKey: ['proyectos'] })
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
		defaultValues: project,
		validators: {
			onSubmit: projectSchema,
		},
		onSubmit: data => {
			const realData: ProjectType = {
				id: project.id,
				name: data.value.name,
				is_active: data.value.is_active,
				gross_area: Number.parseFloat(data.value.gross_area?.toString() || '0'),
				net_area: Number.parseFloat(data.value.net_area?.toString() || '0'),
			}

			editProjectMutation.mutate({ data: realData })
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
			<div className='md:w-1/2 md:mx-auto my-3 p-3 flex items-start flex-col gap-2'>
				<UploadButton
					endpoint={'fileUploader'}
					onClientUploadComplete={res => {
						addFile.mutate({
							data: {
								project_id: project.id as string,
								name: res[0].name,
								url: res[0].ufsUrl,
							},
						})
					}}
					config={{
						cn: classes =>
							cn(
								classes,
								'ut-allowed-content:hidden ut-button:rounded-none ut-button:w-fit ut-button:px-2.5 ut-button:text-xs ut-button:font-medium ut-button:bg-chart-4 ut-button:text-primary-foreground ut-button:[a]:hover:bg-chart-4/80 ut-uploading:opacity-50 ut-uploading:cursor-not-allowed ut-button:text-xs',
							),
					}}
					content={{
						button: ({ isUploading, uploadProgress }) => {
							if (isUploading) {
								return (
									<>
										<UploadIcon size={16} className='me-2' />
										{uploadProgress}
									</>
								)
							}

							return (
								<>
									<UploadIcon size={16} className='me-2' />
									Subir Archivo
								</>
							)
						},
					}}
				/>

				{show}
			</div>
		</div>
	)
}
