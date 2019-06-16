const { MongoClient } = require('mongodb')

const DEFAULT_LIMIT = 100
const MAX_LIMIT = 1000
const FILTER_TYPES_MAP = {
  cpfcnpj: 'integer',
  type: 'string',
  fromDate: 'datetime',
  toDate: 'datetime'
}
const ORDER_FIELDS = ['cpfcnpj', 'type', 'created']

function getMongoClient() {
  return new Promise((resolve, reject) => {
    const mongoDatabaseAddress = process.env.MONGO_DATABASE_ADDRESS || 'mongodb://127.0.0.1:27017'

    MongoClient.connect(mongoDatabaseAddress, { useNewUrlParser: true }, (error, client) => {
      if (error) return reject(error)
      resolve(client)
    })
  })
}

function getMongoDocumentsCollection(client) {
  return new Promise((resolve, reject) => {
    const db = client.db(process.env.MONGO_DATABASE)
    db.collection('documents', { strict: true }, (error, collection) => {
      if (error) return reject(error)
      resolve(collection)
    })
  })
}

function getDocumentsStream({ collection, filters, order, limit }) {
  const queryLimit = Math.min(parseInt(limit) || DEFAULT_LIMIT, MAX_LIMIT)
  let queryEnvelope = collection.find(filters)
    .limit(queryLimit)

  if (ORDER_FIELDS.includes(order)) queryEnvelope.sort({ [order]: 1 })

  return queryEnvelope.stream()
}

function buildMongoQuery(queryParams) {
  const mongoQuery = {}

  Object.keys(queryParams)
    .forEach((filterName) => {
      const type = FILTER_TYPES_MAP[filterName]
      const value = queryParams[filterName]

      if (!type) return

      if (filterName === 'fromDate') {
        mongoQuery.created = Object.assign(mongoQuery.created || {}, { $gte: new Date(value) })
      } else if (filterName === 'toDate') {
        mongoQuery.created = Object.assign(mongoQuery.created || {}, { $lt: new Date(value) })
      } else {
        mongoQuery[filterName] = (type === 'integer' ? parseInt(value) : value)
      }
    })

  return mongoQuery
}

module.exports = {
  getMongoClient,
  getMongoDocumentsCollection,
  getDocumentsStream,
  buildMongoQuery
}
