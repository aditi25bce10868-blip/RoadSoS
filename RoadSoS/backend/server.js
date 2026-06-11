const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

//const authRoutes = require('./src/routes/authRoutes');
const sosRoutes = require('./src/routes/sosRoutes');
const userRoutes = require('./src/routes/userRoutes');
const emergencyRoutes = require('./src/routes/emergencyRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.set('io', io);

//app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/user', userRoutes);
app.use('/api/emergency', emergencyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Road SOS Backend is Running!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});