import { Table } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Badge, Pagination, Text } from "@edn/components";
import React, { useContext } from "react";
import { CodeActivityReportContext } from "./Context";
import { upperCase } from "lodash";
import moment from "moment/moment";
import Link from "@src/components/Link";

const Content = () => {
  const { filter, data, search } = useContext(CodeActivityReportContext);
  const { t } = useTranslation();

  const ths = (
    <tr>
      <th className="!text-center">{t("No.")}</th>
      <th>{t("Date")}</th>
      <th>{t("Name")}</th>
      <th>{t("Activity")}</th>
      <th className="!text-center">{t("Total execute time (ms)")}</th>
      <th className="!text-center">{t("Test case")}</th>
      <th className="!text-center">{t("Language key")}</th>
      {/*<th className="!text-center">{t("Actions")}</th>*/}
    </tr>
  );

  const rows = data?.results?.map((element, idx) => {
    let createdOn =
      element?.createdOn && moment(moment.utc(element?.createdOn).toDate()).local().format("HH:mm - DD/MM/YYYY");
    return (
      <tr key={element.id}>
        <td className="text-center">{(data.currentPage - 1) * data.pageSize + idx + 1}</td>
        <td>{createdOn}</td>
        <td>
          <Link href={`/profile/${element.ownerId}`} className="text-primary hover:underline" target="_blank">
            {element.owner?.userName}
          </Link>
        </td>
        <td>{element.activityTitle}</td>
        <td className="text-center">{element.totalExcuteTime}</td>
        <td className="!text-center">
          {element.isComplete ? (
            <Badge color="green" variant="filled">
              {element.testResult}
            </Badge>
          ) : (
            <Badge color="gray" variant="filled">
              {element.testResult}
            </Badge>
          )}
        </td>
        <td className="text-center">{upperCase(element.languageKey)}</td>
        {/*<td className="text-center">*/}
        {/*  <Tooltip label={t("Export")}>*/}
        {/*    <ActionIcon*/}
        {/*      onClick={() => handleExportCode(element.activityId, element.id)}*/}
        {/*      variant="filled"*/}
        {/*      color="blue"*/}
        {/*      loading={loadingExportSubmittedId != null && loadingExportSubmittedId === element.id}*/}
        {/*      className="inline-flex"*/}

        {/*      disabled={loadingExportSubmittedId != null && loadingExportSubmittedId != element.id}*/}
        {/*    >*/}
        {/*      <Icon size={20} name="download" />*/}
        {/*    </ActionIcon>*/}
        {/*  </Tooltip>*/}
        {/*</td>*/}
      </tr>
    );
  });

  return (
    <>
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
