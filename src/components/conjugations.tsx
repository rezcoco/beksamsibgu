"use client";

import React from "react";
import FloatSeparator from "./float-separator";
import axios from "axios";
import AudioBtn from "./audio-btn";
import { GetQueryConjugationType } from "@/types/type";
import { useQuery } from "react-query";
import { createId } from "@paralleldrive/cuid2";
import { Skeleton } from "./ui/skeleton";
import { API_UTILS_URL } from "@/constants";

type Props = {
  id: string;
};

const Loading = () => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-5 mb-3">
        <Skeleton className="w-[100px] h-6" />
        <Skeleton className="w-full h-[1px]" />
      </div>
      <div className="max-[330px]:ml-0 ml-5 max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-40 min-[330px]:w-48" />
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-6 w-40 min-[330px]:w-48" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-40 min-[330px]:w-48" />
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-6 w-40 min-[330px]:w-48" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-40 min-[330px]:w-48" />
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-6 w-40 min-[330px]:w-48" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Conjugations({ id }: Props) {
  const { data, isLoading } = useQuery<GetQueryConjugationType>({
    queryKey: [`vocabularies/conjugation/${id}`],
    queryFn: async () => {
      const res = await axios.get(
        `${API_UTILS_URL}/vocabularies/${id}/conjugation`
      );
      return res.data.data;
    },
  });

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        data &&
        data.length > 0 && (
          <div className="mt-8">
            <FloatSeparator placeholder="Perubahan" />
            <div className="ml-5 max-w-2xl grid lg:grid-cols-2 gap-2">
              {data.map((each_types) => (
                <div className="lg:grid-cols-2 grid gap-1" key={createId()}>
                  <p className="capitalize">{each_types.type}</p>
                  <div className="flex flex-col gap-1 max-md:mb-2">
                    {each_types.conjugations.map((conjugation) => (
                      <div className="flex items-center" key={createId()}>
                        <p className="text-zinc-700 dark:text-zinc-400">
                          {conjugation?.conjugated}
                        </p>
                        {conjugation?.conjugated && (
                          <AudioBtn text={conjugation.conjugated} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
