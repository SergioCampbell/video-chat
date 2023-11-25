export interface LobbyScreenProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  room: string | number;
  setRoom: React.Dispatch<React.SetStateAction<string | number>>;
}

export interface RoomProps {
  remoteSocketId: string;
  myStream: MediaStream | null;
  remoteStream: MediaStream | null;
  user: string;
}

export interface RTCDataInterface {
  [key: string]: string | number | null;
}

export interface RTCRoomInterface {
  [key: string]: RTCSessionDescriptionInit;
}

export interface PeerService {
  getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined>;
  getOffer(): Promise<RTCSessionDescriptionInit | undefined>;
  setLocalDescription(answer: RTCSessionDescriptionInit): Promise<void>;
  peer?: RTCPeerConnection | null;
}
