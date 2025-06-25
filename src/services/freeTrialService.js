// Free Trial Service - Simple prompt optimization for homepage
export class FreeTrialService {
  static async optimizePrompt(originalPrompt) {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    if (!originalPrompt || !originalPrompt.trim()) {
      throw new Error('Please enter a prompt to optimize');
    }

    const optimizationPrompt = `You are an expert prompt engineer. Your task is to optimize the following prompt to make it more effective, clear, and likely to produce better results from AI models.

Please improve this prompt by:
1. Making it more specific and clear
2. Adding relevant context if needed
3. Using better structure and formatting
4. Including helpful instructions or constraints
5. Making it more actionable

Original prompt: "${originalPrompt.trim()}"

Please provide only the optimized prompt without any explanations or additional text:`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: optimizationPrompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
      }

      return data.choices[0].message.content.trim();
      
    } catch (error) {
      console.error('Free trial optimization error:', error);
      
      if (error.message.includes('API key')) {
        throw new Error('API configuration error. Please contact support.');
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else {
        throw new Error('Sorry, there was an error optimizing your prompt. Please try again later or contact support.');
      }
    }
  }

  // Get trial count from localStorage
  static getTrialCount() {
    return parseInt(localStorage.getItem('promptTrialCount') || '0');
  }

  // Increment trial count
  static incrementTrialCount() {
    const currentCount = this.getTrialCount();
    const newCount = currentCount + 1;
    localStorage.setItem('promptTrialCount', newCount.toString());
    return newCount;
  }

  // Check if user has trials left
  static hasTrialsLeft() {
    return this.getTrialCount() < 10;
  }

  // Get remaining trials
  static getRemainingTrials() {
    return Math.max(0, 10 - this.getTrialCount());
  }
} 