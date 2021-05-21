import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Room({ handleChannelSelect }) {
  const [channels, setChannels] = useState();

  useEffect(() => {
    getChannels()
      .then((data) => {
        setChannels(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const getChannels = async () => {
    const response = await axios.get('http://localhost:4001/channels');
    return response.data.channels;
  };

  return (
    <div>
      {channels &&
        channels.map((ch) => (
          <div onClick={() => handleChannelSelect(ch.id)} key={ch.id}>
            {ch.name}
          </div>
        ))}
    </div>
  );
}

export default Room;
