import { Volume2 } from "lucide-react";
import React from "react";

const AudioBtn = () => {
  return (
    <button className="hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:text-zinc-400/10 dark:hover:text-zinc-50/50 rounded-full ml-1 p-1">
      <Volume2 size={16} className="text-sky-400" />
    </button>
  );
};

export default AudioBtn;
