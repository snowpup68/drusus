'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Blipp = require('blipp')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('package')
const HapiLevel = require('hapi-level')


const Hello = require('./hello')
const UserStore = require('./user-store')

const server = new Hapi.Server()
server.connection({
    port: 1729,
    host: 'localhost'
})

server.register([
    Inert,
    Blipp,
    Vision,
    {
        register: Hello,
        options: {}
    },
    {
        register: HapiLevel,
        options: {
            config: { valueEncoding: 'json'}
        }
    },
    UserStore,
    {
        register: HapiSwagger,
        options: {
            info: {
                title: 'Test API Documentation',
                version: Pack.version
            }
        }
    }], (err) => {
    server.start((err) => {
        if (err) {
            throw err
        }
        console.log(`Server running at ${server.info.uri}`)
    })
})
