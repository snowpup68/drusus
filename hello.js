const Joi = require('joi')

exports.register = function(server, options, next) {
    const getHello = function(name) {
        const target = name || 'world'
        return `Hello ${target}`
    }

    server.route({
        method: 'GET',
        path: '/hello/{name?}',
        config: {
            handler: function(request, reply) {
                const message = getHello(request.params.name)
                return reply(message)
            },
            validate: {
                params: {
                    name: Joi.string()
                        .description('name of the addressee'),
                }
            },
            description: 'Greets the world',
            notes: 'Greets the world - developer notes',
            tags: ['api']
        }
    })

    return next()
}


exports.register.attributes = {
    name: 'Hello'
}
