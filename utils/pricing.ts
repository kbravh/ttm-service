/*
| Volume range | Price  |
|:------------:|--------|
|     0-200    | $0.000 |
|    201-500   | $0.005 |
|   501-1000   | $0.004 |
|     1000+    | $0.003 |


Example pricing

| Number of tweets | Volume | Graduated |
|:----------------:|:------:|:---------:|
|        500       |  $1.50 |   $1.50   |
|       1000       |  $3.20 |   $3.50   |
|       1500       |  $3.90 |   $5.00   |
|       2000       |  $5.40 |   $6.50   |


let usage = 2000
let tiers = [
  [200, 0.000],
  [300, 0.005],
  [500, 0.004],
  [Infinity, 0.003]
]

calculatePrice(tiers, usage)

*/

export const calculatePrice = (
  priceTiers: number[][],
  tweets: number
): number =>
  priceTiers.reduce((totalCost, priceTier): number => {
    const [limit, price] = priceTier
    const usage = limit === Infinity ? tweets : Math.min(limit, tweets)
    tweets -= usage
    return (totalCost += usage * price)
  }, 0)
