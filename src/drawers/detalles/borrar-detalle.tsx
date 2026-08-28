import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DeleteInvoiceDetail } from '@/queries/detalle'
import type { InvoiceDetailsResponseType } from '@/types/detalle'

type DetalleDeleteDialogProps = {
	invoice_detail: InvoiceDetailsResponseType
}

export function DetalleDeleteDialog({
	invoice_detail,
}: DetalleDeleteDialogProps) {
	const queryClient = useQueryClient()
	const deleteInvoiceDetailMutation = useMutation({
		mutationFn: DeleteInvoiceDetail,
		onSuccess: async () => {
			toast.success('Partida creada exitosamente')
			queryClient.invalidateQueries({ queryKey: ['facturas'] })
			queryClient.invalidateQueries({ queryKey: ['facturas-detalle'] })
		},
		onError: error => {
			toast.error(error.message, {
				position: 'top-center',
				style: {
					color: 'red',
				},
			})
		},
	})
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='ghost'>
					<DeleteIcon size={16} className='text-red-600' />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className='bg-white'>
						<DeleteIcon size={16} className='bg-white text-red-600' />
					</AlertDialogMedia>
					<AlertDialogTitle className='text-red-600'>
						Eliminar Detalle
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta seguro que desea eliminar el detalle:
						<ul className='my-3'>
							<li className='flex justify-between'>
								<span className='font-bold'>Codigo</span>{' '}
								{invoice_detail.budget_item_code}
							</li>
							<li className='flex justify-between'>
								<span className='font-bold'>Nombre</span>{' '}
								{invoice_detail.budget_item_name}
							</li>
						</ul>
						Esta accion no se puede deshacer
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							deleteInvoiceDetailMutation.mutate({
								data: {
									invoiceId: invoice_detail.id,
									detailId: invoice_detail.budget_item_id,
								},
							})
						}}
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
