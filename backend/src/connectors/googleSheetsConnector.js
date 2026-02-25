const BaseConnector = require('./baseConnector');
const axios = require('axios');
const logger = require('../config/logger');

/**
 * Google Sheets Connector
 * Fetches data from a public or OAuth-authenticated Google Sheet
 *
 * config.spreadsheetId  - The ID from the Google Sheets URL
 * config.range          - e.g. 'Sheet1!A1:Z1000'
 * config.apiKey         - For public sheets (simple API key)
 * config.accessToken    - For private sheets (OAuth2 token)
 */
class GoogleSheetsConnector extends BaseConnector {
    constructor(config) {
        super(config);
        this.spreadsheetId = config.spreadsheetId;
        this.range = config.range || 'Sheet1';
        this.apiKey = config.apiKey;
        this.accessToken = config.accessToken;
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    }

    async connect() {
        if (!this.spreadsheetId) {
            throw new Error('Google Sheets spreadsheetId is required');
        }
        if (!this.apiKey && !this.accessToken) {
            throw new Error('Either apiKey or accessToken is required for Google Sheets');
        }
        logger.info(`GoogleSheetsConnector: Connecting to spreadsheet ${this.spreadsheetId}`);
        return true;
    }

    async fetchData() {
        try {
            const url = `${this.baseUrl}/${this.spreadsheetId}/values/${encodeURIComponent(this.range)}`;
            const params = {};
            const headers = { 'Content-Type': 'application/json' };

            if (this.apiKey) {
                params.key = this.apiKey;
            }
            if (this.accessToken) {
                headers['Authorization'] = `Bearer ${this.accessToken}`;
            }

            const response = await axios.get(url, { params, headers, timeout: 30000 });
            return response.data.values || [];
        } catch (error) {
            logger.error(`GoogleSheetsConnector fetchData error: ${error.message}`);
            throw new Error(`Failed to fetch Google Sheet: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async validate(data) {
        if (!Array.isArray(data) || data.length < 2) {
            throw new Error('Google Sheet is empty or has no data rows (needs header + at least 1 row)');
        }
        return true;
    }

    /**
     * Transform Google Sheets 2D array into array of objects
     * First row is treated as headers
     */
    async transform(data) {
        const [headers, ...rows] = data;
        const cleanHeaders = headers.map(h => h.trim());

        return rows.map(row => {
            const obj = {};
            cleanHeaders.forEach((header, i) => {
                obj[header] = row[i] !== undefined ? row[i] : null;
            });
            return obj;
        });
    }
}

module.exports = GoogleSheetsConnector;
