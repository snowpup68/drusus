const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('package')

const server = new Hapi.Server()
server.connection({
    port: 1729,
    host: 'localhost'
})

server.register([
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: {
            info: {
                title: 'Test API Documentation',
                version: Pack.version
            }
        }
    }], (err) => {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply) {
                return reply('Hello World.\n')
            },
            description: 'Greets the world - description',
            notes: 'Greets the world - notes',
            tags: ['api']
        }
    })

    server.start((err) => {
        if (err) {
            throw err
        }
        console.log(`Server running at ${server.info.uri}`)
    })
})


