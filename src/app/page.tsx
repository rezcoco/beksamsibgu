import { Button } from "@/components/button";
import { HeroPattern } from "@/components/hero-pattern";
import { DataTableDemo } from "@/components/table";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between container">
      <HeroPattern />
      <article className="pt-16 pb-10">
        <div className="flex-auto prose dark:prose-invert [html_:where(&>*)]:mx-auto [html_:where(&>*)]:max-w-2xl [html_:where(&>*)]:lg:mx-[calc(50%-min(50%,theme(maxWidth.lg)))] [html_:where(&>*)]:lg:max-w-3xl mb-28">
          <h1 className="">Selamat Datang di Pustaka Kosa Kata Korea</h1>
          <p className="lead">
            Proyek sukarela ini bertujuan untuk memudahkan pengorganisasian kosa
            kata bahasa Korea secara rapi dan mudah diakses sehingga mereka
            dapat menambah dan mengelola kosa kata dengan efisien. Melalui
            koleksi kata-kata yang terstruktur dan fitur pencarian yang canggih.
          </p>
          <div className="not-prose mb-16 mt-6 flex gap-3">
            <Button href="/quickstart" arrow="right">
              <>Quickstart</>
            </Button>
            <Button href="/sdks" variant="outline">
              <>Explore SDKs</>
            </Button>
          </div>
        </div>
        <DataTableDemo />
      </article>
    </main>
  );
}
