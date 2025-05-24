"use client"

import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClient, LiveTranscriptionEvent } from "@deepgram/sdk"

interface Props {
  onRecording: (stream: MediaStream | null) => void;
}

export function AudioRecorderButton({ onRecording }: Props) {
    const [recording, setRecording] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);
    
    const startAudio = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setRecording(true);
        } catch (err) {
            console.error("Speech capture error occured:", err);
        }
    };

    const stopAudio = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        onRecording(streamRef.current)
        setRecording(false)
    };

    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);


    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full w-10 h-10"
            onClick={recording ? stopAudio : startAudio}
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