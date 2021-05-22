import React, { useState } from 'react';
import { Col, Row, Form, InputGroup, Card } from 'react-bootstrap';

function MessagePanel({ message, source, newSocket }) {
  const [text, setText] = useState();

  const handleSendMessage = (destination, text) => {
    // newSocket
    //   .emit('message', {
    //     destination,
    //     text,
    //     source: localStorage.getItem('id'),
    //     id: Date.now(),
    //   })
    //   .on('message', (data) => {
    //     console.log({ message: data });
    //     setMessage(data);
    //   });
  };

  return (
    <div>
      {message.message &&
        message.message.map((msg) =>
          msg.source === source ? (
            <Source msg={msg} />
          ) : (
            <Destination msg={msg} />
          )
        )}
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

const Source = ({ msg }) => {
  return (
    <Card style={{ margin: '5px' }}>
      <div
        style={{
          backgroundColor: 'lightskyblue',
          margin: '5px',
          textAlign: 'right',
        }}
      >
        <span>{msg.content}</span>
        <br />
        <span>You</span>
      </div>
    </Card>
  );
};
const Destination = ({ msg }) => {
  return (
    <Card style={{ margin: '5px', width: '50%' }}>
      <div
        style={{
          backgroundColor: 'lightgray',
          padding: '5px',
          margin: '5px',
        }}
      >
        <span>{msg.content}</span>
        <br />
        <pre>from: {msg.source}</pre>
      </div>
      <div style={{ float: 'clear' }}></div>
    </Card>
  );
};

export default MessagePanel;
