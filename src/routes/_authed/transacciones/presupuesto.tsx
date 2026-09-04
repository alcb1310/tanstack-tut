import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import PageTitle from '@/components/layout/page-title'
import { DataTable } from '@/components/table/data-table'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Spinner } from '@/components/ui/spinner'
import { PresupuestoCreateDrawer } from '@/drawers/presupuesto/crear-presupuesto'
import { PresupuestoUpdateDrawer } from '@/drawers/presupuesto/editar-presupuesto'
import { GetAllBudgets } from '@/queries/presupuesto'
import { GetAllProjects } from '@/queries/proyectos'
import type { BudgetResponseType } from '@/types/presupuesto'

export const Route = createFileRoute('/_authed/transacciones/presupuesto')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		Promise.all([
			queryClient.query({
				queryKey: ['proyectos'],
				queryFn: () => GetAllProjects({ data: { active: true } }),
			}),
			queryClient.query({
				queryKey: ['presupuesto'],
				queryFn: () => GetAllBudgets({ data: {} }),
			}),
		])
	},
})

function RouteComponent() {
	const queryClient = useQueryClient()
	const [search, setSearch] = useState<string>('')
	const [project, setProject] = useState<string>('')
	const [debounced, setDebounced] = useState<string>(search)

	const queries = useSuspenseQueries({
		queries: [
			{
				queryKey: ['presupuesto'],
				queryFn: () =>
					GetAllBudgets({ data: { query: search, project: project } }),
			},
			{
				queryKey: ['proyectos'],
				queryFn: () => GetAllProjects({ data: { active: true } }),
			},
		],
	})

	const { data, isLoading, isFetching } = queries[0]
	const { data: projects } = queries[1]

	const columns: ColumnDef<BudgetResponseType>[] = [
		{
			accessorKey: 'project.name',
			header: 'Proyecto',
			size: 500,
		},
		{
			accessorKey: 'budget_item.name',
			header: 'Partida',
			size: 800,
		},
		{
			accessorKey: 'spent_total',
			size: 200,
			header: 'Gastado',
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.spent_total.toLocaleString('es-EC', {
							minimumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
		{
			accessorKey: 'remaining_quantity',
			size: 200,
			header: 'Cantidad',
			cell: ({ row }) => {
				const q = row.original.remaining_quantity

				return (
					<span className='block w-full text-right'>
						{q.Valid
							? q.Float64.toLocaleString('es-EC', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})
							: ''}
					</span>
				)
			},
		},
		{
			accessorKey: 'remaining_cost',
			size: 200,
			header: 'Costo',
			cell: ({ row }) => {
				const q = row.original.remaining_cost

				return (
					<span className='block w-full text-right'>
						{q.Valid
							? q.Float64.toLocaleString('es-EC', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})
							: ''}
					</span>
				)
			},
		},
		{
			accessorKey: 'remaining_total',
			size: 200,
			header: 'Total',
			cell: ({ row }) => {
				const q = row.original.remaining_total

				return (
					<span className='block w-full text-right'>
						{q.toLocaleString('es-EC', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
		{
			accessorKey: 'updated_budget',
			size: 200,
			header: 'Presupuesto',
			cell: ({ row }) => {
				const q = row.original.updated_budget

				return (
					<span className='block w-full text-right'>
						{q.toLocaleString('es-EC', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
		{
			id: 'Actions',
			size: 20,
			cell: ({ row }) => {
				const budget = row.original
				return (
					<>
						{!budget.budget_item.accumulate && (
							<PresupuestoUpdateDrawer budget={budget} />
						)}
					</>
				)
			},
		},
	]

	useEffect(() => {
		const id = window.setTimeout(() => setDebounced(search), 500)
		return () => window.clearTimeout(id)
	}, [search])

	useEffect(() => {
		setDebounced(project)
	}, [project])

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ['presupuesto'] })
	}, [debounced, queryClient])

	const proyValues =
		projects?.map(item => ({
			label: item.name,
			value: item.id as string,
		})) || []
	proyValues.unshift({
		label: 'Proyecto',
		value: '',
	})

	return (
		<div>
			<PageTitle title='Presupuesto' />
			<div className='flex my-3 justify-start gap-4'>
				<PresupuestoCreateDrawer />

				<NativeSelect
					name={'proyectos'}
					size='default'
					value={project}
					onChange={e => {
						setProject(e.target.value)
					}}
				>
					{proyValues.map(option => (
						<NativeSelectOption key={option.value} value={option.value}>
							{option.label}
						</NativeSelectOption>
					))}
				</NativeSelect>

				<Input
					placeholder='Buscar'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>
			{(isLoading || isFetching) && <Spinner />}
			<DataTable columns={columns} data={data} />
		</div>
	)
}
