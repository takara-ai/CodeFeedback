"use client";

import React, { useEffect, useRef } from "react";

interface P5CanvasProps {
  code: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export function P5Canvas({ code, onError, onSuccess }: P5CanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    try {
      const htmlContent = `

    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>
    

    <script>
      try {
        ${code}
      } catch (error) {
        console.error('p5.js error:', error);
        document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: Arial;">Error: ' + error.message + '</div>';
      }
    </script>
`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      
      iframeRef.current.src = url;
      onSuccess?.();

      // Cleanup URL when component unmounts or code changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error creating p5.js iframe:", error);
      onError?.(error instanceof Error ? error.message : String(error));
    }
  }, [code, onError, onSuccess]);

  return (
    <iframe
      ref={iframeRef}
      className="h-full w-full border-0"
      title="p5.js Canvas"
    />
  );
} 