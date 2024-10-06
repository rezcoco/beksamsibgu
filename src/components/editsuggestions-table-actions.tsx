"use client";

import { GetQueryEditSuggestionsType, GetQueryUserType } from "@/types/type";
import { Loader2, Minus, MoreHorizontal, Plus } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Button as SButton } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import EditVocabulary from "./edit-vocabulary";
import { axiosRequest } from "@/lib/queries";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { toastError } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { revalidate, sendNotification } from "@/lib/actions";

type Props = {
  data: GetQueryEditSuggestionsType;
  userInfo: GetQueryUserType;
  queryKey: any[];
};

type ApproveRejectReducerValue = {
  isLoading: boolean;
  status: number | undefined;
};

export default function EditSuggestionsTableActions({
  data,
  userInfo,
  queryKey,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: false,
    status: undefined,
  });

  function reducer(
    state: ApproveRejectReducerValue,
    action: ApproveRejectReducerValue
  ) {
    return { ...state, ...action };
  }

  function generateComparisonText(
    key: keyof typeof data.originVocabulary,
    type?: "before" | "after"
  ) {
    const originalVocabulary =
      data.status === "approved" && data.vocabularyHistory
        ? data.vocabularyHistory
        : data.originVocabulary;
    const vocabulary = type === "before" ? originalVocabulary : data;

    console.log(vocabulary);

    if (key === "predicate") {
      const irregular =
        vocabulary.isRegular === 1 ? "beraturan" : "tidak beraturan";
      const adj = vocabulary.isAdj === 1 ? ", kata sifat" : "";

      return `${vocabulary.predicate} (${irregular}${adj})`;
    } else if (key === "sentenceEx") {
      return (
        <pre>{`${vocabulary.sentenceEx}\n${vocabulary.translationEx}`}</pre>
      );
    } else if (key === "chapter") {
      return vocabulary.chapter ? vocabulary.chapter : "Acak";
    } else {
      if (key === "tag") {
        return vocabulary[key]?.name;
      }
      return vocabulary[key];
    }
  }

  function generateComparison(
    title: string,
    key: keyof typeof data.originVocabulary
  ) {
    const originalVocabulary =
      data.status === "approved" && data.vocabularyHistory
        ? data.vocabularyHistory
        : data.originVocabulary;

    const before =
      key === "tag" ? originalVocabulary[key]?.name : originalVocabulary[key];
    const after = key === "tag" ? data[key]?.name : data[key];

    const isBeforeEmpty = !before;
    const isAfterEmpty = !after;
    const isNotChapter = key !== "chapter";
    const isAfterEmptyString = typeof after === "string" && after.length === 0;

    if (isAfterEmpty && after !== before) {
      return (
        <div>
          <p className="mt-4 text-sm mb-2 font-medium">{title}</p>
          <div className="flex items-center gap-2 bg-red-200 dark:bg-[#3e2e34] px-3 py-1 rounded-md">
            <Minus size={14} className="text-zinc-700 dark:text-zinc-400" />
            <p className="text-sm">{generateComparisonText(key, "before")}</p>
          </div>
        </div>
      );
    } else if (isBeforeEmpty && isNotChapter && before !== after) {
      return (
        <div>
          <p className="mt-4 text-sm mb-2 font-medium">{title}</p>
          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-200 dark:bg-[#263834] rounded-md">
            <Plus size={14} className="text-zinc-700 dark:text-zinc-400" />
            <p className="text-sm">{generateComparisonText(key, "after")}</p>
          </div>
        </div>
      );
    } else if ((!!before || key === "chapter") && before !== after) {
      return (
        <div>
          <p className="mt-4 mb-2 text-sm font-medium">{title}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-red-200 dark:bg-[#3e2e34] px-3 py-1 rounded-md">
              <Minus size={14} className="text-zinc-700 dark:text-zinc-400" />
              <p className="text-sm">{generateComparisonText(key, "before")}</p>
            </div>
            <div className="flex items-center bg-emerald-200 dark:bg-[#263834] gap-1 px-3 py-1 rounded-md">
              <Plus size={14} className="text-zinc-700 dark:text-zinc-400" />
              <p className="text-sm">{generateComparisonText(key, "after")}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return undefined;
    }
  }

  async function onEditSubmit(body: any) {
    try {
      const token = await getToken();

      await axiosRequest.put(
        `/edit-suggestions/${data.id}`,
        Object.assign(body, {
          vocabularyId: data.originVocabulary.id,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await queryClient.refetchQueries({ queryKey });
      toast.success("Berhasil menyunting");
    } catch (error: any) {
      throw new Error(error?.message, {
        cause: error,
      });
    }
  }

  async function onDeleteSubmit() {
    const toastId = toast.loading("Memuat...");
    try {
      setIsDeleteLoading(true);
      const token = await getToken();

      await axiosRequest.delete(`edit-suggestions/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await queryClient.refetchQueries({ queryKey });
      toast.success("Berhasil menghapus", { id: toastId });
    } catch (error: any) {
      const status = error?.response?.status;
      console.error(error);

      toastError(status, toastId);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  async function onApproveReject(status: number) {
    try {
      dispatch({
        isLoading: true,
        status,
      });
      const token = await getToken();

      await axiosRequest.patch(
        `/edit-suggestions/${data.id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await queryClient.refetchQueries({ queryKey });
      toast.success("Berhasil");
      if (status === 2) {
        sendNotification(
          "edit-suggestion-approve",
          userInfo.id,
          [data.authorId],
          {
            vocabularyId: data.vocabularyId,
          }
        );

        await revalidate("/kosa-kata");
        await revalidate(`/kosa-kata/${data.vocabularyId}`);
      } else {
        sendNotification(
          "edit-suggestion-reject",
          userInfo.id,
          [data.authorId],
          {
            editSuggestionId: data.id.toUpperCase(),
          }
        );
      }
    } catch (error: any) {
      const status = error?.response?.status;
      console.error(error);

      toastError(status);
    } finally {
      setIsDialogOpen(false);
      dispatch({
        isLoading: false,
        status: undefined,
      });
    }
  }

  return (
    <div className="flex items-center gap-1">
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
          {userInfo.id === data.authorId && data.status === "pending" ? (
            <>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteSubmit}>
                Delete
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              Lihat
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVocabulary
        onSubmitCb={onEditSubmit}
        mode="edit-suggest"
        open={open}
        setOpen={setOpen}
        data={data}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="gap-0 rounded-md">
          <DialogHeader>
            <DialogTitle>Detail Perubahan</DialogTitle>
            <DialogDescription>
              {data.status === "pending"
                ? "Harap periksa detail berikut dengan cermat sebelum membuat pilihan"
                : `Perubahan yang disarankan oleh ${data.author.firstName} ${data.author.lastName}`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[320px] max-w-2xl">
            {generateComparison("Hangeul", "hangeul")}
            {generateComparison("Arti", "translation")}
            {generateComparison("Perubahan (predikat)", "predicate")}
            {generateComparison("Contoh Kalimat", "sentenceEx")}
            {generateComparison("Catatan", "note")}
            {generateComparison("Bab", "chapter")}
            {generateComparison("Tag", "tag")}
            {generateComparison("Referensi", "reference")}
          </ScrollArea>
          {data.status === "pending" && (
            <DialogFooter className="flex !flex-col">
              <div className="rounded-md bg-yellow-50 dark:bg-background dark:border dark:border-yellow-700 p-4 mt-5">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-yellow-400"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Perhatian
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700">
                      <p>
                        Tindakan ini tidak bisa dibatalkan. data kosa kata
                        sebelumnya akan ditimpa dengan perubahan di atas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end flex-row gap-2">
                <SButton
                  type="submit"
                  className="rounded-md h-9 flex items-center px-5 gap-2"
                  variant={"secondary"}
                  disabled={state.isLoading}
                  onClick={(e) => onApproveReject(1)}
                >
                  {state.isLoading && state.status === 1 ? (
                    <>
                      <Loader2
                        size={16}
                        className="text-zinc-700 dark:text-zinc-400 animate-spin"
                      />
                      <span>Reject...</span>
                    </>
                  ) : (
                    "Reject"
                  )}
                </SButton>
                <SButton
                  type="submit"
                  className="rounded-md h-9 flex items-center gap-2 px-5"
                  disabled={state.isLoading}
                  onClick={(e) => onApproveReject(2)}
                >
                  {state.isLoading && state.status === 2 ? (
                    <>
                      <Loader2
                        size={16}
                        className="text-emerald-500 animate-spin"
                      />
                      <span>Approve...</span>
                    </>
                  ) : (
                    "Approve"
                  )}
                </SButton>
              </div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
