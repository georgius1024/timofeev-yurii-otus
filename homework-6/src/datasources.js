/*
 * Источники данных приложения
 * Каждый источник является экземпляром NEDB (подмножество MongoDB)
 * и соответствует коллекции документов MongoDB
 * умеет выполнять основные операции MongoDB: find/update
 * Сами данные сгенерированы заранее и помещены в папку /db/
 */

const DB = require('nedb-promise')
const path = require('path')
const customers = new DB({
  filename: path.join(__dirname, '../db/customers'),
  autoload: true,
})
const categories = new DB({
  filename: path.join(__dirname, '../db/categories'),
  autoload: true,
})
const products = new DB({
  filename: path.join(__dirname, '../db/products'),
  autoload: true,
})
const orders = new DB({
  filename: path.join(__dirname, '../db/orders'),
  autoload: true,
})

const orderProducts = new DB({
  filename: path.join(__dirname, '../db/order-products'),
  autoload: true,
})

module.exports = {
  customers,
  categories,
  products,
  orders,
  orderProducts,
}
