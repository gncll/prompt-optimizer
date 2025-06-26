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
4. Use imperative language

IMPORTANT: Return only the optimized prompt directly. Do NOT include any prefixes like "Optimized Prompt:" or similar labels.`;

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

    // Add target audience instruction if provided
    if (feedback.targetAudience && feedback.targetAudience.trim()) {
      systemPrompt += `

TARGET AUDIENCE REQUIREMENT:
The optimized prompt should be tailored for: ${feedback.targetAudience}
Adjust the language complexity, examples, and tone to be appropriate for this specific audience.`;
    }

    systemPrompt += `

Optimize the following prompt using zero-shot technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 