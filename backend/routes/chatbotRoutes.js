const express = require('express');
const router = express.Router();
const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face inference
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

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

// Helper function to format the prompt
const formatPrompt = (question) => {
  return `${FINANCIAL_CONTEXT}\n\nQuestion: ${question}\nAnswer:`;
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const prompt = formatPrompt(question);

    const response = await hf.textGeneration({
      model: "gpt2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        do_sample: true,
        return_full_text: false
      }
    });

    // Clean up and format the response
    let generatedText = response.generated_text
      .split('\n')[0]  // Take only the first paragraph
      .replace(/["""]/g, '')  // Remove quotes
      .trim();

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