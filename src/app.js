const fastify = require('fastify')
const fastifyMultipart = require('@fastify/multipart')

const { PORT, DEBUG } = require('./utils/constants.js')
const routes = require("./routes/routes.js")

const app = fastify({ logger: DEBUG })
app.register(fastifyMultipart)
app.register(routes)

app.listen({ port: PORT }, (error) => {
  if (error) {
    console.error('Error starting server:', error)
    // process.exit(1)
  }
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app