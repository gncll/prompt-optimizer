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
    let systemPrompt = `You are an expert prompt engineer. Your task is to optimize prompts using the Chain-of-thought technique.

Chain-of-thought prompting encourages step-by-step reasoning. The key is to:
1. Ask for step-by-step thinking
2. Request explicit reasoning process
3. Break down complex problems
4. Show intermediate steps

IMPORTANT: Return only the optimized prompt directly. Do NOT include any prefixes like "Optimized Prompt:" or similar labels.`;

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
Adjust the reasoning steps, language complexity, and examples to be appropriate for this specific audience.`;
    }

    systemPrompt += `

Optimize the following prompt using chain-of-thought technique:`;

    return await AIService.generateCompletion(provider, model, systemPrompt, userPrompt);
  }
}; 