import React, { createContext, useContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

export const SocketProvider: React.FC<SocketContextProps> = (props) => {
  const socket = io("http://localhost:5000");

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
