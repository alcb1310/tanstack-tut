import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
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
import { GetAllPartidas } from '@/queries/partidas'
import { UpdateBudget } from '@/queries/presupuesto'
import { GetAllProjects } from '@/queries/proyectos'
import {
	type BudgetEditType,
	type BudgetResponseType,
	budgetEditSchema,
} from '@/types/presupuesto'

type PresupuestoUpdateDrawerProps = {
	budget: BudgetResponseType
}

export function PresupuestoUpdateDrawer({
	budget,
}: PresupuestoUpdateDrawerProps) {
	const [open, setOpen] = useState(false)
	const queryClient = useQueryClient()

	const useUpdateBudgetMutation = useMutation({
		mutationFn: UpdateBudget,
		onSuccess: () => {
			toast.success('Presupuesto actualizado')
			queryClient.invalidateQueries({ queryKey: ['presupuesto'] })
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
			project_id: budget.project.id,
			budget_item_id: budget.budget_item.id,
			quantity: budget.remaining_quantity.Float64,
			cost: budget.remaining_cost.Float64,
			total: budget.remaining_total,
		} as BudgetEditType,
		validators: {
			onSubmit: budgetEditSchema,
			onChange: data => {
				const c = Number.parseFloat(data.value.cost.toString())
				const q = Number.parseFloat(data.value.quantity.toString())

				if (Number.isNaN(c) || Number.isNaN(q)) {
					data.value.total = 0
					return
				}

				data.value.total = q * c
			},
		},
		onSubmit: data => {
			const newData = {
				project_id: data.value.project_id,
				budget_item_id: data.value.budget_item_id,
				quantity: Number.parseFloat(data.value.quantity.toString()),
				cost: Number.parseFloat(data.value.cost.toString()),
				total: Number.parseFloat(data.value.total.toString()),
			}

			useUpdateBudgetMutation.mutate({ data: newData })
		},
	})

	const result = useQueries({
		queries: [
			{
				queryKey: ['partidas'],
				queryFn: () => GetAllPartidas({ data: { accum: false } }),
			},
			{
				queryKey: ['proyectos', 'active'],
				queryFn: () => GetAllProjects({ data: { active: true } }),
			},
		],
	})

	const { data: budgetItems } = result[0]
	const { data: projects } = result[1]

	useEffect(() => {
		if (open) {
			form.reset()
		}
	}, [open, form.reset])

	const proyValues =
		projects?.map(item => ({
			label: item.name,
			value: item.id as string,
		})) || []

	const partValues =
		budgetItems?.map(item => ({
			label: item.name,
			value: item.id as string,
		})) || []

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
						<DrawerTitle>Crear Presupuesto</DrawerTitle>
						<DrawerDescription>
							Crea una nueva partida presupuestaria
						</DrawerDescription>
					</DrawerHeader>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='project_id'>
								{field => (
									<field.SelectField
										label='Proyecto'
										name='project_id'
										options={proyValues}
										disabled
									/>
								)}
							</form.AppField>

							<form.AppField name='budget_item_id'>
								{field => (
									<field.SelectField
										label='Partida'
										name='budget_item_id'
										options={partValues}
										disabled
									/>
								)}
							</form.AppField>

							<form.AppField name='quantity'>
								{field => (
									<field.TextField
										name='quantity'
										label='Cantidad'
										placeholder='cant'
									/>
								)}
							</form.AppField>

							<form.AppField name='cost'>
								{field => (
									<field.TextField
										name='cost'
										label='Costo'
										placeholder='costo'
									/>
								)}
							</form.AppField>

							<form.AppField name='total'>
								{field => (
									<field.TextField
										name='total'
										label='Total'
										placeholder='total'
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
