import "./App.css";
import { Typography, AppBar, makeStyles } from "@material-ui/core";
import { VideoPlayer } from "./components/VideoPlayer";
import Notifications from "./components/Notifications";
import { Options } from "./components/Options";
import { useEffect } from "react";
import { LobbyScreen } from "./screens/LobbyScreen";
import { Room } from "./screens/Room";

import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
