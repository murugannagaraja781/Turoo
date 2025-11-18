import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

export default function Call() {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);

  const room = "room123";

  useEffect(() => {
    socketRef.current = io("https://turoo.onrender.com");

    socketRef.current.on("offer", handleOffer);
    socketRef.current.on("answer", handleAnswer);
    socketRef.current.on("ice", handleIce);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  async function setupPeer() {
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("ice", { room, ice: e.candidate });
      }
    };

    pcRef.current.ontrack = (e) => {
      remoteRef.current.srcObject = e.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      pcRef.current.addTrack(track, stream);
    });
  }

  async function startCall() {
    await setupPeer();
    socketRef.current.emit("join", room);

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socketRef.current.emit("offer", { room, sdp: offer });
  }

  async function joinCall() {
    await setupPeer();
    socketRef.current.emit("join", room);
  }

  async function handleOffer(sdp) {
    await setupPeer();
    await pcRef.current.setRemoteDescription(sdp);

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socketRef.current.emit("answer", { room, sdp: answer });
  }

  async function handleAnswer(sdp) {
    await pcRef.current.setRemoteDescription(sdp);
  }

  async function handleIce(candidate) {
    try {
      await pcRef.current.addIceCandidate(candidate);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Simple Free Audio Call (React)</h2>

      <button onClick={startCall}>Start Call</button>
      <button onClick={joinCall}>Join Call</button>

      <audio ref={localRef} autoPlay muted />
      <audio ref={remoteRef} autoPlay />
    </div>
  );
}
