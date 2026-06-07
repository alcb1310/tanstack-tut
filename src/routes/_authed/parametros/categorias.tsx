import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { EditIcon, PlusIcon } from "lucide-react"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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

				return <EditIcon size={10} className='text-yellow-600' />
			},
		},
	]

	return (
		<div>
			<PageTitle title='Categorias' />

			{isLoading && <Spinner />}

			<Button variant='default' className='my-3'>
				<PlusIcon />
				Crear Categoria
			</Button>

			<div className='max-w-1/3'>
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	)
}
