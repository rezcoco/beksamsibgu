"use client";

import React from "react";
import { Button } from "./ui/button";
import { Button as TButton } from "./button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { revalidate, revalidateByTag } from "@/lib/actions";
import EditVocabulary from "./edit-vocabulary";
import toast from "react-hot-toast";
import { GetQueryVocabType } from "@/types/type";
import { useAuth, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle as SDialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema, ReportSchemaType } from "@/lib/validation";
import { Form, FormField, FormItem } from "./ui/form";
import { axiosRequest } from "@/lib/queries";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type ReducerState = {
  open: boolean;
  mode: "edit-vocabulary" | "suggest";
};

type Props = {
  data: GetQueryVocabType;
  type?: "list" | "table";
};

export default function VocabActions({ data, type = "list" }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const role = user?.publicMetadata.role;
  const userId = user?.id;
  const allowedRoles = ["admin", "superuser"];

  const [openReport, setOpenReport] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [isReportLoading, setIsReportLoading] = React.useState(false);
  const [state, dispatch] = React.useReducer<
    (state: ReducerState, action: ReducerState) => ReducerState
  >(
    (_, action) => {
      return action;
    },
    {
      open: false,
      mode: "edit-vocabulary",
    }
  );
  const form = useForm<ReportSchemaType>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onDeleteVocab() {
    console.time("delete");
    setIsDeleteLoading(true);
    const toastId = toast.loading("Menunggu...");

    try {
      await axiosRequest.delete(`/vocabularies/${data.id}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      await revalidate("/kosa-kata");
      toast.success("Berhasil dihapus", { id: toastId });
    } catch (error: any) {
      console.error(error);
      const status = error?.response?.status;

      if (status === 404) {
        toast.error("Kosa kata tidak ditemukan", { id: toastId });
      } else if (status === 400) {
        toast.error("Bad Request", { id: toastId });
      } else {
        toast.error("Terjadi Kesalahan", { id: toastId });
      }
    } finally {
      console.timeEnd("delete");
      setIsDeleteLoading(false);
    }
  }

  async function onFeedback() {
    if (!isSignedIn) {
      return router.push(
        `/auth/sign-in?redirect_url=${encodeURIComponent(pathname)}`
      );
    }

    dispatch({
      open: !state.open,
      mode: "suggest",
    });
  }

  function onReportClicked() {
    if (!isSignedIn) {
      return router.push(
        `/auth/sign-in?redirect_url=${encodeURIComponent(pathname)}`
      );
    }

    setOpenDropdown((prevState) => !prevState);
    setOpenReport((prevState) => !prevState);
    form.resetField("message");
  }

  async function onSubmitReport(values: ReportSchemaType) {
    try {
      setIsReportLoading(true);

      await axiosRequest.post(
        "/reports",
        Object.assign(values, {
          reporterId: userId,
          vocabularyId: data.id,
        }),
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      toast.success("Laporan dikirim");
    } catch (error: any) {
      const status = error?.response?.status;
      console.error(error);

      switch (status) {
        case 400:
          toast.error("Bad Request");
          break;
        case 404:
          toast.error("Kosa kata tidak ditemukan");
        default:
          toast.error("Terjadi kesalahan");
          break;
      }
    } finally {
      setIsReportLoading(false);
      setOpenDropdown(false);
      setOpenReport(false);
    }
  }

  async function onSubmitEdit(body: any) {
    try {
      if (state.mode === "edit-vocabulary") {
        await axiosRequest.put(`/vocabularies/${data.id}`, body, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });

        revalidate("/kosa-kata");
        await revalidateByTag(`/vocabularies/${data.id}`);
        toast.success("Berhasil menyunting", { duration: 2500 });
      } else {
        await axiosRequest.post(
          "/edit-suggestions",
          Object.assign(body, {
            vocabularyId: data.id,
          }),
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        toast.success("Berhasil mengirimkan saran");
      }
    } catch (error: any) {
      throw new Error(error?.message, {
        cause: error,
      });
    }
  }

  return (
    <>
      <DropdownMenu
        modal={false}
        open={openDropdown}
        onOpenChange={setOpenDropdown}
      >
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
          <DropdownMenuSeparator />
          {type === "table" && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/kosa-kata/${data.id}`}>Lihat</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {(data.authorId === userId ||
            allowedRoles.includes(role as string)) && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  dispatch({
                    open: !state.open,
                    mode: "edit-vocabulary",
                  })
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenDelete(true)}
                disabled={isDeleteLoading}
              >
                Hapus
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          {data.authorId !== userId && (
            <DropdownMenuItem onClick={onFeedback}>
              Sarankan pengeditan
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onReportClicked}>
            Laporkan ke Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openReport} onOpenChange={onReportClicked}>
        <DialogContent className="dark:bg-zinc-900 rounded-md">
          <DialogHeader className="mb-4">
            <SDialogTitle>Laporkan ke Admin</SDialogTitle>
            <DialogDescription>
              Laporkan keluhan untuk dilakukan peninjauan oleh admin
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitReport)}>
              <FormField
                control={form.control}
                name={"message"}
                render={({ field }) => (
                  <FormItem>
                    <Textarea
                      {...field}
                      placeholder="Tulis sesuatu..."
                      className="resize-none bg-muted"
                    />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <TButton
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenReport(false);
                    }}
                    className="rounded-md h-9 px-5 py-3 flex items-center"
                    variant={"secondary"}
                  >
                    Cancel
                  </TButton>
                  <TButton
                    disabled={isReportLoading}
                    type="submit"
                    className="rounded-md h-9 px-5 py-3 flex items-center"
                  >
                    {isReportLoading && (
                      <LoaderCircle
                        size={16}
                        className="mr-1 text-gray-200 dark:text-emerald-200 animate-spin"
                      />
                    )}
                    {isReportLoading ? "Send..." : "Send"}
                  </TButton>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah kamu yakin akan menghapus?
            </AlertDialogTitle>
            <AlertDialogDescription>
              tindakan ini tidak bisa dibatalkan
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteVocab}
              className="text-white hover:bg-emerald-500/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditVocabulary
        onSubmitCb={onSubmitEdit}
        data={data}
        mode={state.mode}
        open={state.open}
        setOpen={() =>
          dispatch({
            open: !state.open,
            mode: state.mode,
          })
        }
      />
    </>
  );
}
