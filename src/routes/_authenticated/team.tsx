import { createFileRoute } from '@tanstack/react-router'
import { TeamAccessPage } from '@/features/underhype/team-access'
export const Route = createFileRoute('/_authenticated/team')({ component: TeamAccessPage })
