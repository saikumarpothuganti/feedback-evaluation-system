import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '1mb' }));

const apiKey = process.env.OPENAI_API_KEY;
let client = null;
if (apiKey) {
  client = new OpenAI({ apiKey });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ai: Boolean(apiKey) });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({ error: 'AI not configured. Set OPENAI_API_KEY.' });
    }

    const { messages, system } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages[] is required' });
    }

    const sysPrompt = system ||
      'You are a helpful assistant for a Student Feedback Management System. '
      + 'Be concise and helpful. If a question is about navigation, suggest the right page. '
      + 'Do not hallucinate data; if unsure, say so and propose a next step.';

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
    res.json({ reply });
  } catch (err) {
    console.error('AI error:', err?.response?.data || err?.message || err);
    const status = err?.status || err?.response?.status || 500;
    res.status(status).json({ error: 'AI request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[server] AI proxy running on http://localhost:${PORT}`);
});
