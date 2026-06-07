import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { DeleteIcon } from "lucide-react"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Spinner } from "@/components/ui/spinner"
import { UserCreateDrawer } from "@/drawers/usuarios/crear-usuario"
import { UserEditDrawer } from "@/drawers/usuarios/editar-usuario"
import { GetAllUsers } from "@/queries/user"
import type { UserResponse } from "@/types/user"

export const Route = createFileRoute("/_authed/usuarios/admin")({
	component: RouteComponent,
	beforeLoad: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData({
			queryKey: ["usuarios"],
			queryFn: () => GetAllUsers(),
		})
	},
})

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery({
		queryKey: ["usuarios"],
		queryFn: () => GetAllUsers(),
	})

	const columns: ColumnDef<UserResponse>[] = [
		{
			accessorKey: "name",
			header: "Nombre",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const usuario = row.original

				if (!usuario) return null

				return (
					<div className='flex px-3 justify-end items-center gap-2'>
						<UserEditDrawer user={usuario} />
						<DeleteIcon size={16} className='text-red-600' />
					</div>
				)
			},
		},
	]

	return (
		<div>
			<PageTitle title='Administrar Usuarios' />

			{isLoading && <Spinner />}
			<UserCreateDrawer />

			<div className='max-w-2/3'>
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	)
}
