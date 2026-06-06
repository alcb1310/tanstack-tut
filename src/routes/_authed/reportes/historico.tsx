import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/reportes/historico")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authed/reportes/historico"!</div>
}
