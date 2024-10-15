import { Card, Pagination, Paper, SimpleGrid, Table, Text } from "@mantine/core";
import Link from "@src/components/Link";
import { CourseViewLimitEnum } from "@src/constants/courses/courses.constant";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { LearnService } from "@src/services/LearnService/LearnService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import PieChartComponent from "./PieChartComponent";

export const CourseReport = (props: any) => {
  const { data, listUsers } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const [dataCourse, setDataCourse] = useState({} as any);
  const fetch = async () => {
    const res = await LearnService.getCourseByOwnerIds({
      ownerIds: listUsers,
      pageSize: 10,
      pageIndex: currentPage,
    });
    if (res?.data?.success) {
      setDataCourse(res.data.data);
    }
  };
  useEffect(() => {
    if (listUsers) {
      fetch();
    }
  }, [listUsers, currentPage]);

  const rows = dataCourse?.results?.map((element) => (
    <tr key={element.id}>
      <td>
        <Link href={`/learning/${element.permalink}`} className="hover:text-blue-500">
          {element.title}
        </Link>
      </td>
      <td>
        <Link href={`/profile/${element.owner.userId}`} className="hover:text-blue-500">
          {element.owner.userName}
        </Link>
      </td>
      <td>{element.courseViewLimit == CourseViewLimitEnum.Private ? t("Private") : t("Public")}</td>
      <td>{element.courseStatus == "Published" ? t("Yes") : t("No")}</td>
      <td>{FunctionBase.formatNumber(element.price)}</td>
      <td>{element.totalEnroll}</td>
      <td>{element.totalPass}</td>
      <td>{formatDateGMT(element.createdOn)}</td>
      <td>{formatDateGMT(element.startTime)}</td>
      <td>{formatDateGMT(element.finishedTime)}</td>
    </tr>
  ));
  return (
    <div className="flex flex-col gap-4">
      <Card shadow="sm" p="md" className="space-y-4">
        <Text className="font-semibold text-xl">{t("Course Overview")}</Text>
        <Text className="font-semibold">{`${t("Total")}: ${data?.totalCourse}`} </Text>
        <Text className="font-semibold">{`${t("Total students")}: ${data?.totalEnrolled}`}</Text>
        <SimpleGrid cols={3} spacing="lg">
          <Paper shadow="xs" p="md" className="flex flex-col items-center bg-slate-50">
            <PieChartComponent
              data={[
                { name: "Free", value: data?.totalCourse_Free },
                { name: "Paid", value: data?.totalCourse_Paid },
              ]}
            />
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#77C148]"></div>
                <Text className="text-center font-semibold">{t("Free")}</Text>
              </div>
              /
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FAA05E]"></div>
                <Text className="text-center font-semibold">{t("Paid")}</Text>
              </div>
            </div>
          </Paper>
          <Paper shadow="xs" p="md" className="flex flex-col items-center bg-slate-50">
            <PieChartComponent
              data={[
                { name: "Public", value: data?.totalCourse_Publish },
                { name: "Private", value: data?.totalCourse_Privated },
              ]}
            />
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#77C148]"></div>
                <Text className="text-center font-semibold">{t("Public")}</Text>
              </div>
              /
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FAA05E]"></div>
                <Text className="text-center font-semibold">{t("Private")}</Text>
              </div>
            </div>
          </Paper>
          <Paper shadow="xs" p="md" className="flex flex-col items-center bg-slate-50">
            <PieChartComponent
              data={[
                { name: "Published", value: data?.totalCourse_Published },
                { name: "Archived", value: data?.totalCourse_Archived },
              ]}
            />
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#77C148]"></div>
                <Text className="text-center font-semibold">{t("Published")}</Text>
              </div>
              /
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#FAA05E]"></div>
                <Text className="text-center font-semibold">{t("Archived")}</Text>
              </div>
            </div>
          </Paper>
        </SimpleGrid>
      </Card>
      <div className="shadow-sm bg-white">
        <Table withBorder withColumnBorders striped>
          <thead className="bg-blue-200 h-[60px]">
            <tr>
              <th>{t("Name")}</th>
              <th>{t("Owner")}</th>
              <th>{t("Status")}</th>
              <th>{t("Published")}</th>
              <th>{t("Price")} (VND)</th>
              <th>{t("Enrolls")}</th>
              <th>{t("Completed")}</th>
              <th>{t("Release date")}</th>
              <th>{t("Start date")}</th>
              <th>{t("End date")}</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <div className="flex justify-center py-4">
          <Pagination
            total={dataCourse?.pageCount}
            value={dataCourse?.currentPage}
            withEdges
            onChange={(value) => {
              setCurrentPage(value);
            }}
            size={"sm"}
          />
        </div>
      </div>
    </div>
  );
};
