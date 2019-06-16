const { getMongoClient, getMongoDocumentsCollection, getDocumentsStream, buildMongoQuery } = require('../core/mongo')
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
        return next()
      })
    }))
    .post((request, response) => {
      response.json({ message: 'Feature not implemented' })
    })

  app.route('/document/:documentId')
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
