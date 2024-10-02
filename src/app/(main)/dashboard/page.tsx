import React from "react";
import ReportsTable from "@/components/reports-table";
import VocabulariesTable from "@/components/vocabularies-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosRequest } from "@/lib/queries";
import { GetQueryStatisticsType, GetQueryUserType } from "@/types/type";
import { auth } from "@clerk/nextjs/server";
import { BookOpen, Flag, Users } from "lucide-react";
import UsersTable from "@/components/users-table";

export default async function Dashboard() {
  const { userId, getToken } = auth();
  const [s, u] = await Promise.all([
    axiosRequest.get("/statistics", {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }),
    axiosRequest.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }),
  ]);

  const statistics: GetQueryStatisticsType = s.data.data;
  const userInfo: GetQueryUserType = u.data.data;

  return (
    <section className="min-h-screen my-10">
      <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Kosa Kata
              </CardTitle>
              <div className="h-6 w-6 rounded-md bg-emerald-500 flex justify-center items-center">
                <BookOpen className="h-3 w-3 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.totalVocabulary}
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Laporan
              </CardTitle>
              <div className="h-6 w-6 rounded-md bg-emerald-500 flex justify-center items-center">
                <Flag className="h-3 w-3 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalReport}</div>
            </CardContent>
          </Card>
          <Card className="dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total User</CardTitle>
              <div className="h-6 w-6 rounded-md bg-emerald-500 flex justify-center items-center">
                <Users className="h-3 w-3 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalUser}</div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="vocabulary" className="space-y-4">
          {userId === userInfo.id ? (
            <TabsList>
              <TabsTrigger value="vocabulary">Kosa Kata</TabsTrigger>
              <TabsTrigger value="reports">Laporan</TabsTrigger>
              <TabsTrigger value="users">Pengguna</TabsTrigger>
            </TabsList>
          ) : (
            <h2 className="text-xl font-bold mb-5">Kosa Kata Pengguna</h2>
          )}

          {/* Vocabulary Table */}
          <TabsContent value="vocabulary">
            <Card>
              <CardContent>
                <VocabulariesTable
                  url="/statistics/vocabularies"
                  userInfo={userInfo}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports List */}
          <TabsContent value="reports">
            <Card>
              <CardContent>
                <ReportsTable url="/statistics/reports" userInfo={userInfo} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent>
                <UsersTable userInfo={userInfo} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
