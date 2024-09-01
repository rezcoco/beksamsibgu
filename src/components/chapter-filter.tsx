"use client";

import React from "react";
import { createId } from "@paralleldrive/cuid2";
import { usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "./ui/scroll-area";
import { Check } from "lucide-react";

type Props = {
  chapter: string | undefined;
};

const ChapterFilter: React.FC<Props> = ({ chapter }) => {
  const [selectedChapter, setSelectedChapter] = React.useState<
    number | undefined
  >(chapter ? Number(chapter) : undefined);
  const [openChapter, setOpenChapter] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function onChapterSelect(value: number) {
    if (value === selectedChapter) {
      setSelectedChapter(() => {
        setOpenChapter(false);
        return undefined;
      });

      router.replace(pathname);
    } else {
      setSelectedChapter(() => {
        setOpenChapter(false);
        return value;
      });

      const sp = new URLSearchParams({
        chapter: String(value),
      });

      router.replace(`${pathname}?${sp.toString()}`);
    }
  }

  return (
    <Popover open={openChapter} onOpenChange={setOpenChapter}>
      <PopoverTrigger asChild>
        <button className="px-4 flex bg-white dark:bg-muted justify-between items-center w-[180px] rounded-md text-sm font-medium transition py-1 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white">
          {selectedChapter === undefined ? "Pilih Bab" : selectedChapter}
          <CaretSortIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[90px]">
        <ScrollArea className="h-[200px] px-2 flex-col gap-2">
          <ul className="w-full">
            {Array.from({ length: 60 }).map((_, index) => (
              <li
                className="list-none hover:text-emerald-500 text-zinc-700 dark:text-zinc-400 w-full"
                key={createId()}
              >
                <button
                  onClick={() => onChapterSelect(index + 1)}
                  className="flex justify-between items-center gap-2 w-full"
                >
                  {index + 1}
                  {selectedChapter && selectedChapter - 1 === index && (
                    <Check size={14} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default ChapterFilter;
