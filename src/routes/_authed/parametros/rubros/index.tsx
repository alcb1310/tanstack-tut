import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { EditIcon, PlusIcon } from "lucide-react"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { GetAllRubros } from "@/queries/rubros"
import type { RubrosType } from "@/types/rubros"

export const Route = createFileRoute("/_authed/parametros/rubros/")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.prefetchQuery({
			queryKey: ["rubros"],
			queryFn: () => GetAllRubros(),
		})
	},
})

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery({
		queryKey: ["rubros"],
		queryFn: () => GetAllRubros(),
	})

	const columns: ColumnDef<RubrosType>[] = [
		{
			accessorKey: "code",
			header: "Codigo",
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
			id: "actions",
			cell: ({ row }) => {
				const rubro = row.original

				return (
					<Link
						to='/parametros/rubros/$rubroId'
						params={{ rubroId: rubro.id as string }}
					>
						<EditIcon size={15} className='text-yellow-600' />
					</Link>
				)
			},
		},
	]

	return (
		<div>
			<PageTitle title='Rubros' />

			<Link
				to='/parametros/rubros/crear'
				className={`my-3 ${buttonVariants({ variant: "default" })}`}
			>
				<PlusIcon size={16} />
				Crear Rubro
			</Link>
			{isLoading && <Spinner />}

			<DataTable columns={columns} data={data} />
		</div>
	)
}
