import React, { useState } from 'react';
import { Col, Row, Form, InputGroup } from 'react-bootstrap';

function MessagePanel({ handleSendMessage, message, source }) {
  const [text, setText] = useState();
  return (
    <div>
      <div>list of message + sender</div>
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
    <div>
      <div
        style={{
          backgroundColor: 'lightskyblue',
          padding: '5px',
          margin: '5px',
          width: '100%',
          textAlign: 'right',
        }}
      >
        <span>{msg.content}</span>
        <br />
        <span>You</span>
      </div>
    </div>
  );
};
const Destination = ({ msg }) => {
  return (
    <div>
      <div
        style={{
          backgroundColor: 'lightgray',
          padding: '5px',
          margin: '5px',
          width: '100%',
        }}
      >
        <span>{msg.content}</span>
        <br />
        <pre>from: {msg.source}</pre>
      </div>
      <div style={{ float: 'clear' }}></div>
    </div>
  );
};

export default MessagePanel;
