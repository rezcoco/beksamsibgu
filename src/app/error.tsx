"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-emerald-500">500</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-6 text-base leading-7 text-zinc-700 dark:text-zinc-400">
          The server was unable to complete your request. Please try again
          later.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          >
            Go back home
          </Link>
          <a href="/" className="text-sm font-semibold">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
