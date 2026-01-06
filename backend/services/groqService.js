/**
 * Groq AI Service
 * Handles all AI-related operations using Groq API
 */

const Groq = require('groq-sdk');
const config = require('../config/config');

class GroqService {
    constructor() {
        this.client = new Groq({
            apiKey: config.GROQ_API_KEY
        });
    }

    /**
     * Generate comprehensive document summary
     * @param {string} documentText - Full document text
     * @returns {Promise<Object>} Analysis results
     */
    async analyzeDocument(documentText) {
        try {
            const prompt = `You are an expert document analyzer. Analyze the following document and provide:

1. **Executive Summary** (2-3 paragraphs): Comprehensive overview
2. **Key Points** (5-7 bullet points): Main takeaways
3. **Important Entities**: Names, dates, locations, organizations mentioned
4. **Sentiment**: Overall tone (Positive/Neutral/Negative)
5. **Action Items**: Any tasks, deadlines, or follow-ups mentioned
6. **Topics & Categories**: Main subjects discussed

Document Text:
${documentText.substring(0, 15000)} // Limit to avoid token overflow

Respond in valid JSON format with this structure:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "entities": {
    "people": ["..."],
    "organizations": ["..."],
    "dates": ["..."],
    "locations": ["..."]
  },
  "sentiment": "...",
  "actionItems": ["..."],
  "topics": ["..."],
  "wordCount": number,
  "readingTime": "X minutes"
}`;

            const completion = await this.client.chat.completions.create({
                model: config.GROQ_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert document analyzer. Always respond with valid JSON only, no additional text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3, // Lower for more consistent output
                max_tokens: 2000
            });

            const response = completion.choices[0].message.content;

            // Clean response and parse JSON
            const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            const analysis = JSON.parse(cleanedResponse);

            return {
                success: true,
                analysis
            };
        } catch (error) {
            console.error('Groq analysis error:', error);
            return {
                success: false,
                error: error.message || 'Failed to analyze document'
            };
        }
    }

    /**
     * Answer questions about the document
     * @param {string} documentText - Document content
     * @param {string} question - User's question
     * @param {Array} conversationHistory - Previous Q&A
     * @returns {Promise<string>} Answer
     */
    async answerQuestion(documentText, question, conversationHistory = []) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: `You are a helpful assistant that answers questions about documents. 
          Base your answers ONLY on the provided document content. 
          If the answer isn't in the document, say "I cannot find that information in the document."
          Be concise and accurate.`
                },
                {
                    role: 'user',
                    content: `Document Content:\n${documentText.substring(0, 10000)}\n\nQuestion: ${question}`
                }
            ];

            // Add conversation history for context
            if (conversationHistory.length > 0) {
                conversationHistory.forEach(item => {
                    messages.push(
                        { role: 'user', content: item.question },
                        { role: 'assistant', content: item.answer }
                    );
                });
                messages.push({ role: 'user', content: question });
            }

            const completion = await this.client.chat.completions.create({
                model: config.GROQ_MODEL,
                messages,
                temperature: 0.5,
                max_tokens: 500
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Question answering error:', error);
            throw new Error('Failed to answer question');
        }
    }

    /**
     * Generate a custom summary with specific focus
     * @param {string} documentText - Document content
     * @param {string} focusArea - What to focus on (e.g., "financial data", "technical details")
     * @returns {Promise<string>} Focused summary
     */
    async generateFocusedSummary(documentText, focusArea) {
        try {
            const completion = await this.client.chat.completions.create({
                model: config.GROQ_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert at creating focused, detailed summaries.'
                    },
                    {
                        role: 'user',
                        content: `Create a detailed summary focusing specifically on: ${focusArea}\n\nDocument:\n${documentText.substring(0, 12000)}`
                    }
                ],
                temperature: 0.4,
                max_tokens: 800
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Focused summary error:', error);
            throw new Error('Failed to generate focused summary');
        }
    }
}

module.exports = new GroqService();