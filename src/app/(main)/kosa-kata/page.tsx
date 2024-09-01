import React from "react";
import AddVocabulary from "@/components/add-vocabulary";
import ChapterFilter from "@/components/chapter-filter";
import List from "@/components/list";
import PagePagination from "@/components/page-pagination";
import { GetQueryVocabType } from "@/types/type";
import { fetchData } from "@/lib/queries";

const KosaKata = async ({
  searchParams,
}: {
  searchParams: { chapter: string | undefined; page: string | undefined };
}) => {
  const chapter = searchParams.chapter;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const queryObj: Record<string, any> = { page };

  if (chapter) queryObj["chapter"] = chapter;

  const query = new URLSearchParams(queryObj).toString();
  const url = `/vocabularies?${query}`;

  const data: {
    total: number;
    vocabularies: GetQueryVocabType[];
  } = await fetchData(url, [url]);

  return (
    <section className="min-h-screen flex flex-col justify-between py-10">
      <div>
        <div className="flex flex-col md:flex-row justify-between lg:items-center pb-10">
          <div className="max-md:mb-6">
            <p className="text-xl font-bold">Kosa Kata</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              Kumpulan kosa kata yang ditambahkan pengguna
            </p>
          </div>
          <AddVocabulary />
        </div>
        <ChapterFilter chapter={searchParams.chapter} />
        <List data={data.vocabularies} />
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
