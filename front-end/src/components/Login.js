import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

function Login({ handleLogin }) {
  const [username, setUsername] = useState();

  return (
    <Container>
      <h1>Login</h1>
      <div>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
        <button onClick={() => handleLogin(username)}>Login</button>
      </div>
    </Container>
  );
}

export default Login;
