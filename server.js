const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticate = require('./middlewares/authenticate'); 
const authRoutes = require('./router/authRouter');
const messageRoutes = require('./router/messageRouter');
const socket = require('socket.io');
const workspaceRoutes = require('./router/workspaceRouter');


const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/auth',authRoutes);
app.use('/workspace', authenticate, workspaceRoutes);
app.use('/message', messageRoutes )

app.use('/workspace', authenticate, workspaceRoutes);

 server = app.listen(PORT, async()=>{
  console.log(`Server is running on port ${PORT}`);
});
