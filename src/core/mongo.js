const { MongoClient, ObjectID } = require('mongodb')

const DEFAULT_LIMIT = 100
const MAX_LIMIT = 1000
const FILTER_TYPES_MAP = {
  cpfcnpj: 'integer',
  type: 'string',
  active: 'boolean',
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

function getDocumentsStream({ collection, filters, order, limit }) {
  const queryLimit = Math.min(parseInt(limit) || DEFAULT_LIMIT, MAX_LIMIT)
  let queryEnvelope = collection.find(filters)
    .limit(queryLimit)

  if (ORDER_FIELDS.includes(order)) queryEnvelope.sort({ [order]: 1 })

  return queryEnvelope.toArray()
}

function getDocumentById({ collection, documentId }) {
  return new Promise((resolve, reject) => {
    if (!documentId) return resolve()

    collection.findOne({ '_id': new ObjectID(documentId) }, (error, result) => {
      error ? reject(error) : resolve(result)
    })
  })
}

function insertOneDocument({ collection, document }) {
  return new Promise((resolve, reject) => {
    if (!document) return resolve()

    collection.insertOne(document, (error, result) => {
      error ? reject(error) : resolve(result)
    })
  })
}

function updateOneDocument({ collection, documentIdToUpdate, documentFieldsToUpdate }) {
  return new Promise((resolve, reject) => {
    if (!documentIdToUpdate || !documentFieldsToUpdate) return resolve()

    collection.updateOne({ _id: new ObjectID(documentIdToUpdate) },
      { $set: documentFieldsToUpdate }, { upsert: false }, (error, result) => {
        error ? reject(error) : resolve(result)
      })
  })
}

function deleteOneDocument({ collection, documentIdToDelete }) {
  return new Promise((resolve, reject) => {
    if (!documentIdToDelete) return resolve()

    collection.deleteOne({ _id: new ObjectID(documentIdToDelete) }, (error, result) => {
      error ? reject(error) : resolve(result)
    })
  })
}


module.exports = {
  getMongoClient,
  getMongoDocumentsCollection,
  buildMongoQuery,
  getDocumentsStream,
  getDocumentById,
  insertOneDocument,
  updateOneDocument,
  deleteOneDocument
}
