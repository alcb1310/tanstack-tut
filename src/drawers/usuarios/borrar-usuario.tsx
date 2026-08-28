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
import { DeleteUser } from '@/queries/user'
import type { UserResponse } from '@/types/user'

type UserDeleteDialogProps = {
	user: UserResponse
}

export function UserDeleteDialog({ user }: UserDeleteDialogProps) {
	const queryClient = useQueryClient()

	const useDeleteUserMutation = useMutation({
		mutationFn: DeleteUser,
		onSuccess: () => {
			toast.success('Usuario eliminado exitosamente')
			queryClient.invalidateQueries({ queryKey: ['usuarios'] })
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
			<AlertDialogTrigger>
				<DeleteIcon size={16} className='text-red-600' />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className='bg-white'>
						<DeleteIcon size={16} className='bg-white text-red-600' />
					</AlertDialogMedia>
					<AlertDialogTitle className='text-red-600'>
						Eliminar Usuario
					</AlertDialogTitle>
					<AlertDialogDescription>
						¿Estás seguro de eliminar el usuario{' '}
						<span className='font-bold'>{user.name}</span>?. Esta acción no se
						puede deshacer
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							useDeleteUserMutation.mutate({ data: { id: user.id } })
						}}
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
