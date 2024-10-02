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
};

const KosaKata = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { getToken } = auth();
  const chapter = searchParams.chapter;
  const createdByUser = searchParams.createdByUser;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const tab = searchParams.tab;
  const queryObj: Record<string, any> = { page };
  let totalFilter = 0;

  if (chapter) {
    queryObj["chapter"] = chapter;
    totalFilter++;
  }
  if (createdByUser) {
    queryObj["createdByUser"] = createdByUser;
    totalFilter++;
  }

  if (tab) {
    queryObj["tab"] = tab;
  }

  const query = new URLSearchParams(queryObj).toString();
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
    <section className="min-h-screen my-10">
      <div>
        <div className="mb-10">
          <p className="text-2xl font-bold">Kosa Kata</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            Kumpulan kosa kata yang ditambahkan pengguna
          </p>
        </div>
        <ListTabs
          totalFilter={totalFilter}
          data={data.vocabularies}
          query={query}
        />
      </div>

      {data.total > 0 && (
        <PagePagination
          queryString={query}
          totalRecord={data.total}
          currentPage={page}
        />
      )}
    </section>
  );
};

export default KosaKata;
