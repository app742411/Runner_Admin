import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used inside SocketProvider');
  return context;
};

export function SocketProvider({ children }) {
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  const connectSocket = useCallback(() => {
    if (isAuthenticated && accessToken) {
      const socketInstance = io(CONFIG.site.socketUrl, {
        auth: { token: accessToken },
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        console.log('✅ Connected to socket server');
      });
      
      socketInstance.on('disconnect', () => {
        console.log('❌ Disconnected from socket server');
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
    return undefined;
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    const disconnect = connectSocket();
    return () => {
      if (disconnect) disconnect();
    };
  }, [connectSocket]);

  const memoizedValue = useMemo(
    () => ({
      socket,
    }),
    [socket]
  );

  return <SocketContext.Provider value={memoizedValue}>{children}</SocketContext.Provider>;
}
