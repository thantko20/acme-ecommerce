import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/analytics')({
  component: () => <div>Hello /_main/analytics!</div>
})