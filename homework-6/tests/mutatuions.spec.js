const {
  customers,
  categories,
  products,
  orders,
  orderProducts,
} = require('../src/datasources')
const utils = require('../src/utils')
const {
  register,
  updateProfile,
  createOrder,
  addOrderProduct,
  changeOrderProduct,
  confirmOrder,
} = require('../src/mutations')

describe('mutations', async () => {
  let token
  const profile = {
    email: 'it@vep.ru',
    name: 'Ахалай-Махалай',
    address: 'Не дом и не улица',
    password: '123',
  }
  it('can register', async () => {
    const mockInsert = jest.fn()
    customers.insert = mockInsert

    const args = { data: profile }
    token = await register(null, args)
    expect(mockInsert.mock.calls).toHaveLength(1)
  })

  it('can update profile', async () => {
    const ctx = {
      user: profile,
    }
    const mockUpdate = jest.fn()
    mockUpdate.mockImplementationOnce(cb => [1, profile])
    customers.update = mockUpdate
    const args = { data: profile }
    token = await updateProfile(null, args, ctx)
    expect(mockUpdate.mock.calls).toHaveLength(1)
  })

  it('can create order', async () => {
    const ctx = {
      user: profile,
    }
    const mockInsert = jest.fn()
    orders.insert = mockInsert

    await createOrder(null, {}, ctx)
    expect(mockInsert.mock.calls).toHaveLength(1)
  })

  it('can addOrderProduct', async () => {
    const ctx = {
      user: profile,
    }
    const mockFindOrder = jest.fn()
    const mockFindProduct = jest.fn()
    function return101() {
      return { _id: '101' }
    }
    mockFindOrder.mockImplementation(return101)
    mockFindProduct.mockImplementation(return101)
    const mockInsert = jest.fn()
    orders.findOne = mockFindOrder
    products.findOne = mockFindProduct
    orderProducts.insert = mockInsert
    const args = {
      item: {
        product: 101,
        order: 101,
        quantity: 1,
      },
    }
    await addOrderProduct(null, args, ctx)
    expect(mockInsert.mock.calls).toHaveLength(1)
    expect(mockFindOrder.mock.calls).toHaveLength(2)
    expect(mockFindProduct.mock.calls).toHaveLength(1)
  })

  it('can changeOrderProduct', async () => {
    const ctx = {
      user: profile,
    }
    const mockFindOrder = jest.fn()
    const mockFindProduct = jest.fn()
    const mockUpdate = jest.fn()
    function return101() {
      return { _id: '101' }
    }
    mockFindOrder.mockImplementation(return101)
    mockFindProduct.mockImplementation(return101)
    mockUpdate.mockImplementation(return101)
    orders.findOne = mockFindOrder
    products.findOne = mockFindProduct
    orderProducts.update = mockUpdate
    const args = {
      item: {
        product: 101,
        order: 101,
        quantity: 2,
      },
    }
    await changeOrderProduct(null, args, ctx)
    expect(mockUpdate.mock.calls).toHaveLength(1)
    expect(mockFindOrder.mock.calls).toHaveLength(2)
    expect(mockFindProduct.mock.calls).toHaveLength(1)
  })

  it('can confirm order', async () => {
    const ctx = {
      user: profile,
    }
    const mockUpdate = jest.fn()
    mockUpdate.mockImplementationOnce(cb => [1, {}])
    orders.update = mockUpdate

    await confirmOrder(null, {}, ctx)
    expect(mockUpdate.mock.calls).toHaveLength(1)
  })
})
