import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authed/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1 className='text-2xl font-bold'>Hello "/"!</h1>
			<Button>Button</Button>
		</div>
	)
}
