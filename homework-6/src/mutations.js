/*
 * Мутации
 */
const { customers, orders, orderProducts, products } = require('./datasources')
const { getOrderWithProducts } = require('./utils')
const uuidv1 = require('uuid/v1')

async function register(parent, args, context) {
  const customerData = {
    name: args.data.name,
    email: args.data.email,
    password: args.data.password,
    token: uuidv1(),
    address: args.data.address,
  }
  await customers.insert(customerData)
  return customerData.token
}

async function updateProfile(parent, args, context) {
  if (!context.user) {
    throw new Error('You must be logged in')
  }
  const customerData = Object.assign(context.user, args.data)
  const { _id, ...update } = customerData
  const [recordsAffected, customer] = await customers.update({ _id }, update, {
    multi: false,
    returnUpdatedDocs: true,
  })
  return customer
}

async function createOrder(parent, args, context) {
  if (!context.user) {
    throw new Error('You must be logged in')
  }
  const orderData = {
    date: new Date().toISOString(),
    customerId: context.user._id,
    status: 'new',
  }
  return orders.insert(orderData)
}

async function addOrderProduct(parent, args, context) {
  if (!context.user) {
    throw new Error('You must be logged in')
  }
  const orderId = args.item.orderId
  const productId = args.item.productId
  const quantity = args.item.quantity
  const customerId = context.user._id
  const order = await orders.findOne({ _id: orderId, customerId })
  if (!order) {
    throw new Error('Your order not found')
  }

  const product = await products.findOne({ _id: productId })
  if (!product) {
    throw new Error('Your product not found')
  }
  const price = product.price

  const orderProductData = {
    orderId,
    productId,
    quantity,
    price,
  }
  orderProducts.insert(orderProductData)
  return await getOrderWithProducts(orderId)
}

async function changeOrderProduct(parent, args, context) {
  if (!context.user) {
    throw new Error('You must be logged in')
  }
  const orderId = args.item.orderId
  const productId = args.item.productId
  const quantity = args.item.quantity
  const customerId = context.user._id
  const order = await orders.findOne({ _id: orderId, customerId })
  if (!order) {
    throw new Error('Your order not found')
  }
  const product = await products.findOne({ _id: productId })
  if (!product) {
    throw new Error('Your product not found')
  }
  const price = product.price

  const orderProductData = {
    orderId,
    productId,
    quantity,
    price,
  }
  await orderProducts.update(
    { orderId, productId },
    orderProductData,
    { multi: false, returnUpdatedDocs: true }
  )
  return await getOrderWithProducts(orderId)
}

async function confirmOrder(parent, args, context) {
  if (!context.user) {
    throw new Error('You must be logged in')
  }
  const orderId = args.id
  const customerId = context.user._id
  const oldOrder = await orders.findOne({ _id: orderId, customerId })
  if (!oldOrder) {
    throw new Error('Your order not found')
  }
  oldOrder.status = 'confirmed'
  const [recordsAffected, newOrder] = await orders.update(
    { _id: orderId },
    oldOrder,
    { multi: false, returnUpdatedDocs: true }
  )
  return await getOrderWithProducts(orderId)
}

module.exports = {
  register,
  updateProfile,
  createOrder,
  confirmOrder,
  addOrderProduct,
  changeOrderProduct,
}
