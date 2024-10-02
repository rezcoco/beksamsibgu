"use client";

import { GetQueryVocabType } from "@/types/type";
import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
import EditVocabulary from "./edit-vocabulary";
import { axiosRequest } from "@/lib/queries";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

type Props = {
  data: GetQueryVocabType;
  queryKey: any[];
};

export default function VocabulariesTabActions({ data, queryKey }: Props) {
  const [open, setOpen] = React.useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  async function onSubmitEdit(body: any) {
    try {
      await axiosRequest.put(`/vocabularies/${data.id}`, body, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      await queryClient.refetchQueries({ queryKey });
      toast.success("Berhasil menyunting", { duration: 2500 });
    } catch (error: any) {
      throw new Error(error?.message, {
        cause: error,
      });
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        className="text-zinc-700 dark:text-zinc-400 py-1.5 px-2 hover:bg-accent hover:text-accent-foreground rounded-sm"
        onClick={() => setOpen(true)}
      >
        <Edit size={16} />
      </button>
      <Link
        target="_blank"
        href={`/kosa-kata/${data.id}`}
        className="text-zinc-700 dark:text-zinc-400 py-1.5 px-2 hover:bg-accent hover:text-accent-foreground rounded-sm"
      >
        <ExternalLink size={16} />
      </Link>
      <EditVocabulary
        onSubmitCb={onSubmitEdit}
        open={open}
        setOpen={setOpen}
        data={data}
      />
    </div>
  );
}
