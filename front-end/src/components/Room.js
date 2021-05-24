import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Room({ source }) {
  const [channels, setChannels] = useState();

  useEffect(() => {
    getChannels()
      .then((data) => {
        console.log({ data });
        setChannels(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const getChannels = async () => {
    const response = await axios.get('http://localhost:4001/channels');

    console.log({ response: response.data, source });
    return response.data.channels.filter((ch) => ch.id !== source);
  };

  return (
    <Col sm={12} md={4}>
      {channels &&
        channels.map((ch) => (
          <Link to={`/${ch.id}`} key={ch.id}>
            <p
              style={{
                backgroundColor: 'teal',
                padding: '2px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <pre>
                {ch.name} - {ch.id}
              </pre>
            </p>
          </Link>
        ))}
    </Col>
  );
}

export default Room;
