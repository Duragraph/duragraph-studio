import { createFileRoute } from '@tanstack/react-router'
import { ApprovalsView } from '@/views/ApprovalsView'

export const Route = createFileRoute('/_app/approvals')({
  component: ApprovalsView,
})