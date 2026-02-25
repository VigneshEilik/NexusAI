const { createClient } = require('redis');
const config = require('./index');
const logger = require('./logger');

let redisClient = null;

const connectRedis = async () => {
    if (!config.redis.enabled) {
        logger.info('Redis is disabled (set REDIS_ENABLED=true in .env to enable)');
        return null;
    }

    try {
        redisClient = createClient({
            socket: {
                host: config.redis.host,
                port: config.redis.port,
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        logger.error('Redis: Max reconnection attempts reached');
                        return new Error('Max reconnection attempts reached');
                    }
                    return Math.min(retries * 100, 3000);
                },
            },
            password: config.redis.password || undefined,
        });

        redisClient.on('error', (err) => {
            logger.error('Redis Client Error:', err.message);
        });

        redisClient.on('connect', () => {
            logger.info('Redis client connected');
        });

        redisClient.on('reconnecting', () => {
            logger.warn('Redis client reconnecting...');
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        logger.error('Redis connection failed:', error.message);
        logger.warn('Application will continue without Redis caching');
        return null;
    }
};

const getRedisClient = () => redisClient;

const cacheGet = async (key) => {
    try {
        if (!redisClient || !redisClient.isOpen) return null;
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error('Redis GET error:', error.message);
        return null;
    }
};

const cacheSet = async (key, value, ttl = config.redis.ttl) => {
    try {
        if (!redisClient || !redisClient.isOpen) return;
        await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
        logger.error('Redis SET error:', error.message);
    }
};

const cacheDel = async (key) => {
    try {
        if (!redisClient || !redisClient.isOpen) return;
        await redisClient.del(key);
    } catch (error) {
        logger.error('Redis DEL error:', error.message);
    }
};

const cacheFlush = async () => {
    try {
        if (!redisClient || !redisClient.isOpen) return;
        await redisClient.flushAll();
    } catch (error) {
        logger.error('Redis FLUSH error:', error.message);
    }
};

module.exports = {
    connectRedis,
    getRedisClient,
    cacheGet,
    cacheSet,
    cacheDel,
    cacheFlush,
};
