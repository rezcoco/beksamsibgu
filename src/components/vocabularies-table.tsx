"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  CircleX,
  Loader2,
  Trash2,
} from "lucide-react";
import { useQuery, useQueryClient } from "react-query";
import { axiosRequest } from "@/lib/queries";
import { useAuth } from "@clerk/nextjs";
import { GetQueryUserType, GetQueryVocabType } from "@/types/type";
import { allowedRoles } from "@/constants";
import { toastError } from "@/lib/utils";
import Link from "next/link";
import VocabulariesTabActions from "./vocabularies-table-actions";
import toast from "react-hot-toast";

type Props = {
  userInfo: GetQueryUserType;
  url: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export default function VocabulariesTable({ userInfo, url }: Props) {
  const { userId, getToken } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [totalCheckBoxSelected, setTotalCheckBoxSelected] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState({});
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  const queryKey = ["/vocabularies", userInfo.id, page];

  const { isLoading, isError, data } = useQuery<{
    total: number;
    vocabularies: GetQueryVocabType[];
  }>({
    retry: 3,
    keepPreviousData: true,
    queryKey,
    queryFn: async () => {
      const res = await axiosRequest.get(`${url}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      return res.data.data;
    },
  });

  const [state, dispatch] = React.useReducer<
    (
      state: string[],
      action: {
        type: "remove" | "add";
        data: string[];
      }
    ) => string[]
  >(reducer, []);

  function reducer(
    state: string[],
    action: {
      type: "remove" | "add";
      data: string[];
    }
  ) {
    switch (action.type) {
      case "add":
        return state.concat(action.data);
      case "remove":
        return action.data;
      default:
        return [""];
    }
  }

  const columns: ColumnDef<GetQueryVocabType>[] = [
    {
      accessorKey: "hangeul",
      header: "Hangeul",
      cell: ({ row }) =>
        allowedRoles.includes(userInfo.role) || userId === userInfo.id ? (
          <p className="capitalize">{row.getValue("hangeul")}</p>
        ) : (
          <Link
            target="_blank"
            href={`/kosa-kata/${row.id}`}
            className="capitalize underline underline-offset-4"
          >
            {row.getValue("hangeul")}
          </Link>
        ),
    },
    {
      accessorKey: "translation",
      header: () => <div>Arti</div>,
      cell: ({ row }) => (
        <p className="lowercase">{row.getValue("translation")}</p>
      ),
    },
    {
      accessorKey: "chapter",
      filterFn: "includesStringSensitive",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bab
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <p className="font-semibold ml-5">
          {row.getValue("chapter") ?? "Acak"}
        </p>
      ),
    },
  ];

  if (allowedRoles.includes(userInfo.role) || userInfo.id === userId) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        return (
          <VocabulariesTabActions queryKey={queryKey} data={row.original} />
        );
      },
    });

    columns.unshift({
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => {
            table.toggleAllPageRowsSelected(!!value);
            switch (!!value) {
              case true:
                setTotalCheckBoxSelected(data?.vocabularies.length ?? 0);
                dispatch({
                  type: "add",
                  data: data!.vocabularies.map((value) => value.id),
                });
                break;
              case false:
                setTotalCheckBoxSelected(0);
                dispatch({
                  type: "remove",
                  data: [],
                });
              default:
                break;
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            setTotalCheckBoxSelected((prevState) =>
              !!value ? prevState + 1 : prevState - 1
            );

            switch (!!value) {
              case true:
                dispatch({
                  type: "add",
                  data: [row.original.id],
                });
                break;
              case false:
                dispatch({
                  type: "remove",
                  data: state.filter((value) => value !== row.original.id),
                });
                break;
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }
  const table = useReactTable<GetQueryVocabType>({
    data: data?.vocabularies ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (originalRow) => originalRow.id,
    state: {
      rowSelection: selectedRows,
    },
    onRowSelectionChange: setSelectedRows,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  const perPage = 20;
  const totalRecords = data?.total ?? 0;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalRecords);

  async function onDelete() {
    try {
      setIsDeleteLoading(true);
      const token = await getToken();
      await axiosRequest.post(
        "/vocabularies/delete-bulk",
        {
          vocabularies: state,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await queryClient.refetchQueries({
        queryKey,
      });
      toast.success("Berhasil menghapus");
    } catch (error: any) {
      const status = error?.response?.status;
      console.error(error);

      toastError(status);
    } finally {
      setIsDeleteLoading(false);
      setSelectedRows({});
      setTotalCheckBoxSelected(0);
      dispatch({ type: "remove", data: [] });
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
    <div className="w-full py-5">
      <div className="flex justify-between lg:items-center flex-col lg:flex-row mb-5">
        {totalCheckBoxSelected > 0 && (
          <div className="flex items-center gap-5 max-md:mb-6">
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              {`${totalCheckBoxSelected} / ${data?.vocabularies.length} baris dipilih`}
            </p>
            <Button
              onClick={onDelete}
              disabled={isDeleteLoading}
              variant={"outline"}
              className="space-x-2 text-zinc-700 dark:text-zinc-400 w-fit"
            >
              {isDeleteLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              <span>
                {isDeleteLoading ? "Hapus Kosa kata..." : "Hapus Kosa kata"}
              </span>
            </Button>
          </div>
        )}

        {data!.total > 0 && (
          <div className="flex items-center gap-5 ml-auto">
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
                disabled={
                  page * perPage >= (data?.total ?? 0) ||
                  totalCheckBoxSelected > 0
                }
                onClick={() => setPage((prevState) => prevState + 1)}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada kosa kata, coba tambahkan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
