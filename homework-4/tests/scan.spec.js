const scan = require('../src/scan')
describe('scanning module', async () => {
  it('can scan existing folder', async () => {
    const listing = await scan('./tests/foo')
    expect(listing).toMatchSnapshot()
  })

  it('can not scan non-existing folder', async () => {
    try {
      const listing = await scan('==error==')
    } catch (error) {
      expect(error.message).toEqual(expect.stringContaining('ENOENT'))
    }
  })
})
