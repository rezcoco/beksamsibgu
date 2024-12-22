import ClerkLogo from "./logos/clerk";
import CloudflareLogo from "./logos/cloudflare";
import AlgoliaLogo from "./logos/algolia";
import NextJsLogo from "./logos/nextjs";
import VercelLogo from "./logos/vercel";

export default function LogoClouds() {
  return (
    <div className="bg-white dark:bg-background">
      <div>
        <h2 className="text-center text-lg font-semibold leading-8 dark:text-white text-zinc-900">
          Menggunakan teknologi paling popular saat ini
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-y-10 sm:max-w-xl sm:grid-cols-6 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <NextJsLogo className="col-span-2 max-h-6 w-full object-contain lg:col-span-1" />
          <AlgoliaLogo className="col-span-2 max-h-6 w-full object-contain lg:col-span-1" />
          <ClerkLogo className="col-span-2 max-h-6 w-full object-contain lg:col-span-1" />
          <VercelLogo className="col-span-2 max-h-6 w-full object-contain lg:col-span-1" />
          <CloudflareLogo className="col-span-2 col-start-2 max-h-6 w-full object-contain sm:col-start-auto lg:col-span-1" />
        </div>
      </div>
    </div>
  );
}
