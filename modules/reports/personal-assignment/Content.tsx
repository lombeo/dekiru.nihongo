import { Table } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Pagination, Text } from "@edn/components";
import React, { useContext } from "react";
import { isNil } from "lodash";
import { DateTimeHelper } from "@src/helpers/date-time.helper";
import { assignmentStatusData } from "@src/modules/reports/service/type";
import clsx from "clsx";
import { PersonalAssignmentReportContext } from "@src/modules/reports/personal-assignment/Context";

const Content = () => {
  const { model, data, changeModel, search } = useContext(PersonalAssignmentReportContext);
  const { t } = useTranslation();

  const ths = (
    <tr>
      <th>{t("User")}</th>
      <th>{t("Assignment")}</th>
      <th className="!text-center">{t("Pass score")}</th>
      <th className="!text-center">{t("Score")}</th>
      <th>{t("Submit")}</th>
      <th>{t("Grade date")}</th>
      <th>{t("Due date")}</th>
      <th>{t("Status")}</th>
      <th className="!text-center">{t("Pass/Failed")}</th>
    </tr>
  );

  const rows = data?.results?.map?.((item) => {
    const assignmentStatus = assignmentStatusData.find((e) => e.value === item.assignmentStatus);
    const assignmentStatusName = assignmentStatus ? t(assignmentStatus.label) : null;
    const isPassed = !isNil(item.score) ? item.score >= item.passScore : false;
    return (
      <tr key={item.id}>
        <td>
          <Text>{item.user?.fullName}</Text>
          <Text className="text-blue-primary">{item.user?.email}</Text>
          <Text>{item.user?.rollNumber}</Text>
        </td>
        <td>{item.title}</td>
        <td className="text-center">{isNil(item.passScore) ? "-" : item.passScore}</td>
        <td className="text-center">
          {isNil(item.score) ? "-" : `${item.score}${!!item.maxScore ? `/${item.maxScore}` : ""}`}
        </td>
        <td>{item.lastTime ? DateTimeHelper.formatDate(item.lastTime) : "-"}</td>
        <td>{item.gradDate ? DateTimeHelper.formatDate(item.gradDate) : "-"}</td>
        <td>{item.dueDate ? DateTimeHelper.formatDate(item.dueDate) : "-"}</td>
        <td>{assignmentStatusName}</td>
        <td
          className={clsx("text-center", {
            "text-green-500": isPassed,
            "text-red-500": !isPassed,
          })}
        >
          {!isNil(item.score) ? (isPassed ? t("Passed") : t("Failed")) : "-"}
        </td>
      </tr>
    );
  });

  return (
    <>
      {/* <div className="mb-4 flex justify-between">
        <h3 className="mb-0 text-lg">{t("Submission list")} (0)</h3>
        <Button size="md" leftIcon={<Icon size={20} name="Upload-cloud" />}>
          {t("Export")}
        </Button>
      </div> */}
      <div className="overflow-auto">
        <Table captionSide="bottom" striped withBorder withColumnBorders className="bg-white">
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
      {data?.results?.length ? (
        <div className="mt-8 pb-8">
          <Pagination
            pageIndex={model.pageIndex}
            currentPageSize={data.results?.length}
            totalItems={data.rowCount}
            totalPages={data.pageCount}
            label={""}
            pageSize={model.pageSize}
            onChange={(page) => {
              // changeModel("pageIndex", page);
              search(page);
            }}
          />
        </div>
      ) : (
        <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
      )}
    </>
  );
};

export default Content;
