const Joi = require('joi')
const Uuid = require('uuid')
const Boom = require('boom')

exports.register = function (server, options, next) {
  let store
  server.dependency('hapi-level', (server, after) => {
    store = server.plugins['hapi-level'].db
    return after()
  })

  const getUser = function (userId, callback) {
    return store.get(userId, callback)
  }

  const createUser = function (userDetails, callback) {
    const userId = Uuid.v4()
    const user = {
      id: userId,
      details: userDetails
    }
    store.put(userId, user, (err) => {
      callback(err, user)
    })
  }

  server.route([
    {
      method: 'GET',
      path: '/user/{userId}',
      config: {
        handler: function (request, reply) {
          const userId = request.params.userId
          getUser(userId, (err, user) => {
            if (err) {
              return reply(Boom.notFound(err))
            }
            return reply(user)
          })
        },
        description: 'Retrieve a user',
        validate: {
          params: {
            userId: Joi.string().description('userId')
          }
        },
        tags: ['api']
      }
    },
    {
      method: 'POST',
      path: '/user',
      config: {
        handler: function (request, reply) {
          const userDetails = request.payload
          createUser(userDetails, (err, user) => {
            if (err) {
              return reply(Boom.badRequest(err))
            }
            return reply(user)
          })
        },
        description: 'Create a user',
        validate: {
          payload: {
            firstName: Joi.string().trim().min(3).max(100).description('First name')
          }
        },
        tags: ['api']
      }
    }
  ])

  server.expose({
    getUser: getUser,
    createUser: createUser
  })

  return next()
}

exports.register.attributes = {
  name: 'userStore'
}
