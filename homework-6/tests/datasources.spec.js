const {
  customers,
  categories,
  products,
  orders,
  orderProducts,
} = require('../src/datasources')

describe('datasources', async () => {
  async function testSourse(DS) {
    expect(DS.nedb).toBeTruthy()
    const x = await DS.find({})
    expect(Array.isArray(x)).toBe(true)
  }
  it('customers', async () => {
    await testSourse(customers)
  })
  it('categories', async () => {
    await testSourse(categories)
  })
  it('products', async () => {
    await testSourse(products)
  })
  it('orders', async () => {
    await testSourse(orders)
  })
  it('orderProducts', async () => {
    await testSourse(orderProducts)
  })
})
