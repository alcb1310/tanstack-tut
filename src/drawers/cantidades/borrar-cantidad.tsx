import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "lucide-react"
import { toast } from "sonner"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DeleteCantidad } from "@/queries/cantidad"
import type { QuantityResponseType } from "@/types/cantidad"

type CantidadDeleteDialogProps = {
	cantidad: QuantityResponseType
}

export function CantiadDeleteDialog({ cantidad }: CantidadDeleteDialogProps) {
	const queryClient = useQueryClient()
	const useDeleteCantidadMutation = useMutation({
		mutationFn: DeleteCantidad,
		onSuccess: () => {
			toast.success("Cantidad eliminada exitosamente")
			queryClient.invalidateQueries({ queryKey: ["cantidades"] })
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

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<DeleteIcon size={16} className='cursor-pointer text-red-600' />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className='bg-white'>
						<DeleteIcon size={16} className='bg-white text-red-600' />
					</AlertDialogMedia>
					<AlertDialogTitle className='text-red-600'>
						Eliminar Cantidad
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta seguro que desea eliminar la cantidad:
						<ul className='my-3'>
							<li className='flex justify-between'>
								<span className='font-bold'>Proyecto</span>{" "}
								{cantidad.project.name}
							</li>
							<li className='flex justify-between'>
								<span className='font-bold'>Rubro</span> {cantidad.rubro.name}
							</li>
						</ul>
						Esta accion no se puede deshacer
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button type='button' variant='outline'>
							Cancelar
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							useDeleteCantidadMutation.mutate({ data: { id: cantidad.id } })
						}}
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
