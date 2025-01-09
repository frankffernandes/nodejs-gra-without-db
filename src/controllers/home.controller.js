const { PORT } = require('../utils/constants.js')

class HomeController {
    index(request, response) {
        const htmlString = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Upload filmes CSV</title>
    </head>
    <body>
        <h1>Faça o upload dos filmes em csv</h1>
        <form id="csvForm" action="http://localhost:${PORT}/upload-movies" method="post" enctype="multipart/form-data">
            <label for="csvFile">Choose a CSV file:</label>
            <input type="file" id="csvFile" name="file" accept=".csv" required>
            <button type="submit">Upload</button>
        </form>
    </body>
</html>`
        response.type('text/html').send(htmlString)
    }
}
  
module.exports = new HomeController()