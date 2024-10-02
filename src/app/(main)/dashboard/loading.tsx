import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen my-10">
      <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[114px] w-full" />
          <Skeleton className="h-[114px] w-full" />
          <Skeleton className="h-[114px] w-full" />
        </div>

        <div>
          <Skeleton className="h-10 w-52 lg:w-[20rem] mb-5" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
