import { createFileRoute } from '@tanstack/react-router'
import { RecordTable } from '@/features/underhype/record-table'
export const Route = createFileRoute('/_authenticated/contacts')({ component: () => <RecordTable type='contact'/> })
