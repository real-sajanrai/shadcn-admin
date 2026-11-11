import { createFileRoute } from '@tanstack/react-router'
import { RecordTable } from '@/features/underhype/record-table'
export const Route = createFileRoute('/_authenticated/hiring')({ component: () => <RecordTable type='hiring'/> })
