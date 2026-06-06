import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/reportes/actual")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authed/reportes/actual"!</div>
}
