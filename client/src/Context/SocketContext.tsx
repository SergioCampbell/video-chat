import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  MutableRefObject,
} from "react";
import { io, Socket } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

interface Call {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: SignalData;
}

interface ContextProviderProps {
  children: React.ReactNode;
}

interface SocketContextProps {
  call: Call;
  callAccepted: boolean;
  myVideo: MutableRefObject<HTMLVideoElement | null>;
  userVideo: MutableRefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
}

const DEFAULT_VALUES: SocketContextProps = {
  call: {
    isReceivingCall: false,
    from: "",
    name: "",
    signal: {} as SignalData,
  },
  callAccepted: false,
  myVideo: { current: null },
  userVideo: { current: null },
  stream: null,
  name: "",
  setName: () => {},
  callEnded: false,
  me: "",
  callUser: () => {},
  leaveCall: () => {},
  answerCall: () => {},
};

const SocketContext = createContext<SocketContextProps>(DEFAULT_VALUES);

const socket: Socket = io("http://localhost:5000");

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [name, setName] = useState("");
  const [call, setCall] = useState<Call>({
    isReceivingCall: false,
    from: "",
    name: "",
    signal: {} as SignalData,
  });
  const [me, setMe] = useState("");
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentUser) => {
        setStream(currentUser);

        if (myVideo.current) {
          myVideo.current.srcObject = currentUser;
        }
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream ? stream : undefined,
    });

    peer.on("signal", (data: SignalData) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream ? stream : undefined,
    });

    peer.on("signal", (data: SignalData) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on("callAccepted", (signal: SignalData) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    if (connectionRef.current !== null) {
      connectionRef.current.destroy();
    }

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default ContextProvider;
