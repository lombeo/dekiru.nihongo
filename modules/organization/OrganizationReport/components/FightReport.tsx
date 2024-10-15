import { Card, Pagination, Paper, SimpleGrid, Table, Text } from "@mantine/core";
import Link from "@src/components/Link";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { getContestType } from "@src/services/Coding/types";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import PieChartComponent from "./PieChartComponent";

export const FightReport = (props) => {
  const { data, listUsers } = props;
  const { t } = useTranslation();
  const [listFight, setListFight] = useState({} as any);
  const [currentPage, setCurrentPage] = useState(1);
  const getStatusStr = (status: string) => {
    switch (status) {
      case "CONTEST_TO_START_REGISTER":
        return t("Start Register");
      case "CONTEST_TO_END_REGISTER":
        return t("End Register");
      case "CONTEST_UPCOMING":
        return t("Upcoming");
      case "CONTEST_RUNNING":
        return t("Ongoing");
      case "CONTEST_FINISH":
        return t("fight.Finished");
    }
  };
  const fetch = async () => {
    const res = await CodingService.getContestByOwnerIds({
      ownerIds: listUsers,
      pageIndex: currentPage,
    });
    if (res?.data?.success) {
      setListFight(res.data);
    }
  };

  useEffect(() => {
    fetch();
  }, [listUsers, currentPage]);

  const rows = listFight?.data?.map((element) => (
    <tr key={element.id}>
      <td>
        <Link href={`/fights/detail/${element.id}`} className="hover:text-blue-500">
          {element.title}
        </Link>
      </td>
      <td>
        <Link href={`/profile/${element.ownerId}`} className="hover:text-blue-500">
          {element.ownerName}
        </Link>
      </td>
      <td>
        <Text>{getStatusStr(element.statusName)}</Text>
      </td>
      <td>{t(getContestType(element.contestType))}</td>
      <td>{FunctionBase.formatNumber(element.price)}</td>
      <td>{element.countRegister}</td>
      <td>{element.isTeam ? t("Yes") : t("No")}</td>
      <td>{formatDateGMT(element.startDate)}</td>
      <td>{formatDateGMT(element.endTimeCode)}</td>
    </tr>
  ));

  return (
    <div className="flex flex-col gap-4">
      <Card shadow="sm" p="md" className="space-y-4">
        <Text className="font-semibold text-lg">{t("Contest Overview")}</Text>
        <Text className="font-semibold">{`${t("Total")}: ${data?.totalContest}`} </Text>
        <Text className="font-semibold">{`${t("Total registration")}: ${data?.totalRegister}`}</Text>
        <SimpleGrid cols={3} spacing="lg">
          <Paper shadow="xs" p="md" className="flex flex-col  bg-slate-50">
            <div className="flex justify-start">
              <Text className="font-semibold">{t("Display mode contest")}</Text>
            </div>
            <div className="flex justify-center">
              <PieChartComponent
                data={[
                  { name: "Public", value: data?.totalContest_Public },
                  { name: "Share", value: data?.totalContest_Share },
                  { name: "Private", value: data?.totalContest_Private },
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#77C148]"></div>
                <Text className="text-center font-semibold text-sm">{t("Public")}</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FAA05E]"></div>
                <Text className="text-center font-semibold text-sm">{t("Share")}</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#F1646C]"></div>
                <Text className="text-center font-semibold text-sm">{t("Private")}</Text>
              </div>
            </div>
          </Paper>
          <Paper shadow="xs" p="md" className="flex flex-col bg-slate-50">
            <div className="flex justify-start">
              <Text className="font-semibold">{t("Contest Status")}</Text>
            </div>
            <div className="flex justify-center">
              <PieChartComponent
                data={[
                  { name: "Running", value: data?.totalContest_Running },
                  { name: "Finished", value: data?.totalContest_Finished },
                  { name: "End Register", value: data?.totalContest_ToEndRegister },
                  { name: "Start Register", value: data?.totalContest_ToStartRegister },
                  { name: "Upcoming", value: data?.totalContest_UpComing },
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#77C148]"></div>
                <Text className="text-center font-semibold text-sm">{t("Running")}</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FAA05E]"></div>
                <Text className="text-center font-semibold text-sm">{t("Finished")}</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#F1646C]"></div>
                <Text className="text-center font-semibold text-sm">{t("End Register")}</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FF5722]"></div>
                <Text className="text-center font-semibold text-sm">{t("Start Register")}</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#9C27B0]"></div>
                <Text className="text-center font-semibold text-sm">{t("Upcoming")}</Text>
              </div>
            </div>
          </Paper>
          <Paper shadow="xs" p="md" className="flex flex-col  bg-slate-50">
            <div className="flex justify-start">
              <Text className="font-semibold">{t("Contest Type")}</Text>
            </div>
            <div className="flex justify-center">
              <PieChartComponent
                data={[
                  { name: "Free", value: data?.totalContest_Free },
                  { name: "Paid", value: data?.totalContest_Paid },
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#77C148]"></div>
                <Text className="text-center font-semibold text-sm">{t("Free")}</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FAA05E]"></div>
                <Text className="text-center font-semibold text-sm">{t("Paid")}</Text>
              </div>
            </div>
          </Paper>
        </SimpleGrid>
      </Card>
      <Card shadow="sm" p="md">
        <Text className="font-semibold text-lg">{t("Contest List")}</Text>
        <Table withColumnBorders withBorder striped>
          <thead className="bg-blue-200">
            <tr>
              <th>{t("Name")}</th>
              <th>{t("Owner")}</th>
              <th>{t("Status")}</th>
              <th>{t("Type")}</th>
              <th>{t("Price")} (VND)</th>
              <th>{t("Register")}</th>
              <th>{t("Is Team")}</th>
              <th>{t("Start time")}</th>
              <th>{t("End time")}</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <div className="flex justify-center">
          <Pagination
            total={listFight?.metaData?.pageTotal}
            value={currentPage}
            onChange={setCurrentPage}
            withEdges
            size="sm"
            align="center"
            className="py-4"
          />
        </div>
      </Card>
    </div>
  );
};
