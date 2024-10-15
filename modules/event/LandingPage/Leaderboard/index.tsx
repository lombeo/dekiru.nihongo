import { Table, Tooltip } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Fragment, useState } from "react";
// import EventConfirmAttendModal from "./ConfirmAttendModal";
import styles from "./styles.module.scss";
import { capitalizeName } from "@src/constants/event/event.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { AlertCircle, CircleCheck } from "tabler-icons-react";

export default function EventLandingLeaderboard({
  dataTable,
  totalRegister,
  imageTop,
  classTitle,
  title,
  roundData,
  eventData,
  joinFunc,
}) {
  const { t } = useTranslation();

  // const [isOpen, setIsOpen] = useState(false);

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
      <tr className="text-white">
        <td className="text-center">
          <div className="max-w-[70px]">{position}</div>
        </td>
        <td>
          <div className="flex items-center gap-[6px] h-fit w-fit min-w-[145px]">
            <div className="!w-7 !h-7 xs:!w-8 xs:!h-8 rounded-full overflow-hidden">
              <img src={rowData?.avatarUrl} className="w-full h-full" />
            </div>
            <span className="flex gap-1">
              <span
                className="text-ellipsis whitespace-nowrap max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] screen1024:max-w-[150px] screen1440:max-w-[170px] xl:max-w-[190px] overflow-hidden"
                title={rowData?.userName}
              >
                {capitalizeName(rowData?.userName)}
              </span>
              {rowData?.isVerifiedPhoneNumber ? (
                <Tooltip label={t("Authenticated tel")}>
                  <span className="flex items-center">
                    <CircleCheck size={16} className="text-green-600" />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip label={t("Unauthenticated tel")}>
                  <span className="flex items-center">
                    <AlertCircle size={16} className="text-red-600" />
                  </span>
                </Tooltip>
              )}
            </span>
          </div>
        </td>
        <td className="text-right">{rowData?.totalPointEarned}</td>
      </tr>
    );
  };

  const renderTableRow = () => {
    let missingRows;

    if (dataTable?.length < 10) {
      const missingNumber = 10 - dataTable.length;

      missingRows = [...Array(missingNumber)].map((_, index) => {
        const position = 10 - missingNumber + index + 1;

        let cell: any = "---";
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

        return (
          <tr key={index}>
            <td className="text-center">
              <div className="max-w-[70px]">{cell}</div>
            </td>
            <td>
              <div className="min-w-[145px]">---</div>
            </td>
            <td className="text-right">---</td>
          </tr>
        );
      });
    }

    return (
      <>
        {dataTable?.map((item, index) => (
          <Fragment key={index}>{generateRows(item)}</Fragment>
        ))}
        {missingRows && missingRows}
      </>
    );
  };

  return (
    <div className={`${styles["table-wrapper"]} relative text-white`}>
      {/* {isOpen && (
        <EventConfirmAttendModal
          title={title}
          roundData={roundData}
          eventData={eventData}
          joinFunc={joinFunc}
          onClose={() => setIsOpen(false)}
        />
      )} */}

      <div
        className="w-[240px] xs:w-[268px] absolute -top-[5px] left-[50%]"
        style={{ transform: "translate(-50%,-50%)" }}
      >
        <img src={imageTop} />
        <div
          className="absolute top-[53%] left-[50%] w-full flex flex-col items-center"
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <div className="text-sm font-bold">{classTitle}</div>
          <div className="uppercase text-[18px] xs:text-xl font-extrabold">{title}</div>
        </div>
      </div>
      <div
        className={`rounded-[28px] xs:rounded-[40px] pt-[35px] px-4 pb-5 xs:pt-[40px] xs:px-6 xs:pb-6`}
        style={{ background: "#003A32" }}
      >
        <div className="italic text-right mb-1 pr-[10px] text-xs sm:text-sm">
          {t("Did the assignment {{number}}", { number: FunctionBase.formatNumber(totalRegister) })}
        </div>
        <Table>
          <tbody className="max-h-[600px] overflow-auto">{renderTableRow()}</tbody>
        </Table>
        <div className="mt-5 text-xs xs:text-sm w-1/2 mx-auto">
          <button
            className="text-white bg-[#F56060] py-3 px-6 rounded-[8px] flex-grow cursor-pointer w-full"
            onClick={() => {
              // setIsOpen(true);
              joinFunc();
            }}
          >
            {t("Attend")}
          </button>
        </div>
      </div>
    </div>
  );
}
