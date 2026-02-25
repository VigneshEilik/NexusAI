/**
 * BaseConnector Class
 * Abstract interface for all data connectors (CSV, Google Sheets, SQL, REST, etc.)
 */
class BaseConnector {
    constructor(config = {}) {
        this.config = config;
    }

    /**
     * Establish connection to the data source
     * @returns {Promise<boolean>}
     */
    async connect() {
        throw new Error('Method connect() must be implemented');
    }

    /**
     * Fetch raw data from the source
     * @returns {Promise<any>}
     */
    async fetchData() {
        throw new Error('Method fetchData() must be implemented');
    }

    /**
     * Validate the structure and content of fetched data
     * @param {any} data 
     * @returns {Promise<boolean>}
     */
    async validate(data) {
        throw new Error('Method validate() must be implemented');
    }

    /**
     * Transform raw data into a standardized internal format
     * @param {any} data 
     * @returns {Promise<Array<Object>>}
     */
    async transform(data) {
        throw new Error('Method transform() must be implemented');
    }

    /**
     * Helper to execute the full pipeline for a connector
     */
    async execute() {
        try {
            await this.connect();
            const rawData = await this.fetchData();
            await this.validate(rawData);
            return await this.transform(rawData);
        } catch (error) {
            throw new Error(`Connector Execution Failed: ${error.message}`);
        }
    }
}

module.exports = BaseConnector;
