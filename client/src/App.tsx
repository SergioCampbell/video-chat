import "./App.css";
import { LobbyScreen } from "./screens/LobbyScreen";
import { Room } from "./screens/Room";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LobbyScreen
              username={""}
              room={""}
              setRoom={() => {}}
              setUsername={() => {}}
            />
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <Room
              remoteSocketId={""}
              myStream={null}
              remoteStream={null}
              user={""}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
