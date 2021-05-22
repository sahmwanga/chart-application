import React, { useState, useEffect } from 'react';
import { Col, Row, Form, InputGroup, Card } from 'react-bootstrap';

function MessagePanel({ message, source, newSocket }) {
  const [text, setText] = useState();
  const [dt, setDt] = useState(message);

  useEffect(() => {
    newSocket.on('message', (data) => {
      console.log({ dt: dt });
      setDt(data);
    });
  }, [dt]);

  const handleSendMessage = (destination, text) => {
    newSocket.emit('message', {
      destination,
      text,
      source: localStorage.getItem('id'),
      id: Date.now(),
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '50px',
        }}
      >
        {dt.message &&
          dt.message.map((msg) => (
            <Card
              style={{
                width: '40%',
                margin: '16px 4px 0px 4px',
                alignSelf: msg.source === source ? 'flex-end' : 'flex-start',
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
              onChange={(e) => setText(e.target.value)}
            />

            <InputGroup.Prepend>
              <InputGroup.Text
                onClick={(e) => handleSendMessage(message.destination, text)}
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
  );
}

export default MessagePanel;
