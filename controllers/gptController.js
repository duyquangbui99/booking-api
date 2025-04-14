const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.generateCaption = async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Generate a short, fun caption for a beauty salon Instagram post based on this image. 
        The caption should include at least one beauty-related hashtag, and must end with: #TranquilityNailsSpa #Tulsa.`
                        },
                        { type: 'image_url', image_url: { url: imageUrl } }
                    ]
                }
            ],
            max_tokens: 100
        });


        const caption = response.choices[0]?.message?.content;
        res.json({ caption });
    } catch (error) {
        console.error('GPT error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Failed to generate caption', error: error.message });
    }
};
