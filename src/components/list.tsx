import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import VocabActions from "./vocab-actions";
import { Badge } from "./ui/badge";
import { GetQueryVocabType } from "@/types/type";
import AudioBtn from "./audio-btn";
import NoResultsIcon from "./no-result-icon";

type Props = {
  data: GetQueryVocabType[];
};

export default function List({ data }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-5">
      {data && data?.length > 0 ? (
        data.map((value) => (
          <div
            key={value.id}
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative border flex-col rounded-lg bg-white dark:bg-card flex"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <p className="font-semibold text-zinc-900 dark:text-white line-clamp-1">
                    {value.hangeul}
                  </p>
                  <AudioBtn text={value.hangeul} />
                </div>
                <VocabActions data={value} />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-400 line-clamp-1">
                {value.translation}
              </p>
              <div className="space-x-2">
                <Badge className="mt-2 text-[11px] hover:bg-emerald-500/10 rounded-md border border-emerald-500 text-emerald-500 bg-emerald-500/10">
                  {value.chapter ? `Bab ${value.chapter}` : "Acak"}
                </Badge>
                {value.tag && (
                  <Badge className="mt-2 text-[11px] rounded-md hover:bg-emerald-500/10 capitalize border-emerald-500 text-emerald-500 bg-emerald-500/10">
                    {value.tag.name}
                  </Badge>
                )}
              </div>
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
        ))
      ) : (
        <div className="p-6 mt-8 col-span-3 text-center">
          <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-700 dark:text-zinc-400" />
          <p className="mt-2 text-sm dark:text-zinc-400">
            Kosa kata tidak ditemukan, coba tambahkan
          </p>
        </div>
      )}
    </div>
  );
}
