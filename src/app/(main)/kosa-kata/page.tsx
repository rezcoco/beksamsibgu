import React from "react";
import PagePagination from "@/components/page-pagination";
import { GetQueryVocabType } from "@/types/type";
import ListTabs from "@/components/list-tabs";
import { axiosRequest } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";

type SearchParams = {
  chapter: string | undefined;
  page: string | undefined;
  createdByUser: boolean | undefined;
  tab: ("list" | "table") | undefined;
  tag: string | undefined;
} & URLSearchParams;

const KosaKata = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { getToken } = auth();
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const sp = new URLSearchParams(searchParams);

  sp.set("page", String(page));

  const query = sp.toString();
  const url = `/vocabularies?${query}`;

  const res = await axiosRequest.get(url, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  const data: {
    total: number;
    vocabularies: GetQueryVocabType[];
  } = res.data.data;

  return (
    <section className="my-10">
      <div className="flex flex-col min-h-screen justify-between">
        <div>
          <div className="mb-10">
            <p className="text-2xl font-bold">Kosa Kata</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              Kumpulan kosa kata yang ditambahkan pengguna
            </p>
          </div>
          <ListTabs data={data.vocabularies} query={query} />
        </div>

        {data.total > 0 && (
          <PagePagination
            queryString={query}
            totalRecord={data.total}
            currentPage={page}
          />
        )}
      </div>
    </section>
  );
};

export default KosaKata;
