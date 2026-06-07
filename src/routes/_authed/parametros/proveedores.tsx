import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { EditIcon, PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { GetAllSuppliers } from "@/queries/proveedor"
import type { SupplierType } from "@/types/proveedor"

export const Route = createFileRoute("/_authed/parametros/proveedores")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData({
			queryKey: ["proveedores"],
			queryFn: () => GetAllSuppliers({ data: {} }),
		})
	},
})

function RouteComponent() {
	const queryClient = useQueryClient()
	const [search, setSearch] = useState<string>("")
	const [debounced, setDebounced] = useState<string>(search)

	const { data, isLoading, isFetching } = useSuspenseQuery({
		queryKey: ["proveedores"],
		queryFn: () => GetAllSuppliers({ data: { search } }),
	})

	const columns: ColumnDef<SupplierType>[] = [
		{
			accessorKey: "supplier_id",
			header: "RUC",
		},
		{
			accessorKey: "name",
			header: "Nombre",
		},
		{
			accessorKey: "contact_name.String",
			header: "Nombre Contacto",
		},
		{
			accessorKey: "contact_email.String",
			header: "Email Contacto",
		},
		{
			accessorKey: "contact_phone.String",
			header: "Telefono Contacto",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const _supplier = row.original

				return <EditIcon className='inline-block text-yellow-600' />
				// return <SupplierEditDrawer supplier={supplier} />
			},
		},
	]

	useEffect(() => {
		const id = window.setTimeout(() => setDebounced(search), 500)
		return () => window.clearTimeout(id)
	}, [search])

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ["proveedores"] })
	}, [debounced, queryClient])

	return (
		<div>
			<PageTitle title='Proveedores' />

			<div className='flex my-3 justify-start gap-4'>
				<Button>
					<PlusIcon size={16} />
					Crear Proveedor
				</Button>

				<Input
					placeholder='Buscar'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>
			{(isLoading || isFetching) && <Spinner />}
			<DataTable data={data} columns={columns} />
		</div>
	)
}
