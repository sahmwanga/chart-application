import { useEffect, useState } from 'react';
import Room from './components/Room';
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

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

let socket;
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState('');

  useEffect(() => {
    getLoggedInUser();
  }, []);

  const getLoggedInUser = () => {
    const userId = localStorage.getItem('id');
    console.log({ userId });
    setIsLoggedIn(userId);
  };

  const handleLogin = (username) => {
    localStorage.setItem('id', username);
    window.location.reload();
  };

  const toRender = isLoggedIn ? (
    <Row>
      <div>
        <Alert variant="primary">
          Welcome <b>{isLoggedIn}</b>
        </Alert>
        <h4>Channels/Rooms</h4>
      </div>
      <Room source={isLoggedIn} />

      <Route exact path="/" component={Home} />
      <Route exact path="/:id" component={Chart} />
    </Row>
  ) : (
    <Login handleLogin={handleLogin} />
  );

  return (
    <Router>
      <Switch>
        <Container>{toRender}</Container>
      </Switch>
    </Router>
  );
}

function Home(props) {
  return (
    <Col>
      <div>No chart selected</div>
    </Col>
  );
}
function Chart(props) {
  console.log({ props });
  const { id } = props.match.params;
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState();
  const [dest, setDest] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket = io('http://localhost:4001', {
      transports: ['websocket'],
    });

    socket.emit(
      'channel-join',
      { source: localStorage.getItem('id'), destination: id },
      (ack) => {
        console.log({ ack });
      }
    );

    return () => {
      // socket.emit('disconnect');
      socket.off();
    };
  }, [id]);

  useEffect(() => {
    getLoggedInUser();
  });

  const getLoggedInUser = () => {
    const userId = localStorage.getItem('id');
    setIsLoggedIn(userId);
  };

  const handleSendMessage = (e) => {
    console.log({ message });
    e.preventDefault();
    socket.emit(
      'sendMessage',
      {
        destination: id,
        message,
        source: localStorage.getItem('id'),
        id: Date.now(),
      },
      () => {
        setMessage('');
      }
    );
  };

  const handleLogin = (username) => {
    localStorage.setItem('id', username);
    window.location.reload();
  };

  useEffect(() => {
    socket.on('message', (object) => {
      console.log({ object });
      setMessages(object);
    });
  }, [messages, id]);

  return (
    <Col sm={12} md={8}>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '50px',
          }}
        >
          {messages &&
            messages.message.map((msg) => (
              <Card
                style={{
                  width: '40%',
                  margin: '16px 4px 0px 4px',
                  alignSelf:
                    msg.source === isLoggedIn ? 'flex-end' : 'flex-start',
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
            {message}
            <InputGroup>
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <InputGroup.Prepend>
                <InputGroup.Text onClick={(e) => handleSendMessage(e)}>
                  Send
                </InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </Col>
        </Row>
      </div>
    </Col>
  );
}

export default App;
