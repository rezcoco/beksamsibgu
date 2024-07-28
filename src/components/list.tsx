import React from "react";
import { nanoid } from "nanoid";
import { ChevronRight, Volume2 } from "lucide-react";
import { serverGetVocabularies } from "@/lib/action";

const List = async () => {
  const data = await serverGetVocabularies();

  return (
    <section>
      <div className="flex flex-col gap-5">
        {data.map((value) => (
          <div
            key={nanoid()}
            className="bg-muted rounded-lg px-6 py-5 flex justify-between items-center"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold">{value.hangul}</p>
                <Volume2 size={16} className="text-zinc-400" />
              </div>
              <p className="text-sm">{value.translation}</p>
            </div>
            <ChevronRight size={20} className="text-zinc-400" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default List;
