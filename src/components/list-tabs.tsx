"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GetQueryVocabType } from "@/types/type";
import List from "./list";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filter from "./filter";
import AddVocabulary from "./add-vocabulary";
import ListTable from "./list-table";
import { useDataStore } from "@/lib/store";

type Props = {
  data: GetQueryVocabType[];
};

export default function ListTabs({ data }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get("tab") ?? "list";
  const { setVocabularies } = useDataStore();

  React.useEffect(() => {
    setVocabularies(data);
  }, [data, setVocabularies]);

  function onTabChange(value: string) {
    const sp = new URLSearchParams(searchParams);
    sp.set("tab", value);

    router.replace(`${pathname}?${sp.toString()}`);
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Filter />
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
        <ListTable />
      </TabsContent>
    </Tabs>
  );
}
