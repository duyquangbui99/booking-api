const { OpenAI } = require('openai');
const upload = require('../middleware/multerMiddleware'); // import your middleware
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateCaptionFromUpload = [
    upload.single('image'), // 'image' should match the form field name
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

            const base64 = req.file.buffer.toString('base64');
            const mime = req.file.mimetype;

            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'Create a fun caption with a beauty-related hashtag. End with #QuangProject #Houston' },
                            { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } }
                        ]
                    }
                ],
                max_tokens: 100
            });

            const caption = response.choices[0]?.message?.content;
            res.json({ caption });
        } catch (err) {
            console.error('Caption error:', err.message);
            res.status(500).json({ message: 'Caption generation failed' });
        }
    }
];
