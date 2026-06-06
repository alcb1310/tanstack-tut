import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed/analisis/analisis")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_authed/analisis/analisis"!</div>
}
