"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export default function LogoClouds() {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "light" ? "gray-900" : "white";
  return (
    <div className="bg-white dark:bg-zinc-900 pb-28 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-lg font-semibold leading-8 dark:text-white text-zinc-900">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <Image
            alt="Transistor"
            src={`https://tailwindui.com/img/logos/158x48/transistor-logo-${color}.svg`}
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <Image
            alt="Reform"
            src={`https://tailwindui.com/img/logos/158x48/reform-logo-${color}.svg`}
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <Image
            alt="Tuple"
            src={`https://tailwindui.com/img/logos/158x48/tuple-logo-${color}.svg`}
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          />
          <Image
            alt="SavvyCal"
            src={`https://tailwindui.com/img/logos/158x48/savvycal-logo-${color}.svg`}
            width={158}
            height={48}
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
          />
          <Image
            alt="Statamic"
            src={`https://tailwindui.com/img/logos/158x48/statamic-logo-${color}.svg`}
            width={158}
            height={48}
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}
