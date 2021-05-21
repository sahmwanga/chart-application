import { createContext, useContext, useEffect, useState } from 'react';

import { io } from 'socket.io-client';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io('http://localhost:4001', {
      query: { id },
      auth: { token: 'tst' },
      transports: ['websocket'],
    });

    // newSocket.on('FromApi', (data) => {
    //   console.log(data);
    // });

    setSocket(newSocket);

    return () => newSocket.closed();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
