const ProductBatch = require('./productBatchModel')

async function handleFifo(productId, quantityNeeded) {
  // Lấy tất cả các lô hàng của sản phẩm cần bán, sắp xếp theo FIFO (expirationDate và createdAt)
  const batches = await ProductBatch.find({
    productId,
    quantity: { $gt: 0 }
  }).sort({ expirationDate: 1, createdAt: 1 }) // FIFO

  const usedBatches = [] // Lưu thông tin về các lô hàng đã sử dụng
  let remaining = quantityNeeded // Số lượng còn lại cần trừ

  // Duyệt qua các lô hàng theo thứ tự FIFO
  for (const batch of batches) {
    if (remaining <= 0) break // Nếu đã đủ số lượng, thoát vòng lặp

    // Xác định số lượng cần sử dụng từ lô này
    const useQty = Math.min(batch.quantity, remaining)

    // Cập nhật lại số lượng tồn kho của lô hàng
    batch.quantity -= useQty
    await batch.save() // Lưu lại lô hàng với số lượng mới

    // Thêm thông tin lô hàng đã sử dụng vào mảng usedBatches
    usedBatches.push({
      productBatchId: batch._id,
      usedQuantity: useQty,
      sellPrice: batch.sellPrice
    })

    // Cập nhật số lượng còn lại cần trừ
    remaining -= useQty
  }

  // Kiểm tra nếu không đủ hàng tồn kho
  if (remaining > 0) {
    throw new Error(`Not enough stock for product: ${productId}`)
  }

  return usedBatches // Trả về thông tin các lô hàng đã sử dụng
}

module.exports = handleFifo
