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
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useAppForm } from '@/hooks/app-form'
import { UpdatePartida } from '@/queries/partidas'
import {
	type BudgetItemResponse,
	budgetItemUpdateSchema,
} from '@/types/partidas'

type PartidaEditDrawerProps = {
	partida: BudgetItemResponse
}

export function PartidaEditDrawer({ partida }: PartidaEditDrawerProps) {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)

	const useUpdatePartidaMutation = useMutation({
		mutationFn: UpdatePartida,
		onSuccess: () => {
			setOpen(false)
			toast.success('Partida actualizada exitosamente')
			queryClient.invalidateQueries({ queryKey: ['partidas'] })
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
			id: partida.id,
			code: partida.code,
			name: partida.name,
		},
		validators: {
			onSubmit: budgetItemUpdateSchema,
		},
		onSubmit: data => {
			useUpdatePartidaMutation.mutate({ data: data.value })
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
					<EditIcon className='inline-block text-yellow-600' />
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
						<DrawerTitle>Crear partida</DrawerTitle>
						<DrawerDescription>Crea una nueva partida</DrawerDescription>
					</DrawerHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='code'>
								{field => (
									<field.TextField
										name='code'
										label='Código'
										placeholder='codigo'
									/>
								)}
							</form.AppField>

							<form.AppField name='name'>
								{field => (
									<field.TextField
										name='name'
										label='Nombre'
										placeholder='Nombre de la Partida'
									/>
								)}
							</form.AppField>

							<Field>
								<FieldLabel htmlFor='parent'>Partida padre</FieldLabel>
								<Input name='parent' value={partida.parent?.name} disabled />
							</Field>

							<Field className='mt-2'>
								<div className='flex gap-2'>
									<Switch
										name='accumulate'
										checked={partida.accumulate}
										disabled
									/>
									<FieldLabel htmlFor='accumulate'> Acumula </FieldLabel>
								</div>
							</Field>
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
