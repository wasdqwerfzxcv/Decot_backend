require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const cors = require('cors');
const authenticate = require('./middlewares/authenticate');
const authRoutes = require('./router/authRouter');
const messageRoutes = require('./router/messageRouter');
const workspaceRoutes = require('./router/workspaceRouter');
const notificationRoutes = require('./router/notificationRouter');
const passport = require('./config/passport');
const boardRoutes = require('./router/boardRouter');
const canvasRoutes = require('./router/canvasRouter');
const commentRoutes = require('./router/commentRouter');
const stickyNoteRoutes = require('./router/stickyNoteRouter');
const textboxRoutes = require('./router/textboxRouter');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://decot-frontend.vercel.app",
      'https://decot-frontend-git-main-wasdqwerfzxcv.vercel.app',
      'http://decot-518a73edea89.herokuapp.com',
      'http://decot-frontend.vercel.app'
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
  }
});
const { setupSockets } = require('./sockets');
setupSockets(io);

const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: ['http://localhost:3000', 'https://decot-frontend.vercel.app',
    'https://decot-frontend-git-main-wasdqwerfzxcv.vercel.app',
    'http://localhost:5000', 'https://decot-518a73edea89.herokuapp.com',
    'https://decot-frontend.vercel.app'],
  optionsSuccessStatus: 200
}

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(xmlparser());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/workspace', authenticate, workspaceRoutes);
app.use('/board', authenticate, boardRoutes);
app.use('/message', authenticate, messageRoutes)
app.use('/notification', authenticate, notificationRoutes);
app.use('/canvas', authenticate, canvasRoutes);
app.use('/comment', authenticate, commentRoutes);
app.use('/stickyNote', authenticate, stickyNoteRoutes);
app.use('/textbox', authenticate, textboxRoutes);

// for testing purpose
if (require.main === module) {
  server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  module.exports = app;
}
