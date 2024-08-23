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
import { revalidate } from "@/lib/actions";
import EditVocabulary from "./edit-vocabulary";
import toast from "react-hot-toast";
import useFetch from "@/hooks/use-fetch";
import { GetQueryResponseType } from "@/types/type";
import { useUser } from "@clerk/nextjs";

const VocabActions: React.FC<{
  data: GetQueryResponseType;
}> = ({ data }) => {
  const request = useFetch();
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const { user } = useUser();
  const role = user?.publicMetadata.role;
  const userId = user?.id;
  const allowedRoles = ["admin", "superuser"];

  async function onDeleteVocab() {
    console.time("delete");
    setIsDeleteLoading(true);
    const toastId = toast.loading("Menunggu...");

    try {
      const axiosRequest = await request();
      await axiosRequest.delete(`/vocabularies/${data.id}`);

      await revalidate("vocabularies");
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-zinc-700 dark:text-zinc-400 ml-4"
          >
            <span className="sr-only">Open menu</span>
            <DotsVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {(data.authorId === userId ||
            allowedRoles.includes(role as string)) && (
            <>
              <DropdownMenuItem
                onClick={() => setOpenEdit((prevState) => !prevState)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDeleteVocab}
                disabled={isDeleteLoading}
              >
                Hapus
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Beri masukan</DropdownMenuItem>
          <DropdownMenuItem>Lapor ke Admin</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVocabulary data={data} open={openEdit} setOpen={setOpenEdit} />
    </>
  );
};

export default VocabActions;
