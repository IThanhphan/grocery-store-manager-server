// Middleware tự động tính totalAmount
function calculateTotalAmount(next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  next();
}

module.exports = {
  calculateTotalAmount
};