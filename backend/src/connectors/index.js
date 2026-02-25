const CsvConnector = require('./csvConnector');
const GoogleSheetsConnector = require('./googleSheetsConnector');
const RestApiConnector = require('./restApiConnector');
const logger = require('../config/logger');

/**
 * Connector Registry / Factory
 *
 * Central registry for all data connectors.
 * To add a new connector:
 *   1. Create a class extending BaseConnector in /connectors
 *   2. Register it here with connectorRegistry.register('type', ConnectorClass)
 *
 * This pattern allows 10+ connectors to be added without touching any other file.
 */
class ConnectorRegistry {
    constructor() {
        this._connectors = new Map();
        this._registerDefaults();
    }

    _registerDefaults() {
        this.register('csv', CsvConnector);
        this.register('google_sheets', GoogleSheetsConnector);
        this.register('rest_api', RestApiConnector);
    }

    /**
     * Register a new connector type
     * @param {string} type - Unique key (matches DataSource.type)
     * @param {typeof import('./baseConnector')} ConnectorClass
     */
    register(type, ConnectorClass) {
        if (this._connectors.has(type)) {
            logger.warn(`ConnectorRegistry: Overwriting existing connector type "${type}"`);
        }
        this._connectors.set(type, ConnectorClass);
        logger.info(`ConnectorRegistry: Registered connector "${type}"`);
    }

    /**
     * Create a connector instance by type
     * @param {string} type
     * @param {Object} config
     * @returns {import('./baseConnector')}
     */
    create(type, config) {
        const ConnectorClass = this._connectors.get(type);
        if (!ConnectorClass) {
            throw new Error(
                `Unsupported connector type: "${type}". Available types: ${this.listTypes().join(', ')}`
            );
        }
        return new ConnectorClass(config);
    }

    /**
     * List all registered connector types
     * @returns {string[]}
     */
    listTypes() {
        return Array.from(this._connectors.keys());
    }

    /**
     * Check if a connector type is registered
     * @param {string} type
     * @returns {boolean}
     */
    has(type) {
        return this._connectors.has(type);
    }
}

// Singleton — import once, use everywhere
module.exports = new ConnectorRegistry();
