import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleXIcon, EditIcon, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { useAppForm } from '@/hooks/app-form'
import { UpdateMaterial } from '@/queries/materiales'
import { type MaterialType, materialSchema } from '@/types/materiales'

type MaterialEditDrawerProps = {
	material: MaterialType
}

export function MaterialEditDrawer({ material }: MaterialEditDrawerProps) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)

	const useUpdateMaterialMutation = useMutation({
		mutationFn: UpdateMaterial,
		onSuccess: () => {
			setOpen(false)
			toast.success('Material creado exitosamente')
			queryClient.invalidateQueries({ queryKey: ['materiales'] })
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
		defaultValues: material,
		validators: {
			onSubmit: materialSchema,
		},
		onSubmit: data => {
			useUpdateMaterialMutation.mutate({ data: data.value })
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
						<DrawerTitle>Editar Material</DrawerTitle>
						<DrawerDescription>
							Edita el material seleccionado
						</DrawerDescription>
					</DrawerHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='code'>
								{field => (
									<field.TextField
										name='code'
										label='Código'
										placeholder='cod'
									/>
								)}
							</form.AppField>

							<form.AppField name='name'>
								{field => (
									<field.TextField
										name='name'
										label='Nombre'
										placeholder='Nombre del Material'
									/>
								)}
							</form.AppField>

							<form.AppField name='unit'>
								{field => (
									<field.TextField
										name='unit'
										label='Unidad'
										placeholder='unidad'
									/>
								)}
							</form.AppField>

							<form.AppField name='category.name'>
								{field => (
									<field.TextField
										name='category.name'
										label='Categoría'
										placeholder='unidad'
										disabled
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
