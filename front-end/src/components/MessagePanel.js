import React, { useState } from 'react';

function MessagePanel({ handleSendMessage, message }) {
  const [text, setText] = useState();
  return (
    <div>
      <div>list of message + sender</div>
      {message.message && message.message.map((msg) => <p>{msg.message}</p>)}
      <hr />
      <div>
        <input type="text" onChange={(e) => setText(e.target.value)} />
        <button onClick={(e) => handleSendMessage(message.channel_id, text)}>
          Send.
        </button>
      </div>
    </div>
  );
}

export default MessagePanel;
