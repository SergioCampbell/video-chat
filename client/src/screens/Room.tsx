import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../Context/SocketProvider";
import {
  RTCDataInterface,
  RTCRoomInterface,
  RoomProps,
} from "../types/app.type";
import usePeerService from "../service/peer";
import { PeerService } from "../types/app.type";
import { VideoPlayer } from "../components/VideoPlayer";
import { Button } from "@material-ui/core";

export const Room: React.FC<RoomProps> = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string | number | null>(
    null
  );
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [user, setUser] = useState<string | number | null>(null);

  const handleUserJoined = useCallback(({ username, id }: RTCDataInterface) => {
    console.log(`Username: ${username} Joined room`);
    setRemoteSocketId(id);
    setUser(username);
  }, []);

  const peer: PeerService = usePeerService();

  const handleCallUser = useCallback(async () => {
    const stream = await getLocalStream();
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket, peer]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }: RTCRoomInterface) => {
      const stream = await getLocalStream();
      setMyStream(stream);
      console.log("incomming call from: ", from, offer);
      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket, peer]
  );

  const sendStream = useCallback(() => {
    try {
      if (myStream && peer.peer) {
        const senders = peer.peer.getSenders();
        for (const track of myStream.getTracks()) {
          const existingSender = senders.find(
            (sender) => sender.track && sender.track.id === track.id
          );

          if (!existingSender) {
            peer.peer.addTrack(track, myStream);
          } else {
            console.log("Sender already exists for track: ", track.id);
          }
        }
      }
    } catch (error) {
      console.error({ error });
    }
  }, [myStream, peer]);

  const handleCallAccepted = useCallback(
    ({ answer }: RTCRoomInterface) => {
      if (peer.peer) {
        peer.setLocalDescription(answer);
        console.log("Call accepted!");
        sendStream();
      }
    },
    [sendStream, peer]
  );

  const handleNegociationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:negociation:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket, peer]);

  useEffect(() => {
    if (peer.peer) {
      peer.peer.addEventListener("negotiationneeded", handleNegociationNeeded);
    }
    return () => {
      if (peer.peer) {
        peer.peer.removeEventListener(
          "negotiationneeded",
          handleNegociationNeeded
        );
      }
    };
  }, [handleNegociationNeeded, peer]);

  const handleNegociationIncomming = useCallback(
    async ({ from, offer }: RTCRoomInterface) => {
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:negociation:accepted", { to: from, answer });
    },
    [socket, peer]
  );

  const handleNegociationFinal = useCallback(
    async ({ answer }: RTCRoomInterface) => {
      if (peer.peer) {
        await peer.setLocalDescription(answer);
      }
    },
    [peer]
  );

  useEffect(() => {
    if (peer.peer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      peer.peer.addEventListener("track", async (e: any) => {
        const remoteStream = e.streams;
        console.log("GOT TRACKS!");
        setRemoteStream(remoteStream);
      });
    }
  }, [peer]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:negociation:needed", handleNegociationIncomming);
    socket.on("peer:negociation:final", handleNegociationFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:negociation:needed", handleNegociationIncomming);
      socket.off("peer:negociation:final", handleNegociationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegociationIncomming,
    handleNegociationFinal,
    peer,
  ]);

  const getLocalStream = async () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  return (
    <>
      <h1>Room Screen</h1>
      <h4>{remoteSocketId ? `${user} is Connected` : "No one in the room"}</h4>
      {myStream && (
        <Button
          variant="contained"
          style={{ margin: "1em" }}
          color="primary"
          onClick={sendStream}
        >
          Send Stream
        </Button>
      )}
      {remoteSocketId && (
        <Button
          variant="contained"
          style={{ margin: "1em" }}
          color="primary"
          onClick={handleCallUser}
        >
          Call
        </Button>
      )}
      {myStream && (
        <VideoPlayer myVideo={myStream} remoteVideo={remoteStream} />
      )}
    </>
  );
};
