import { useMemo, useState } from 'react'
import {
  calculatePriceWithBreakdown,
  defaultPriceTiers,
} from '../utils/pricing'

export const PriceEstimate = () => {
  const [usage, setUsage] = useState<number>(500)

  const priceWithBreakdown = useMemo(
    () => calculatePriceWithBreakdown(defaultPriceTiers, usage),
    [usage]
  )

  return (
    <div>
      <div className="flex flex-row items-center justify-center py-4">
        {!!usage ? (
          <div className="flex flex-col text-right text-slate-600">
            {priceWithBreakdown.breakdown.map((breakdown, index) => (
              <>
                <p key={breakdown.price} className={index + 1 < priceWithBreakdown.breakdown.length ? "after:content-['+'] after:text-slate-600" : 'after:ml-4'}>
                  {`${breakdown.usage.toLocaleString('en-US')} * $${
                    breakdown.price.toFixed(3)
                  }`}{' '}
                </p>
              </>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">0</p>
        )}
        <p className="text-slate-600 text-2xl mx-3">=</p>
        <div className="font-semibold text-slate-700 text-2xl">
          {priceWithBreakdown.cost.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </div>
      </div>
      <div className='flex flex-col items-center'>
        <input
          type="number"
          value={usage}
          min={0}
          onChange={(e) => setUsage(+e.target.value)}
          className="caret-emerald-400 focus:outline-none focus:ring focus:ring-emerald-400 rounded-md shadow-sm mb-4"
        />
        <input
          type="range"
          value={usage}
          min={0}
          max={3000}
          step={50}
          onChange={(e) => setUsage(+e.target.value)}
          className="accent-slate-700 focus:accent-emerald-400"
        />
      </div>
    </div>
  )
}
