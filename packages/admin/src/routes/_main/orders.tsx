import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/orders')({
  component: () => <div>Hello /_main/orders!</div>
})