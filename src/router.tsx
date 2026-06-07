import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
	const queryClient = new QueryClient()

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		context: { queryClient },
		defaultPreload: "intent",
	})

	return router
}
