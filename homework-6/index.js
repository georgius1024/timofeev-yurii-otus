const { ApolloServer } = require('apollo-server')
const queries = require('./src/queries')
const mutations = require('./src/mutations')
const utils = require('./src/utils')
const typeDefs = require('./src/schema')

const resolvers = {
  Query: {
    ...queries,
  },

  Mutation: {
    ...mutations,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || ''
    if (token) {
      const user = await utils.findCustomerWithToken(token)
      return { user }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`)
})
