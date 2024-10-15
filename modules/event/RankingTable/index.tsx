import { Table, Tooltip } from "@mantine/core";
import styles from "./styles.module.scss";
import { Image } from "@mantine/core";
import { Fragment } from "react";
import { useTranslation } from "next-i18next";
import { formatTime } from "@src/constants/event/event.constant";
import { selectProfile } from "@src/store/slices/authSlice";
import { useSelector } from "react-redux";
import clsx from "clsx";
import Link from "@src/components/Link";
import { capitalizeName } from "@src/constants/event/event.constant";
import { AlertCircle, CircleCheck } from "tabler-icons-react";

export default function RankingTable({ data, minRows, isCut }: { data: any; minRows: number; isCut: boolean }) {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const generateRows = (rowData) => {
    let position;
    switch (rowData?.ranking) {
      case 1:
        position = <img className="!h-[34px]" src={"/images/icons/IconRank1.svg"} />;
        break;

      case 2:
        position = <img className="!h-[34px]" src={"/images/icons/IconRank2.svg"} />;
        break;
      case 3:
        position = <img className="!h-[34px]" src={"/images/icons/IconRank3.svg"} />;
        break;

      default:
        parseInt(rowData?.ranking, 10) < 10 ? (position = "0" + rowData?.ranking) : (position = rowData?.ranking);
        break;
    }

    return (
      <tr
        className={clsx("", {
          "bg-[#E0E5FF]": profile?.userId === rowData?.userId,
        })}
      >
        <td className="text-center">{position}</td>
        <td>
          <div className="flex items-center gap-[6px] h-fit w-fit">
            <div className="!w-7 !h-7 xs:!w-8 xs:!h-8 rounded-full overflow-hidden">
              <img src={rowData?.avatarUrl} className="w-full h-full" />
            </div>
            <Link href={`/profile/${rowData?.userId}`} className="hover:underline cursor-pointer flex gap-1">
              <span className="max-w-200 truncate">{capitalizeName(rowData?.userName)}</span>
              {rowData?.isVerifiedPhoneNumber ? (
                <Tooltip label={t("Authenticated tel")}>
                  <span className="flex items-center justify-end ">
                    <CircleCheck size={16} className="text-green-600" />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip label={t("Unauthenticated tel")}>
                  <span className="flex items-center justify-end">
                    <AlertCircle size={16} className="text-red-600" />
                  </span>
                </Tooltip>
              )}
            </Link>
          </div>
        </td>
        <td className="text-right">{rowData?.totalPointEarned}</td>
        <td>
          <div className="flex items-center gap-[6px] h-fit w-[50px]">
            <div className="w-[18px] h-[18px]">
              <Image src="/images/icons/IconCorrect.svg" />
            </div>
            <span>{rowData?.totalQuestionDonePass}</span>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-[6px] h-fit w-[45px]">
            <div className="w-[18px] h-[18px]">
              <Image src="/images/icons/IconWrong.svg" />
            </div>
            <span>{rowData?.totalQuestionDoneNotPass}</span>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-[6px] h-fit">
            <div className="w-[18px] h-[18px]">
              <Image src="/images/icons/IconClock.svg" />
            </div>
            <span>{formatTime(rowData?.totalTimeTakenInSecond)}</span>
          </div>
        </td>
      </tr>
    );
  };

  const renderTableRow = () => {
    let missingRows;

    if (data?.length < minRows) {
      const missingNumber = minRows - data.length;

      missingRows = [...Array(missingNumber)].map((_, index) => {
        const position = minRows - missingNumber + index + 1;
        let cell: any = "---";

        if (!isCut) {
          switch (position) {
            case 1:
              cell = <img className="!h-[34px]" src={"/images/icons/IconRank1.svg"} />;
              break;

            case 2:
              cell = <img className="!h-[34px]" src={"/images/icons/IconRank2.svg"} />;
              break;
            case 3:
              cell = <img className="!h-[34px]" src={"/images/icons/IconRank3.svg"} />;
              break;

            default:
              break;
          }
        }

        return (
          <tr key={index}>
            <td className="text-center">{cell}</td>
            <td>---</td>
            <td className="text-right">---</td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
          </tr>
        );
      });
    }

    return (
      <>
        {data?.map((item, index) => (
          <Fragment key={index}>{generateRows(item)}</Fragment>
        ))}
        {missingRows && missingRows}
      </>
    );
  };

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          <th className="w-[14%] !text-center whitespace-nowrap">{t("Ranks")}</th>
          <th>{t("Full name")}</th>
          <th className="!text-right">{t("Point")}</th>
          <th>{t("Correct")}</th>
          <th>{t("Incorrect")}</th>
          <th>{t("Time")}</th>
        </tr>
      </thead>
      <tbody className="max-h-[600px] overflow-auto">{renderTableRow()}</tbody>
    </Table>
  );
}

RankingTable.defaultProps = {
  minRows: 10,
  isCut: false,
};
