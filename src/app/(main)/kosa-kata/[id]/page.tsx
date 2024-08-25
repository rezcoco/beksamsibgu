import React from "react";
import AudioBtn from "@/components/audio-btn";
import Link from "next/link";
import FloatSeparator from "@/components/float-separator";
import Conjugations from "@/components/conjugations";
import { fetchData } from "@/lib/queries";
import { GetQueryVocabByIdType } from "@/types/type";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as ina } from "date-fns/locale";

const VocabDetail = async ({ params: { id } }: { params: { id: string } }) => {
  const data: GetQueryVocabByIdType = await fetchData(`/vocabularies/${id}`, [
    `/vocabularies/${id}`,
  ]);

  return (
    <section className="min-h-screen py-10">
      <Link href="/kosa-kata" className="flex gap-1 items-center">
        <ArrowLeft size={20} />
        <span className="underline">Kembali</span>
      </Link>

      <div className="mt-10 py-8 px-6 md:px-10 lg:px-14 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative border rounded-lg">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-4xl font-bold">{data.hangeul}</p>
            <div className="flex flex-wrap items-center md:gap-2 mt-2">
              <div className="flex items-center">
                <p className="text-zinc-700 dark:text-zinc-400 italic">{`[${data.romanization}]`}</p>
                <AudioBtn text={data.hangeul} />
              </div>
              <div className="flex items-center">
                <p className="text-zinc-700 dark:text-zinc-400">{`[${data.pronunciation}]`}</p>
                <AudioBtn text={data.hangeul} />
              </div>
            </div>
            <p className="text-zinc-700 dark:text-zinc-400 mt-2">
              1. {data.translation}
            </p>
            {data.reference && (
              <p className="text-zinc-700 dark:text-zinc-400">
                2. {data.reference}
              </p>
            )}
          </div>

          <Badge className="text-center bg-emerald-500 text-[12px] text-white md:text-sm hover:bg-emerald-500 rounded-lg">
            {data.chapter ? `Bab ${data.chapter}` : "Acak"}
          </Badge>
        </div>

        {data.note && (
          <>
            <div className="mt-8">
              <FloatSeparator placeholder="Catatan" />
              <p className="text-zinc-700 dark:text-zinc-400 pl-4">
                {data.note}
              </p>
            </div>
          </>
        )}

        {data.sentenceEx && (
          <div className="mt-8">
            <FloatSeparator placeholder="Contoh Kalimat" />
            <div className="flex flex-col">
              <p className="text-zinc-700 dark:text-zinc-400 pl-4">
                {data.sentenceEx}
              </p>
              {data.translationEx && (
                <p className="text-zinc-700 dark:text-zinc-400 pl-4 mt-1">
                  {data.translationEx}
                </p>
              )}
            </div>
          </div>
        )}

        {data.isConjugated === 1 && <Conjugations id={data.id} />}

        <p className="mt-10 text-sm text-zinc-700 dark:text-zinc-400">
          {`Dibuat pada ${format(data.createdAt, "PPPP", {
            locale: ina,
          })} oleh`}{" "}
          <Link
            className="capitalize underline"
            href={`/profile/${data.author.username}`}
          >
            {`${data.author.firstName} ${data.author.lastName}`}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default VocabDetail;
