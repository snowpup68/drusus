const Hapi   = require('hapi')
const Cookie = require('hapi-auth-cookie')
const Bell   = require('bell')
const Blipp  = require('blipp')
const routes = require('./routes')
const server = new Hapi.Server()

server.connection({ port: 1337 })
server.register([
    Cookie,
    Bell,
    { register: Blipp, options: { showAuth: true } }
    ], (err) => {
        server.auth.strategy(
            'session',
            'cookie',
            {
                cookie: 'example',
                password: 'password',
                isSecure: false,
                redirectTo: '/login',
                redirectOnTry: false
            }
        )
        server.auth.default('session')
        server.route(routes)
        server.start(() => {})
    }
)

module.exports = server
