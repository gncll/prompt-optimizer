import { AIService } from '../services/aiService';

export const chainOfThoughtTechnique = {
  name: 'Chain-of-Thought',
  description: 'Step-by-step reasoning',
  
  generatePrompt: (userPrompt) => {
    return `Task: ${userPrompt}

Please think through this step by step:

1. First, analyze the problem
2. Break it down into smaller parts
3. Work through each part systematically
4. Combine your findings for the final answer

Let's work through this step by step:`;
  },

  async optimizeWithAI(userPrompt, provider, model, feedback = {}) {
    let systemPrompt = `You are an expert prompt engineer. Your task is to optimize prompts using the Chain-of-Thought technique.

Chain-of-thought prompting encourages step-by-step reasoning. The key is to:
1. Ask the model to think step by step
2. Break down complex problems into smaller parts
3. Use phrases like "Let's think step by step" or "First, let's analyze..."
4. Encourage showing the reasoning process`;

    // Add feedback if provided
    if (feedback.positiveExamples && feedback.positiveExamples.trim()) {
      systemPrompt += `

POSITIVE OUTPUT GUIDANCE:
The step-by-step reasoning should encourage outputs that are:
${feedback.positiveExamples}`;
    }

    if (feedback.negativeExamples && feedback.negativeExamples.trim()) {
      systemPrompt += `

NEGATIVE OUTPUT GUIDANCE:
The step-by-step reasoning should discourage outputs that are:
${feedback.negativeExamples}`;
    }

    systemPrompt += `

Optimize the following prompt using chain-of-thought technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 