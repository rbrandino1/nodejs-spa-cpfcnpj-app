const {
  getMongoClient,
  getMongoDocumentsCollection,
  buildMongoQuery,
  getDocumentsStream,
  getDocumentById,
  insertOneDocument,
  updateOneDocument
} = require('../core/mongo')

const { errorCatcher } = require('../utils')

function initRoutes(app) {
  app.route('/documents')
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

      cursor.on('data', data => response.write(JSON.stringify(data)))
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

  app.route('/documents/:documentId')
    .get((request, response) => {
      response.json(request.document)
    })
    .put(errorCatcher(async(request, response, next) => {
      const documentIdToUpdate = request.document._id

      // For security purposes only merge these parameters
      const documentFieldsToUpdate = {
        cpfcnpj: request.body.cpfcnpj,
        active: request.body.active
      }

      const client = await getMongoClient()
      const collection = await getMongoDocumentsCollection(client)
      await updateOneDocument({
        collection,
        documentIdToUpdate,
        documentFieldsToUpdate
      })

      response.status(200)
        .send({ id: documentIdToUpdate })

      client.close()
      next()
    }))
    .delete((request, response) => {
      response.json({ message: 'Feature not implemented' })
    })

  app.param('documentId', errorCatcher(async(request, response, next) => {
    const documentId = request.params.documentId
    const client = await getMongoClient()
    const collection = await getMongoDocumentsCollection(client)
    const result = await getDocumentById({
      collection,
      documentId
    })

    request.document = result
    client.close()
    next()
  }))
}

module.exports = { initRoutes }
