const {
  getMongoClient,
  getMongoDocumentsCollection,
  buildMongoQuery,
  getDocumentsStream,
  getDocumentById,
  insertOneDocument,
  updateOneDocument,
  deleteOneDocument
} = require('../core/mongo')

const { errorCatcher } = require('../utils')

function initRoutes(app) {
  app.route('/api/documents')
    .get(errorCatcher(async(request, response, next) => {
      const filters = buildMongoQuery(request.query)
      const order = request.query.order
      const limit = request.query.limit && parseInt(request.query.limit)
      const client = await getMongoClient()
      const collection = await getMongoDocumentsCollection(client)
      const documents = await getDocumentsStream({
        collection,
        filters,
        order,
        limit
      })

      response.json(documents)

      client.close()
      response.end()
      next()
    }))
    .post(errorCatcher(async(request, response, next) => {
      const document = request.body

      Object.assign(document, {
        type: (document.cpfcnpj.length === 11 ? 'cpf' : 'cnpj'),
        active: true
      })

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

  app.route('/api/documents/:documentId')
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
    .delete(errorCatcher(async(request, response, next) => {
      const documentIdToDelete = request.document._id

      const client = await getMongoClient()
      const collection = await getMongoDocumentsCollection(client)
      await deleteOneDocument({
        collection,
        documentIdToDelete
      })

      response.status(200)
        .send({ id: documentIdToDelete })

      client.close()
      next()
    }))

  app.param('documentId', errorCatcher(async(request, response, next) => {
    const documentId = request.params.documentId
    const client = await getMongoClient()
    const collection = await getMongoDocumentsCollection(client)
    const result = await getDocumentById({
      collection,
      documentId
    })

    client.close()

    if (!result) {
      return response.status(404)
        .send({ message: 'Document not found!' })
    }

    request.document = result
    next()
  }))
}

module.exports = { initRoutes }
