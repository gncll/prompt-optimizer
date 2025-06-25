import { AIService } from '../services/aiService';

export const fewShotTechnique = {
  name: 'Few-shot',
  description: 'Learning from examples',
  
  generatePrompt: (userPrompt) => {
    return `Task: ${userPrompt}

Here are some examples to guide your response:

Example 1:
Input: [Example input]
Output: [Example output]

Example 2:
Input: [Example input]
Output: [Example output]

Now, please provide your response:`;
  },

  async optimizeWithAI(userPrompt, provider, model, feedback = {}) {
    let systemPrompt = `You are an expert prompt engineer. Your task is to optimize prompts using the Few-shot technique.

Few-shot prompting means providing a few examples to demonstrate the desired behavior. The key is to:
1. Provide 2-3 relevant examples
2. Show clear input-output patterns
3. Use diverse but representative examples
4. Maintain consistent formatting`;

    // Add feedback if provided
    if (feedback.positiveExamples && feedback.positiveExamples.trim()) {
      systemPrompt += `

POSITIVE OUTPUT GUIDANCE:
The examples and optimized prompt should encourage outputs that are:
${feedback.positiveExamples}`;
    }

    if (feedback.negativeExamples && feedback.negativeExamples.trim()) {
      systemPrompt += `

NEGATIVE OUTPUT GUIDANCE:
The examples and optimized prompt should discourage outputs that are:
${feedback.negativeExamples}`;
    }

    systemPrompt += `

Optimize the following prompt using few-shot technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 