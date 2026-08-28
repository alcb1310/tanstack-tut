import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { MeQuery } from '@/queries/user'

export const Route = createFileRoute('/_authed/')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.query({
			queryKey: ['me'],
			queryFn: () => MeQuery(),
		})
	},
})

function RouteComponent() {
	const { data } = useSuspenseQuery({
		queryKey: ['me'],
		queryFn: () => MeQuery(),
	})

	return (
		<div>
			<p>
				Bienvenido <span className='font-bold text-chart-3'>{data?.name}</span>
			</p>
		</div>
	)
}
