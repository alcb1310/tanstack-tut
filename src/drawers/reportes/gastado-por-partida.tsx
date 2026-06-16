import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { ViewIcon } from "lucide-react"
import { ReportDataTable } from "@/components/table/report-data-table"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Spinner } from "@/components/ui/spinner"
import { GetSpentDetails } from "@/queries/reportes"
import type { Spent, SpentDetailsType } from "@/types/reportes"

type SpentDetailsDrawerProps = {
	report: Spent
	project_id: string
	date: string
}

export function SpentDetailsDrawer({
	report,
	project_id,
	date,
}: SpentDetailsDrawerProps) {
	const { data, isLoading } = useQuery({
		queryKey: ["spent-detail", project_id, report.budget_item.id, date],
		queryFn: () =>
			GetSpentDetails({
				data: {
					project_id,
					budget_item_id: report.budget_item.id as string,
					date,
				},
			}),
	})

	const columns: ColumnDef<SpentDetailsType>[] = [
		{
			accessorKey: "invoice_date",
			header: "Fecha",
			cell: ({ row }) => {
				const dt = new Date(row.original.invoice_date)
				return dt.toLocaleDateString("es-EC", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				})
			},
		},
		{
			accessorKey: "supplier_name",
			header: "Proveedor",
		},
		{
			accessorKey: "invoice_number",
			header: "Factura",
		},
		{
			accessorKey: "total",
			header: "Total",
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.total.toLocaleString("es-EC", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				)
			},
		},
	]

	return (
		<Drawer direction='bottom'>
			<DrawerTrigger>
				<ViewIcon size={16} />
			</DrawerTrigger>
			<DrawerContent>
				<div className='no-scrollbar overflow-y-auto my-2 px-4'>
					<DrawerHeader>
						<DrawerTitle>Reporte de Gastos</DrawerTitle>
						<DrawerDescription>
							<div className='flex gap-4'>
								<p className='font-bold'>Codigo:</p>
								<p>{report.budget_item.code}</p>
							</div>
							<div className='flex gap-2'>
								<p className='font-bold'>Partida:</p>
								<p>{report.budget_item.name}</p>
							</div>
						</DrawerDescription>
					</DrawerHeader>
					<div>
						{isLoading && <Spinner />}
						<ReportDataTable columns={columns} data={data ? data : []} />
					</div>
					<DrawerFooter>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
