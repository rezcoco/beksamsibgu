import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ACHIEVEMENTS, ACHIEVEMENTS_ICONS } from "@/constants";
import { fetchData } from "@/lib/queries";
import Image from "next/image";
import React from "react";
import Loading from "./loading";

export default async function TopContributors() {
  const data: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    reputation: number;
    picture: string | null;
    totalVocabulary: number;
  }[] = await fetchData("/statistics/top-contributors", ["/top-contributors"]);

  // return <Loading />;

  return (
    <section className="my-10 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-32">
        <div>
          <h2 className="text-2xl font-bold mb-5">Top 10 Contributors</h2>

          <Table>
            <TableBody>
              {data.map((value, index) => {
                const imgsrc = ["gold", "silver", "bronze"];
                const fullname = `${value.firstName} ${value.lastName}`;

                return (
                  <TableRow
                    key={value.id}
                    className="border-none even:bg-muted/50 hover:odd:bg-transparent rounded-md"
                  >
                    <TableCell className="lg:max-w-[40px]">
                      {index < 3 ? (
                        <Image
                          src={`/${imgsrc[index]}-medal.svg`}
                          height={30}
                          width={30}
                          alt={imgsrc[index]}
                        />
                      ) : (
                        <p className="font-medium text-emerald-500 w-[30px] text-center">
                          {index + 1}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="flex items-center gap-3">
                      <Image
                        className="rounded-full"
                        src={value.picture ?? ""}
                        width={30}
                        height={30}
                        alt={fullname}
                      />
                      <p className="font-medium capitalize">{fullname}</p>
                    </TableCell>

                    <TableCell className="font-medium text-orange-400 text-center">
                      {value.reputation}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-center mb-5">Achievements</h2>
          <div className="space-y-3">
            {ACHIEVEMENTS.map((achievement, index) => {
              return (
                <div
                  key={achievement.value}
                  className="flex items-center gap-3"
                >
                  <span className="font-medium text-emerald-500">
                    {`${index + 1}.`}
                  </span>
                  <Card className="w-full p-2 px-3 flex flex-row items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span>{ACHIEVEMENTS_ICONS[achievement.points].icon}</span>
                      <div>
                        <CardTitle className="text-base">
                          {achievement.name}
                        </CardTitle>
                        <CardDescription className="max-sm:max-w-[20ch]">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-orange-400 ml-auto">
                      {achievement.points}
                      <span className="text-gray-400"> XP</span>
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
