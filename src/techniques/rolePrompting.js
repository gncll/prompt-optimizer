import { AIService } from '../services/aiService';

export const rolePromptingTechnique = {
  name: 'Role Prompting',
  description: 'Assign specific expertise role',
  
  generatePrompt: (userPrompt) => {
    return `You are an expert professional with deep knowledge in the relevant field.

Your task: ${userPrompt}

Please respond with the expertise and perspective of a qualified professional, providing authoritative and well-informed guidance.`;
  },

  async optimizeWithAI(userPrompt, provider, model, feedback = {}) {
    let systemPrompt = `You are an expert prompt engineer. Your task is to optimize prompts using the Role Prompting technique.

Role prompting means assigning a specific expert role or persona to the AI. The key is to:
1. Identify the most relevant expert role for the task
2. Be specific about the expertise level and background
3. Include relevant context about the role's perspective
4. Use phrases like "You are an expert..." or "As a professional..."`;

    // Add feedback if provided
    if (feedback.positiveExamples && feedback.positiveExamples.trim()) {
      systemPrompt += `

POSITIVE OUTPUT GUIDANCE:
The expert role should encourage outputs that are:
${feedback.positiveExamples}`;
    }

    if (feedback.negativeExamples && feedback.negativeExamples.trim()) {
      systemPrompt += `

NEGATIVE OUTPUT GUIDANCE:
The expert role should discourage outputs that are:
${feedback.negativeExamples}`;
    }

    systemPrompt += `

Optimize the following prompt using role prompting technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 