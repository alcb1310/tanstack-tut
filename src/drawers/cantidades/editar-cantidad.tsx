import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleXIcon, EditIcon, SaveIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAppForm } from '@/hooks/app-form'
import { UpdateCantidad } from '@/queries/cantidad'
import {
	type QuantityEditType,
	type QuantityResponseType,
	quantityEditSchema,
} from '@/types/cantidad'

type CantidadesEditDrawerProps = {
	cantidad: QuantityResponseType
}

export function CantidadesEditDrawer({ cantidad }: CantidadesEditDrawerProps) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)

	const useUpdateCantidadesMutation = useMutation({
		mutationFn: UpdateCantidad,
		onSuccess: () => {
			toast.success('Cantidad actualizada exitosamente')
			setOpen(false)
			queryClient.invalidateQueries({ queryKey: ['cantidades'] })
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
			id: cantidad.id,
			project_id: cantidad.project.id as string,
			rubro_id: cantidad.rubro.id as string,
			quantity: cantidad.quantity,
		} as QuantityEditType,
		validators: {
			onSubmit: quantityEditSchema,
		},
		onSubmit: data => {
			const newData = {
				id: data.value.id,
				project_id: data.value.project_id,
				rubro_id: data.value.rubro_id,
				quantity: Number.parseFloat(data.value.quantity.toString()),
			}

			useUpdateCantidadesMutation.mutate({ data: newData })
		},
	})

	useEffect(() => {
		if (open) {
			form.reset()
		}
	}, [open, form.reset])

	return (
		<Drawer direction='right' open={open} onOpenChange={setOpen}>
			<DrawerTrigger>
				<EditIcon size={16} className='cursor-pointer text-yellow-600' />
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
						<DrawerTitle>Editar Cantidad</DrawerTitle>
					</DrawerHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<FieldLabel>Proyecto</FieldLabel>
							<Input value={cantidad.project.name} disabled />

							<FieldLabel>Rubro</FieldLabel>
							<Input value={cantidad.rubro.name} disabled />

							<form.AppField name='quantity'>
								{field => (
									<field.TextField
										name='quantity'
										label='Cantidad'
										placeholder='cantidad'
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
