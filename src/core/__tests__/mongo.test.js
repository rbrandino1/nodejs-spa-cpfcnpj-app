const { MongoCollection } = require('mongodb')
const {
  getMongoClient,
  getMongoDocumentsCollection,
  buildMongoQuery,
  getDocumentsStream,
  insertOneDocument
} = require('../mongo')

describe('#getMongoDocumentsCollection', () => {
  let originalMongoDatabaseAddress = process.env.MONGO_DATABASE_ADDRESS
  let originalMongoDatabase = process.env.MONGO_DATABASE

  beforeEach(() => {
    process.env.MONGO_DATABASE_ADDRESS = 'mongodb://127.0.0.1:33017'
    process.env.MONGO_DATABASE = 'brazilian-documents-test'
  })

  afterEach(() => {
    process.env.MONGO_DATABASE_ADDRESS = originalMongoDatabaseAddress
    process.env.MONGO_DATABASE = originalMongoDatabase
  })

  it('returns MongoDB collection', async() => {
    const client = await getMongoClient()
    const collection = await getMongoDocumentsCollection(client)

    expect(collection.name)
      .toBe('documents')
    expect(collection.database.name)
      .toBe(process.env.MONGO_DATABASE_ADDRESS_TEST)
    expect(collection.database.client.databaseAddress)
      .toBe(process.env.MONGO_DATABASE_ADDRESS_TEST)
  })

  it('throws error if collection cannot be opened', () => {
    process.env.MONGO_DATABASE_ADDRESS = null

    expect(getMongoDocumentsCollection())
      .rejects
      .toThrow()
  })
})

describe('#buildMongoQuery', () => {
  const queryParams = {
    cpfcnpj: '90394439000139',
    type: 'cnpj',
    fromDate: '2019-06-15',
    toDate: '2019-06-15'
  }

  it('returns empty query if no parameters are given', () => {
    expect(buildMongoQuery({}))
      .toEqual({})
  })

  it('returns empty query if parameters are invalid', () => {
    const invalidQueryParams = { invalidParameter: 'invalid' }

    expect(buildMongoQuery(invalidQueryParams))
      .toEqual({})
  })

  it('parses date and use a `$gte` filter when query has `fromDate`', () => {
    expect(buildMongoQuery({ fromDate: queryParams.fromDate }))
      .toEqual({ date: { $gte: new Date('2019-06-15') } })
  })

  it('parses date and use a `$lt` filter when query has `toDate`', () => {
    expect(buildMongoQuery({ toDate: queryParams.toDate }))
      .toEqual({ date: { $lt: new Date('2019-06-15') } })
  })

  it('returns merged parameters', () => {
    const mongoQuery = buildMongoQuery(queryParams)

    expect(Object.keys(mongoQuery))
      .toEqual(['cpfcnpj', 'type', 'created'])
    expect(Object.keys(mongoQuery.created))
      .toEqual(['$gte', '$lt'])
  })
})

describe('#getDocumentsStream', () => {
  const collection = new MongoCollection('documents', {})

  it('filters collection with given filters', () => {
    const filters = { type: 'cnpj' }

    const cursor = getDocumentsStream({
      collection,
      filters
    })

    expect(cursor.options.filters)
      .toBe(filters)
  })

  it('sorts collection with given order (ascending by default)', () => {
    const cursor = getDocumentsStream({
      collection,
      order: 'created'
    })

    expect(cursor.options.sort)
      .toEqual({ created: 1 })
  })

  it('does not sort collection if order parameter is invalid', () => {
    const cursor = getDocumentsStream({
      collection,
      order: 'invalid'
    })

    expect(cursor.options.sort)
      .toBe(null)
  })

  it('limits query based on parameter', () => {
    const cursor = getDocumentsStream({
      collection,
      limit: 10
    })

    expect(cursor.options.limit)
      .toBe(10)
  })

  it('accepts limit parameters as string', () => {
    const cursor = getDocumentsStream({
      collection,
      limit: '10'
    })

    expect(cursor.options.limit)
      .toBe(10)
  })

  it('limits query to fetch 100 records if limit parameter is absent', () => {
    const cursor = getDocumentsStream({ collection })

    expect(cursor.options.limit)
      .toBe(100)
  })

  it('limits query to fetch a maximum of 1000 records if parameter is too high', () => {
    const cursor = getDocumentsStream({
      collection,
      limit: 5000
    })

    expect(cursor.options.limit)
      .toBe(1000)
  })

  it('streams collection', () => {
    const cursor = getDocumentsStream({ collection })

    expect(cursor.options.stream)
      .toBe(true)
  })
})

describe('#insertOneDocument', () => {
  const collection = new MongoCollection('documents', {})

  it('filters collection with given filters', () => {
    const filters = { type: 'cnpj' }

    const cursor = getDocumentsStream({
      collection,
      filters
    })

    expect(cursor.options.filters)
      .toBe(filters)
  })

  it('sorts collection with given order (ascending by default)', () => {
    const cursor = getDocumentsStream({
      collection,
      order: 'created'
    })

    expect(cursor.options.sort)
      .toEqual({ created: 1 })
  })

  it('does not sort collection if order parameter is invalid', () => {
    const cursor = getDocumentsStream({
      collection,
      order: 'invalid'
    })

    expect(cursor.options.sort)
      .toBe(null)
  })

  it('limits query based on parameter', () => {
    const cursor = getDocumentsStream({
      collection,
      limit: 10
    })

    expect(cursor.options.limit)
      .toBe(10)
  })

  it('accepts limit parameters as string', () => {
    const cursor = getDocumentsStream({
      collection,
      limit: '10'
    })

    expect(cursor.options.limit)
      .toBe(10)
  })

  it('limits query to fetch 100 records if limit parameter is absent', () => {
    const cursor = getDocumentsStream({ collection })

    expect(cursor.options.limit)
      .toBe(100)
  })

  it('limits query to fetch a maximum of 1000 records if parameter is too high', () => {
    const cursor = getDocumentsStream({
      collection,
      limit: 5000
    })

    expect(cursor.options.limit)
      .toBe(1000)
  })

  it('streams collection', () => {
    const cursor = getDocumentsStream({ collection })

    expect(cursor.options.stream)
      .toBe(true)
  })
})
