const BaseConnector = require('./baseConnector');
const csv = require('csv-parser');
const { Readable } = require('stream');

class CsvConnector extends BaseConnector {
    /**
     * @param {Object} config
     * @param {Buffer|String} config.data - The CSV data
     * @param {Object} config.options - CSV parser options
     */
    constructor(config) {
        super(config);
        this.data = config.data;
        this.options = config.options || {};
    }

    async connect() {
        if (!this.data) {
            throw new Error('No CSV data provided');
        }
        return true;
    }

    async fetchData() {
        const results = [];
        const stream = Readable.from(this.data.toString());

        return new Promise((resolve, reject) => {
            stream
                .pipe(csv(this.options))
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    async validate(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid or empty CSV data');
        }
        return true;
    }

    async transform(data) {
        // Here you can implement standardized mapping
        // For now, return as is (clean objects)
        return data.map(row => {
            const cleanRow = {};
            for (let key in row) {
                cleanRow[key.trim()] = row[key];
            }
            return cleanRow;
        });
    }
}

module.exports = CsvConnector;
