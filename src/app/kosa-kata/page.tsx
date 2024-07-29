import AddVocabulary from "@/components/add-vocabulary";
import List from "@/components/list";
import React from "react";

const KosaKata = () => {
  return (
    <div className="min-h-screen py-10 px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center pb-10">
        <div className="max-md:mb-6">
          <p className="text-xl font-bold">Kosa Kata</p>
          <p className="text-sm text-zinc-600">
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
