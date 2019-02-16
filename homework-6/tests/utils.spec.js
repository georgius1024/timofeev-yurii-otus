const utils = require('../src/utils')

describe('utils', async () => {
  let token
  it('can findCustomerWithToken (valid token)', async () => {
    const x = await utils.findCustomerWithToken(
      'eec90640-fc38-11e8-813f-6f169c48b2bd'
    )
    expect(x).toBeTruthy()
  })
  it('can not findCustomerWithToken (wrong token)', async () => {
    const x = await utils.findCustomerWithToken('wrong-token')
    expect(x).toBeFalsy()
  })

  it('can getOrderWithProducts (valid id)', async () => {
    const x = await utils.getOrderWithProducts('mLvCR3unAz7461fF')
    expect(x).toBeTruthy()
  })

  it('can not getOrderWithProducts (wrong id)', async () => {
    const x = await utils.getOrderWithProducts('wrong')
    expect(x).toBeFalsy()
  })
})
