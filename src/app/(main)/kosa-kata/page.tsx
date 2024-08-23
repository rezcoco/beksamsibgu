import AddVocabulary from "@/components/add-vocabulary";
import List from "@/components/list";
import React from "react";

const KosaKata = () => {
  return (
    <div className="min-h-screen py-10">
      <div className="flex flex-col md:flex-row justify-between lg:items-center pb-10">
        <div className="max-md:mb-6">
          <p className="text-xl font-bold">Kosa Kata</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            Kumpulan kosa kata yang ditambahkan pengguna
          </p>
        </div>
        <AddVocabulary />
      </div>
      <List />
    </div>
  );
};

export default KosaKata;
