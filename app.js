var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose')

server.listen(3000);

mongoose.connect('mongodb://localhost/chat', function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to mongodb!')
  }
});

var chatSchema = mongoose.Schema({
  msg: String,
  created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  Chat.find({}, function(err, docs) {
    if(err) throw err;
    socket.emit('load old msgs', docs);
  })
  socket.on('chat message', function(msg){
    var newMsg = new Chat({msg: msg});
    newMsg.save(function(err) {
      if(err) throw err;
    })
    io.emit('chat message', msg);
  });
});