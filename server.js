require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

// connect to Mongo
connectDB();

app.get('/test', (req, res) => {
    res.send('Test works!');
});


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const workerRoutes = require('./routes/workerRoutes');
app.use('/api/workers', workerRoutes);

const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes)

const socialMediaRoutes = require('./routes/socialMediaRoutes');
app.use('/api/socialmedia', socialMediaRoutes);




// Start server AFTER everything is set up
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
