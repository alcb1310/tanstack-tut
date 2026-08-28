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
import { UpdateCategory } from '@/queries/categorias'
import { type CategoryType, categorySchema } from '@/types/categorias'

type EditCategoryDrawerProps = {
	category: CategoryType
}

export function CategoryEditDrawer({ category }: EditCategoryDrawerProps) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)

	const useUpdateCategoryMutation = useMutation({
		mutationFn: UpdateCategory,
		onSuccess: () => {
			setOpen(false)
			toast.success('Categoria actualizada exitosamente')
			queryClient.invalidateQueries({ queryKey: ['categorias'] })
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
			name: category.name,
			id: category.id,
		} as CategoryType,
		validators: {
			onSubmit: categorySchema,
		},
		onSubmit: data => {
			useUpdateCategoryMutation.mutate({ data: data.value })
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
						<DrawerTitle>Editar Categoria</DrawerTitle>
						<DrawerDescription>Edita una categoria</DrawerDescription>
					</DrawerHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='name'>
								{field => (
									<field.TextField
										name='name'
										label='Nombre'
										placeholder='Categoria'
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
