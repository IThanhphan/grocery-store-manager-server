const ProductBatch = require('../models/productBatchModel')

async function handleFifo(productId, quantityNeeded) {
  const batches = await ProductBatch.find({
    productId,
    quantity: { $gt: 0 }
  }).sort({ expirationDate: 1, createdAt: 1 })

  const usedBatches = []
  let remaining = quantityNeeded

  for (const batch of batches) {
    if (remaining <= 0) break

    const useQty = Math.min(batch.quantity, remaining)

    batch.quantity -= useQty
    await batch.save()

    usedBatches.push({
      productBatchId: batch._id,
      usedQuantity: useQty,
      sellPrice: batch.sellPrice
    })

    remaining -= useQty
  }

  if (remaining > 0) {
    throw new Error(`Not enough stock for product: ${productId}`)
  }

  return usedBatches
}

module.exports = handleFifo
