import "./App.css";
import { Typography, AppBar } from "@material-ui/core";
import { VideoPlayer } from "./components/VideoPlayer";
import Notifications from "./components/Notifications";
import { Options } from "./components/Options";

function App() {
  return (
    <>
      <AppBar position="static" color="inherit">
        <Typography variant="h2">Video Chat</Typography>
      </AppBar>
      <VideoPlayer />
      <Notifications />
      <Options />
    </>
  );
}

export default App;
