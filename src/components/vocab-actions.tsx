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
import { GetQueryVocabType } from "@/types/type";
import { useAuth, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const VocabActions: React.FC<{
  data: GetQueryVocabType;
}> = ({ data }) => {
  const request = useFetch();
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const { isSignedIn } = useAuth();
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

  async function onFeedback() {
    if (!isSignedIn)
      return router.push(`/auth/sign-in?redirectUrl=${pathname}`);
  }

  async function onReport() {
    if (!isSignedIn)
      return router.push(`/auth/sign-in?redirectUrl=${pathname}`);
  }

  return (
    <>
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
          {data.authorId !== userId && (
            <DropdownMenuItem onClick={onFeedback}>
              Beri masukan
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onReport}>Lapor ke Admin</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVocabulary data={data} open={openEdit} setOpen={setOpenEdit} />
    </>
  );
};

export default VocabActions;
