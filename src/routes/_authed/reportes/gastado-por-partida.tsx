import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/reportes/gastado-por-partida")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authed/reportes/gastado-por-partida"!</div>
}
