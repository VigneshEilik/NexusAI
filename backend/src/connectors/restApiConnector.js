const BaseConnector = require('./baseConnector');
const axios = require('axios');
const logger = require('../config/logger');

/**
 * REST API Connector
 * Fetches data from any REST endpoint
 *
 * config.url            - The API endpoint URL
 * config.method         - HTTP method (GET, POST)
 * config.headers        - Custom headers (e.g. Authorization)
 * config.body           - Request body for POST
 * config.dataPath       - JSONPath-like dot notation to extract array from response (e.g. 'data.results')
 * config.pagination     - { type: 'offset'|'cursor', pageParam, limitParam, limit, cursorPath }
 */
class RestApiConnector extends BaseConnector {
    constructor(config) {
        super(config);
        this.url = config.url;
        this.method = (config.method || 'GET').toUpperCase();
        this.headers = config.headers || {};
        this.body = config.body || null;
        this.dataPath = config.dataPath || null;
        this.pagination = config.pagination || null;
        this.timeout = config.timeout || 30000;
    }

    async connect() {
        if (!this.url) {
            throw new Error('REST API url is required');
        }
        // Validate the URL format
        try {
            new URL(this.url);
        } catch {
            throw new Error(`Invalid URL: ${this.url}`);
        }
        logger.info(`RestApiConnector: Ready to fetch from ${this.url}`);
        return true;
    }

    async fetchData() {
        try {
            if (this.pagination) {
                return await this._fetchPaginated();
            }
            return await this._fetchSingle();
        } catch (error) {
            logger.error(`RestApiConnector fetchData error: ${error.message}`);
            throw new Error(`Failed to fetch REST API: ${error.message}`);
        }
    }

    async _fetchSingle() {
        const response = await axios({
            method: this.method,
            url: this.url,
            headers: this.headers,
            data: this.body,
            timeout: this.timeout,
        });
        return this._extractData(response.data);
    }

    async _fetchPaginated() {
        const allData = [];
        let page = 0;
        let cursor = null;
        const limit = this.pagination.limit || 100;
        const maxPages = 50; // Safety limit

        for (let i = 0; i < maxPages; i++) {
            const params = {};
            if (this.pagination.type === 'offset') {
                params[this.pagination.pageParam || 'offset'] = page * limit;
                params[this.pagination.limitParam || 'limit'] = limit;
            } else if (this.pagination.type === 'cursor' && cursor) {
                params[this.pagination.pageParam || 'cursor'] = cursor;
            }

            const response = await axios({
                method: this.method,
                url: this.url,
                headers: this.headers,
                data: this.body,
                params,
                timeout: this.timeout,
            });

            const pageData = this._extractData(response.data);
            if (!Array.isArray(pageData) || pageData.length === 0) break;

            allData.push(...pageData);

            if (this.pagination.type === 'cursor') {
                cursor = this._getNestedValue(response.data, this.pagination.cursorPath);
                if (!cursor) break;
            }

            if (pageData.length < limit) break;
            page++;
        }

        return allData;
    }

    /**
     * Extract nested data from response using dot-notation path
     */
    _extractData(responseData) {
        if (!this.dataPath) return responseData;
        return this._getNestedValue(responseData, this.dataPath) || [];
    }

    _getNestedValue(obj, path) {
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
    }

    async validate(data) {
        if (!Array.isArray(data)) {
            throw new Error('REST API response did not return an array. Set dataPath to point to the array field.');
        }
        if (data.length === 0) {
            throw new Error('REST API returned an empty dataset');
        }
        return true;
    }

    async transform(data) {
        // Flatten nested objects one level deep for tabular consistency
        return data.map(row => {
            const flat = {};
            for (const [key, value] of Object.entries(row)) {
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    for (const [nestedKey, nestedVal] of Object.entries(value)) {
                        flat[`${key}_${nestedKey}`] = nestedVal;
                    }
                } else {
                    flat[key] = value;
                }
            }
            return flat;
        });
    }
}

module.exports = RestApiConnector;
