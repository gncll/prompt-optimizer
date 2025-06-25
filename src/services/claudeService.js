// Claude Service - Using proxy server to avoid CORS issues
export class ClaudeService {
  static async generateCompletion(model, systemPrompt, userPrompt) {
    try {
      console.log('Calling Claude API via proxy with model:', model);
      
      // Call our proxy server instead of direct API
      const response = await fetch('http://localhost:3002/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          systemPrompt: systemPrompt,
          userPrompt: userPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Claude Proxy Error:', errorData);
        throw new Error(errorData.error || `Proxy Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Claude API Success via proxy');
      
      return data.text;
    } catch (error) {
      console.error('Claude Service Error:', error);
      
      // If proxy server is not running
      if (error.message.includes('Failed to fetch') || error.message.includes('ECONNREFUSED')) {
        throw new Error('Claude proxy server is not running. Please start the server with: node server.js');
      }
      
      throw new Error(`Claude Service Error: ${error.message}`);
    }
  }
} 