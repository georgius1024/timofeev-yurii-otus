/*
 * Запросы
 */

const { customers, categories, products } = require('./datasources')
const { getOrderWithProducts } = require('./utils')

async function login(parent, args, context) {
  const email = args.email
  const password = args.password
  const customer = await customers.findOne({ email, password }, { token: 1 })
  if (customer) {
    return customer.token
  }
}

async function profile(parent, args, context) {
  if (context.user) {
    return context.user
  } else {
    throw new Error('You must be logged in')
  }
}

function getCategories(parent, args, context) {
  return categories.find({})
}

// Построитель фильтра
function buildProductFilter(args) {
  const filter = {}
  if (args && args.filter) {
    if (args.filter.search) {
      filter.name = new RegExp(args.filter.search, 'imu')
    }
    if (args.filter.categoryId) {
      filter.categoryId = args.filter.categoryId
    }
    if (args.filter.priceMax || args.filter.priceMin) {
      filter.price = {}
      if (args.filter.priceMin) {
        filter.price.$gte = args.filter.priceMin
      }
      if (args.filter.priceMax) {
        filter.price.$lte = args.filter.priceMax
      }
    }
  }
  return filter
}

async function getProducts(parent, args, context, info) {
  const filter = buildProductFilter(args)
  const sort = {}
  if (args && args.sortBy) {
    sort[args.sortBy.field] = args.sortBy.ascending ? 1 : -1
  }
  const fields = info.fieldNodes[0].selectionSet.selections
  const loadCategories = fields.some(field => field.name.value === 'category')
  const prodList = await products
    .cfind(filter)
    .sort(sort)
    .skip(args.offset)
    .limit(args.limit)
    .exec()
  if (!loadCategories) {
    return prodList
  } else {
    if (filter.categoryId) {
      const category = await categories.findOne({ _id: filter.categoryId })
      return prodList.map(item => {
        item.category = category
        return item
      })
    } else {
      const catList = await categories.find({})
      return prodList.map(item => {
        item.category = catList.find(e => e._id === item.categoryId)
        return item
      })
    }
  }
}

function countProducts(parent, args, context) {
  const filter = buildProductFilter(args)
  return products.count(filter)
}

function getOrder(parent, args, context) {
  return getOrderWithProducts(args.id)
}

module.exports = {
  login,
  profile,
  getCategories,
  getProducts,
  countProducts,
  getOrder,
}
