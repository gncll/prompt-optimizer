import { AIService } from '../services/aiService';

export const zeroShotTechnique = {
  name: 'Zero-shot',
  description: 'Direct instruction without examples',
  
  generatePrompt: (userPrompt) => {
    return `Task: ${userPrompt}

Please provide a clear and accurate response based on the instruction above.`;
  },

  async optimizeWithAI(userPrompt, provider, model, feedback = {}) {
    let systemPrompt = `You are an expert prompt engineer. Your task is to optimize prompts using the Zero-shot technique.

Zero-shot prompting means giving direct, clear instructions without providing examples. The key is to:
1. Be specific and clear about what you want
2. Include context when necessary
3. Specify the desired output format
4. Use imperative language`;

    // Add feedback if provided
    if (feedback.positiveExamples && feedback.positiveExamples.trim()) {
      systemPrompt += `

POSITIVE OUTPUT GUIDANCE:
The optimized prompt should encourage outputs that are:
${feedback.positiveExamples}`;
    }

    if (feedback.negativeExamples && feedback.negativeExamples.trim()) {
      systemPrompt += `

NEGATIVE OUTPUT GUIDANCE:
The optimized prompt should discourage outputs that are:
${feedback.negativeExamples}`;
    }

    systemPrompt += `

Optimize the following prompt using zero-shot technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 