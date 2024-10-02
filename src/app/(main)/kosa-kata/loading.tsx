import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen my-10">
      <div className="mb-10">
        <p className="text-xl font-bold">Kosa Kata</p>
        <p className="text-sm text-zinc-700 dark:text-zinc-400">
          Kumpulan kosa kata yang ditambahkan pengguna
        </p>
      </div>

      <div className="flex items-center">
        <Skeleton className="w-10 lg:w-20 h-9" />
        <Skeleton className="w-24 lg:w-28 h-10 ml-3" />
        <Skeleton className="w-14 lg:w-36 h-9 ml-auto" />
      </div>

      <div className="grid gap-5 mt-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
