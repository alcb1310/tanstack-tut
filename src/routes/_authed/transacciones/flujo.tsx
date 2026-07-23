import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/transacciones/flujo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/transacciones/flujo"!</div>
}
