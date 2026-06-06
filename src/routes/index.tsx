import { Button } from "@/components/ui/button"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Hello "/"!</h1>
			<Button>Button</Button>
		</div>
	)
}
