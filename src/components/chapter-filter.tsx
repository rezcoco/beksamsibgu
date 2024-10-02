"use client";

import React from "react";
import { createId } from "@paralleldrive/cuid2";
import { usePathname, useRouter } from "next/navigation";
import { Check, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useQuery } from "react-query";
import { axiosRequest } from "@/lib/queries";

type Props = {
  query: string;
  totalFilter: number;
};

type ReducerValueType = {
  createdByUser: number | undefined;
  chapter: string | undefined;
  totalFilter: number;
};

type ReducerActionType =
  | {
      createdByUser: number | undefined;
      totalFilter: number;
    }
  | {
      chapter: string | undefined;
      totalFilter: number;
    };

export default function ChapterFilter({ query, totalFilter }: Props) {
  const searchParams = new URLSearchParams(query);
  const createdByUser = searchParams.get("createdByUser");
  const chapter = searchParams.get("chapter");

  const [state, dispatch] = React.useReducer(reducer, {
    createdByUser: Number(createdByUser) || 0,
    chapter: chapter ?? "",
    totalFilter: totalFilter,
  });
  const [searchChapter, setSearchChapter] = React.useState(state.chapter);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryParams = new URLSearchParams(query);

  const {} = useQuery({
    queryKey: ["/tags"],
    queryFn: async () => {
      const res = axiosRequest.get("/tags");
    },
  });

  function reducer(state: ReducerValueType, action: ReducerActionType) {
    return { ...state, ...action };
  }

  function onChapterChange(value: string) {
    if (value === state.chapter) {
      const totalFilter = state.totalFilter - 1;
      dispatch({ chapter: "", totalFilter });
      setSearchChapter("");
      setOpenDropdown(false);

      queryParams.delete("chapter");

      router.replace(`${pathname}?${queryParams.toString()}`);
    } else {
      const totalFilter = state.chapter
        ? state.totalFilter
        : state.totalFilter + 1;
      dispatch({ chapter: value, totalFilter });
      setSearchChapter(value);
      setOpenDropdown(false);

      queryParams.set("chapter", value);

      router.replace(`${pathname}?${queryParams.toString()}`);
    }
  }

  function onCreatedByUserChange(checked: number) {
    const totalFilter = checked ? state.totalFilter + 1 : state.totalFilter - 1;
    dispatch({
      createdByUser: checked,
      totalFilter,
    });

    if (checked) {
      queryParams.set("createdByUser", String(checked));
      router.replace(`${pathname}?${queryParams.toString()}`);
    } else {
      queryParams.delete("createdByUser");
      router.replace(`${pathname}?${queryParams.toString()}`);
    }
  }

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger className="px-3 flex h-9 min-w-max bg-white dark:bg-muted justify-between items-center gap-2 rounded-md text-sm font-medium transition py-1 text-zinc-700 ring-1 dark:focus-visible:ring-0 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white">
        <ListFilter size={16} />
        <span className="max-sm:hidden">Filter</span>
        {state.totalFilter > 0 && (
          <span className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-600 dark:text-white text-xs">
            {state.totalFilter}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="mt-1">
        <DropdownMenuLabel className="dark:text-zinc-400">
          Filter Berdasarkan
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={state.createdByUser === 1}
          onCheckedChange={(value) => onCreatedByUserChange(value ? 1 : 0)}
        >
          Kosa kata saya
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Bab</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-0 ml-2">
            <Command className="max-w-[150px]">
              <CommandInput
                value={searchChapter}
                onValueChange={(value) => setSearchChapter(value)}
                placeholder="Cari bab..."
              />
              <CommandList>
                <CommandEmpty>Bab tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {Array.from({ length: 60 }).map((_, index) => {
                    const label = String(index + 1);
                    return (
                      <CommandItem
                        onSelect={onChapterChange}
                        key={createId()}
                        value={label}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            label === state.chapter
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
