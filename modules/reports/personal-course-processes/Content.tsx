import { Pagination, Text } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Badge, Switch, Table } from "@mantine/core";
import Link from "@src/components/Link";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import ModalViewStatistic from "@src/modules/enrolments/components/ModalViewStatistic";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import { PersonalCourseProcessesContext } from "./Context";
import styles from "./CourseEnrollment.module.scss";

const Content = () => {
  const { filter, data, search, viewStatistic, setViewStatistic } = useContext(PersonalCourseProcessesContext);

  const { t } = useTranslation();
  const ths = (
    <tr>
      <th className="max-w-[500px] w-[200px]">{t("User")}</th>
      {/*<th>{t("Group")}</th>*/}
      <th className="!text-center">{t("Account status")}</th>
      <th>{t("Enrollment date")}</th>
      <th>{t("Final quiz status")}</th>
      <th className="!text-center">{t("Progress") + " (%)"}</th>
      <th className="!text-center">{t("Course status")}</th>
    </tr>
  );

  const rows = data?.results?.map((item, idx) => {
    const isHaveSection = item.sectionProgresses?.length > 0 && filter.loadSectionProgresses;
    const className = idx % 2 ? styles["rowNth"] : "bg-[#f8f9fa]";
    return (
      <React.Fragment key={`${item.courseId}-${item.id}`}>
        <tr className={className}>
          <td rowSpan={isHaveSection ? 2 : 1}>
            <Link href={`/profile/${item.userId}`} className="text-primary hover:underline" target="_blank">
              {item.userName}
            </Link>
          </td>
          {/*<td rowSpan={isHaveActivities ? 2 : 1}>*/}
          {/*  {item.groupId ? groups?.find((e) => e.id === item.groupId)?.courseGroupName : null}*/}
          {/*</td>*/}
          <td rowSpan={isHaveSection ? 2 : 1} className="text-center">
            {item.status != 0 ? (
              <span className="text-blue-primary font-semibold">{t("Active")}</span>
            ) : (
              <span className="text-orange-primary font-semibold">{t("Deactive")}</span>
            )}
          </td>
          <td>{formatDateGMT(item.createdOn)}</td>
          <td>{t(item.finalQuizStatus)}</td>
          <td className="text-center">{item.progress > 0 ? item.progress.toFixed(2) : "0"}</td>
          <td className="text-center">
            {item.completed ? (
              <Badge variant="filled" color="green">
                {t("Completed")}
              </Badge>
            ) : (
              <Badge variant="filled" color="gray">
                {t("Incomplete")}
              </Badge>
            )}
          </td>
        </tr>
        {isHaveSection && (
          <tr className={className}>
            <td colSpan={4} className="border-l b-[#dee2e6]">
              <div className="grid grid-cols-2 gap-x-6">
                {item.sectionProgresses.map((e) => (
                  <div key={e.id} className={`flex items-center gap-3`}>
                    <span>
                      <Text className="min-w-[30px]">{FunctionBase.formatNumber(e?.completedPercent * 100, 2)}%</Text>
                    </span>
                    <span>-</span>
                    <span className="text-sm text-ink-primary">
                      <TextLineCamp>{e.title}</TextLineCamp>
                    </span>
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  });

  return (
    <>
      <div className="pb-6">
        {viewStatistic && <ModalViewStatistic courseId={filter.courseId} setViewStatistic={setViewStatistic} />}
      </div>
      <div className="mb-3">
        <Switch
          label={t("Show activities")}
          checked={filter.loadSectionProgresses}
          onChange={(event) => search({ loadSectionProgresses: event.currentTarget.checked })}
        />
      </div>
      <div className="overflow-auto">
        <Table captionSide="bottom" striped withBorder withColumnBorders className="bg-white">
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
      {data?.results?.length ? (
        <div className="mt-8 pb-8">
          <Pagination
            pageIndex={filter.pageIndex}
            currentPageSize={data.results?.length}
            totalItems={data.rowCount}
            totalPages={data.pageCount}
            label={""}
            pageSize={filter.pageSize}
            onChange={(page) => {
              search({
                pageIndex: page,
              });
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
