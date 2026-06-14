import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleXIcon, EditIcon, SaveIcon, UploadIcon } from "lucide-react"
import { useState } from "react"
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
import { AddFile, UpdateProject } from "@/queries/proyectos"
import { type ProjectType, projectSchema } from "@/types/proyectos"
import { UploadButton } from "@/lib/uploadthing"
import { cn } from "@/lib/utils"

type EditProjectDrawerProps = {
	project: ProjectType
}

export function ProjectEditDrawer({ project }: EditProjectDrawerProps) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)

	const editProjectMutation = useMutation({
		mutationFn: UpdateProject,
		onSuccess: () => {
			setOpen(false)
			toast.success("Proyecto actualizado exitosamente")
			queryClient.invalidateQueries({ queryKey: ["proyectos"] })
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

	const addFile = useMutation({
		mutationFn: AddFile,
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
				gross_area: Number.parseFloat(data.value.gross_area?.toString() || "0"),
				net_area: Number.parseFloat(data.value.net_area?.toString() || "0"),
			}

			editProjectMutation.mutate({ data: realData })
		},
	})

	return (
		<Drawer direction='right' open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant='ghost'>
					<EditIcon size={10} className='text-yellow-600' />
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
						<DrawerTitle>Crear Proyecto</DrawerTitle>
						<DrawerDescription>Crear un nuevo proyecto</DrawerDescription>
					</DrawerHeader>
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
				<UploadButton
					endpoint={"fileUploader"}
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
								"ut-allowed-content:hidden ut-button:rounded-none ut-button:w-fit ut-button:px-2.5 ut-button:text-xs ut-button:font-medium ut-button:bg-primary ut-button:text-primary-foreground ut-button:[a]:hover:bg-primary/80 ut-uploading:opacity-50 ut-uploading:cursor-not-allowed",
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
			</DrawerContent>
		</Drawer>
	)
}
