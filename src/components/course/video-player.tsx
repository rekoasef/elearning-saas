"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  // Función para transformar URLs de YouTube a modo Embed si es necesario
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  const finalUrl = getEmbedUrl(videoUrl);

  return (
    <div className="relative w-full h-full bg-[#050505]">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
      <iframe
        src={finalUrl}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        allowFullScreen
        onLoad={() => setIsReady(true)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};