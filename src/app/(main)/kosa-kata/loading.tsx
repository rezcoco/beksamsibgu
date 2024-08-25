import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen py-10">
      <div className="flex flex-col md:flex-row justify-between lg:items-center pb-10">
        <div className="max-md:mb-6">
          <p className="text-xl font-bold">Kosa Kata</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            Kumpulan kosa kata yang ditambahkan pengguna
          </p>
        </div>
        <Skeleton className="w-52 h-10" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="w-full h-[126px]" />
          <Skeleton className="w-full h-[41px]" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="w-full h-[126px]" />
          <Skeleton className="w-full h-[41px]" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="w-full h-[126px]" />
          <Skeleton className="w-full h-[41px]" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
