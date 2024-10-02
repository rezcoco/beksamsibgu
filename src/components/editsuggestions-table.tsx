"use client";

import { axiosRequest } from "@/lib/queries";
import { GetQueryEditSuggestionsType, GetQueryUserType } from "@/types/type";
import { useAuth } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  CircleX,
  ListFilter,
  Loader2,
} from "lucide-react";
import React from "react";
import { useQuery } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  editSuggestionsCreatedByFilter,
  editSuggestionsStatusFilter,
} from "@/constants";
import EditSuggestionsTabActions from "./editsuggestions-table-actions";
import { cn } from "@/lib/utils";

type Props = {
  userInfo: GetQueryUserType;
};

type ReducerValueType = {
  status: number | undefined;
  createdBy: number | undefined;
  totalActive: number;
  query: string;
};

export default function EditSuggestionsTable({ userInfo }: Props) {
  const { getToken, userId } = useAuth();

  const [page, setPage] = React.useState(1);

  const [filterState, filterDispatch] = React.useReducer(reducer, {
    status: undefined,
    createdBy: undefined,
    totalActive: 0,
    query: "page=1",
  });

  const queryKey = [
    "/users/edit-suggestions",
    userInfo.id,
    page,
    filterState.query,
  ];

  const { isLoading, isError, data } = useQuery<{
    total: number;
    totalRecords: number;
    editSuggestions: GetQueryEditSuggestionsType[];
  }>({
    retry: 3,
    keepPreviousData: true,
    queryKey,
    queryFn: async () => {
      const token = await getToken();
      const res = await axiosRequest.get(
        `/users/${userInfo.id}/edit-suggestions?${filterState.query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data;
    },
  });

  const perPage = 20;
  const totalRecords = data?.total ?? 0;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalRecords);

  function reducer(state: ReducerValueType, action: ReducerValueType) {
    return { ...state, ...action };
  }

  function onFilterStatusChange(status: number | undefined) {
    const searchParams = new URLSearchParams(filterState.query);

    if (filterState.status === status) {
      searchParams.delete("status");

      filterDispatch({
        status: undefined,
        createdBy: filterState.createdBy,
        totalActive: filterState.totalActive - 1,
        query: searchParams.toString(),
      });
    } else {
      searchParams.set("status", String(status));

      filterDispatch({
        totalActive: !isNaN(Number(filterState.status))
          ? filterState.totalActive
          : filterState.totalActive + 1,
        createdBy: filterState.createdBy,
        query: searchParams.toString(),
        status,
      });
    }
  }

  function onFilterCreatedByChange(createdBy: number | undefined) {
    const searchParams = new URLSearchParams(filterState.query);

    if (filterState.createdBy === createdBy) {
      searchParams.delete("createdBy");

      filterDispatch({
        createdBy: undefined,
        status: filterState.status,
        totalActive: filterState.totalActive - 1,
        query: searchParams.toString(),
      });
    } else {
      searchParams.set("createdBy", String(createdBy));

      filterDispatch({
        status: filterState.status,
        totalActive: !isNaN(Number(filterState.createdBy))
          ? filterState.totalActive
          : filterState.totalActive + 1,
        query: searchParams.toString(),
        createdBy,
      });
    }
  }

  return isLoading ? (
    <div className="flex justify-center items-center w-full flex-col gap-1 min-h-52">
      <Loader2 className="animate-spin text-zinc-700 dark:text-zinc-400" />
      <p className="text-sm text-zinc-700 dark:text-zinc-400">Memuat...</p>
    </div>
  ) : isError ? (
    <div className="text-center flex justify-center items-center w-full min-h-52">
      <div className="flex flex-col justify-center items-center gap-1">
        <CircleX size={20} className="text-zinc-700 dark:text-zinc-400" />
        <span className="text-zinc-700 dark:text-zinc-400">
          Terjadi kesalahan
        </span>
      </div>
    </div>
  ) : (
    data?.editSuggestions && (
      <div className="w-full py-5">
        {data!.totalRecords > 0 && (
          <div className="flex justify-between items-center mb-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 flex h-9 min-w-max bg-white dark:bg-muted justify-between items-center gap-2 rounded-md text-sm font-medium transition py-1 text-zinc-700 ring-1 dark:focus-visible:ring-0 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white">
                <ListFilter size={16} />
                <span className="max-sm:hidden">Filter</span>
                {filterState.totalActive > 0 && (
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-600 dark:text-white text-xs">
                    {filterState.totalActive}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="dark:focus:bg-zinc-700 dark:focus:text-white dark:text-zinc-400">
                    Dibuat oleh
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {editSuggestionsCreatedByFilter.map((es) => (
                      <DropdownMenuCheckboxItem
                        className="capitalize"
                        key={es.createdBy}
                        checked={filterState.createdBy === es.value}
                        onCheckedChange={() =>
                          onFilterCreatedByChange(es.value)
                        }
                      >
                        {es.createdBy}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="dark:focus:bg-zinc-700 dark:focus:text-white dark:text-zinc-400">
                    Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {editSuggestionsStatusFilter.map((es) => (
                      <DropdownMenuCheckboxItem
                        className="capitalize"
                        key={es.status}
                        checked={filterState.status === es.value}
                        onCheckedChange={() => onFilterStatusChange(es.value)}
                      >
                        {es.status}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-5">
              <p className="text-sm text-zinc-700 dark:text-zinc-400">{`${start} - ${end} dari ${
                data!.total
              }`}</p>
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant={"outline"}
                  className="px-2"
                  disabled={page - 1 === 0}
                  onClick={() => setPage((prevState) => prevState - 1)}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant={"outline"}
                  className="px-2"
                  disabled={page * perPage >= (data?.total ?? 0)}
                  onClick={() => setPage((prevState) => prevState + 1)}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pengeditan</TableHead>
                <TableHead>Pengedit</TableHead>
                <TableHead>Kosa kata diedit</TableHead>
                <TableHead>Dibuat tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.editSuggestions.length > 0 ? (
                data?.editSuggestions.map((editSuggestion) => (
                  <TableRow key={editSuggestion.id}>
                    <TableCell className="uppercase">
                      {editSuggestion.id}
                    </TableCell>
                    <TableCell className="capitalize">
                      {editSuggestion.authorId === userId ? (
                        <p>{`${editSuggestion.author.firstName} ${editSuggestion.author.lastName}`}</p>
                      ) : (
                        <Link
                          className="underline underline-offset-4"
                          target="_blank"
                          href={`/profile/${editSuggestion.author.username}`}
                        >{`${editSuggestion.author.firstName} ${editSuggestion.author.lastName}`}</Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        target="_blank"
                        href={`/kosa-kata/${editSuggestion.vocabularyId}`}
                        className="underline underline-offset-4"
                      >
                        {editSuggestion.originVocabulary.hangeul}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(editSuggestion.createdAt), "P", {
                        locale: id,
                      })}
                    </TableCell>
                    <TableCell
                      className={cn(
                        editSuggestion.status === "approved" &&
                          "text-emerald-500",
                        editSuggestion.status === "rejected" && "text-red-400"
                      )}
                    >
                      {editSuggestion.status}
                    </TableCell>
                    <TableCell>
                      <EditSuggestionsTabActions
                        data={editSuggestion}
                        userInfo={userInfo}
                        queryKey={queryKey}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Tidak ada saran pengeditan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  );
}
