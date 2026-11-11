import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '@/features/underhype/analytics'
export const Route = createFileRoute('/_authenticated/analytics')({ component: AnalyticsPage })
