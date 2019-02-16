/*
 * Схема данных, минимально необходимая для e-commerce
 * Содержит сущности: Customer, Category, Product, Order, OrderProduct
 * Никакие функции бэк-офиса/CRUD/администрирование в данном примере не реализованы,
 * только то, что взаимодействует с клиентом.
 * Схема работы:
 * 1) Идентификация пользователя:  register или login
 * Клиент получает токен, по которому работает дальше. Токен добавляется в HTTP-заголовок authorization
 * 2) Клиент берет список категорий: getProductCategories
 * 3) В выбранной категории читает продукты getProducts (поддерживается фильтрация, пагинация, сортировка)
 * (Для поддержки пагинации используется countProducts)
 * 4) При выборе продукта сначала создается заказ createOrder, код заказа далее испльзуется
 * 5) Непосредственно добавить продукт в заказ addOrderProduct
 * 6) Изменить кол-во продукта в заказе changeOrderProduct
 * 7) Когда все готово, вызывается confirmOrder - устанавливает статус, передает заказ в работу
 */
const { gql } = require('apollo-server')
module.exports = gql`
  # Схема данных, необходимая для минимальной e-commerce

  # Клиент
  type Customer {
    _id: ID!
    name: String!
    email: String!
    password: String!
    address: String!
    token: String!
  }

  # Категория продуктов
  type Category {
    _id: ID!
    name: String!
    description: String
    imageUrl: String
  }

  # Продукт
  type Product {
    _id: ID!
    name: String!
    price: Float!
    quantity: Float!
    description: String
    imageUrl: String
    category: Category!
  }

  # Заказ
  type Order {
    _id: ID!
    date: String!
    status: String!
    items: [OrderProduct]
  }

  # Продукт-в-заказе
  type OrderProduct {
    product: Product!
    quantity: Float!
    price: Float!
  }

  # Маскировка нескольких секьюрных полей от передачи по HTTP
  type CustomerOutput {
    _id: ID!
    name: String!
    email: String!
    address: String!
    orders: [Order]
  }

  # Фильтр продуктов - категория+текст+диапазон-цен
  input ProductFilter {
    categoryId: ID
    search: String
    priceMin: Float
    priceMax: Float
  }

  # правило для сортировки
  input Sort {
    field: String!
    ascending: Boolean
  }

  # Регистрация клиента
  input CustomerRegistration {
    name: String!
    email: String!
    password: String!
    address: String!
  }

  #Обновление профиля
  input CustomerUpdate {
    name: String
    email: String
    password: String
    address: String
  }

  # Количество продукта в заказе
  input OrderItem {
    orderId: ID!
    productId: ID!
    quantity: Float!
  }

  type Query {
    login(email: String!, password: String!): String
    profile: CustomerOutput
    getCategories: [Category]
    getProducts(
      filter: ProductFilter
      offset: Int
      limit: Int
      sortBy: Sort
    ): [Product]
    countProducts(filter: ProductFilter): Int
    getOrder(id: ID!): Order
  }

  type Mutation {
    register(data: CustomerRegistration): String
    updateProfile(data: CustomerUpdate): CustomerOutput
    createOrder: Order
    addOrderProduct(item: OrderItem!): Order
    changeOrderProduct(item: OrderItem!): Order
    confirmOrder(id: ID!): Order
  }
`
