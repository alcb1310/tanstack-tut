import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/reportes/cuadre")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authed/reportes/cuadre"!</div>
}
