require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticate = require('./middlewares/authenticate'); 
const authRoutes = require('./router/authRouter');
const messageRoutes = require('./router/messageRouter');
const workspaceRoutes = require('./router/workspaceRouter');
const notificationRoutes = require('./router/notificationRouter');
const passport = require('./config/passport');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
  }
});
const { setupSockets } = require('./sockets');
setupSockets(io);

const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/auth',authRoutes);
app.use('/workspace', authenticate, workspaceRoutes);
app.use('/message', messageRoutes )
app.use('/notification', authenticate, notificationRoutes);

server.listen(PORT, async()=>{
  console.log(`Server is running on port ${PORT}`);
});
