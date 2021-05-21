const express = require('express');

const http = require('http');
const cors = require('cors');

const socketIo = require('socket.io');

const redis = require('redis');
const client = redis.createClient();

const port = process.env.PORT || 4001;

const routes = require('./routes/index');

const app = express();

app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(routes);

const server = http.createServer(app);

const io = socketIo(server);

const CHANNELS = ['CHANNEL ONE', 'CHANNEL TWO'];

// socker middleware
// io.use((socket, next) => {
//   const err = new Error('not authorized');
//   err.data = { content: 'please retry later' };
//   //   console.log(socket.handshake);
//   next(err);
// });

function updatedCache(id, key, value) {
  return new Promise((resv, rej) => {
    // value = JSON.stringify(value);
    client.hset(id, key, value, (err, res) => {
      resv(1);
    });
  });
}

function getAll(id) {
  return new Promise((resv, rej) => {
    client.hgetall(id, (err, res) => {
      console.log({ res: res });
      resv(res);
    });
  });
}

getAll(1).then((d) => console.log({ test: JSON.parse(d) }));

let interval;
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('channel-join', async (id) => {
    console.log('channel-join', id);

    // general welcome
    socket.emit('message', 'Sahmwanga Messages are limited to this room ' + id);

    // get all message for the selected channel
    const messages = await getAll(id);
    socket.emit('channel-join', {
      channel_id: id,
      message: messages,
    });

    // broadcast everytime users connect
    socket.broadcast.to(id).emit('message', 'Sahmwanga has joined the room');
  });

  socket.on('send-message', async (message) => {
    console.log({ message });

    // TODO: SAVE INTO DB=REDIS

    await updatedCache(message.channel_id, message.id, JSON.stringify(message));
    io.emit('message', message);
  });

  //handle room

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => console.log('Listening on port ' + port));
