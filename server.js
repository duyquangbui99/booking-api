require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());
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

const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes');
app.use('/api/service-categories', serviceCategoryRoutes);

const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const allowBookingRoutes = require('./routes/allowBookingRoutes');
app.use('/api/setting', allowBookingRoutes);

const socialMediaRoutes = require('./routes/socialMediaRoutes');
app.use('/api/socialmedia', socialMediaRoutes);

const gptRoutes = require('./routes/gptRoutes');
app.use('/api/gpt', gptRoutes);



// Start server AFTER everything is set up
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
