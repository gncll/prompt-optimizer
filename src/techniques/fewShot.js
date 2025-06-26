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

Few-shot prompting means providing a few examples to demonstrate the desired pattern or format. The key is to:
1. Include 2-3 relevant examples
2. Show the input-output pattern clearly
3. Make examples diverse but consistent
4. End with the actual task

IMPORTANT: Return only the optimized prompt directly. Do NOT include any prefixes like "Optimized Prompt:" or similar labels.`;

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
Adjust the examples, language complexity, and explanations to be appropriate for this specific audience.`;
    }

    systemPrompt += `

Optimize the following prompt using few-shot technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 