/**
 * Returns two date objects set to the first millisecond
 * and the last millisecond of the current month in UTC.
 * @returns Date objects of first moment and last moment of current month in UTC
 */
export const getFirstAndLastDayOfMonth = (): Date[] => {
  const date = new Date()
  const firstDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999)
  )
  return [firstDay, lastDay]
}

export const isDateBetween = (target: Date, first: Date, last: Date): Boolean =>
  target.getTime() > first.getTime() && target.getTime() < last.getTime()
