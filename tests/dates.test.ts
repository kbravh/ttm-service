import { assert, describe, it } from 'vitest'
import { getFirstAndLastMomentOfMonth, isDateBetween } from '../utils/dates'

describe.concurrent('First and last moments of month', () => {
  it('Gets first and last day of 30 day month', async () => {
    const date = new Date('2022-04-09')
    const [first, last] = getFirstAndLastMomentOfMonth(date)
    assert.equal(first.toISOString(), '2022-04-01T00:00:00.000Z')
    assert.equal(last.toISOString(), '2022-04-30T23:59:59.999Z')
  })
  it('Gets first and last day of 31 day month', async () => {
    const date = new Date('2022-03-15')
    const [first, last] = getFirstAndLastMomentOfMonth(date)
    assert.equal(first.toISOString(), '2022-03-01T00:00:00.000Z')
    assert.equal(last.toISOString(), '2022-03-31T23:59:59.999Z')
  })
  it('Gets first and last day of February', async () => {
    const date = new Date('2022-02-16')
    const [first, last] = getFirstAndLastMomentOfMonth(date)
    assert.equal(first.toISOString(), '2022-02-01T00:00:00.000Z')
    assert.equal(last.toISOString(), '2022-02-28T23:59:59.999Z')
  })
  it('Gets first and last day of February on leap year', async () => {
    const date = new Date('2024-02-16')
    const [first, last] = getFirstAndLastMomentOfMonth(date)
    assert.equal(first.toISOString(), '2024-02-01T00:00:00.000Z')
    assert.equal(last.toISOString(), '2024-02-29T23:59:59.999Z')
  })
})

describe('Is date between', () => {
  it('Checks a date between two dates', async () => {
    assert.isTrue(
      isDateBetween(
        new Date('2022-04-08'),
        new Date('2022-04-01'),
        new Date('2022-04-10')
      )
    )
  })
  it('Checks a date before two dates', async () => {
    assert.isFalse(
      isDateBetween(
        new Date('2022-04-13'),
        new Date('2022-04-01'),
        new Date('2022-04-10')
      )
    )
  })
  it('Checks a date after two dates', async () => {
    assert.isFalse(
      isDateBetween(
        new Date('2022-04-12'),
        new Date('2022-04-01'),
        new Date('2022-04-10')
      )
    )
  })
  it('Checks a date that matches one of the two dates', async () => {
    assert.isFalse(
      isDateBetween(
        new Date('2022-04-10'),
        new Date('2022-04-01'),
        new Date('2022-04-10')
      )
    )
  })
})
