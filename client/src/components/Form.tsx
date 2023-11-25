import { Box, Grid, TextField, Typography } from "@material-ui/core";
import { MagicButton } from "./Buttons";

interface PropsInterface {
  username: string;
  setUsername: (username: string) => void;
  room: string | number;
  setRoom: (room: string) => void;
  handleSubmitForm: (e: React.FormEvent) => void;
}
export const Form = ({
  handleSubmitForm,
  username,
  setUsername,
  room,
  setRoom,
}: PropsInterface) => {
  return (
    <Grid className="form-container">
        <Typography hidden variant="h3" gutterBottom></Typography>
      <span className="form-title">LobbyScreen</span>
      <Box className="form" component="form" onSubmit={handleSubmitForm}>
        <TextField
          className="form-group"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
          required
        />
        <TextField
          className="form-group"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          label="Room Code"
          required
        />
        <MagicButton label="Join" />
      </Box>
    </Grid>
  );
};
