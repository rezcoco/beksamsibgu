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
import { GetQueryUserType } from "@/types/type";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useQuery } from "react-query";
import { ChevronLeft, ChevronRight, CircleX, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  userInfo: GetQueryUserType;
};

export default function UsersTable({ userInfo }: Props) {
  const [page, setPage] = React.useState(1);
  const { getToken } = useAuth();

  const queryKey = [`/users`, userInfo.id, page];

  const { isLoading, isError, data } = useQuery<{
    total: number;
    users: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      reputation: number | null;
      createdAt: string;
      role: "user" | "admin" | "superuser";
    }[];
  }>({
    retry: 3,
    keepPreviousData: true,
    queryKey,
    queryFn: async () => {
      const token = await getToken();
      const res = await axiosRequest.get(`/statistics/users?page=${page}`, {
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

  const roleColors = {
    user: "",
    admin: "text-teal-500",
    superuser: "text-rose-500",
  };

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
    data?.users && (
      <div className="w-full py-5">
        {data!.total > 0 && (
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center ml-auto gap-5">
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
                <TableHead>Username</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Point</TableHead>
                <TableHead>Bergabung tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.length > 0 ? (
                data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell className="capitalize">
                      <Link
                        className="underline underline-offset-4"
                        target="_blank"
                        href={`/profile/${user.username}`}
                      >
                        {`${user.firstName} ${user.lastName}`}
                      </Link>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "uppercase font-medium text-sm",
                        roleColors[user.role!]
                      )}
                    >
                      {user.role}
                    </TableCell>
                    <TableCell>{user.reputation}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "P", {
                        locale: id,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
