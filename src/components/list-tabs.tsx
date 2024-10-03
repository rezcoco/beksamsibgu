"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GetQueryVocabType } from "@/types/type";
import List from "./list";
import { usePathname, useRouter } from "next/navigation";
import ChapterFilter from "./chapter-filter";
import AddVocabulary from "./add-vocabulary";
import ListTable from "./list-table";

type Props = {
  data: GetQueryVocabType[];
  query: string;
};

export default function ListTabs({ data, query }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(query);
  const activeTab = searchParams.get("tab") ?? "list";

  function onTabChange(value: string) {
    searchParams.set("tab", value);

    router.replace(`${pathname}?${searchParams.toString()}`);
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ChapterFilter query={query} />
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </div>

        <AddVocabulary />
      </div>
      <TabsContent value="list">
        <List data={data} />
      </TabsContent>
      <TabsContent value="table">
        <ListTable data={data} />
      </TabsContent>
    </Tabs>
  );
}
