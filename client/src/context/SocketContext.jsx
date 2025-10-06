import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnected(false);
    });

    newSocket.on('current-blocks', (blocks) => {
      setBlockedSeats(blocks);
    });

    newSocket.on('seat-blocked', (data) => {
      setBlockedSeats(prev => {
        const exists = prev.find(
          s => s.seatRow === data.seatRow && s.seatColumn === data.seatColumn
        );
        if (!exists) {
          return [...prev, data];
        }
        return prev;
      });
    });

    newSocket.on('seat-unblocked', (data) => {
      setBlockedSeats(prev =>
        prev.filter(s => !(s.seatRow === data.seatRow && s.seatColumn === data.seatColumn))
      );
    });

    newSocket.on('seat-block-failed', (data) => {
      console.log('Seat block failed:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinShow = (showId) => {
    if (socket && socket.connected) {
      socket.emit('join-show', showId);
    }
  };

  const blockSeat = (showId, row, column) => {
    if (socket && socket.connected) {
      socket.emit('block-seat', {
        showId,
        seatRow: row,
        seatColumn: column,
      });
    }
  };

  const unblockSeat = (showId, row, column) => {
    if (socket && socket.connected) {
      socket.emit('unblock-seat', {
        showId,
        seatRow: row,
        seatColumn: column,
      });
    }
  };

  const unblockAllSeats = (showId) => {
    if (socket && socket.connected) {
      socket.emit('unblock-all-seats', showId);
    }
  };

  const isSeatBlocked = (row, column) => {
    return blockedSeats.some(
      s => s.seatRow === row && s.seatColumn === column && s.socketId !== socket?.id
    );
  };

  const isSeatBlockedByMe = (row, column) => {
    return blockedSeats.some(
      s => s.seatRow === row && s.seatColumn === column && s.socketId === socket?.id
    );
  };

  const value = {
    socket,
    connected,
    blockedSeats,
    joinShow,
    blockSeat,
    unblockSeat,
    unblockAllSeats,
    isSeatBlocked,
    isSeatBlockedByMe,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};