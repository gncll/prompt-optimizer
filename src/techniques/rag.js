import { AIService } from '../services/aiService';

export const ragTechnique = {
  name: 'RAG (Retrieval-Augmented)',
  description: 'Context-enhanced responses',
  
  generatePrompt: (userPrompt) => {
    return `Based on the following context and information:

[Context: Relevant background information, data, or documentation would be provided here]

Task: ${userPrompt}

Please provide a comprehensive response that incorporates the provided context and addresses the specific requirements.`;
  },

  async optimizeWithAI(userPrompt, provider, model, feedback = {}) {
    let systemPrompt = `You are an expert prompt engineer. Your task is to optimize prompts using the RAG (Retrieval-Augmented Generation) technique.

RAG prompting means providing relevant context or information to enhance the response. The key is to:
1. Include relevant background information or context
2. Reference specific data, documents, or sources when applicable
3. Ask the model to base its response on the provided information
4. Structure the prompt to clearly separate context from the task`;

    // Add feedback if provided
    if (feedback.positiveExamples && feedback.positiveExamples.trim()) {
      systemPrompt += `

POSITIVE OUTPUT GUIDANCE:
The context-enhanced response should encourage outputs that are:
${feedback.positiveExamples}`;
    }

    if (feedback.negativeExamples && feedback.negativeExamples.trim()) {
      systemPrompt += `

NEGATIVE OUTPUT GUIDANCE:
The context-enhanced response should discourage outputs that are:
${feedback.negativeExamples}`;
    }

    systemPrompt += `

Optimize the following prompt using RAG technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 