const ProductBatch = require('../models/productBatchModel')

async function createProductBatches(doc, next) {
  try {
    const batches = doc.items.map(item => ({
      productId: item.productId,
      stockIntId: doc._id,
      quantity: item.quantity,
      importPrice: item.importPrice,
      sellPrice: item.sellPrice ?? Math.round(item.importPrice * 1.2), // hoặc item.sellPrice nếu có
      expirationDate: item.expirationDate
    }))

    for (const data of batches) {
      const batch = new ProductBatch(data)
      await batch.validate()
      await batch.save()
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { createProductBatches }