import {assert, describe, it} from 'vitest'
import { calculatePrice, defaultPriceTiers } from '../utils/pricing'

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
