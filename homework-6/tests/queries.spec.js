const {
  customers,
  categories,
  products,
  orders,
  orderProducts,
} = require('../src/datasources')
const utils = require('../src/utils')
const {
  login,
  profile,
  getCategories,
  getProducts,
  countProducts,
  getOrder,
} = require('../src/queries')

describe('queries', async () => {
  let token
  it('can login with valid credentials', async () => {
    const args = {
      email: 'it@vep.ru',
      password: '123',
    }
    token = await login(null, args)
    expect(token).toBeTruthy()
  })
  it('can not login with wrong credentials', async () => {
    const args = {
      email: 'it@vep.ru',
      password: 'wrong-pass',
    }
    const token = await login(null, args)
    expect(token).toBeFalsy()
  })
  it('can get profile if logged in', async () => {
    const user = await utils.findCustomerWithToken(token)
    const ctx = {
      user,
    }
    const profileData = await profile(null, null, ctx)
    expect(profileData).toEqual(user)
  })
  it('can not get profile if not logged in', async () => {
    let errorCnt = 0
    try {
      await profile(null, null, {})
    } catch (error) {
      errorCnt += 1
    }
    expect(errorCnt).toBe(1)
  })

  it('can getCategories', async () => {
    const x = await getCategories()
    expect(Array.isArray(x)).toBe(true)
    expect(x).toHaveLength(3)
  })

  it('can getProducts', async () => {
    const x = await getProducts(null, {})
    expect(Array.isArray(x)).toBe(true)
    expect(x).toHaveLength(9)
    const filter = {
      search: 'ql',
    }
    const y = await getProducts(null, { filter })
    expect(y).toHaveLength(2)
    filter.search = false
    filter.minPrice = 100
    filter.maxPrice = 500
    const z = await getProducts(null, { filter })
    expect(y).toHaveLength(2)
  })

  it('can countProducts', async () => {
    const filter = {
      categoryId: 'gm5w0Lxyo8r9ZTkE',
    }
    const x = await countProducts(null, { filter })
    expect(x).toBe(3)
  })

  it('can getOrder', async () => {
    const x = await getOrder(null, { id: 'mLvCR3unAz7461fF' })
    expect(x).toBeTruthy()
    expect(x.items).toHaveLength(1)
  })
})
