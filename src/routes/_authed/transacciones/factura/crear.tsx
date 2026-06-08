import {
	useMutation,
	useQueryClient,
	useSuspenseQueries,
} from "@tanstack/react-query"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { CircleXIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"
import { FormBackground } from "@/components/layout/form-background"
import PageTitle from "@/components/layout/page-title"
import { Button, buttonVariants } from "@/components/ui/button"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { useAppForm } from "@/hooks/app-form"
import { CreateInvoice } from "@/queries/factura"
import { GetAllSuppliers } from "@/queries/proveedor"
import { GetAllProjects } from "@/queries/proyectos"
import { type InvoiceCreateType, invoiceCreateSchema } from "@/types/facturas"

export const Route = createFileRoute("/_authed/transacciones/factura/crear")({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		Promise.all([
			queryClient.ensureQueryData({
				queryKey: ["proyectos", "active"],
				queryFn: () => GetAllProjects({ data: { active: true } }),
			}),
			queryClient.ensureQueryData({
				queryKey: ["proveedores"],
				queryFn: () => GetAllSuppliers({ data: {} }),
			}),
		])
	},
})

function RouteComponent() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const useCreateInvoiceMutation = useMutation({
		mutationFn: CreateInvoice,
		onSuccess: data => {
			toast.success("Factura creada exitosamente")
			queryClient.invalidateQueries({ queryKey: ["facturas"] })
			navigate({
				to: "/transacciones/factura/$facturaId",
				params: { facturaId: data.id },
			})
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
		],
	})

	const { data: proyectos } = result[0]
	const { data: proveedores } = result[1]

	const form = useAppForm({
		defaultValues: {
			project_id: "",
			supplier_id: "",
			invoice_date: "",
			invoice_number: "",
			invoice_total: 0,
		} satisfies InvoiceCreateType,
		validators: {
			onSubmit: invoiceCreateSchema,
		},
		onSubmit: data => {
			useCreateInvoiceMutation.mutate({ data: data.value })
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
									/>
								)}
							</form.AppField>

							<form.AppField name='supplier_id'>
								{field => (
									<field.SelectField
										label='Proveedor'
										name='supplier_id'
										options={provValues}
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
		</div>
	)
}
