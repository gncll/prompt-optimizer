const express = require('express');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { model, systemPrompt, userPrompt } = req.body;
    
    if (!process.env.REACT_APP_ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Anthropic API key not configured' });
    }

    console.log('Proxying Claude API request:', { model });

    const requestBody = JSON.stringify({
      model: model,
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const claudeRequest = https.request(options, (claudeResponse) => {
      let data = '';

      claudeResponse.on('data', (chunk) => {
        data += chunk;
      });

      claudeResponse.on('end', () => {
        try {
          if (claudeResponse.statusCode !== 200) {
            console.error('Claude API Error:', claudeResponse.statusCode, data);
            return res.status(claudeResponse.statusCode).json({ 
              error: `Claude API Error: ${claudeResponse.statusCode} - ${data}` 
            });
          }

          const responseData = JSON.parse(data);
          console.log('Claude API Success');
          
          if (responseData.content && responseData.content[0] && responseData.content[0].text) {
            res.json({ text: responseData.content[0].text });
          } else {
            res.status(500).json({ error: 'Unexpected response format from Claude API' });
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          res.status(500).json({ error: 'Failed to parse Claude API response' });
        }
      });
    });

    claudeRequest.on('error', (error) => {
      console.error('Claude Request Error:', error);
      res.status(500).json({ error: `Claude Request Error: ${error.message}` });
    });

    claudeRequest.write(requestBody);
    claudeRequest.end();

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: `Proxy Error: ${error.message}` });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Claude proxy server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
}); 