import { describe, expect, it } from 'vitest'
import { csvCell, csvContent, formatDate, initials, statusTitle } from './format'

describe('Underhype dashboard formatting', () => {
  it('creates initials from names with varied whitespace', () => {
    expect(initials('Sajan Rai')).toBe('SR')
    expect(initials('  Ada   Lovelace ')).toBe('AL')
    expect(initials('')).toBe('?')
  })

  it('formats status labels consistently', () => {
    expect(statusTitle('in_progress')).toBe('In Progress')
    expect(statusTitle(null)).toBe('New')
  })

  it('handles missing and invalid dates', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate('not-a-date')).toBe('—')
    expect(formatDate('2026-01-01T00:00:00.000Z')).not.toBe('—')
  })

  it('escapes CSV quotes and serializes heterogeneous records', () => {
    expect(csvCell('He said "hello"')).toBe('"He said ""hello"""')
    expect(csvContent([{ name: 'A', note: 'line, with comma' }, { name: 'B', extra: 2 }])).toBe(
      '"name","note","extra"\r\n"A","line, with comma",""\r\n"B","","2"',
    )
    expect(csvContent([])).toBe('')
  })
})
