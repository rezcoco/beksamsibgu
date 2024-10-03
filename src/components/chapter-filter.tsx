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
};

type Reducer = {
  createdByUser: number | undefined;
  chapter: string | undefined;
  tag: string | undefined;
};

type ReducerAction =
  | { chapter: string | undefined }
  | { createdByUser: number | undefined }
  | { tag: string | undefined };

export default function ChapterFilter({ query }: Props) {
  const searchParams = new URLSearchParams(query);
  const createdByUser = searchParams.get("createdByUser");
  const chapter = searchParams.get("chapter");
  const tag = searchParams.get("tag");

  const [state, dispatch] = React.useReducer(reducer, {
    createdByUser: Number(createdByUser) || 0,
    chapter: chapter ?? "",
    tag: tag ?? "",
  });
  const [searchChapter, setSearchChapter] = React.useState(state.chapter);
  const [searchTag, setSearchTag] = React.useState(state.tag);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryParams = new URLSearchParams(query);
  let totalFilter = queryParams.size;

  if (queryParams.has("page")) totalFilter -= 1;
  if (queryParams.has("tab")) totalFilter -= 1;

  const { data } = useQuery<{
    total: number;
    tags: {
      id: string;
      name: string;
    }[];
  }>({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axiosRequest.get("/tags");

      return res.data.data;
    },
  });

  function reducer(state: Reducer, action: ReducerAction) {
    return { ...state, ...action };
  }

  function onChapterChange(value: string) {
    if (value === state.chapter) {
      dispatch({ chapter: "" });
      setSearchChapter("");
      setOpenDropdown(false);

      queryParams.delete("chapter");

      router.replace(`${pathname}?${queryParams.toString()}`);
    } else {
      dispatch({ chapter: value });
      setSearchChapter(value);
      setOpenDropdown(false);

      queryParams.set("chapter", value);

      router.replace(`${pathname}?${queryParams.toString()}`);
    }
  }

  function onCreatedByUserChange(checked: number) {
    dispatch({
      createdByUser: checked,
    });

    if (checked) {
      queryParams.set("createdByUser", String(checked));
      router.replace(`${pathname}?${queryParams.toString()}`);
    } else {
      queryParams.delete("createdByUser");
      router.replace(`${pathname}?${queryParams.toString()}`);
    }
  }

  function onTagChange(value: string) {
    console.log(value, state.tag);
    if (state.tag === value) {
      queryParams.delete("tag");

      dispatch({
        tag: undefined,
      });
      setSearchTag("");
      setOpenDropdown(false);

      router.replace(`${pathname}?${queryParams.toString()}`);
    } else {
      queryParams.set("tag", value);

      dispatch({
        tag: value,
      });
      setSearchTag(value);
      setOpenDropdown(false);

      router.replace(`${pathname}?${queryParams.toString()}`);
    }
  }

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger className="px-3 flex h-9 min-w-max bg-white dark:bg-muted justify-between items-center gap-2 rounded-md text-sm font-medium transition py-1 text-zinc-700 ring-1 dark:focus-visible:ring-0 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white">
        <ListFilter size={16} />
        <span className="max-sm:hidden">Filter</span>
        {totalFilter > 0 && (
          <span className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-600 dark:text-white text-xs">
            {totalFilter}
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Tag</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-0 ml-2">
            <Command className="max-w-[150px]">
              <CommandInput
                value={searchTag}
                onValueChange={(value) => setSearchTag(value)}
                placeholder="Cari bab..."
              />
              <CommandList>
                <CommandEmpty>Tag tidak ditemukan</CommandEmpty>
                <CommandGroup>
                  {data ? (
                    data.tags.map((tag) => {
                      return (
                        <CommandItem
                          onSelect={onTagChange}
                          key={tag.id}
                          value={tag.id}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              tag.id === state.tag ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {tag.name}
                        </CommandItem>
                      );
                    })
                  ) : (
                    <p className="text-sm">Tag tidak ada</p>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
