import OpenAI from 'openai';
import { ClaudeService } from './claudeService';

// API Keys
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

// Available models
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic'
};

export const AVAILABLE_MODELS = {
  [AI_PROVIDERS.OPENAI]: [
    { id: 'o1-preview', name: 'o1-preview', description: 'Most capable reasoning model for complex problems', isO1: true },
    { id: 'o1-mini', name: 'o1-mini', description: 'Faster reasoning model for coding and math', isO1: true },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable multimodal flagship model', isO1: false },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Affordable, intelligent small model', isO1: false },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Previous generation flagship model', isO1: false },
    { id: 'gpt-4', name: 'GPT-4', description: 'Previous generation flagship model', isO1: false },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast, affordable model', isO1: false }
  ],
  [AI_PROVIDERS.ANTHROPIC]: [
    { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus', description: 'Most capable and intelligent model yet' },
    { id: 'claude-sonnet-4-20250514', name: 'Claude 4 Sonnet', description: 'High-performance model with exceptional reasoning' },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Most intelligent model (legacy)' },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Fastest model (legacy)' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Powerful model for highly complex tasks (legacy)' }
  ]
};

// Initialize clients
const openaiClient = OPENAI_API_KEY ? new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
}) : null;

// AI Service
export class AIService {
  static async generateCompletion(provider, model, systemPrompt, userPrompt) {
    try {
      if (provider === AI_PROVIDERS.OPENAI) {
        return await this.callOpenAI(model, systemPrompt, userPrompt);
      } else if (provider === AI_PROVIDERS.ANTHROPIC) {
        // Use alternative Claude service
        return await ClaudeService.generateCompletion(model, systemPrompt, userPrompt);
      } else {
        throw new Error('Unsupported AI provider');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  static async callOpenAI(model, systemPrompt, userPrompt) {
    if (!openaiClient) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Check if this is an o1 model
      const modelInfo = AVAILABLE_MODELS[AI_PROVIDERS.OPENAI].find(m => m.id === model);
      const isO1Model = modelInfo?.isO1 || false;

      if (isO1Model) {
        // o1 models don't support system messages, combine into user message
        const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;
        
        const completion = await openaiClient.chat.completions.create({
          model: model,
          messages: [
            {
              role: "user",
              content: combinedPrompt
            }
          ],
          max_completion_tokens: 1000,
          temperature: 1, // o1 models use temperature 1
        });

        return completion.choices[0].message.content;
      } else {
        // Regular models support system messages
        const completion = await openaiClient.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        });

        return completion.choices[0].message.content;
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  static getAvailableProviders() {
    const providers = [];
    if (OPENAI_API_KEY) providers.push(AI_PROVIDERS.OPENAI);
    if (ANTHROPIC_API_KEY) providers.push(AI_PROVIDERS.ANTHROPIC);
    return providers;
  }

  static isProviderAvailable(provider) {
    return this.getAvailableProviders().includes(provider);
  }

  static getAvailableModels(provider) {
    return AVAILABLE_MODELS[provider] || [];
  }
} 