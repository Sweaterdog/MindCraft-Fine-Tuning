import Anthropic from '@anthropic-ai/sdk';
import { strictFormat } from '../utils/text.js';
import { getKey } from '../utils/keys.js';
import { log } from '../../logger.js';

export class Claude {
    constructor(model_name, url) {
        this.model_name = model_name;

        let config = {};
        if (url)
            config.baseURL = url;

        config.apiKey = getKey('ANTHROPIC_API_KEY');

        this.anthropic = new Anthropic(config);
    }

    async sendRequest(turns, systemMessage) {
        const messages = strictFormat(turns);
        let res = null;
        try {
            console.log('Awaiting anthropic api response...');
            const resp = await this.anthropic.messages.create({
                model: this.model_name || "claude-3-5-sonnet-20241022",
                system: systemMessage,
                max_tokens: 8192,
                messages: messages,
            });
            console.log('Received.')
            res = resp.content[0].text;

             // Log the prompt and response after successful retrieval and before returning
            if (!res.includes("Error:") && !res.includes("exception:")) {
                const systemMessageContent = systemMessage.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                const messagesContent = JSON.stringify(messages).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                const loggedMessage = `[{"role":"user","content":" ${systemMessageContent} "}],${messagesContent}`;
                log(loggedMessage, res);
            }
              else
                 console.warn(`Not logging due to potential error in model response: ${res}`);

        }
        catch (err) {
            console.log(err);
            res = 'My brain disconnected, try again.';
        }
        return res;
    }

    async embed(text) {
        throw new Error('Embeddings are not supported by Claude.');
    }
}