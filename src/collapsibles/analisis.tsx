import type { ColumnDef } from '@tanstack/react-table'
import { ChevronRightIcon } from 'lucide-react'
import { ReportDataTable } from '@/components/table/report-data-table'
import { Button } from '@/components/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { AnalisisType, AnalisysDataType } from '@/types/analisis'

type AnalisisCollapsibleProps = {
	data: AnalisisType
}

export function AnalisisCollapsible({ data }: AnalisisCollapsibleProps) {
	const columns: ColumnDef<AnalisysDataType>[] = [
		{
			accessorKey: 'material_name',
			size: 1000,
			header: 'Rubro',
		},
		{
			accessorKey: 'unit',
			size: 100,
			header: 'Unidad',
		},
		{
			accessorKey: 'quantity',
			size: 100,
			header: 'Cantidad',
		},
	]

	return (
		<Collapsible>
			<CollapsibleTrigger asChild>
				<Button variant='ghost' className='w-full justify-start'>
					{data.key}
					<ChevronRightIcon className='transition-transform group-data-[state=open]:rotate-90' />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<ReportDataTable data={data.data} columns={columns} />
			</CollapsibleContent>
		</Collapsible>
	)
}
