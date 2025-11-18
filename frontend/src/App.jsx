import React from "react";

export default function CallButton() {
  const makeCall = async () => {
    try {
      const response = await fetch("https://turoo.onrender.com/api/make-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caller_id: "919942101990", // your MSG91 registered caller ID
          client_number: "916382379565", // astrologer / target user
        }),
      });

      const data = await response.json();
      console.log("Call Response:", data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <button onClick={makeCall}>Call Now</button>;
}
