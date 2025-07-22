"use client"

import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    text,
    isListening,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  return (
    <>
    <button onClick={startListening}>Start Listening</button>
    {isListening && <p>Currently listening</p>}
    {text}
    </>
  );
}
