"use client";

import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { GetQueryReportType, GetQueryUserType } from "@/types/type";
import { toastError } from "@/lib/utils";
import toast from "react-hot-toast";
import { axiosRequest } from "@/lib/queries";
import { useQueryClient } from "react-query";
import { useAuth } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { allowedRoles } from "@/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  data: GetQueryReportType;
  userInfo: GetQueryUserType;
  queryKey: any[];
};

export default function ReportsTableActions({
  data,
  userInfo,
  queryKey,
}: Props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  async function onDelete() {
    const toastId = toast.loading("Memuat...");
    try {
      const token = await getToken();

      await axiosRequest.delete(`/reports/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await queryClient.refetchQueries({
        queryKey,
      });

      toast.success("Berhasil menghapus", { id: toastId });
    } catch (error: any) {
      const status = error?.response?.status;
      console.error(error);

      toastError(status, toastId);
    }
  }

  async function onResolve() {
    const toastId = toast.loading("Memuat...");
    try {
      const token = await getToken();

      await axiosRequest.patch(
        `/reports/${data.id}`,
        {
          status: 1,
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

      toast.success("Berhasil", { id: toastId });
    } catch (error: any) {
      const status = error?.response?.status;
      console.error(error);

      toastError(status, toastId);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenDialog(true)}>
            Lihat
          </DropdownMenuItem>
          {data.reporterId === userId && (
            <DropdownMenuItem onClick={onDelete}>Hapus</DropdownMenuItem>
          )}
          {allowedRoles.includes(userInfo.role) &&
            data.status === "pending" && (
              <DropdownMenuItem onClick={onResolve}>Resolve</DropdownMenuItem>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Laporan</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[320px]">
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              {data.message}
            </p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
