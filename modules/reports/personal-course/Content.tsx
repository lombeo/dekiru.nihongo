import { Pagination, Text } from "@edn/components";
import { Badge, Table } from "@mantine/core";
import { resolveLanguage } from "@src/helpers/helper";
import Link from "components/Link";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { PersonalCourseReportContext } from "./Context";

const Content = () => {
  const { model, data, search } = useContext(PersonalCourseReportContext);
  const { t } = useTranslation();
  const { locale } = useRouter();

  const ths = (
    <tr>
      <th>{t("Course name")}</th>
      <th className="!text-center">{t("Status")}</th>
      <th className="!text-right">{t("Price")}</th>
      <th className="!text-center">{t("Enrolls")}</th>
      <th className="!text-center">{t("Completed")}</th>
      <th className="!text-center">{t("%")}</th>
      <th>{t("Released date")}</th>
      <th>{t("Start date")}</th>
      <th>{t("End date")}</th>
    </tr>
  );

  const numberFormat = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

  const rows = data?.results?.map((element) => (
    <tr key={element.courseId}>
      <td>
        <Link target="_blank" href={`/learning/${element.permalink}`}>
          <div className="text-blue-primary font-semibold">{resolveLanguage(element, locale)?.title}</div>
        </Link>
      </td>
      <td className="text-center">
        {element.courseStatus === "Published" && (
          <Badge variant="filled" color="green">
            {t("Published")}
          </Badge>
        )}
        {element.courseStatus === "Archived" && (
          <Badge variant="filled" color="gray">
            {t("Archived")}
          </Badge>
        )}
      </td>
      <td className="font-semibold text-right">{element.price ? numberFormat.format(element.price) : t("Free")}</td>
      <td className="text-center">{element.totalActiveEnrolment}</td>
      <td className="text-center">{element.totalGraded}</td>
      <td className="text-center">{element.gradedPercentage}</td>
      <td>{element.createdTime && <>{dayjs(element.createdTime).format("DD/MM/YYYY")}</>}</td>
      <td>{element.startTime && <>{dayjs(element.startTime).format("DD/MM/YYYY")}</>}</td>
      <td>{element.endTime && <>{dayjs(element.endTime).format("DD/MM/YYYY")}</>}</td>
    </tr>
  ));

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
            pageIndex={model.pageIndex}
            currentPageSize={data.results?.length}
            totalItems={data.rowCount}
            totalPages={data.pageCount}
            label={""}
            pageSize={model.pageSize}
            onChange={(page) => {
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
