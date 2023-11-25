import { useEffect, useRef } from "react";

const usePeerService = () => {
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!peerRef.current) {
      peerRef.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio:3478",
            ],
          },
        ],
      });
    }

    return () => {
      // Limpiar recursos en caso de ser necesario
    };
  }, []);

  const peer = peerRef.current;

  const getAnswer = async (offer: RTCSessionDescriptionInit) => {
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  };

  const getOffer = async () => {
    if (peer) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  };

  const setLocalDescription = async (answer: RTCSessionDescriptionInit) => {
    if (peer) {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  return { getAnswer, getOffer, setLocalDescription };
};

export default usePeerService;
