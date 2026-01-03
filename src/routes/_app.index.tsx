import { createFileRoute } from '@tanstack/react-router'
import { ChatView } from '@/views/ChatView'

export const Route = createFileRoute('/_app/')({
  component: ChatView,
})