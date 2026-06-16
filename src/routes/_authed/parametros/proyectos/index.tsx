import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
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

export const Route = createFileRoute("/_authed/parametros/proyectos/")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.ensureQueryData({
			queryKey: ["projectos"],
			queryFn: () => GetAllProjects({ data: {} }),
		})
	},
})

function RouteComponent() {
	const navigate = useNavigate()
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
			size: 800,
		},
		{
			accessorKey: "net_area",
			header: "Area Neta (m2)",
			size: 100,
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
			size: 100,
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
			size: 20,
			cell: ({ row }) => {
				return (
					<span className=' w-full flex items-center'>
						{row.original.is_active ? (
							<CheckIcon className='w-full text-center' size={16} />
						) : (
							<X className='w-full text-center' size={16} />
						)}
					</span>
				)
			},
		},
		{
			id: "actions",
			size: 10,
			cell: ({ row }) => {
				const project = row.original

				return (
					<Button
						variant='ghost'
						onClick={() =>
							navigate({
								to: `/parametros/proyectos/${project.id}`,
								params: { proyectoId: project.id },
							})
						}
					>
						<EditIcon size={16} className='cursor-pointer text-yellow-600' />
					</Button>
				)
			},
		},
	]

	return (
		<div>
			<PageTitle title='Proyectos' />
			{(isLoading || isFetching) && <Spinner />}

			<div className='flex my-3 items-center justify-start gap-4'>
				<Button
					variant='default'
					className='flex my-3 justify-start gap-4'
					onClick={() =>
						navigate({
							to: "/parametros/proyectos/crear",
						})
					}
				>
					<PlusIcon size={16} />
					Crear Proyecto
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
