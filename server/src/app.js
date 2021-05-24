const express = require('express');

const http = require('http');
const cors = require('cors');

const socketIo = require('socket.io');

const redis = require('redis');
const client = redis.createClient();

const port = process.env.PORT || 4001;

const routes = require('./routes/index');

const app = express();

const path = require('path');

app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(routes);

const server = http.createServer(app);

const io = socketIo(server);

var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database(path.join(__dirname, 'db.sqlite3'));

// db.serialize(function () {
db.run(
  'CREATE TABLE IF NOT EXISTS charts (source TEXT, destination TEXT, content TEXT) '
);

const getAllMessage = ({ source, destination }) => {
  return new Promise((resolve, reject) => {
    const data = [];
    db.all(
      `SELECT * FROM charts where destination IN(${destination},${source}) AND source  IN (${source},${destination})`,
      (err, rows) => {
        data.push(rows);
      },
      (r, n) => {
        resolve(n);
      }
    );
  });
};

// });

// socker middleware
// io.use((socket, next) => {
//   const err = new Error('not authorized');
//   err.data = { content: 'please retry later' };
//   //   console.log(socket.handshake);
//   next(err);
// });

let interval;
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('channel-join', async ({ source, destination }, callback) => {
    console.log('channel-join', { source, destination });

    // general welcome
    // socket.emit('message', 'Sahmwanga Messages are limited to this room ' + id);

    // get all message for the selected channel
    const messages = await getAllMessage({ source, destination });
    // console.log(messages);
    // socket.emit('channel-join', {
    socket.emit('message', {
      source,
      destination,
      message: messages,
    });

    callback();
  });

  socket.on('sendMessage', async (content, callback) => {
    console.log({ content });

    const { destination, message, source, id } = content;

    // TODO: SAVE INTO DB=REDIS
    var stmt = await db.prepare('INSERT INTO charts VALUES (?,?,?)');
    stmt.run(source, destination, message);
    stmt.finalize();

    const messages = await getAllMessage({ destination, source });

    io.emit('message', {
      source,
      destination,
      message: messages,
    });

    callback();
  });

  //handle room

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => console.log('Listening on port ' + port));
