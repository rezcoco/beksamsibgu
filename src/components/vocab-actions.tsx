"use client";

import React from "react";
import { Button } from "./ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { axiosRequest } from "@/lib/axios";
import toast from "react-hot-toast";
import { SelectVocabType } from "@/drizzle/schema";
import { useRouter } from "next/navigation";

const VocabActions: React.FC<{
  data: SelectVocabType;
}> = ({ data }) => {
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const router = useRouter();

  async function onDeleteVocab() {
    console.time("delete");
    setIsDeleteLoading(true);
    const toastId = toast.loading("Menunggu...");

    try {
      await axiosRequest.delete(`/vocabularies?id=${data.id}`);
      router.refresh();

      toast.success("Berhasil dihapus", { id: toastId });
    } catch (error: any) {
      console.error(error);
      const status = error?.response?.status;

      if (status === 404) {
        toast.error("Kosa kata tidak ditemukan", { id: toastId });
      } else if (status === 400) {
        toast.error("Bad Request", { id: toastId });
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } finally {
      console.timeEnd("delete");
      setIsDeleteLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-zinc-400/10 ml-4"
        >
          <span className="sr-only">Open menu</span>
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onDeleteVocab} disabled={isDeleteLoading}>
          Hapus
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Beri masukan</DropdownMenuItem>
        <DropdownMenuItem>Lapor ke Admin</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VocabActions;
