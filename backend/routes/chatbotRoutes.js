const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Financial context to guide the model
const FINANCIAL_CONTEXT = `You are a helpful financial assistant. Your role is to provide general financial information and education.

You should:
- Focus on general financial principles and concepts
- Provide practical budgeting and saving tips
- Explain basic financial terms and concepts
- Emphasize the importance of financial planning
- Give general advice about personal finance management

You should NOT:
- Give specific investment recommendations
- Provide tax advice
- Make market predictions
- Suggest specific financial products
- Give legal advice

Keep responses clear, concise, and focused on practical advice.`;

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const prompt = `${FINANCIAL_CONTEXT}\n\nQuestion: ${question}\nAnswer:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: FINANCIAL_CONTEXT
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    // Get the response text
    const generatedText = response.choices[0].message.content.trim();

    // Add disclaimer to the response
    const disclaimer = "\n\n*Disclaimer: This is general financial information and not professional advice. Please consult with a qualified financial advisor for personalized advice.*";
    const fullResponse = generatedText + disclaimer;

    res.json({ response: fullResponse });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

module.exports = router; 