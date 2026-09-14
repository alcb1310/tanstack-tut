import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import PageTitle from '@/components/layout/page-title'
import { DataTable } from '@/components/table/data-table'
import { Spinner } from '@/components/ui/spinner'
import { MaterialCreateDrawer } from '@/drawers/materiales/crear-material'
import { MaterialEditDrawer } from '@/drawers/materiales/editar-material'
import { GetAllMaterials } from '@/queries/materiales'
import type { MaterialType } from '@/types/materiales'

export const Route = createFileRoute('/_authed/parametros/materiales')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.query({
			queryKey: ['materiales'],
			queryFn: () => GetAllMaterials(),
		})
	},
})

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery({
		queryKey: ['materiales'],
		queryFn: () => GetAllMaterials(),
	})

	const columns: ColumnDef<MaterialType>[] = [
		{
			accessorKey: 'code',
			header: 'Código',
			size: 100,
		},
		{
			accessorKey: 'name',
			header: 'Nombre',
			size: 500,
		},
		{
			accessorKey: 'unit',
			header: 'Unidad',
			size: 100,
		},
		{
			accessorKey: 'category.name',
			header: 'Categoria',
			size: 500,
		},
		{
			id: 'actions',
			size: 50,
			cell: ({ row }) => {
				const material = row.original
				if (!material.id) return null

				return (
					<div className='flex justify-end'>
						<MaterialEditDrawer
							material={{
								code: material.code,
								name: material.name,
								unit: material.unit,
								id: material.id,
								category: material.category,
							}}
						/>
					</div>
				)
			},
		},
	]

	return (
		<div>
			<PageTitle title='Materiales' />
			{isLoading && <Spinner />}

			<MaterialCreateDrawer />
			<DataTable columns={columns} data={data} />
		</div>
	)
}
