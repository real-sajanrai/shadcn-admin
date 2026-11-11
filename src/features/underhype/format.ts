export function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function initials(name?: string | null) {
  return (name || '?').trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('')
}

export function statusTitle(status?: string | null) {
  return (status || 'new').replaceAll('_', ' ').replace(/\b\w/g, (value) => value.toUpperCase())
}

export function csvCell(value: unknown) {
  return '"' + String(value ?? '').replaceAll('"', '""') + '"'
}

export function csvContent(rows: Record<string, unknown>[]) {
  if (!rows.length) return ''
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  return [columns.map(csvCell).join(','), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(','))].join('\r\n')
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const csv = csvContent(rows)
  if (!csv) return
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
