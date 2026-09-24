import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { ViewIcon } from 'lucide-react'
import { ReportDataTable } from '@/components/table/report-data-table'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Spinner } from '@/components/ui/spinner'
import { GetActualDetails } from '@/queries/reportes'
import type { BudgetResponseType } from '@/types/presupuesto'
import type { SpentDetailsType } from '@/types/reportes'

type ActualDetailsDrawerProps = {
	budget: BudgetResponseType
}

export function ActualDetailsDrawer({ budget }: ActualDetailsDrawerProps) {
	const { data, isLoading } = useQuery({
		queryKey: ['actual-detail', budget.project.id, budget.budget_item.id],
		queryFn: () =>
			GetActualDetails({
				data: {
					project_id: budget.project.id as string,
					budget_item_code: budget.budget_item.id as string,
				},
			}),
	})

	const columns: ColumnDef<SpentDetailsType>[] = [
		{
			accessorKey: 'invoice_date',
			header: 'Fecha',
			size: 100,
			cell: ({ row }) => {
				const dt = new Date(row.original.invoice_date)
				return dt.toLocaleDateString('es-EC', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
				})
			},
		},
		{
			accessorKey: 'supplier_name',
			size: 800,
			header: 'Proveedor',
		},
		{
			accessorKey: 'invoice_number',
			size: 150,
			header: 'Factura',
		},
		{
			accessorKey: 'total',
			header: 'Total',
			size: 100,
			cell: ({ row }) => {
				return (
					<span className='block w-full text-right'>
						{row.original.total.toLocaleString('es-EC', {
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
						<DrawerTitle>Detalles</DrawerTitle>
						<DrawerDescription>
							<div className='flex gap-4'>
								<p className='font-bold'>Proyecto:</p>
								<p>{budget.project.name}</p>
							</div>
							<div className='flex gap-4'>
								<p className='font-bold'>Codigo:</p>
								<p>{budget.budget_item.code}</p>
							</div>
							<div className='flex gap-2'>
								<p className='font-bold'>Partida:</p>
								<p>{budget.budget_item.name}</p>
							</div>
							<div className='flex gap-2'>
								<p className='font-bold'>Gastado:</p>
								<p>
									{data?.total.toLocaleString('es-EC', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
						</DrawerDescription>
					</DrawerHeader>
					<div>
						{isLoading && <Spinner />}
						<ReportDataTable
							columns={columns}
							data={data?.details ? data.details : []}
						/>
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
