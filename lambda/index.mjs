// AWS Lambda function for chatbot backend
import OpenAI from 'openai';

// Initialize OpenAI client
let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  // Health check endpoint
  if (event.path === '/api/health' && event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ ok: true, ai: Boolean(client) }),
    };
  }

  // Chat endpoint
  if (event.path === '/api/chat' && event.httpMethod === 'POST') {
    try {
      if (!client) {
        return {
          statusCode: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'AI not configured. Set OPENAI_API_KEY.' }),
        };
      }

      const body = JSON.parse(event.body || '{}');
      const { messages, system } = body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'messages[] is required' }),
        };
      }

      const sysPrompt = system ||
        'You are a helpful assistant for a Student Feedback Management System. ' +
        'Be concise and helpful. If a question is about navigation, suggest the right page. ' +
        'Do not hallucinate data; if unsure, say so and propose a next step.';

      const chatMessages = [
        { role: 'system', content: sysPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ];

      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.4,
        messages: chatMessages,
      });

      const reply = completion?.choices?.[0]?.message?.content || 'Sorry, I could not generate a reply.';

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ reply }),
      };
    } catch (err) {
      console.error('AI error:', err);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'AI request failed' }),
      };
    }
  }

  // 404 for other paths
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: 'Not found' }),
  };
};
