import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Edit, Flag, Star, CalendarDays } from "lucide-react";
import { GetQueryUserType } from "@/types/type";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ACHIEVEMENTS, ACHIEVEMENTS_ICONS, allowedRoles } from "@/constants";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import ReportsTable from "@/components/reports-table";
import VocabulariesTable from "@/components/vocabularies-table";
import EditSuggestionsTable from "@/components/editsuggestions-table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import React from "react";
import { axiosRequest } from "@/lib/queries";

type Achievement = {
  id: string;
  name: string;
  description: string;
  points: keyof typeof ACHIEVEMENTS_ICONS;
};

export default async function Profile({
  params: { username },
}: {
  params: { username: string };
}) {
  const [u, a] = await Promise.all([
    axiosRequest.get(`/users/${username}?isUsername=true`),
    axiosRequest.get(`/users/${username}/achievements?isUsername=true`),
  ]);

  const userInfo: GetQueryUserType = u.data?.data;

  const achievements: Achievement[] = a.data?.data ?? [];

  const { userId } = auth();

  const nonAchievements =
    achievements.length > 0
      ? ACHIEVEMENTS.filter((value) => value.points > achievements[0].points)
      : ACHIEVEMENTS;

  const combine: Array<Achievement & { value?: string }> = achievements.concat(
    nonAchievements as any[]
  );

  const AchievementCard: React.FC<{
    achievement: (typeof combine)[number];
  }> = ({ achievement }) => {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 px-4 py-3">
          <span>{ACHIEVEMENTS_ICONS[achievement.points].icon}</span>
          <div>
            <h3 className="font-semibold leading-none tracking-tight text-sm mb-2">
              {achievement.name}
            </h3>
            <CardDescription className="mb-1">
              {achievement.description}
            </CardDescription>
            <p className="text-xs font-medium text-orange-400">
              {achievement.points}
              <span className="text-gray-400"> XP</span>
            </p>
          </div>
          <p className="text-xs font-medium ml-auto">
            <span
              className={cn(
                achievement?.id ? "text-emerald-500" : "text-red-500"
              )}
            >
              {achievement?.id ? 1 : 0}
            </span>
            /1
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="my-10 space-y-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-5">
        <Image
          src={userInfo.picture ?? "/default-profile.svg"}
          width={140}
          height={140}
          alt={`${userInfo.firstName} ${userInfo.lastName}`}
          className="rounded-full object-cover"
        />
        <div className="mt-3">
          <div className="flex">
            <p className="font-bold text-2xl capitalize">
              {`${userInfo.firstName} ${userInfo.lastName}`}
            </p>
            {allowedRoles.includes(userInfo.role) && (
              <span
                className={cn(
                  "rounded-md uppercase text-[10px] py-0.5 px-1.5 ml-3 shadow-glow text-white flex items-center font-bold",
                  userInfo.role === "superuser" ? "bg-rose-500" : "bg-teal-500"
                )}
              >
                {userInfo.role}
              </span>
            )}
          </div>
          <p className="text-zinc-700 dark:text-zinc-400 font-medium">
            @{userInfo.username}
          </p>
          <p className="flex items-center gap-2 mt-5">
            <CalendarDays size={16} className="dark:text-zinc-400" />
            <span className="text-sm text-zinc-700 dark:text-zinc-400 font-medium">
              Bergabung{" "}
              {format(userInfo.createdAt, "dd MMM yyyy", {
                locale: id,
              })}
            </span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-5">Stats</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <Card className="dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points</CardTitle>
              <div className="h-6 w-6 rounded-md bg-emerald-500 flex justify-center items-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userInfo.reputation}</div>
            </CardContent>
          </Card>
          <Card className="dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Laporan</CardTitle>
              <div className="h-6 w-6 rounded-md bg-emerald-500 flex justify-center items-center">
                <Flag className="h-3 w-3 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userInfo.totalReport}</div>
            </CardContent>
          </Card>
          <Card className="dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kosa Kata</CardTitle>
              <div className="h-6 w-6 rounded-md bg-emerald-500 flex justify-center items-center">
                <BookOpen className="h-3 w-3 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userInfo.totalVocabulary}
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saran</CardTitle>
              <div className="h-6 w-6 rounded-md bg-emerald-500 flex justify-center items-center">
                <Edit className="h-3 w-3 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userInfo.totalEditSuggestions}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">All Achievements</h2>
          <Dialog>
            <DialogTrigger className="font-semibold text-emerald-500 max-sm:text-sm">
              View All
            </DialogTrigger>
            <DialogContent className="rounded-md">
              <DialogTitle>All Achievements</DialogTitle>
              <ScrollArea className="max-h-[320px]">
                <div className="space-y-4">
                  {combine.map((achievement) => (
                    <AchievementCard
                      achievement={achievement}
                      key={achievement?.id ?? achievement?.value}
                    />
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
          {Array.from({ length: 4 }).map((_, index) => {
            const achievement = combine[index];

            return (
              <AchievementCard
                achievement={achievement}
                key={achievement?.id ?? achievement?.value}
              />
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="vocabulary" className="space-y-4">
        {userId === userInfo.id ? (
          <TabsList>
            <TabsTrigger value="vocabulary">Kosa Kata</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
            <TabsTrigger value="editSuggestions">Saran Pengeditan</TabsTrigger>
          </TabsList>
        ) : (
          <h2 className="text-xl font-bold mb-5">Kosa Kata Pengguna</h2>
        )}

        <TabsContent value="vocabulary">
          <Card>
            <CardContent>
              <VocabulariesTable
                url={`/users/${userInfo.id}/vocabularies`}
                userInfo={userInfo}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardContent>
              <ReportsTable
                url={`/users/${userInfo.id}/reports`}
                userInfo={userInfo}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editSuggestions">
          <Card>
            <CardContent>
              <EditSuggestionsTable userInfo={userInfo} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
