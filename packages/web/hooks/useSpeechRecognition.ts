"use client";
import { useEffect, useState } from "react";

let recognition = null;

if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
}

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      console.log("Speech recognition result:", event);
      recognition.stop();
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    setText("");
    setIsListening(true);
    recognition!.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition!.stop();
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition;
