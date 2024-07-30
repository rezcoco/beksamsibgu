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
import { VocabulariesType } from "@/types/type";
import { axiosRequest } from "@/lib/axios";
import toast from "react-hot-toast";
import { revalidateAction } from "@/lib/actions";
import { SelectVocabType } from "@/drizzle/schema";

const VocabActions: React.FC<{
  data: SelectVocabType;
}> = ({ data }) => {
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  async function onDeleteVocab() {
    setIsDeleteLoading(true);
    const toastId = toast.loading("Menunggu...");

    try {
      await axiosRequest.delete(`/vocabularies?id=${data.id}`);
      await revalidateAction("vocabularies");

      toast.dismiss(toastId);
      toast.success("Sukses dihapus");
    } catch (error: any) {
      console.error(error);
      const status = error?.response?.status;
      toast.dismiss(toastId);

      if (status !== 400) {
        toast.error("Something went wrong");
      } else if (status === 404) {
        toast.error("Kosa kata tidak ditemukan");
      } else if (status === 400) {
        toast.error("Bad Request");
      }
    } finally {
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
