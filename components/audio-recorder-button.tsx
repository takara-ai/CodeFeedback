"use client"

import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
    onTranscription: (text: string) => void;
}

export function AudioRecorderButton({ onTranscription }: Props) {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    let chunks: Blob[] = [];
    
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Request microphone access and set up MediaRecorder
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            const recorder = new MediaRecorder(stream);
    
            recorder.onstart = () => (chunks = []);
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => handleRecordingStop();
    
            setMediaRecorder(recorder);
          })
          .catch((err) => console.error("Error accessing microphone:", err));
    }, []);

    const handleRecordingStop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
    
        // Prepare FormData with the recorded audio
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
    
        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
    
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
    
          const data = await response.json();
          onTranscription(data.result)
        } catch (error) {
          console.error("Error during transcription:", error);
          alert("Failed to transcribe audio. Please try again.");
        }
      };
    
      const toggleRecording = () => {
        if (!mediaRecorder) return;
        if (recording) {
          mediaRecorder.stop();
        } else {
          mediaRecorder.start();
        }
        setRecording(!recording);
      };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full w-10 h-10"
            onClick={toggleRecording}
            >
            <Mic className="w-5 h-5" />
        </Button>
    );
}

/*
<Button
    variant="ghost"
    size="icon"
    className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full w-10 h-10"
>
    <Mic className="w-5 h-5" />
</Button>
*/