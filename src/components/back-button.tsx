"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const BackButton = () => {
  const seaerchParams = useSearchParams();
  const router = useRouter();
  return (
    <button
      onClick={() => {
        const from = seaerchParams.get("from");
        if (from) {
          router.replace(from);
        } else {
          router.back();
        }
      }}
      aria-label="back button"
      className="flex gap-1 items-center"
    >
      <ArrowLeft size={20} />
      <span className="underline">Kembali</span>
    </button>
  );
};

export default BackButton;
