const logger = require('../config/logger');

/**
 * AI Insight Service
 *
 * Pre-processes raw tabular data into a structured JSON payload
 * optimised for LLM consumption. Extracts KPIs, detects trends,
 * and flags anomalies BEFORE sending to Ollama — keeping token
 * usage low and response quality high.
 */
class AiInsightService {

    // ──────────────────────────────────────────────
    //  PUBLIC API
    // ──────────────────────────────────────────────

    /**
     * Build a complete insight payload from raw rows
     * @param {Array<Object>} rows  - Array of flat data objects
     * @param {Object} options      - { question, maxSampleRows }
     * @returns {{ kpis, trends, anomalies, columns, rowCount }}
     */
    buildInsightPayload(rows, options = {}) {
        if (!rows || rows.length === 0) return null;

        const columns = Object.keys(rows[0]);
        const columnMeta = this._classifyColumns(rows, columns);
        const kpis = this._extractKPIs(rows, columnMeta);
        const trends = this._detectTrends(rows, columnMeta);
        const anomalies = this._detectAnomalies(rows, columnMeta);

        return {
            rowCount: rows.length,
            columnCount: columns.length,
            columns: columnMeta,
            kpis,
            trends,
            anomalies,
            sampleRows: rows.slice(0, options.maxSampleRows || 5),
        };
    }

    /**
     * Build a structured prompt for the LLM from the payload
     */
    buildPrompt(payload, question) {
        const sections = [];

        sections.push(`## Dataset Overview\n- Rows: ${payload.rowCount}\n- Columns: ${payload.columnCount}`);

        sections.push(`## KPIs\n${JSON.stringify(payload.kpis, null, 2)}`);

        if (payload.trends.length > 0) {
            sections.push(`## Detected Trends\n${payload.trends.map(t => `- ${t.column}: ${t.direction} (slope: ${t.slope.toFixed(4)})`).join('\n')}`);
        }

        if (payload.anomalies.length > 0) {
            sections.push(`## Anomalies Detected\n${payload.anomalies.map(a => `- ${a.column} row ${a.rowIndex}: value ${a.value} (z-score: ${a.zScore.toFixed(2)})`).join('\n')}`);
        }

        sections.push(`## Sample Data\n\`\`\`json\n${JSON.stringify(payload.sampleRows, null, 2)}\n\`\`\``);

        const systemContext = sections.join('\n\n');

        const userQuestion = question
            ? `User Question: ${question}`
            : 'Provide a comprehensive analysis with key insights, trends, and actionable recommendations.';

        return {
            system: `You are a senior data analyst. Analyze the structured dataset summary below and respond STRICTLY in JSON with keys: summary, key_findings (array), recommendations (array), suggested_charts (array of {type, title, x_axis, y_axis}).`,
            user: `${systemContext}\n\n${userQuestion}`,
        };
    }

    // ──────────────────────────────────────────────
    //  INTERNAL HELPERS
    // ──────────────────────────────────────────────

    /**
     * Classify each column as numeric, date, or categorical
     */
    _classifyColumns(rows, columns) {
        return columns.map(col => {
            const values = rows.map(r => r[col]).filter(v => v !== undefined && v !== null && v !== '');
            const numericValues = values.map(Number).filter(n => !isNaN(n));
            const isNumeric = numericValues.length > values.length * 0.6;

            // Simple date detection (ISO, MM/DD/YYYY, etc.)
            const dateCount = values.filter(v => !isNaN(Date.parse(v))).length;
            const isDate = dateCount > values.length * 0.6 && !isNumeric;

            return {
                name: col,
                type: isNumeric ? 'numeric' : isDate ? 'date' : 'categorical',
                nonNull: values.length,
                uniqueCount: new Set(values).size,
                nullCount: rows.length - values.length,
            };
        });
    }

    /**
     * Extract KPIs for numeric and categorical columns
     */
    _extractKPIs(rows, columnMeta) {
        const kpis = {};
        for (const col of columnMeta) {
            const values = rows.map(r => r[col.name]).filter(v => v !== undefined && v !== null && v !== '');

            if (col.type === 'numeric') {
                const nums = values.map(Number).filter(n => !isNaN(n));
                if (nums.length === 0) continue;
                nums.sort((a, b) => a - b);
                const sum = nums.reduce((a, b) => a + b, 0);
                kpis[col.name] = {
                    min: nums[0],
                    max: nums[nums.length - 1],
                    avg: +(sum / nums.length).toFixed(2),
                    median: nums.length % 2 === 0
                        ? +((nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2).toFixed(2)
                        : nums[Math.floor(nums.length / 2)],
                    sum: +sum.toFixed(2),
                    stdDev: +this._stdDev(nums).toFixed(2),
                };
            } else {
                // Top 5 values by frequency
                const freq = {};
                values.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
                const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
                kpis[col.name] = {
                    uniqueCount: col.uniqueCount,
                    topValues: sorted.map(([value, count]) => ({ value, count })),
                };
            }
        }
        return kpis;
    }

    /**
     * Detect linear trends in numeric columns using simple linear regression
     */
    _detectTrends(rows, columnMeta) {
        const trends = [];
        const numericCols = columnMeta.filter(c => c.type === 'numeric');

        for (const col of numericCols) {
            const values = rows.map((r, i) => ({ x: i, y: Number(r[col.name]) })).filter(v => !isNaN(v.y));
            if (values.length < 5) continue;

            const n = values.length;
            const sumX = values.reduce((s, v) => s + v.x, 0);
            const sumY = values.reduce((s, v) => s + v.y, 0);
            const sumXY = values.reduce((s, v) => s + v.x * v.y, 0);
            const sumX2 = values.reduce((s, v) => s + v.x * v.x, 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

            // Only report meaningful trends (normalized slope > threshold)
            const avgY = sumY / n;
            if (avgY === 0) continue;
            const normalizedSlope = Math.abs(slope / avgY);

            if (normalizedSlope > 0.005) {
                trends.push({
                    column: col.name,
                    direction: slope > 0 ? 'increasing' : 'decreasing',
                    slope,
                    normalizedSlope: +normalizedSlope.toFixed(4),
                });
            }
        }

        return trends;
    }

    /**
     * Detect anomalies using Z-score (|z| > 2.5)
     */
    _detectAnomalies(rows, columnMeta) {
        const anomalies = [];
        const numericCols = columnMeta.filter(c => c.type === 'numeric');

        for (const col of numericCols) {
            const nums = rows.map((r, i) => ({ idx: i, val: Number(r[col.name]) })).filter(v => !isNaN(v.val));
            if (nums.length < 10) continue;

            const vals = nums.map(n => n.val);
            const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
            const std = this._stdDev(vals);
            if (std === 0) continue;

            for (const n of nums) {
                const z = (n.val - mean) / std;
                if (Math.abs(z) > 2.5) {
                    anomalies.push({
                        column: col.name,
                        rowIndex: n.idx,
                        value: n.val,
                        zScore: z,
                    });
                }
            }
        }

        // Cap at 20 most extreme anomalies
        return anomalies.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore)).slice(0, 20);
    }

    _stdDev(arr) {
        const n = arr.length;
        if (n === 0) return 0;
        const mean = arr.reduce((a, b) => a + b, 0) / n;
        return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
    }
}

module.exports = new AiInsightService();
