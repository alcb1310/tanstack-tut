import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import PageTitle from '@/components/layout/page-title'
import { DataTable } from '@/components/table/data-table'
import { Spinner } from '@/components/ui/spinner'
import { CantiadDeleteDialog } from '@/drawers/cantidades/borrar-cantidad'
import { CantidadesCreateDrawer } from '@/drawers/cantidades/crear-cantidad'
import { CantidadesEditDrawer } from '@/drawers/cantidades/editar-cantidad'
import { GetAllCantidades } from '@/queries/cantidad'
import type { QuantityResponseType } from '@/types/cantidad'

export const Route = createFileRoute('/_authed/analisis/cantidades')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.query({
			queryKey: ['cantidades'],
			queryFn: () => GetAllCantidades(),
		})
	},
})

function RouteComponent() {
	const { data, isLoading, isFetching } = useSuspenseQuery({
		queryKey: ['cantidades'],
		queryFn: () => GetAllCantidades(),
	})

	const columns: ColumnDef<QuantityResponseType>[] = [
		{
			accessorKey: 'project.name',
			header: 'Proyecto',
		},
		{
			accessorKey: 'rubro.name',
			header: 'Rubro',
		},
		{
			accessorKey: 'rubro.unit',
			header: 'Unidad',
		},
		{
			accessorKey: 'quantity',
			header: 'Cantidad',
			cell: ({ row }) => {
				const q = row.original.quantity
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
			id: 'actions',
			cell: ({ row }) => {
				const data = row.original
				return (
					<div className='flex gap-2'>
						<CantidadesEditDrawer cantidad={data} />
						<CantiadDeleteDialog cantidad={data} />
					</div>
				)
			},
		},
	]

	return (
		<div>
			<PageTitle title='Cantidades' />

			<CantidadesCreateDrawer />

			{(isLoading || isFetching) && <Spinner />}
			<DataTable columns={columns} data={data} />
		</div>
	)
}
