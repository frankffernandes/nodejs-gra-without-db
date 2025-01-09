const fs = require('fs')
const path = require('path')

const { movieService } = require('../services/movie.service.js')
const movieValidation = require('../utils/movie.validation.js')

class MovieController {
    listMovies(request, response) {
        const items = movieService.getAllItems()
        let htmlString = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Lista de filmes</title>
    </head>
    <body>
        <h1>Lista de filmes</h1>`
    if (items.length == 0) {
        htmlString += `<p>No movies to show</p>`
    } else {
        htmlString += `<table border="1">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Year</th>
                    <th>Title</th>
                    <th>Studios</th>
                    <th>Producers</th>
                    <th>Winner</th>
                </tr>
            </thead>
            <tbody>`

        items.forEach(item => {
            htmlString += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.year}</td>
                    <td>${item.title}</td>
                    <td>${item.studios}</td>
                    <td>${item.producers}</td>
                    <td>${item.winner || 'no'}</td>
                </tr>`
        })
        htmlString += `
                </tbody>
            </table>`
    }
    htmlString += `
    </body>
</html`
        response.type('text/html').send(htmlString)
    }

    producers(request, response) {
        const items = movieService.getProducersWinningGap()
        response.status(200).send(items)
    }
    
    async upload(request, response) {
        const parts = request.parts()
        let rows = []
        let tempFilePath

        for await (const part of parts) {
            if (part.file) {
                tempFilePath = path.join(__dirname, 'upload.csv')
                const writeStream = fs.createWriteStream(tempFilePath)
                await part.file.pipe(writeStream)
            }
        }
        // console.log("tempFilePath:", tempFilePath)

        if ((tempFilePath) && (fs.existsSync(tempFilePath))) {
            try {
                const result = await movieValidation.validateCsv(tempFilePath)
                rows = result.rows
            } catch (error) {
                console.error("Error processing csv", error)
                response.status(500).send({ message: 'Error while processing the csv file.' })
                return
            }
            
            rows.forEach(row => {
                movieService.create(row)
            })
            response.status(200).send({ message: 'The csv was processed successfully' })
        } else {
            // console.warn("file doesn't exists")
            response.status(400).send({ message: 'No file was uploaded.' })
        }
    }

    find(request, response) {
        const itemId = request.params.id
        const movie = movieService.get(itemId)
        if (movie) {
            return response.status(200).send({ movie: movie })
        }
        return response.status(404).send({ message: "Movie not found." })
    }

    edit(request, response) {
        const id = request.params.id
        const { year, title, studios, producers, winner } = request.body
        const result = movieService.update(id, {
            year,
            title,
            studios,
            producers,
            winner
        })
        console.log("editing movie:", result)
        if (result) {
            return response.status(204).send()
        }
        return response.status(404).send({ message: "Movie not found." })
    }

    delete(request, response) {
        const itemId = request.params.id
        const result = movieService.delete(itemId)
        if (result) {
            return response.status(204).send()
        }
        return response.status(404).send({ message: "Movie not found." })
    }
}
  
module.exports = new MovieController()