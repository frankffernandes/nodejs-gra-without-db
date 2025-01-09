
const HomeController = require('../controllers/home.controller.js')
const MovieController = require('../controllers/movie.controller.js')

async function routes(server, options) {
    // GET / - Get the initial form to upload movies from csv file
    server.get('/', HomeController.index)

    // GET /movies - Get all movies from the model and return as a html table
    server.get('/movies', MovieController.listMovies)

    // POST /upload-movies - Create new movies from the csv uploaded
    server.post('/upload-movies', MovieController.upload)

    // GET /movies/:id - Get a single movie by ID
    server.get('/movies/:id', MovieController.find)

    // PUT /movies/:id - Update a single movie by ID
    server.put('/movies/:id', MovieController.edit)

    // DELETE /movies/:id - Delete a movie by ID
    server.delete('/movies/:id', MovieController.delete)

    // GET /producers - Get custom gap producers
    server.get('/producers', MovieController.producers)
}

module.exports = routes