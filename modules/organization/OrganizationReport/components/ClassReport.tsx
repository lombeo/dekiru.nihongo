import { Card, Pagination, Paper, SimpleGrid, Table, Text } from "@mantine/core";
import Link from "@src/components/Link";
import { ClassDurationStatusEnum } from "@src/constants/class/class.constant";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { LearnService } from "@src/services/LearnService/LearnService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import PieChartComponent from "./PieChartComponent";

const getTextStatus = (statusEnum) => {
  switch (statusEnum) {
    case ClassDurationStatusEnum.None:
      return "";
    case ClassDurationStatusEnum.NOT_STARTED:
      return "Not started";
    case ClassDurationStatusEnum.INPROGRESS:
      return "Inprogress";
    case ClassDurationStatusEnum.ENDED:
      return "Ended";
  }
};
export const ClassReport = (props: any) => {
  const { data, listUsers } = props;
  const { t } = useTranslation();
  const [listClass, setListClass] = useState({} as any);
  const [currentPage, setCurrentPage] = useState(1);
  const fetch = async () => {
    const res = await LearnService.getClassByOwnerIds({
      ownerIds: listUsers,
      pageSize: 10,
      pageIndex: currentPage,
    });
    if (res?.data?.success) {
      setListClass(res.data.data);
    }
  };
  useEffect(() => {
    fetch();
  }, [listUsers, currentPage]);
  const rows = listClass?.results?.map((element) => (
    <tr key={element.id}>
      <td>
        <Link href={`/classmanagement/classdetails/${element.id}`} className="hover:text-blue-500">
          {element.className}
        </Link>
      </td>
      <td>
        <Link href={`/profile/${element.owner.userId}`} className="hover:text-blue-500">
          {element.owner.userName}
        </Link>
      </td>
      <td>{t(getTextStatus(element.classStatus))}</td>
      <td>{element.totalStudents}</td>
      <td>{formatDateGMT(element.startDate)}</td>
      <td>{formatDateGMT(element.endDate)}</td>
      <td>{element.totalCourses}</td>
    </tr>
  ));
  return (
    <Card>
      <Text className="font-semibold text-xl mb-2">{t("Class Overview")}</Text>
      <SimpleGrid cols={2} spacing="lg">
        <Paper shadow="xs" p="md" className="bg-slate-50">
          <Text className="font-semibold pb-4">{t("Statistics")}</Text>
          <Text>{`${t("Total")}: ${data?.totalClass}`}</Text>
          <Text>{`${t("Total Students")}: ${data?.totalStudent}`}</Text>
        </Paper>
        <Paper shadow="xs" p="md" className="flex flex-col items-center gap-4 bg-slate-50">
          <PieChartComponent
            data={[
              { name: "Not started", value: data?.totalClass_NotStarted },
              { name: "In progress", value: data?.totalClass_InProgress },
              { name: "Ended", value: data?.totalClass_Ended },
            ]}
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#77C148]"></div>
              <Text className="text-center font-semibold">{t("Not started")}</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FAA05E]"></div>
              <Text className="text-center font-semibold">{t("In progress")}</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#F1646C]"></div>
              <Text className="text-center font-semibold">{t("Ended")}</Text>
            </div>
          </div>
        </Paper>
      </SimpleGrid>
      <div className="pt-3">
        <Text className="font-semibold text-lg mb-2">{t("List Class")}</Text>
        <Table withBorder withColumnBorders striped>
          <thead className="bg-blue-200 h-[60px]">
            <tr>
              <th>{t("Name")}</th>
              <th>{t("Owner")}</th>
              <th>{t("Status")}</th>
              <th>{t("Students")}</th>
              <th>{t("Start date")}</th>
              <th>{t("End date")}</th>
              <th>{t("Courses count")}</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <div className="flex justify-center py-4">
          <Pagination
            total={listClass?.pageCount}
            value={listClass?.currentPage}
            withEdges
            onChange={(value) => {
              setCurrentPage(value);
            }}
            size={"sm"}
          />
        </div>
      </div>
    </Card>
  );
};
