import { createFileRoute } from '@tanstack/react-router'
import { TracesView } from '@/views/TracesView'

export const Route = createFileRoute('/_app/traces')({
  component: TracesView,
})