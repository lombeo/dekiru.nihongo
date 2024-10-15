import { Card, Pagination, Paper, SimpleGrid, Table, Text, clsx } from "@mantine/core";
import Link from "@src/components/Link";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { getLevelLabel } from "@src/services/Coding/types";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import PieChartComponent from "./PieChartComponent";

export const TrainingReport = (props) => {
  const { data, listUsers } = props;
  const { t } = useTranslation();
  const [listTraining, setListTraining] = useState({} as any);
  const [currentPage, setCurrentPage] = useState(1);

  const fetch = async () => {
    const res = await CodingService.getTrainingByOwnerIds({
      ownerIds: listUsers,
      pageSize: 10,
      pageIndex: currentPage,
    });
    if (res?.data?.success) {
      setListTraining(res.data);
    }
  };

  useEffect(() => {
    fetch();
  }, [listUsers, currentPage]);

  const rows = listTraining?.data?.map((element) => (
    <tr key={element.id}>
      <td>
        <Link href={`/training/${element.id}`} className="hover:text-blue-500">
          {element.title}
        </Link>
      </td>
      <td>
        <Link href={`/profile/${element.ownerId}`} className="hover:text-blue-500">
          {element.ownerName}
        </Link>
      </td>
      <td
        className={clsx("", {
          "text-[#77C148]": element.levelId === 1,
          "text-[#faa05e]": element.levelId === 2,
          "text-[#ee4035]": element.levelId === 3,
        })}
      >
        {getLevelLabel(element.levelId)}
      </td>
      <td>{element.totalSubmit}</td>
      <td>{element.totalCompleted}</td>
      <td>{formatDateGMT(element.createdOn)}</td>
      <td>{element.tags}</td>
    </tr>
  ));

  return (
    <Card shadow="sm" p="lg" className="space-y-6">
      <Text className="font-semibold text-xl mb-2">{t("Training Overview")}</Text>
      <SimpleGrid cols={2} spacing="lg">
        <Paper shadow="xs" p="md" className="bg-slate-50">
          <Text className="font-semibold pb-4">{t("Statistics")}</Text>
          <Text>{`${t("Total")}: ${data?.totalTraining}`}</Text>
          <Text>{`${t("Total submitted")}: ${data?.totalSubmitted}`}</Text>
        </Paper>
        <Paper shadow="xs" p="md" className="flex flex-col items-center gap-4 bg-slate-50">
          <PieChartComponent
            data={[
              { name: "Easy", value: data?.totalTraining_Easy },
              { name: "Medium", value: data?.totalTraining_Medium },
              { name: "Hard", value: data?.totalTraining_Hard },
            ]}
          />
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#77C148]"></div>
              <Text className="text-center font-semibold text-sm">{t("Easy")}</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FAA05E]"></div>
              <Text className="text-center font-semibold text-sm">{t("Medium")}</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#F1646C]"></div>
              <Text className="text-center font-semibold text-sm">{t("Hard")}</Text>
            </div>
          </div>
        </Paper>
      </SimpleGrid>

      <Text className="font-semibold text-lg mb-2">{t("List Training")}</Text>
      <Table striped withBorder withColumnBorders>
        <thead className="bg-blue-200">
          <tr>
            <th>{t("Name")}</th>
            <th>{t("Owner")}</th>
            <th>{t("Level")}</th>
            <th>{t("Total joined")}</th>
            <th>{t("Completed")}</th>
            <th>{t("Publish date")}</th>
            <th>{t("Tags")}</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <div className="flex justify-center py-4">
        <Pagination
          total={listTraining?.metaData?.pageTotal}
          value={currentPage}
          withEdges
          onChange={setCurrentPage}
          size="sm"
          align="center"
        />
      </div>
    </Card>
  );
};
