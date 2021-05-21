import { useEffect, useState } from 'react';
import Room from './components/Room';
import { SocketProvider, useSocket } from './context/SocketProvider';
import MessagePanel from './components/MessagePanel';

import { io } from 'socket.io-client';

const newSocket = io('http://localhost:4001', {
  auth: { token: 'tst' },
  transports: ['websocket'],
});

function App() {
  const [message, setMessage] = useState();
  // useEffect(() => {
  //   newSocket.on('message', (data) => {
  //     console.log({ data });
  //     setMessage(data);
  //   });
  // }, []);
  const handleChannelSelect = (id) => {
    console.log('handleChannelSelect ' + id);
    newSocket
      .emit('channel-join', id, (ack) => {
        console.log({ ack });
      })
      .on('channel-join', (data) => {
        console.log('channel join => ', data);
        setMessage(data);
      });
  };

  const handleSendMessage = (channel_id, text) => {
    console.log({ channel_id, text });
    newSocket.emit('send-message', {
      channel_id,
      text,
      sender_name: newSocket.id,
      id: Date.now(),
    });
  };

  return (
    <div className="App">
      <div>
        <h4>Channels/Rooms</h4>
      </div>
      <Room handleChannelSelect={handleChannelSelect} />
      <hr />
      {message && (
        <MessagePanel handleSendMessage={handleSendMessage} message={message} />
      )}
    </div>
  );
}

export default App;
