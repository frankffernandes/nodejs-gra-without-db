const fs = require('fs')
const csv = require('csv-parser')

const csvHeaders = ['year', 'title', 'studios', 'producers', 'winner']

const validateCsv = async (filePath) => {
    let headersValidate = true
    let headersRows = true
    let headersYears = true
    
    const rows = []
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('headers', headers => {
                if (JSON.stringify(headers) !== JSON.stringify(csvHeaders)) {
                    console.log("validation - are NOT equal headers")
                    headersValidate = false
                    reject({})
                    return
                }
            })
            .on('data', row => {
                if (Object.keys(row).length != csvHeaders.length) {
                    headersRows = false
                    console.error("validation - row is NOT equals to headers")
                    reject({})
                    return
                }

                // parse year
                const year = parseInt(row['year'], 10)
                if (Number.isNaN(year)) {
                    // console.error("validation - year is wrong", year)
                    headersRows = false
                    headersYears = false
                    reject({})
                    return
                }
                
                rows.push(row)
            })
            .on('end', () => {
                fs.unlinkSync(filePath)

                if (headersValidate && headersRows && headersYears) {
                    resolve({ rows: rows})
                } else {
                    reject({})
                }
            })
            .on('error', () => {
                fs.unlinkSync(filePath)
                reject({})
            })
    })
}

module.exports = {
    csvHeaders,
    validateCsv
}
