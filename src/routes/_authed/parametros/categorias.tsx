import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Spinner } from "@/components/ui/spinner"
import { CategoryCreateDrawer } from "@/drawers/categorias/crear-categoria"
import { CategoryEditDrawer } from "@/drawers/categorias/editar-categoria"
import { GetAllCategories } from "@/queries/categorias"
import type { CategoryType } from "@/types/categorias"

export const Route = createFileRoute("/_authed/parametros/categorias")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData({
			queryKey: ["categorias"],
			queryFn: () => GetAllCategories(),
		})
	},
})

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery({
		queryKey: ["categorias"],
		queryFn: () => GetAllCategories(),
	})

	const columns: ColumnDef<CategoryType>[] = [
		{
			header: "Nombre",
			accessorKey: "name",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const category = row.original

				return <CategoryEditDrawer category={category} />
			},
		},
	]

	return (
		<div>
			<PageTitle title='Categorias' />

			{isLoading && <Spinner />}

			<CategoryCreateDrawer />

			<div className='max-w-1/3'>
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	)
}
