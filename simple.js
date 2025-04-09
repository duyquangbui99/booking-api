const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

app.listen(5001, () => {
    console.log('✅ Server running on port 5001');
});
