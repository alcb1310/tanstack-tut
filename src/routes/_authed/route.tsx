import { Outlet } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			Hello "/_authed"!
			<Outlet />
		</div>
	)
}
