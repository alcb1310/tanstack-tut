import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import PageTitle from '@/components/layout/page-title'
import { Spinner } from '@/components/ui/spinner'
import { MeQuery } from '@/queries/user'

export const Route = createFileRoute('/_authed/usuarios/perfil')({
	component: RouteComponent,
	beforeLoad: ({ context: { queryClient } }) => {
		queryClient.query({ queryKey: ['me'], queryFn: () => MeQuery() })
	},
})

function RouteComponent() {
	const { data, isLoading } = useSuspenseQuery({
		queryKey: ['me'],
		queryFn: () => MeQuery(),
	})

	return (
		<div>
			<PageTitle title='Perfil' />

			{isLoading && <Spinner />}

			<p>
				<strong>Nombre:</strong>
				<span className='text-chart-3'>{data?.name}</span>
			</p>
			<p className='mb-5'>
				<strong>Email:</strong>
				<span className='text-chart-3'>{data?.email}</span>
			</p>

			<p className='text-xs font-extralight'>
				Para modificar la información, favor contactarse con el administrador
			</p>
		</div>
	)
}
