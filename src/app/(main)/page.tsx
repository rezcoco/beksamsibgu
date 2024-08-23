import { Button } from "@/components/button";
import Features from "@/components/features";
import { HeroPattern } from "@/components/hero-pattern";
import LogoClouds from "@/components/logo-clouds";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <HeroPattern />
      <article className="pt-16 pb-10">
        <div className="flex-auto [html_:where(&>*)]:mx-auto [html_:where(&>*)]:max-w-2xl [html_:where(&>*)]:lg:mx-[calc(50%-min(50%,theme(maxWidth.lg)))] [html_:where(&>*)]:lg:max-w-3xl mb-28">
          <h1 className="text-2xl font-bold tracking-normal text-zinc-900 dark:text-white sm:text-3xl">
            Selamat Datang <br /> Di Pustaka Kosa Kata Korea
          </h1>
          <p className="text-zinc-700 dark:text-zinc-400 leading-7 text-base mt-2">
            Proyek sukarela ini bertujuan untuk memudahkan pengorganisasian kosa
            kata secara efisien, rapi dan mudah diakses. Melalui koleksi
            kata-kata yang terstruktur dan fitur pencarian yang canggih.
          </p>
          <div className="not-prose mb-16 mt-6 flex gap-3">
            <Button href="/kosa-kata" arrow="right">
              <>Explore kosa kata</>
            </Button>
          </div>
        </div>
        <LogoClouds />
        <Features />
      </article>
    </main>
  );
}
