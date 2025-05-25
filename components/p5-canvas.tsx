"use client";

import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface P5CanvasProps {
  code: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export function P5Canvas({ code, onError, onSuccess }: P5CanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const createIframeContent = () => {
    if (!iframeRef.current || !code) return;

    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script>
      try {
        ${code}
      } catch (error) {
        console.error('p5.js error:', error);
        document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: Arial;">Error: ' + error.message + '</div>';
      }
    </script>
</body>
</html>`;

      // Clean up previous URL
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      
      setCurrentUrl(url);
      iframeRef.current.src = url;
      onSuccess?.();

    } catch (error) {
      console.error("Error creating p5.js iframe:", error);
      onError?.(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    createIframeContent();

    // Cleanup URL when component unmounts
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [code, onError, onSuccess]);

  const restartAnimation = () => {
    createIframeContent();
  };

  return (
    <div className="relative h-full w-full">
      <iframe
        ref={iframeRef}
        className="h-full w-full border-0"
        title="p5.js Canvas"
      />
      
      {/* Restart Button */}
      <Button
        onClick={restartAnimation}
        className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-md transition-all duration-200 flex items-center gap-1 text-sm font-medium shadow-lg backdrop-blur-sm"
        title="Restart Animation"
        
      >
        <RotateCcw size={16} />
        <span className="hidden sm:inline">Restart</span>
      </Button>
    </div>
  );
} 