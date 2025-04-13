const axios = require('axios');

const PAGE_ID = process.env.FB_PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

exports.createFacebookPost = async (req, res) => {
    try {
        const { caption, imageUrl } = req.body;

        if (!caption || !imageUrl) {
            return res.status(400).json({ message: 'Caption and imageUrl are required' });
        }

        const url = `https://graph.facebook.com/v17.0/${PAGE_ID}/photos`;

        const response = await axios.post(url, null, {
            params: {
                url: imageUrl,
                caption,
                access_token: PAGE_ACCESS_TOKEN
            }
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
