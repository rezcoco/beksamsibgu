import AddVocabulary from "@/components/add-vocabulary";
import List from "@/components/list";
import React from "react";

const KosaKata = () => {
  return (
    <div className="min-h-screen py-10 px-6 lg:px-8">
      <div className="flex justify-between items-center pb-10">
        <p className="text-xl font-bold">Kosa Kata</p>
        <AddVocabulary />
      </div>
      <List />
    </div>
  );
};

export default KosaKata;
