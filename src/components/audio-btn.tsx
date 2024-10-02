"use client";

import { API_UTILS_URL } from "@/constants";
import { Volume2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  text: string;
};

const AudioBtn: React.FC<Props> = ({ text }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [audioSrc, setAudioSrc] = React.useState<string | undefined>();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  async function onAudioClicked() {
    setIsLoading(true);
    const toastId = toast.loading("Memuat...");

    try {
      const res = await fetch(`${API_UTILS_URL}/vocabularies/audio`, {
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!res.ok) throw new Error(res.statusText);

      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);
      setAudioSrc(blobUrl);
      toast.dismiss(toastId);

      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.onended = () => {
          URL.revokeObjectURL(blobUrl);
          setAudioSrc(undefined);
        };
      }
    } catch (error) {
      toast.error("Gagal memuat audio", { id: toastId });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      disabled={isLoading}
      onClick={onAudioClicked}
      className="hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:text-zinc-400/10 dark:hover:text-zinc-50/50 rounded-full ml-1 p-1"
    >
      <Volume2 size={16} className="text-sky-400" />
      <audio autoPlay ref={audioRef}>
        {audioSrc && <source type="audio/mpeg" src={audioSrc} />}
        Your browser does not support the audio element.
      </audio>
    </button>
  );
};

export default AudioBtn;
