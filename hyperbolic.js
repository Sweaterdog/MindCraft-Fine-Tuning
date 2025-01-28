// hyperbolic.js
import { getKey } from '../utils/keys.js';
import { log } from '../../logger.js';

export class hyperbolic {
    constructor(modelName, apiUrl) {
        // Default model name
        this.modelName = modelName || "deepseek-ai/DeepSeek-V3";
        // Default endpoint URL
        this.apiUrl = apiUrl || "https://api.hyperbolic.xyz/v1/chat/completions";

        // Retrieve the Hyperbolic API key from keys.js
        this.apiKey = getKey('HYPERBOLIC_API_KEY');
        if (!this.apiKey) {
            throw new Error('HYPERBOLIC_API_KEY not found. Check your keys.js file.');
        }
    }

    /**
     * Sends a chat completion request to the Hyperbolic endpoint.
     *
     * @param {Array} turns - Array of message objects, e.g. [{role: 'user', content: 'Hi'}].
     * @param {string} systemMessage - The system prompt or instruction.
     * @param {string} stopSeq - A string that represents a stopping sequence, default '***'.
     * @returns {Promise<string>} - The content of the model's reply.
     */
    async sendRequest(turns, systemMessage, stopSeq = '***') {
        // We'll do a maximum of 3 attempts if the model name includes 'deepseek-r1'
        // and we detect a partial <think> mismatch.
        const maxAttempts = 5;
        let attempt = 0;
        let finalResponse = null;

        while (attempt < maxAttempts) {
            attempt++;
            console.log(`Hyperbolic attempt ${attempt} of ${maxAttempts}...`);

            // Make a single request
            let completionContent = await this._singleRequest(turns, systemMessage, stopSeq);

            // If the request returned "My brain disconnected..." or there's no content, just keep it.
            if (!completionContent) {
                finalResponse = completionContent || 'My brain disconnected, try again.';
                break;
            }

            // Check if modelName includes 'deepseek-r1' (case-insensitive)
            if (this.modelName.toLowerCase().includes("deepseek-r1")) {
                // Check for <think> tag mismatch
                const hasOpenTag = completionContent.includes("<think>");
                const hasCloseTag = completionContent.includes("</think>");

                // If there's a partial mismatch (<think> without </think> or vice versa),
                // we retry the entire request to see if we can get a properly balanced response.
                if ((hasOpenTag && !hasCloseTag) || (!hasOpenTag && hasCloseTag)) {
                    console.warn("Partial <think> block detected. Re-generating Hyperbolic request...");
                    // Continue the loop, which calls _singleRequest again
                    continue;
                }
                // If both tags appear (or neither appears), we do nothing—
                // user wants to keep <think> in the final response.
            }

            // We have a suitable final response
            finalResponse = completionContent;
            break;
        }

        // If finalResponse is still null after all attempts, use a fallback
        if (finalResponse == null) {
            console.warn("Could not obtain a valid response after partial <think> retries.");
            finalResponse = 'Response incomplete, please try again.';
        }

        return finalResponse;
    }

    /**
     * Embeddings are not supported by Hyperbolic.
     */
    async embed(text) {
        throw new Error('Embeddings are not supported by Hyperbolic.');
    }

    /**
     * Internal helper method that makes a single request (without partial mismatch retries).
     * We do keep the context-length fallback from your original snippet.
     */
    async _singleRequest(turns, systemMessage, stopSeq) {
        // Prepare the messages with a system prompt at the beginning
        const messages = [{ role: 'system', content: systemMessage }, ...turns];

        // Build the request payload
        const payload = {
            model: this.modelName,
            messages: messages,
            max_tokens: 8192,
            temperature: 0.7,
            top_p: 0.9,
            stream: false
        };

        let completionContent = null;
        try {
            console.log('Awaiting Hyperbolic API response...');

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (
                data?.choices?.[0]?.finish_reason &&
                data.choices[0].finish_reason === 'length'
            ) {
                throw new Error('Context length exceeded');
            }

            completionContent = data?.choices?.[0]?.message?.content || '';
            console.log('Received response from Hyperbolic.');

            // Logging: Only log if content doesn't contain "Error:" or "exception:"
            if (!completionContent.includes("Error:") && !completionContent.includes("exception:")) {
                log(JSON.stringify(messages), completionContent);
            } else {
                console.warn(`Not logging due to potential error in model response: ${completionContent}`);
            }

        } catch (err) {
            // If context length is exceeded, remove one turn and try again
            if (
                (err.message === 'Context length exceeded' ||
                 err.code === 'context_length_exceeded') &&
                turns.length > 1
            ) {
                console.log('Context length exceeded, trying again with a shorter context...');
                // Recursively call _singleRequest with one fewer user turn
                return await this._singleRequest(turns.slice(1), systemMessage, stopSeq);
            } else {
                console.error(err);
                // Return an error placeholder that the outer loop may use
                completionContent = 'My brain disconnected, try again.';
            }
        }

        // Replace any special tokens from your original code if needed
        // For example, if you had <|separator|> tokens, you can transform them here:
        completionContent = completionContent.replace(/<\|separator\|>/g, '*no response*');

        return completionContent;
    }
}