import { useMutation, useSuspenseQueries } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { CircleXIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"
import { FormBackground } from "@/components/layout/form-background"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { RubroMaterialCreateDrawer } from "@/drawers/rubro-material/crear-rubro-material"
import { RubroMaterialEditDrawer } from "@/drawers/rubro-material/editar-rubro-material"
import { useAppForm } from "@/hooks/app-form"
import { GetAllRubrosMaterials } from "@/queries/rubro-material"
import { GetOneRubro, UpdateRubro } from "@/queries/rubros"
import type {
	RubroMaterialResponseTye,
	RubroMaterialType,
} from "@/types/rubro-material"
import { type RubrosType, rubrosSchema } from "@/types/rubros"

export const Route = createFileRoute("/_authed/parametros/rubros/$rubroId")({
	component: RouteComponent,
	loader: ({ context: { queryClient }, params }) => {
		Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["rubros", params.rubroId],
				queryFn: () => GetOneRubro({ data: { id: params.rubroId } }),
			}),

			queryClient.prefetchQuery({
				queryKey: ["rubros-material"],
				queryFn: () =>
					GetAllRubrosMaterials({ data: { rubroId: params.rubroId } }),
			}),
		])
	},
})

function RouteComponent() {
	const { rubroId } = Route.useParams()
	const result = useSuspenseQueries({
		queries: [
			{
				queryKey: ["rubros-material"],
				queryFn: () => GetAllRubrosMaterials({ data: { rubroId } }),
			},
			{
				queryKey: ["rubros", rubroId],
				queryFn: () => GetOneRubro({ data: { id: rubroId } }),
			},
		],
	})

	const { data, isLoading } = result[0]
	const { data: rubro, isLoading: rubroLoading } = result[1]

	const columns: ColumnDef<RubroMaterialResponseTye>[] = [
		{
			accessorKey: "material.code",
			header: "Codigo",
		},
		{
			accessorKey: "material.name",
			header: "Codigo",
		},
		{
			accessorKey: "material.unit",
			header: "Unidad",
		},
		{
			accessorKey: "quantity",
			header: "Cantidad",
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.quantity.toLocaleString("es-EC", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
		{
			id: "actions",
			header: "Acciones",
			cell: ({ row }) => {
				const material: RubroMaterialType = {
					item_id: row.original.item.id as string,
					material_id: row.original.material.id as string,
					quantity: row.original.quantity,
				}
				return (
					<div className='flex px-3 justify-end items-center gap-2'>
						<RubroMaterialEditDrawer
							material_name={row.original.material.name}
							material={material}
						/>
					</div>
				)
				// <ItemMaterialsDeleteDialog
				// material_name={row.original.material.name}
				// material={material}
				// />
			},
		},
	]

	const useUpdateRubroMutation = useMutation({
		mutationFn: UpdateRubro,
		onSuccess: () => {
			toast.success("Rubro actualizado exitosamente")
		},
		onError: error => {
			toast.error(error.message, {
				position: "top-center",
				style: {
					color: "red",
				},
			})
		},
	})

	const form = useAppForm({
		defaultValues: rubro as RubrosType,
		validators: {
			onSubmit: rubrosSchema,
		},
		onSubmit: data => {
			useUpdateRubroMutation.mutate({ data: data.value })
		},
	})

	return (
		<div>
			<PageTitle title='Editar Rubro' />

			<FormBackground>
				<form
					onSubmit={e => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<FieldGroup className='my-2 px-4'>
						<FieldSet>
							<form.AppField name='code'>
								{field => (
									<field.TextField
										name='code'
										label='Codigo'
										placeholder='Codigo'
									/>
								)}
							</form.AppField>

							<form.AppField name='name'>
								{field => (
									<field.TextField
										name='name'
										label='Nombre'
										placeholder='Nombre'
									/>
								)}
							</form.AppField>

							<form.AppField name='unit'>
								{field => (
									<field.TextField
										name='unit'
										label='Unidad'
										placeholder='Unidad'
									/>
								)}
							</form.AppField>
						</FieldSet>
					</FieldGroup>

					<div className='flex justify-around items-center '>
						<Button type='submit'>
							<SaveIcon size={10} />
							Guardar
						</Button>

						<Link
							to='/parametros/rubros'
							className={buttonVariants({ variant: "outline" })}
						>
							<CircleXIcon size={10} />
							Cancelar
						</Link>
					</div>
				</form>
			</FormBackground>
			{(isLoading || rubroLoading) && <Spinner />}
			<RubroMaterialCreateDrawer item={rubro?.id as string} />

			<DataTable data={data} columns={columns} />
		</div>
	)
}
