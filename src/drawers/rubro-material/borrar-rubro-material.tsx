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
import { DeleteRubroMaterial } from '@/queries/rubro-material'
import type { RubroMaterialType } from '@/types/rubro-material'

type RubroMaterialEditDrawerProps = {
	material_name: string
	material: RubroMaterialType
}

export function RubroMaterialDeleteDialog({
	material,
	material_name,
}: RubroMaterialEditDrawerProps) {
	const queryClient = useQueryClient()

	const useDeleteItemMaterialMutation = useMutation({
		mutationFn: DeleteRubroMaterial,
		onSuccess: () => {
			toast.success('Material eliminado exitosamente')
			queryClient.invalidateQueries({ queryKey: ['rubros-material'] })
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
						Eliminar Material
					</AlertDialogTitle>
					<AlertDialogDescription>
						¿Estás seguro de eliminar el material{' '}
						<span className='font-bold'>{material_name}</span>?. Esta acción no
						se puede deshacer
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							useDeleteItemMaterialMutation.mutate({
								data: {
									rubroId: material.item_id,
									materialId: material.material_id,
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
