/*
 * Вспопогательные функции, которые не относятся ни к мутациям, ни к запросам
 */
const { customers, products, orders, orderProducts } = require('./datasources')

async function findCustomerWithToken(token) {
  return await customers.findOne({ token })
}

async function getOrderWithProducts(id) {
  const orderPromise = orders.findOne({ _id: id })
  const orderProductsPromise = orderProducts.find({ orderId: id })
  const productsPromise = products.find({})
  const [order, orderedProducts, allProducts] = await Promise.all([
    orderPromise,
    orderProductsPromise,
    productsPromise,
  ])
  if (order) {
    order.items = orderedProducts.map(e => {
      e.product = allProducts.find(p => e.productId === p._id)
      return e
    })
  }
  return order
}

module.exports = {
  findCustomerWithToken,
  getOrderWithProducts,
}
