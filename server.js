const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticate = require('./middlewares/authenticate'); 
const authRoutes = require('./router/authRouter');
const messageRoutes = require('./router/messageRouter');
const workspaceRoutes = require('./router/workspaceRouter');


const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

Message.sync();

app.use('/auth',authRoutes);
app.use('/workspace', authenticate, workspaceRoutes);
app.use('/', messageRoutes )

app.use('/workspace', authenticate, workspaceRoutes);

 server = app.listen(PORT, function(){
  console.log(`Server is running on port ${PORT}`);
});

//for chat
const io = socket(server); //put app.listen in bracket
io.on('connection', (socket) =>{
  console.log(socket.id);

  socket.on('SEND_MESSAGE', function(data){
    io.emit('RECEIVE_MESSAGE', data);
  });
});
