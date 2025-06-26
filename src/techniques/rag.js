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

RAG prompting involves incorporating relevant context or knowledge. The key is to:
1. Include relevant background information
2. Provide necessary context upfront
3. Reference specific knowledge sources
4. Structure information clearly

IMPORTANT: Return only the optimized prompt directly. Do NOT include any prefixes like "Optimized Prompt:" or similar labels.`;

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

    // Add language instruction if not English
    if (feedback.language && feedback.language !== 'English') {
      systemPrompt += `

LANGUAGE REQUIREMENT:
The optimized prompt should include instructions to respond in ${feedback.language}.`;
    }

    // Add tone instruction if not Normal
    if (feedback.tone && feedback.tone !== 'Normal') {
      const toneDescriptions = {
        'Concise': 'brief and to the point',
        'Explanatory': 'detailed and informative',
        'Conversational': 'natural and casual',
        'Friendly': 'warm and approachable',
        'Confident': 'assertive and authoritative',
        'Minimalist': 'simple and clean',
        'Witty': 'clever and humorous'
      };
      
      const toneDesc = toneDescriptions[feedback.tone] || feedback.tone.toLowerCase();
      systemPrompt += `

TONE REQUIREMENT:
The optimized prompt should include instructions for a ${feedback.tone.toLowerCase()} tone with ${toneDesc}.`;
    }

    systemPrompt += `

Optimize the following prompt using RAG technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 