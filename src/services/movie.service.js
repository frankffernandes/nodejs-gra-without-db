const crypto = require('node:crypto')

class MovieService {
    #items = new Map()

    getAllItems() {    
        return Array.from(this.#items.entries())
            .map((items) => {
                const id = items[0]
                const data = items[1]
                return {
                    id,
                    ...data
                }
            })
    }

    getProducersWinningGap() {
        const items = this.getAllWinningMovies()
        const producerYears = {}
    
        items.forEach(movie => {
            const producers = movie.producers.split(", ")
            producers.forEach(producer => {
                if (!producerYears[producer]) {
                    producerYears[producer] = []
                }
                producerYears[producer].push(parseInt(movie.year, 10))
            })
        })
    
        let smallestGapProducer = null
        let smallestGap = Infinity
        let smallestGapYears = null

        let largestGapProducer = null
        let largestGap = -Infinity
        let largestGapYears = null
    
        for (const producer in producerYears) {
            const years = producerYears[producer].sort((a, b) => a - b)
            if (years.length > 1) {
                // console.log("years:", years, producer)
                for (let i = 1; i < years.length; i++) {
                    const minGap = years[i] - years[i - 1]

                    // for the min gap
                    if (minGap < smallestGap) {
                        smallestGap = minGap
                        smallestGapProducer = producer
                        smallestGapYears = years
                    }

                    // for the max gap
                    const maxGap = years[years.length - 1] - years[0]
                    if (maxGap > largestGap) {
                        largestGap = maxGap
                        largestGapProducer = producer
                        largestGapYears = years
                    }
                }
            }
        }

        return {
            min: (smallestGapProducer && smallestGap > 0) ? { producer: smallestGapProducer, interval: smallestGap, previousWin: smallestGapYears[0], followingWin: smallestGapYears[1] } : null,
            max: (largestGapProducer && largestGap > 0) ? { producer: largestGapProducer, interval: largestGap, previousWin: largestGapYears[0], followingWin: largestGapYears[1] } : null,
        }
    }

    getAllWinningMovies() {
        return this.getAllItems()
            .filter(item => {
                return item.winner == 'yes'
            })
    }

    create(item) {
        const itemId = crypto.randomUUID()
        this.#items.set(itemId, item)
    }

    get(id) {
        return this.#items.get(id)
    }

    update(id, newItem) {
        const item = this.get(id)
        if (item) {
            this.#items.set(id, newItem)
            return true
        }
        return false
    }

    delete(id) {
        return this.#items.delete(id)
    }
}

const movieService = new MovieService()

module.exports = { movieService }