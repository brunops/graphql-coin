const fetch = require('node-fetch')

const {
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLObjectType
} = require('graphql')

const CMC_API = 'https://api.coinmarketcap.com'

const FORKS = {
  bitcoin: [
    'bitcoin-cash',
    'bitcoin-gold',
    'bitcoin-silver'
  ],

  'bitcoin-cash': [
    'lisk' // not true lol
  ],

  ethereum: [
    'ethereum-classic'
  ]
}

const fakeForksService = {
  get: ticker => new Promise((resolve, reject) => {
    const forks = FORKS[ticker]

    console.log(`Fetching forks for "${ticker}..."`)
    setTimeout(() => {
      console.log(`Forks found for "${ticker}: ${forks}"`)
      resolve(forks)
    }, Math.random() * 1000 >> 0)
  })
}

const getCoinData = ticker => {
  console.log(`Fetching data for "${ticker}"...`)

  return fetch(`${CMC_API}/v1/ticker/${ticker}`)
    .then(res => res.json())
    .then(coins => coins[0])
}


const Coin = new GraphQLObjectType({
  name: 'Coin',
  description: 'that thing i wish i bought looong ago',

  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: coin => coin.id
    },

    name: {
      type: GraphQLString,
      resolve: coin => coin.name
    },

    symbol: {
      type: GraphQLString,
      resolve: coin => coin.symbol
    },

    price: {
      type: GraphQLFloat,
      resolve: coin => coin.price_usd
    },

    forks: {
      type: new GraphQLList(Coin),
      resolve: coin => {
        return fakeForksService.get(coin.id)
          .then(forks => (forks || []).map(getCoinData))
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',

    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world'
      },

      coins: {
        type: Coin,

        args: {
          ticker: {
            type: GraphQLString
          }
        },

        resolve: (root, args) => getCoinData(args.ticker)
      }
    }
  })
})

module.exports = schema
