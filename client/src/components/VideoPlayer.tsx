import { Grid, Typography, Paper } from "@material-ui/core";
import { FC } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  myVideo: MediaStream | null;
  remoteVideo: MediaStream | null;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ myVideo, remoteVideo }) => {
  return (
    <Grid
      container
      justifyContent="center"
      style={{ display: "flex", flexDirection: "row",  }}
    >
      {/* Our own Video */}
      <Paper>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Name
          </Typography>
          {/* <video playsInline muted ref={null} autoPlay /> */}
          <ReactPlayer
            playing
            muted
            url={myVideo !== null ? myVideo : []}
            height="300px"
            width="300px"
          />
        </Grid>
      </Paper>
      {/* Other user Video */}
      <Paper>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Name
          </Typography>
          {/* <video playsInline muted ref={null} autoPlay /> */}
          <ReactPlayer
            playing
            muted
            url={remoteVideo !== null ? remoteVideo : []}
            height="300px"
            width="300px"
          />
        </Grid>
      </Paper>
    </Grid>
  );
};
