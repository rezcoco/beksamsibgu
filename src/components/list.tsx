import React from "react";
import { createId } from "@paralleldrive/cuid2";
import { ChevronRight, Volume2 } from "lucide-react";
import Link from "next/link";
import VocabActions from "./vocab-actions";
import { Badge } from "./ui/badge";
import { selectVocabularies } from "@/lib/actions";

const List = async () => {
  const data = await selectVocabularies({});

  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data.map(({ record: value }) => (
          <div
            key={createId()}
            className="shadow-sm dark:shadow-none flex-col rounded-lg bg-emerald-50 dark:bg-muted flex"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <p className="font-semibold line-clamp-1">{value.hangul}</p>
                  <button className="hover:bg-zinc-400/10 dark:hover:text-zinc-50/50 rounded-full ml-1 p-1">
                    <Volume2
                      className="text-zinc-400 dark:text-blue-200"
                      size={14}
                    />
                  </button>
                </div>
                <VocabActions data={value} />
              </div>
              <p className="text-sm text-zinc-500 truncate">
                {value.translation}
              </p>
              <Badge
                variant={"outline"}
                className="mt-2 text-[11px] rounded-md border-zinc-300"
              >
                {value.chapter ? `Bab ${value.chapter}` : "Acak"}
              </Badge>
            </div>
            <Link
              href="/"
              className="bg-white dark:bg-zinc-700 rounded-b-lg px-4 py-2 sm:px-6 flex justify-between items-center"
            >
              <p className="text-xs text-muted-foreground">
                Lihat selengkapnya
              </p>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default List;
