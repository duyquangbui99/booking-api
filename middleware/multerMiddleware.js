const multer = require('multer');

// Use memory storage so the file is kept in RAM, not written to disk
const storage = multer.memoryStorage();

module.exports = multer({ storage });
