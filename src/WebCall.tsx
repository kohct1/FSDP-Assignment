import React, { useEffect, useRef, useState } from 'react';

const WebRTCAudioPage: React.FC = () => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const signalingSocketRef = useRef<WebSocket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const SIGNALING_SERVER_URL = 'ws://localhost:8080';
  const iceServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setLocalStream(stream);
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing audio devices:', error);
      }
    };

    startLocalStream();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      clearInterval(timerIntervalRef.current!);
    };
  }, []);

  const setupSignaling = () => {
    signalingSocketRef.current = new WebSocket(SIGNALING_SERVER_URL);

    signalingSocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    signalingSocketRef.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      console.log('Received message:', data);

      if (data.type === 'offer' && peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        signalingSocketRef.current?.send(JSON.stringify(answer));
      }

      if (data.type === 'answer' && peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data));
      }

      if (data.type === 'ice-candidate' && peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    signalingSocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    signalingSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const startCall = async () => {
    try {
      peerConnectionRef.current = new RTCPeerConnection(iceServers);
      setupSignaling();

      localStream?.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, localStream));

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          signalingSocketRef.current?.send(
            JSON.stringify({ type: 'ice-candidate', candidate: event.candidate })
          );
        }
      };

      peerConnectionRef.current.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          monitorSpeaking(event.streams[0], setIsRemoteSpeaking);
        }
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      signalingSocketRef.current?.send(JSON.stringify(offer));

      setIsCallStarted(true);
      monitorSpeaking(localStream!, setIsUserSpeaking);
      startTimer();
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const endCall = () => {
    peerConnectionRef.current?.close();
    signalingSocketRef.current?.close();
    setIsCallStarted(false);
    setIsUserSpeaking(false);
    setIsRemoteSpeaking(false);
    setCallDuration(0);
    clearInterval(timerIntervalRef.current!);
    localStream?.getTracks().forEach(track => track.stop());
  };

  const monitorSpeaking = (stream: MediaStream, setSpeaking: React.Dispatch<React.SetStateAction<boolean>>) => {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkSpeaking = () => {
      analyser.getByteFrequencyData(dataArray);
      const isSpeakingNow = dataArray.some(value => value > 128);
      setSpeaking(isSpeakingNow);
      if (isSpeakingNow) {
        clearTimeout(speakingTimeoutRef.current!);
        speakingTimeoutRef.current = setTimeout(() => setSpeaking(false), 1000);
      }
      requestAnimationFrame(checkSpeaking);
    };

    requestAnimationFrame(checkSpeaking);
  };

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!isCallStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-gray">
        <button
          onClick={startCall}
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 text-lg"
        >
          Join Call
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 min-h-screen text-gray">
      <div className="flex flex-row gap-8 items-center">
        <div className="flex flex-col items-center">
          <div
            className="rounded-full p-1 transition-shadow duration-300"
            style={{
              boxShadow: isUserSpeaking ? '0 0 15px #3B82F6' : 'none',
            }}
          >
            <img
              src="images/User_PFP.png"
              alt="User"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <p className="mt-2 text-lg font-semibold">You</p>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="rounded-full p-1 transition-shadow duration-300"
            style={{
              boxShadow: isRemoteSpeaking ? '0 0 15px #3B82F6' : 'none',
            }}
          >
            <img
              src="images/OCBC_Rep_PFP.png"
              alt="OCBC Representative"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <p className="mt-2 text-lg font-semibold">OCBC rep</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4">{formatTime(callDuration)}</p>

      <audio ref={localAudioRef} autoPlay muted className="hidden" />
      <audio ref={remoteAudioRef} autoPlay className="hidden" />

      <div className="flex gap-4 mt-8">
        <img
          src="images/End_Call.webp"
          alt="End Call"
          onClick={endCall}
          className="w-12 h-12 cursor-pointer transition-opacity duration-300 ease-in-out"
        />
      </div>
    </div>
  );
};

export default WebRTCAudioPage;
