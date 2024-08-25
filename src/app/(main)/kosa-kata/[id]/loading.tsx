import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Loading = () => {
  return (
    <section className="min-h-screen py-10">
      <Link href="/kosa-kata" className="flex gap-1 items-center">
        <ArrowLeft size={20} />
        <span className="underline">Kembali</span>
      </Link>

      <div className="mt-10 py-8 px-6 md:px-10 lg:px-14 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative border rounded-lg">
        <div className="flex items-center justify-between gap-6">
          <div>
            <Skeleton className="h-14 w-40" />
            <div className="flex flex-wrap items-center gap-2 md:gap-2 mt-2">
              <div className="flex gap-1">
                <Skeleton className="h-9 w-14" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-9 w-14" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-6 mt-2 w-24" />
            <Skeleton className="h-6 mt-1 w-16" />
          </div>
          <Skeleton className="h-6 w-14" />
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-5 mb-3 mt-5">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-[1px] bg-gray-200 dark:bg-muted w-full"></Skeleton>
          </div>
          <Skeleton className="ml-5 w-[80%] h-6" />
          <Skeleton className="ml-5 mt-1 w-[70%] h-6" />
        </div>
      </div>
    </section>
  );
};

export default Loading;
