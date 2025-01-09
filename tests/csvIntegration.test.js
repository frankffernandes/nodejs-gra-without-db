const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const movieValidation = require('../src/utils/movie.validation.js')

describe('Integration Tests - Movies CSV format', () => {
    const csvFilePath = path.join(__dirname, './valid_values.csv')

    test('File exists', () => {
        expect(fs.existsSync(csvFilePath)).toBe(true)
    })

    test('CSV headers are correct', done => {
        const fileStream = fs.createReadStream(csvFilePath)
        fileStream
            .pipe(csv({ separator: ';' }))
            .on('headers', headers => {
                expect(headers).toEqual(movieValidation.csvHeaders)
                done()
            })
            .on('error', error => {
                done(error)
            })
    })

    test('All rows have the correct number of columns', done => {
        const fileStream = fs.createReadStream(csvFilePath)
        const rows = []
        fileStream
            .pipe(csv({ separator: ';' }))
            .on('data', row => {
                expect(Object.keys(row).length).toBe(movieValidation.csvHeaders.length)
                rows.push(row)
            })
            .on('end', () => {
                expect(rows.length).toBeGreaterThan(0)
                done()
            })
            .on('error', error => {
                done(error)
            })
    })

    test('Year is a valid number in all rows', done => {
        const fileStream = fs.createReadStream(csvFilePath)
        fileStream
            .pipe(csv({ separator: ';' }))
            .on('data', row => {
                const year = parseInt(row['year'], 10)
                expect(Number.isNaN(year)).toBe(false)
                expect(year).toBeGreaterThan(1900)
                expect(year).toBeLessThan(new Date().getFullYear() + 1)
            })
            .on('end', () => {
                done()
            })
            .on('error', error => {
                done(error)
            })
    })
})
