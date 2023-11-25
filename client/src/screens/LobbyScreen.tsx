import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../Context/SocketProvider";
import { useNavigate } from "react-router-dom";

import { LobbyScreenProps } from "../types/app.type";
import { Form } from "../components/Form";

export const LobbyScreen: React.FC<LobbyScreenProps> = () => {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string | number>("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      socket.emit("room:join", { username, room });
    },
    [username, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data: { room: string }) => {
      const { room } = data;
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

  {
    /* <Grid style={{ marginTop: "13rem" }}>
    <Typography variant="h3">LobbyScreen</Typography>
    <Box component="form" onSubmit={handleSubmitForm}>
      <TextField
        hiddenLabel
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        label="Username"
        required
      />
      <TextField
        hiddenLabel
        id="room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        label="Room Code"
        required
      />
      <MagicButton label="Join" />
    </Box>
  </Grid> */
  }
  return (
    <Form
      handleSubmitForm={handleSubmitForm}
      username={username}
      setUsername={setUsername}
      room={room}
      setRoom={setRoom}
    />
  );
};
