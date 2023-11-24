import React, { useContext } from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import VideoContext from "../Context/VideoContext";
import ContextProvider from "../Context/SocketContext";
// import { makeStyles } from '@material-ui/core/styles'

// import { SocketContext } from '../SocketContext'

export const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(VideoContext);
  return (
    <Grid>
      {/* Our own Video */}
      <Paper>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Name
          </Typography>
          <video playsInline muted ref={null} autoPlay />
        </Grid>
      </Paper>
      {/* Other user Video */}
      <Paper>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Name
          </Typography>
          <video playsInline muted ref={null} autoPlay />
        </Grid>
      </Paper>
    </Grid>
  );
};
