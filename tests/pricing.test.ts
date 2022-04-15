import { assert, describe, it } from 'vitest'
import {
  calculatePrice,
  calculatePriceWithBreakdown,
  defaultPriceTiers,
} from '../utils/pricing'

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

describe.concurrent('Pricing with breakdown', () => {
  it('Checks price of 0 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 0), {
      cost: 0,
      breakdown: [],
    })
  })
  it('Checks price of 100 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 100), {
      cost: 0,
      breakdown: [{ usage: 100, price: 0 }],
    })
  })
  it('Checks price of 200 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 200), {
      cost: 0,
      breakdown: [{ usage: 200, price: 0 }],
    })
  })
  it('Checks price of 201 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 201), {
      cost: 0.005,
      breakdown: [
        { usage: 200, price: 0 },
        { usage: 1, price: 0.005 },
      ],
    })
  })
  it('Checks price of 500 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 500), {
      cost: 1.5,
      breakdown: [
        { usage: 200, price: 0 },
        { usage: 300, price: 0.005 },
      ],
    })
  })
  it('Checks price of 1000 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 1000), {
      cost: 3.5,
      breakdown: [
        { usage: 200, price: 0 },
        { usage: 300, price: 0.005 },
        { usage: 500, price: 0.004 },
      ],
    })
  })
  it('Checks price of 1500 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 1500), {
      cost: 5.0,
      breakdown: [
        { usage: 200, price: 0 },
        { usage: 300, price: 0.005 },
        { usage: 500, price: 0.004 },
        { usage: 500, price: 0.003 },
      ],
    })
  })
  it('Checks price of 2000 tweets', async () => {
    assert.deepEqual(calculatePriceWithBreakdown(defaultPriceTiers, 2000), {
      cost: 6.5,
      breakdown: [
        { usage: 200, price: 0 },
        { usage: 300, price: 0.005 },
        { usage: 500, price: 0.004 },
        { usage: 1000, price: 0.003 },
      ],
    })
  })
})
