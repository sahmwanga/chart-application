import { useEffect, useState } from 'react';
import Room from './components/Room';
import MessagePanel from './components/MessagePanel';
import {
  Container,
  Alert,
  Row,
  Col,
  Card,
  InputGroup,
  Form,
} from 'react-bootstrap';

import { io } from 'socket.io-client';
import Login from './components/Login';

let socket;

function App(props) {
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [dest, setDest] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket = io('http://localhost:4001', {
      transports: ['websocket'],
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, []);

  useEffect(() => {
    getLoggedInUser();
  });

  useEffect(() => {
    socket.on('message', (object) => {
      console.log({ object });
      setMessages(object);
    });
  }, [messages]);

  const getLoggedInUser = () => {
    const userId = localStorage.getItem('id');
    setIsLoggedIn(userId);
  };

  const handleChannelSelect = ({ source, destination }) => {
    setDest(destination);
    console.log('handleChannelSelect ' + { source, destination });
    socket.emit('channel-join', { source, destination }, (ack) => {
      console.log({ ack });
    });
    // .on('channel-join', (data) => {
    //   console.log('channel join => ', data);
    //   // setMessages(data);
    // });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit(
      'sendMessage',
      {
        destination: dest,
        message,
        source: localStorage.getItem('id'),
        id: Date.now(),
      },
      () => setMessage('')
    );
  };

  const handleLogin = (username) => {
    localStorage.setItem('id', username);
    window.location.reload();
  };

  return (
    <Container>
      <div>
        {isLoggedIn ? (
          <Container>
            <div>
              <Alert variant="primary">
                Welcome <b>{isLoggedIn}</b>
              </Alert>
              <h4>Channels/Rooms</h4>
            </div>

            <Row>
              {messages ? (
                <Col sm={9}>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingBottom: '50px',
                      }}
                    >
                      {messages.message &&
                        messages.message.map((msg) => (
                          <Card
                            style={{
                              width: '40%',
                              margin: '16px 4px 0px 4px',
                              alignSelf:
                                msg.source === isLoggedIn
                                  ? 'flex-end'
                                  : 'flex-start',
                            }}
                          >
                            <Card.Body>
                              <Card.Title>{msg.source}</Card.Title>
                              <Card.Text>{msg.content}</Card.Text>
                            </Card.Body>
                          </Card>
                        ))}
                    </div>
                    <hr />
                    <Row>
                      <Col>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            onChange={(e) => setMessage(e.target.value)}
                          />

                          <InputGroup.Prepend>
                            <InputGroup.Text
                              onClick={(e) => handleSendMessage(e)}
                            >
                              Send
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                        </InputGroup>

                        <Form.Text id="passwordHelpBlock" muted>
                          contain letters and numbers or emoji.
                        </Form.Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ) : (
                <Col sm={9}>No chart selected</Col>
              )}
            </Row>
          </Container>
        ) : (
          <Login handleLogin={handleLogin} />
        )}
      </div>
    </Container>
  );
}

export default App;
