"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { Button } from "@/components/button";
import { SignedOut, useUser } from "@clerk/nextjs";
import { allowedRoles } from "@/constants";
import {
  Award,
  Book,
  BookOpen,
  FileArchive,
  House,
  LayoutDashboard,
  ScrollText,
  Trophy,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface NavGroup {
  title: string;
  links: Array<{
    title: string;
    href: string;
    icon: any;
    isProtected: boolean;
  }>;
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup;
  className?: string;
}) {
  let pathname = usePathname();

  const { user, isLoaded } = useUser();

  return (
    <li className={clsx("relative mt-6", className)}>
      <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">
        {group.title}
      </h2>
      <div className="relative mt-3 pl-2">
        <ul role="list" className="flex flex-col gap-1">
          {group.links.map((link) => {
            const role = user?.publicMetadata?.role as string | undefined;
            const username = user?.username;
            const isActive =
              (pathname.includes(link.href) && link.href.length > 1) ||
              pathname === link.href;

            if (link.href === "/profile") {
              if (username) {
                link.href = `/profile/${username}`;
              } else {
                return null;
              }
            }

            if (link.href === "/dashboard") {
              if (!user || !allowedRoles.includes(role ?? "")) {
                return null;
              }
            }

            return (
              <li key={link.href} className="relative group">
                {isLoaded ? (
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-400 font-semibold leading-6 group-hover:dark:text-white px-2 py-1.5 rounded-md",
                      isActive && "!text-emerald-500"
                    )}
                  >
                    <link.icon
                      size={20}
                      className={cn(
                        "dark:text-zinc-400 text-zinc-700 group-hover:dark:text-white",
                        isActive && "!text-emerald-500"
                      )}
                    />
                    {link.title}
                  </Link>
                ) : (
                  <Skeleton className="h-10 rounded-md w-full" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export const navigation: Array<NavGroup> = [
  {
    title: "Home",
    links: [
      { title: "Introduction", href: "/", icon: House, isProtected: false },
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        isProtected: true,
      },
      { title: "Profile", href: "/profile", icon: User, isProtected: true },
      {
        title: "Kosa Kata",
        href: "/kosa-kata",
        icon: Book,
        isProtected: false,
      },
      {
        title: "Top Contributors",
        href: "/top-contributors",
        icon: Award,
        isProtected: false,
      },
    ],
  },
  {
    title: "Others",
    links: [
      {
        title: "Panduan Kosa Kata",
        href: "/panduan-kosa-kata",
        icon: BookOpen,
        isProtected: false,
      },
      {
        title: "Resources",
        href: "/resources",
        icon: FileArchive,
        isProtected: false,
      },
      {
        title: "Credits",
        href: "/credits",
        icon: ScrollText,
        isProtected: false,
      },
    ],
  },
];

export function Navigation(props: React.ComponentPropsWithoutRef<"nav">) {
  const pathname = usePathname();

  return (
    <nav className="min-h-full" {...props}>
      <ul className="min-h-full" role="list">
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? "md:mt-0" : ""}
          />
        ))}
        <SignedOut>
          <li className="sticky md:hidden bottom-0 z-10 mt-6">
            <Button
              href={`/auth/sign-in?redirect_url=${encodeURIComponent(
                pathname
              )}`}
              variant="filled"
              className="w-full rounded-md"
            >
              Sign in
            </Button>
          </li>
        </SignedOut>
      </ul>
    </nav>
  );
}
