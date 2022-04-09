import {assert, describe, it} from 'vitest'
import { getFirstAndLastMomentOfMonth, isDateBetween } from '../utils/dates'
import { calculatePrice, defaultPriceTiers } from '../utils/pricing'

describe.concurrent('Dates', () => {
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

  it('Checks a date between two dates', async () => {
    assert.isTrue(isDateBetween(
      new Date('2022-04-08'),
      new Date('2022-04-01'),
      new Date('2022-04-10')
    ))
  })
  it('Checks a date before two dates', async () => {
    assert.isFalse(isDateBetween(
      new Date('2022-04-13'),
      new Date('2022-04-01'),
      new Date('2022-04-10')
    ))
  })
  it('Checks a date after two dates', async () => {
    assert.isFalse(isDateBetween(
      new Date('2022-04-12'),
      new Date('2022-04-01'),
      new Date('2022-04-10')
    ))
  })
  it('Checks a date that matches one of the two dates', async () => {
    assert.isFalse(isDateBetween(
      new Date('2022-04-10'),
      new Date('2022-04-01'),
      new Date('2022-04-10')
    ))
  })
})

describe.concurrent('Pricing', () => {
  it('Checks price of 0 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 0), 0)
  })
  it('Checks price of 100 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 100), 0)
  })
  it('Checks price of 200 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 200), 0)
  })
  it('Checks price of 201 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 201), 0.005)
  })
  it('Checks price of 500 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 500), 1.5)
  })
  it('Checks price of 1000 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 1000), 3.5)
  })
  it('Checks price of 1500 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 1500), 5)
  })
  it('Checks price of 2000 tweets', async () => {
    assert.equal(calculatePrice(defaultPriceTiers, 2000), 6.5)
  })
})
