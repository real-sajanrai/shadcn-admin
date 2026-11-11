import { createFileRoute } from '@tanstack/react-router'
import { UnderhypeDashboard } from '@/features/underhype/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: UnderhypeDashboard,
})
