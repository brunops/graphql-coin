const express = require('express')
const morgan = require('morgan')

const gql = require('express-graphql')


const schema = require('./schema')

const PORT = 2345

const app = express()

app.use(morgan('tiny'))

app.use(gql({
  schema,
  graphiql: true
}))

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))