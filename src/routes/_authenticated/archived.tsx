import { createFileRoute } from '@tanstack/react-router'
import { ArchivedRecords } from '@/features/underhype/record-table'
export const Route = createFileRoute('/_authenticated/archived')({ component: ArchivedRecords })
