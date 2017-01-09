module.exports = [
    {
        method: 'GET',
        path: '/login',
        config: {
            auth: {
                mode: 'try'
            },
            handler: (request, reply) => {
                if (request.auth.isAuthenticated ===true) {
                    return reply.redirect('/private')
                }

                let loginForm = `
                    <form method ="post" action = "/login">
                        Username: <input type="text" name="username" />
                        <br>
                        Password: <input type="password" name="password" />
                        <br>
                        <input type="submit" value="login" />
                    </form>
                `

                if (request.query.login ==='failed') {
                    loginForm += `<h3>Previous login attempt failed</h3>`
                }

                return reply(loginForm)
            }
        }
    },
    {
        method: 'POST',
        path: '/login',
        config: {
            auth: {
                mode: 'try'
            },
            handler: (request, reply) => {
                if (request.payload.username !== 'admin' || request.payload.password !== 'password') {
                    request.auth.session.clear()
                    return reply.redirect('/login?login=failed')
                }

                request.auth.session.clear()
                request.auth.session.set({
                    username: request.payload.username,
                    lastLogin: new Date()
                })

                return reply.redirect('/private')
            }
        },
    },
    {
        method: 'GET',
        path: '/public',
        config: {
            handler: (request, reply) => {
                return reply(request.auth)
            }
        }
    },
    {
        method: 'GET',
        path: '/private',
        config: {
            handler: (request, reply) => {
                return reply(request.auth)
            }
        }
    }
]