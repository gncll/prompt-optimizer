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
    let systemPrompt = `You are an expert prompt engineer. Your task is to optimize prompts using the Role prompting technique.

Role prompting means assigning a specific role or persona to the AI. The key is to:
1. Define a clear, relevant role or persona
2. Specify expertise and background
3. Set appropriate context and perspective
4. Use "You are..." statements

IMPORTANT: Return only the optimized prompt directly. Do NOT include any prefixes like "Optimized Prompt:" or similar labels.`;

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

Optimize the following prompt using role prompting technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 