import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen my-10">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-32">
        <div>
          <h2 className="text-2xl font-bold mb-5">Top 10 Contributors</h2>
          <div className="space-y-2">
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-center mb-5">Achievements</h2>
          <div className="space-y-3">
            <Skeleton className="w-ful h-16" />
            <Skeleton className="w-ful h-16" />
            <Skeleton className="w-ful h-16" />
            <Skeleton className="w-ful h-16" />
            <Skeleton className="w-ful h-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
