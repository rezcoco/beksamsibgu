"use client";

import React from "react";
import { axiosRequest } from "@/lib/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { GetQueryReportType, GetQueryUserType } from "@/types/type";
import { allowedRoles } from "@/constants";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useQuery } from "react-query";
import {
  ChevronLeft,
  ChevronRight,
  CircleX,
  ListFilter,
  Loader2,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import ReportsActions from "./reports-table-actions";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Props = {
  userInfo: GetQueryUserType;
  url: string;
};

type ReducerValueType = {
  status: number | undefined;
  isActive: boolean;
  query: string;
};

export default function ReportsTable({ userInfo, url }: Props) {
  const [page, setPage] = React.useState(1);
  const { getToken } = useAuth();

  const [filterState, filterDispatch] = React.useReducer(reducer, {
    status: undefined,
    isActive: false,
    query: "page=1",
  });

  const queryKey = [`/reports`, userInfo.id, page, filterState.query];

  const { isLoading, isError, data } = useQuery<{
    total: number;
    reports: GetQueryReportType[];
  }>({
    retry: 3,
    keepPreviousData: true,
    queryKey,
    queryFn: async () => {
      const token = await getToken();
      const res = await axiosRequest.get(`${url}?${filterState.query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
  });

  const perPage = 20;
  const totalRecords = data?.total ?? 0;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalRecords);

  function reducer(state: ReducerValueType, action: ReducerValueType) {
    return {
      ...state,
      ...action,
    };
  }

  function onFilterChange(status: number | undefined) {
    const searchParams = new URLSearchParams({ page: String(page) });

    if (filterState.status === status) {
      filterDispatch({
        status: undefined,
        isActive: false,
        query: searchParams.toString(),
      });
    } else {
      searchParams.set("status", String(status));

      filterDispatch({
        status,
        isActive: true,
        query: searchParams.toString(),
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
    data?.reports && (
      <div className="w-full py-5">
        {data!.total > 0 && (
          <div className="flex justify-between items-center mb-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 flex h-9 min-w-max bg-white dark:bg-muted justify-between items-center gap-2 rounded-md text-sm font-medium transition py-1 text-zinc-700 ring-1 dark:focus-visible:ring-0 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white">
                <ListFilter size={16} />
                <span className="max-sm:hidden">Filter</span>
                {filterState.isActive && (
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-600 dark:text-white text-xs">
                    1
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="dark:focus:bg-zinc-700 dark:focus:text-white dark:text-zinc-400">
                    Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuCheckboxItem
                      checked={filterState.status === 0}
                      onCheckedChange={() => onFilterChange(0)}
                    >
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterState.status === 1}
                      onCheckedChange={() => onFilterChange(1)}
                    >
                      Resolved
                    </DropdownMenuCheckboxItem>
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
                <TableHead>ID Laporan</TableHead>
                <TableHead>Laporan</TableHead>
                {allowedRoles.includes(userInfo.role) && (
                  <TableHead>Pelapor</TableHead>
                )}
                <TableHead>Kosa kata dilaporkan</TableHead>
                <TableHead>Dibuat tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.reports.length > 0 ? (
                data?.reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="uppercase">{report.id}</TableCell>
                    <TableCell className="truncate max-w-12">
                      {report.message}
                    </TableCell>
                    {allowedRoles.includes(userInfo.role) && (
                      <TableCell>
                        <Link
                          target="_blank"
                          className="capitalize underline"
                          href={`/profile/${report.reporterId}`}
                        >{`${report.reporter.firstName} ${report.reporter.lastName}`}</Link>
                      </TableCell>
                    )}
                    <TableCell>
                      <Link
                        target="_blank"
                        href={`/kosa-kata/${report.vocabularyId}`}
                        className="underline underline-offset-4"
                      >
                        {report.vocabulary.hangeul}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(report.createdAt), "P", {
                        locale: id,
                      })}
                    </TableCell>
                    <TableCell
                      className={cn(
                        report.status === "resolved" && "text-emerald-500"
                      )}
                    >
                      {report.status}
                    </TableCell>
                    <TableCell>
                      <ReportsActions
                        userInfo={userInfo}
                        data={report}
                        queryKey={queryKey}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada laporan
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
