function initRoutes(app) {
  app.route('/document')
    .get((request, response) => {
      response.json({ message: 'Feature not implemented' })
    })
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
