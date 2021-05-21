import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Room({ handleChannelSelect, source }) {
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
    <div>
      {channels &&
        channels.map((ch) => (
          <div
            onClick={() => handleChannelSelect({ source, destination: ch.id })}
            key={ch.id}
          >
            <p
              style={{
                backgroundColor: 'teal',
                padding: '2px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {ch.name}
            </p>
          </div>
        ))}
    </div>
  );
}

export default Room;
