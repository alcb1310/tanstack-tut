import {
	useMutation,
	useQueryClient,
	useSuspenseQueries,
} from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { CircleXIcon, DeleteIcon, PlusIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"
import { FormBackground } from "@/components/layout/form-background"
import PageTitle from "@/components/layout/page-title"
import { DataTable } from "@/components/table/data-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useAppForm } from "@/hooks/app-form"
import { GetAllInvoiceDetails } from "@/queries/detalle"
import { GetOneInvoice, UpdateInvoice } from "@/queries/factura"
import { GetAllSuppliers } from "@/queries/proveedor"
import { GetAllProjects } from "@/queries/proyectos"
import type { InvoiceDetailsResponseType } from "@/types/detalle"
import { invoiceCreateSchema } from "@/types/facturas"

export const Route = createFileRoute(
	"/_authed/transacciones/factura/$facturaId",
)({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params }) => {
		await Promise.all([
			queryClient.prefetchQuery({
				queryKey: ["proyectos", "active"],
				queryFn: () => GetAllProjects({ data: { active: true } }),
			}),
			queryClient.prefetchQuery({
				queryKey: ["proveedores"],
				queryFn: () => GetAllSuppliers({ data: {} }),
			}),
			queryClient.prefetchQuery({
				queryKey: ["facturas", params.facturaId],
				queryFn: () => GetOneInvoice({ data: { id: params.facturaId } }),
			}),
			queryClient.prefetchQuery({
				queryKey: ["facturas-detalle"],
				queryFn: () => GetAllInvoiceDetails({ data: { id: params.facturaId } }),
			}),
		])
	},
})

function RouteComponent() {
	const queryClient = useQueryClient()
	const { facturaId } = Route.useParams()

	const useUpdateInvoiceMutation = useMutation({
		mutationFn: UpdateInvoice,
		onSuccess: () => {
			toast.success("Factura actualizada exitosamente")
			queryClient.invalidateQueries({ queryKey: ["facturas"] })
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

	const result = useSuspenseQueries({
		queries: [
			{
				queryKey: ["proyectos", "active"],
				queryFn: () => GetAllProjects({ data: { active: true } }),
			},
			{
				queryKey: ["proveedores"],
				queryFn: () => GetAllSuppliers({ data: {} }),
			},
			{
				queryKey: ["facturas-detalle"],
				queryFn: () => GetAllInvoiceDetails({ data: { id: facturaId } }),
			},
			{
				queryKey: ["facturas", facturaId],
				queryFn: () => GetOneInvoice({ data: { id: facturaId } }),
			},
		],
	})

	const { data: proyectos } = result[0]
	const { data: proveedores } = result[1]
	const { data, isLoading } = result[2]
	const { data: factura, isLoading: isLoadingFactura } = result[3]

	const columns: ColumnDef<InvoiceDetailsResponseType>[] = [
		{
			accessorKey: "budget_item_code",
			header: "Codigo",
		},
		{
			accessorKey: "budget_item_name",
			header: "Nombre",
		},
		{
			accessorKey: "quantity",
			header: "Cantidad",
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.quantity.toLocaleString("es-EC", {
							minimumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
		{
			accessorKey: "cost",
			header: "Costo",
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.cost.toLocaleString("es-EC", {
							minimumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
		{
			accessorKey: "total",
			header: "Total",
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.total.toLocaleString("es-EC", {
							minimumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const _detalle = row.original
				return <DeleteIcon size={16} className='text-red-500' />
				// return <DeleteInvoiceDetailsDialog invoice_detail={row.original} />
			},
		},
	]

	const form = useAppForm({
		defaultValues: factura,
		validators: {
			onSubmit: invoiceCreateSchema,
		},
		onSubmit: data => {
			useUpdateInvoiceMutation.mutate({ data: data.value })
		},
	})

	const proyValues =
		proyectos?.map(item => ({
			label: item.name,
			value: item.id as string,
		})) || []
	proyValues.unshift({
		label: "Seleccione un proyecto",
		value: "",
	})

	const provValues =
		proveedores?.map(item => ({
			label: item.name,
			value: item.id as string,
		})) || []
	provValues.unshift({
		label: "Seleccione un proveedor",
		value: "",
	})

	return (
		<div>
			<PageTitle title='Crear Factura' />

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
							<form.AppField name='project_id'>
								{field => (
									<field.SelectField
										label='Proyecto'
										name='project_id'
										options={proyValues}
										disabled
									/>
								)}
							</form.AppField>

							<form.AppField name='supplier_id'>
								{field => (
									<field.SelectField
										label='Proveedor'
										name='supplier_id'
										options={provValues}
										disabled
									/>
								)}
							</form.AppField>

							<form.AppField name='invoice_number'>
								{field => (
									<field.TextField
										name='invoice_number'
										label='N° Factura'
										placeholder='000-000-000000'
									/>
								)}
							</form.AppField>

							<div className='flex justify-around gap-24'>
								<form.AppField name='invoice_date'>
									{field => (
										<field.TextField
											name='invoice_date'
											label='Fecha'
											type='date'
											value={
												new Date(form.state.values.invoice_date)
													.toISOString()
													.split("T")[0]
											}
										/>
									)}
								</form.AppField>

								<form.AppField name='invoice_total'>
									{field => (
										<field.TextField
											className='text-right'
											name='invoice_total'
											label='Total'
											disabled
											type='number'
											step={0.01}
										/>
									)}
								</form.AppField>
							</div>
						</FieldSet>
					</FieldGroup>

					<div className='flex justify-around items-center '>
						<Button type='submit'>
							<SaveIcon size={10} />
							Guardar
						</Button>

						<Link
							to='/transacciones/factura'
							className={buttonVariants({ variant: "secondary" })}
						>
							<CircleXIcon size={10} />
							Cancelar
						</Link>
					</div>
				</form>
			</FormBackground>

			{(isLoading || isLoadingFactura) && <Spinner />}

			<Button variant='detail' className='my-3'>
				<PlusIcon size={16} />
				Agregar Detalle
			</Button>

			<DataTable columns={columns} data={data} />
		</div>
	)
}
