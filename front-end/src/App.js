import { useEffect, useState } from 'react';
import Room from './components/Room';
import MessagePanel from './components/MessagePanel';
import { Container, Alert, Row, Col } from 'react-bootstrap';

import { io } from 'socket.io-client';
import Login from './components/Login';

const newSocket = io('http://localhost:4001', {
  auth: { token: 'tst' },
  transports: ['websocket'],
});

function App(props) {
  const [message, setMessage] = useState();
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // newSocket.on('message', (data) => {
    //   console.log({ data });
    // setMessage(data);
    // });
    getLoggedInUser();
  }, [refresh]);

  const getLoggedInUser = () => {
    const userId = localStorage.getItem('id');
    setIsLoggedIn(userId);
  };

  const handleChannelSelect = ({ source, destination }) => {
    console.log('handleChannelSelect ' + { source, destination });
    newSocket
      .emit('channel-join', { source, destination }, (ack) => {
        console.log({ ack });
      })
      .on('channel-join', (data) => {
        console.log('channel join => ', data);
        setMessage(data);
      });
  };

  const handleLogin = (username) => {
    localStorage.setItem('id', username);
    window.location.reload();
  };

  return (
    <Container>
      <div>
        {isLoggedIn ? (
          <Chart
            isLoggedIn={isLoggedIn}
            message={message}
            handleChannelSelect={handleChannelSelect}
            newSocket={newSocket}
          />
        ) : (
          <Login handleLogin={handleLogin} />
        )}
      </div>
    </Container>
  );
}

const Chart = ({ isLoggedIn, message, handleChannelSelect, newSocket }) => {
  return (
    <Container>
      <div>
        <Alert variant="primary">
          Welcome <b>{isLoggedIn}</b>
        </Alert>
        <h4>Channels/Rooms</h4>
      </div>

      <Row>
        <Col sm={3}>
          <Room handleChannelSelect={handleChannelSelect} source={isLoggedIn} />
        </Col>
        {message ? (
          <Col sm={9}>
            <MessagePanel
              message={message}
              source={isLoggedIn}
              newSocket={newSocket}
            />
          </Col>
        ) : (
          <Col sm={9}>No chart selected</Col>
        )}
      </Row>
    </Container>
  );
};

export default App;
