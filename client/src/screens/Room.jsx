import React, { useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../Context/SocketProvider";

export const Room = () => {
  const socket = useSocket();
  const handleUserJoined = useCallback(({ username, id }) => {
    console.log(`Username: ${username} Joined room`);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
        socket.off("user:joined", handleUserJoined);
    }
  }, [socket, handleUserJoined]);

  return (
    <>
      <h1>Room Screen</h1>
      <p>This is the room screen</p>
    </>
  );
};
