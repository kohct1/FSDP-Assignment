import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WebRTCAudioPage: React.FC = () => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isJoiningCall, setIsJoiningCall] = useState(false); // State for disabling the button during call setup

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const signalingSocketRef = useRef<WebSocket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const response = await fetch("http://localhost:5050/decode/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
  
    if (!response.ok) {
      console.error('Failed to decode token:', await response.text());
      return;
    }
  
    const result = await response.json();
  
    if (result.email && result.email.endsWith("@ocbcstaff.com")) {
      setRole("Staff");
    } else {
      setRole("Customer"); 
    }
  }
  

  const SIGNALING_SERVER_URL = 'ws://localhost:8080';
  const iceServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const iceCandidateQueue: RTCIceCandidate[] = [];

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
      try {
        const data = message.data instanceof Blob ? await message.data.text() : message.data;
        const parsedData = JSON.parse(data);

        console.log('Received message:', parsedData);

        if (parsedData.type === 'offer' && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(parsedData));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          signalingSocketRef.current?.send(JSON.stringify(answer));

          iceCandidateQueue.forEach(candidate => peerConnectionRef.current?.addIceCandidate(candidate));
          iceCandidateQueue.length = 0;
        }

        if (parsedData.type === 'answer' && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(parsedData));
        }

        if (parsedData.type === 'ice-candidate' && peerConnectionRef.current) {
          const candidate = new RTCIceCandidate(parsedData.candidate);
          
          if (peerConnectionRef.current.remoteDescription) {
            await peerConnectionRef.current.addIceCandidate(candidate);
          } else {
            iceCandidateQueue.push(candidate);
          }
        }
      } catch (error) {
        console.error('Error handling message:', error);
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
    setIsJoiningCall(true); // Disable the button

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
    } finally {
      setIsJoiningCall(false); // Re-enable the button
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
    localStream?.getTracks().forEach((track) => track.stop());
  
    if (role === "Staff") {
      navigate("/staff/queue");
    } else {
      localStorage.setItem("showFeedbackForm", "true");
      navigate("/homepage");
    }
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

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; 
        setIsMuted(!isMuted); 
      }
    }
  };

  if (!isCallStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray">
        <button
          onClick={startCall}
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 text-lg"
          disabled={isJoiningCall} // Disable the button while joining
        >
          Join Call
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen text-gray">
      <div className="flex flex-row gap-8 items-center">
        <div className="flex flex-col items-center">
          <div
            className="rounded-full p-1 transition-shadow duration-300"
            style={{
              boxShadow: isUserSpeaking ? '0 0 15px #3B82F6' : 'none',
            }}
          >
            <img
              src="images/UserIcon.png"
              alt="User"
              className="w-24 h-24 object-contain"
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
              src="images/OCBCIcon.png"
              alt="OCBC Representative"
              className="w-24 h-24 object-contain" 
            />
          </div>
          <p className="mt-2 text-lg font-semibold">OCBC rep</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4">{formatTime(callDuration)}</p>

      <audio ref={localAudioRef} autoPlay muted className="hidden" />
      <audio ref={remoteAudioRef} autoPlay className="hidden" />

      <div className="flex gap-8 items-center mt-6">
        <button
          onClick={toggleMute}
          className={`w-16 h-16 flex items-center justify-center rounded-full ${
            isMuted ? 'bg-red-500' : 'bg-green-500'
          } transition-colors duration-300`}
        >
          <img
            src={isMuted ? '/images/Muted.png' : '/images/Unmuted.png'}
            alt={isMuted ? 'Mute' : 'Unmute'}
            className="w-10 h-10"
          />
        </button>

        <button
          onClick={endCall}
          className="w-16 h-16 flex items-center justify-center bg-red-500 rounded-full transition-opacity duration-300 ease-in-out"
        >
          <img
            src="/images/EndCall.png"
            alt="End Call"
            className="w-10 h-10"
          />
        </button>
      </div>
    </div>
  );
};

export default WebRTCAudioPage;
