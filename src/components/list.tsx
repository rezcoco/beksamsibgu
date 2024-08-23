import React from "react";
import { createId } from "@paralleldrive/cuid2";
import { ChevronRight, Volume2 } from "lucide-react";
import Link from "next/link";
import VocabActions from "./vocab-actions";
import { Badge } from "./ui/badge";
import { fetchData } from "@/lib/queries";
import { GetQueryResponseType } from "@/types/type";
import AudioBtn from "./audio-btn";

const List = async () => {
  const data: GetQueryResponseType[] = await fetchData("/vocabularies", [
    "vocabularies",
  ]);

  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data.map((value) => (
          <div
            key={value.id}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative border flex-col rounded-lg bg-white dark:bg-zinc-900 flex"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <p className="font-semibold text-zinc-900 dark:text-white line-clamp-1">
                    {value.hangeul}
                  </p>
                  <AudioBtn />
                </div>
                <VocabActions data={value} />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-400 line-clamp-1">
                {value.translation}
              </p>
              <Badge className="mt-2 text-[11px] rounded-md bg-emerald-500 text-white dark">
                {value.chapter ? `Bab ${value.chapter}` : "Acak"}
              </Badge>
            </div>
            <Link
              href={`/kosa-kata/${value.id}`}
              className="border-t border-muted dark:bg-zinc-900 rounded-b-lg px-4 py-2 sm:px-6 flex justify-between items-center"
            >
              <p className="text-xs text-zinc-700 dark:text-zinc-400">
                Lihat selengkapnya
              </p>
              <ChevronRight
                size={16}
                className="text-zinc-700 dark:text-zinc-400"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default List;
