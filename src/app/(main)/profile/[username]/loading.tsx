import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen my-10 space-y-8">
      <div className="flex flex-col lg:flex-row gap-5">
        <Skeleton className="w-[140px] h-[140px] rounded-full" />
        <div className="mt-3">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-7 w-20 mt-2" />
          <Skeleton className="h-7 w-32 mt-5" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-5">Stats</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <Skeleton className="h-[114px] w-full" />
          <Skeleton className="h-[114px] w-full" />
          <Skeleton className="h-[114px] w-full" />
          <Skeleton className="h-[114px] w-full" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-5">All Achievements</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    </div>
  );
}
