import { cn } from "@/lib/utils";
import {
  ArrowUpIcon,
  ClockArrowUpIcon,
  FingerprintIcon,
  LucideLock,
} from "lucide-react";

const features = [
  {
    name: "Pencarian Canggih",
    description:
      "Temukan kosakata yang Anda cari dengan cepat yang didukung oleh Algolia, lengkap dengan filter pintar dan peringkat relevansi.",
    icon: " 🔍 ",
  },
  {
    name: "Konjugasi Otomatis",
    description:
      "Hemat waktu dengan konjugasi kata kerja dan kata sifat otomatis, disesuaikan untuk berbagai waktu, bentuk, dan tingkat kesopanan.",
    icon: " 🌀",
  },
  {
    name: "Pengelompokan Fleksibel",
    description:
      "Kelola catatan Anda dengan mudah menggunakan tag atau bab, menciptakan sistem pembelajaran yang terstruktur",
    icon: " 🗂️ ",
  },
  {
    name: "Audio Pengucapan",
    description:
      "Dengarkan pengucapan audio yang akurat untuk setiap kosakata yang didukung oleh Papago.",
    icon: "🎧",
  },
];

export default function Features() {
  return (
    <div className="bg-white dark:bg-zinc-900 py-24 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-500">
            Belajar Kosakata Korea dengan Efisien
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Solusi lengkap dalam mengelola kosakata
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-700 dark:text-zinc-400">
            Berbagai fitur yang dibutuhkan untuk mencatat dan mengelola kosakata
            dengan efisien dalam satu platform.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-14">
                <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <span>{feature.icon}</span>
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
