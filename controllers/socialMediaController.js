const axios = require('axios');
const FormData = require('form-data');

const PAGE_ID = process.env.FB_PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

exports.createFacebookPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const file = req.file;

        if (!caption || !file) {
            return res.status(400).json({ message: 'Caption and image file are required' });
        }

        const form = new FormData();
        form.append('caption', caption);
        form.append('source', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        });

        const url = `https://graph.facebook.com/v17.0/${PAGE_ID}/photos?access_token=${PAGE_ACCESS_TOKEN}`;
        const response = await axios.post(url, form, {
            headers: form.getHeaders()
        });

        res.status(200).json({
            message: 'Post created successfully',
            postId: response.data.post_id
        });
    } catch (err) {
        console.error('Facebook post error:', err.response?.data || err.message);
        res.status(500).json({
            message: 'Failed to create Facebook post',
            error: err.response?.data || err.message
        });
    }
};
