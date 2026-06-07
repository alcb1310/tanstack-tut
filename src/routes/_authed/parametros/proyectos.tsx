import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, EditIcon, PlusIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { GetAllProjects } from "@/queries/proyectos"
import type { ProjectType } from "@/types/proyectos"

export const Route = createFileRoute("/_authed/parametros/proyectos")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData({
			queryKey: ["projectos"],
			queryFn: () => GetAllProjects({ data: {} }),
		})
	},
})

function RouteComponent() {
	const queryClient = useQueryClient()
	const [query, setQuery] = useState<string>("")

	const [debounced, setDebounced] = useState<string>(query)
	const { data, isLoading, isFetching } = useSuspenseQuery({
		queryKey: ["proyectos"],
		queryFn: () => GetAllProjects({ data: { query } }),
	})

	useEffect(() => {
		const id = window.setTimeout(() => setDebounced(query), 500)
		return () => window.clearTimeout(id)
	}, [query])

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ["proyectos"] })
	}, [debounced, queryClient])

	const columns: ColumnDef<ProjectType>[] = [
		{
			header: "Nombre",
			accessorKey: "name",
		},
		{
			accessorKey: "net_area",
			header: "Area Neta (m2)",
			cell: ({ row }) => {
				const area = row.original.net_area ? row.original.net_area : 0
				return (
					<span className='block w-full text-right'>
						{area.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
					</span>
				)
			},
		},
		{
			accessorKey: "gross_area",
			header: "Area Bruta (m2)",
			cell: ({ row }) => {
				const area = row.original.gross_area ? row.original.gross_area : 0
				return (
					<span className='block w-full text-right'>
						{area.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
					</span>
				)
			},
		},
		{
			accessorKey: "is_active",
			header: "Activo",
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.is_active ? <CheckIcon size={16} /> : <X size={16} />}
					</span>
				)
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const _project = row.original

				return <EditIcon size={16} className='text-yellow-600' />
				// return <EditProjectDrawer project={project} />
			},
		},
	]

	return (
		<div>
			<PageTitle title='Proyectos' />
			{(isLoading || isFetching) && <Spinner />}

			<div className='flex my-3 justify-start gap-4'>
				<Button>
					<PlusIcon size={16} />
					Crear Partida
				</Button>

				<Input
					placeholder='Buscar'
					value={query}
					onChange={e => setQuery(e.target.value)}
				/>
			</div>

			<DataTable data={data} columns={columns} />
		</div>
	)
}
