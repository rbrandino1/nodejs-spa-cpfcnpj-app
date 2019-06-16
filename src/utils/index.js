function errorCatcher(callback) {
  return async function errorHandler(request, response, next) {
    try {
      await callback(request, response, next)
    } catch (error) {
      response.send(500, { error: 'The application has encountered an unknown error.' })
      next(error)
    }
  }
}

function logRequest(error, request, response) {
  let level = 'info'
  let message = 'request processed'
  const data = _extractRequestData(request, response)

  if (error) {
    level = 'error'
    message = error.message
    data.error = error
    data.stack = error.stack
  }

  global.logger.log(level, message, data)
}

function _extractRequestData(request, response) {
  return {
    request: {
      method: request.method.toUpperCase(),
      path: request.path,
      params: request.query
    },
    response: {
      statusCode: response.statusCode,
      bytesWritten: request.socket.bytesWritten
    }
  }
}

module.exports = { errorCatcher, logRequest }
