import React, { useCallback, useEffect } from "react";
import { useSocket } from "../Context/SocketProvider";
import { useNavigate } from "react-router-dom";

export const LobbyScreen = () => {
  const [username, setUsername] = React.useState("");
  const [room, setRoom] = React.useState("");

  const socket = useSocket();

  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { username, room });
    },
    [username, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { username, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [handleJoinRoom, socket]);
  return (
    <>
      <h1>LobbyScreen</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </>
  );
};
