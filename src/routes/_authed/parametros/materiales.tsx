import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { EditIcon, PlusIcon } from "lucide-react"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { GetAllMaterials } from "@/queries/materiales"
import type { MaterialType } from "@/types/materiales"

export const Route = createFileRoute("/_authed/parametros/materiales")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData({
			queryKey: ["materiales"],
			queryFn: () => GetAllMaterials(),
		})
	},
})

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery({
		queryKey: ["materiales"],
		queryFn: () => GetAllMaterials(),
	})

	const columns: ColumnDef<MaterialType>[] = [
		{
			accessorKey: "code",
			header: "Código",
		},
		{
			accessorKey: "name",
			header: "Nombre",
		},
		{
			accessorKey: "unit",
			header: "Unidad",
		},
		{
			accessorKey: "category.name",
			header: "Categoria",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const material = row.original
				if (!material.id) return null

				return <EditIcon size={10} className='text-yellow-600' />
			},
		},
	]

	return (
		<div>
			<PageTitle title='Materiales' />
			{isLoading && <Spinner />}

			<Button variant='default' className='my-3'>
				<PlusIcon size={16} />
				Crear Categoria
			</Button>
			<DataTable columns={columns} data={data} />
		</div>
	)
}
