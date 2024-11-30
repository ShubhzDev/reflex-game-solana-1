import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GAME_CONFIG } from '../config/constants';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(GAME_CONFIG.BACKEND_URL);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};