const {
  getMongoClient,
  getMongoDocumentsCollection,
  buildMongoQuery, getDocumentsStream,
  insertOneDocument
} = require('../core/mongo')

const { errorCatcher } = require('../utils')

function initRoutes(app) {
  app.route('/document')
    .get(errorCatcher(async(request, response, next) => {
      const filters = buildMongoQuery(request.query)
      const order = request.query.order
      const limit = request.query.limit && parseInt(request.query.limit)
      const client = await getMongoClient()
      const collection = await getMongoDocumentsCollection(client)
      const cursor = getDocumentsStream({
        collection,
        filters,
        order,
        limit
      })

      cursor.on('data', data => response.json(data))
      cursor.on('end', () => {
        client.close()
        response.end()
        next()
      })
    }))
    .post(errorCatcher(async(request, response, next) => {
      const document = request.body
      const client = await getMongoClient()
      const collection = await getMongoDocumentsCollection(client)
      const result = await insertOneDocument({
        collection,
        document
      })

      response.status(201)
        .send({ id: result.insertedId })

      client.close()
      next()
    }))

  app.route('/document/:id')
    .get((request, response) => {
      response.json({ message: 'Feature not implemented' })
    })
    .put((request, response) => {
      response.json({ message: 'Feature not implemented' })
    })
    .delete((request, response) => {
      response.json({ message: 'Feature not implemented' })
    })
}

module.exports = { initRoutes }
