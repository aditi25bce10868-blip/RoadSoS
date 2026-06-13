require('./config/firebaseAdmin');

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const app     = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (browser tracking page)
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoadSOS backend is running' });
});

// Browser tracking page — no login needed
app.get('/track/:sessionId', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/track.html'));
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sos',      require('./routes/sosRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));


// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
