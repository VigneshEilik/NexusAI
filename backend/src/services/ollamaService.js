const axios = require('axios');
const config = require('../config');
const logger = require('../config/logger');
const { cacheGet, cacheSet } = require('../config/redis');
const crypto = require('crypto');

class OllamaService {
    constructor() {
        this.baseUrl = config.ollama.baseUrl;
        this.model = config.ollama.model;
        this.timeout = config.ollama.timeout;
    }

    /**
     * Generate cache key from prompt
     */
    _getCacheKey(prompt, model) {
        const hash = crypto.createHash('md5').update(`${model}:${prompt}`).digest('hex');
        return `ollama:response:${hash}`;
    }

    /**
     * Send a chat completion request to Ollama
     */
    async chat(messages, options = {}) {
        const model = options.model || this.model;
        const lastMessage = messages[messages.length - 1]?.content || '';

        // Check Redis cache for repeated prompts
        const cacheKey = this._getCacheKey(lastMessage, model);
        const cached = await cacheGet(cacheKey);
        if (cached) {
            logger.info('AI response served from cache');
            return { ...cached, fromCache: true };
        }

        try {
            const response = await axios.post(
                `${this.baseUrl}/api/chat`,
                {
                    model,
                    messages: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    stream: false,
                    options: {
                        temperature: options.temperature || 0.7,
                        top_p: options.topP || 0.9,
                        num_predict: options.maxTokens || 2048,
                    },
                },
                {
                    timeout: this.timeout,
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const result = {
                content: response.data.message?.content || '',
                model: response.data.model,
                totalDuration: response.data.total_duration,
                promptEvalCount: response.data.prompt_eval_count,
                evalCount: response.data.eval_count,
            };

            // Cache the response in Redis (TTL: 1 hour)
            await cacheSet(cacheKey, result, 3600);

            return result;
        } catch (error) {
            logger.error('Ollama API error:', error.message);

            if (error.code === 'ECONNREFUSED') {
                throw new Error('AI service is currently unavailable. Please try again later.');
            }

            throw new Error(`AI service error: ${error.message}`);
        }
    }

    /**
     * Generate embeddings
     */
    async generateEmbeddings(text, model) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/api/embeddings`,
                {
                    model: model || this.model,
                    prompt: text,
                },
                { timeout: this.timeout }
            );
            return response.data.embedding;
        } catch (error) {
            logger.error('Ollama embeddings error:', error.message);
            throw new Error('Failed to generate embeddings');
        }
    }

    /**
     * Check if Ollama is healthy
     */
    async healthCheck() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 5000 });
            return {
                status: 'healthy',
                models: response.data.models?.map((m) => m.name) || [],
            };
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }

    /**
     * Analyze CSV data with AI
     */
    async analyzeData(csvSummary, question) {
        const prompt = `You are a data analyst. Analyze the following dataset summary and provide insights.

Dataset Summary:
${csvSummary}

${question ? `Specific Question: ${question}` : 'Provide a comprehensive analysis with key insights, trends, and recommendations.'}

Respond in a structured format with:
1. Summary
2. Key Findings
3. Recommendations
4. Suggested Visualizations`;

        return this.chat([{ role: 'user', content: prompt }]);
    }
}

module.exports = new OllamaService();
