import { Table } from "@edn/components";
import { TableColumn } from "@edn/components/Table/Table";
import Icon from "@edn/font-icons/icon";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import moment from "moment";
import { useTranslation } from "next-i18next";

/**
 * Attemp history of quiz
 * @param props data,
    roundCount,
    numberOfTries,
    isLoading,
    suggestion = false,
    viewAnswers = false,
    onViewAnswers,
 * @returns Table layout of attemp history
 */
const AttemptHistorys = (props: any) => {
  const {
    data,
    roundCount,
    numberOfTries,
    isLoading,
    suggestion = false,
    viewAnswers = false,
    onViewAnswers,
    columnsHidden = [],
  } = props;
  const { t } = useTranslation();
  const columns: TableColumn[] = [
    {
      title: t("#"),
      headClassName: "w-60 text-center",
      className: "w-60 text-center",
      isIndex: true,
    },
    {
      title: t("Score (%)"),
      dataIndex: "score",
      headClassName: "text-left w-120",
      className: "text-left w-120",
      render: (item: any) => (
        <span
          className={`${
            checkIsOnGoing(item.utcNow, item.endTime) ? "" : item.isPassed ? "text-green-primary" : "text-red-500"
          } font-semibold`}
        >
          {checkIsOnGoing(item.utcNow, item.endTime) ? "--" : item.completedPercentage}
        </span>
      ),
    },
    // {
    //   title: t("Result"),
    //   dataIndex: "result",
    //   headClassName: "text-left w-120",
    //   className: "text-left 120",
    //   render: (item: any) => (
    //     checkIsOnGoing(item.utcNow, item.endTime) ? <span className="font-semibold">--</span> : item?.isPassed ? <span className="text-green-primary font-semibold">{t("Passed")}</span> : <span className="text-red-500 font-semibold">{t("Not passed")}</span>
    //   ),
    // },
    {
      title: t("Detail"),
      dataIndex: "detail",
      headClassName: "text-left",
      className: "text-left",
      render: (item: any) => (
        <div className="flex gap-3">
          <div className="flex items-center gap-1 text-green-500 whitespace-nowrap">
            <Icon name="check-circle-outline" size={20} />{" "}
            <span className="text-gray">
              {t("Correct")}: <span className="font-semibold">{item?.questionDonePass}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-red-500 whitespace-nowrap">
            <Icon name="close-circle" size={20} />{" "}
            <span className="text-gray">
              {t("Incorrect")}: <span className="font-semibold">{item.totalQuestion - item.questionDonePass}</span>
            </span>
          </div>
          {/*<div className="flex items-center gap-1 text-gray whitespace-nowrap">*/}
          {/*  <Icon name="comment-disabled" size={20} />{" "}*/}
          {/*  <span className="text-gray">*/}
          {/*    {t("Unanswered")}: <span className="font-semibold">{item.totalQuestion - item.questionDonePass - item.questionDoneNotPass}</span>*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>
      ),
    },
    {
      title: t("Start time"),
      dataIndex: "startTime",
      headClassName: "text-center",
      className: "text-center",
      render: (item: any) => (
        <span className="text-center block mx-auto">
          {!checkIsOnGoing(item.utcNow, item.endTime)
            ? FunctionBase.formatDateGMT({
                dateString: item?.beginTime,
              })
            : "--"}
        </span>
      ),
    },
    // {
    //   title: t("End time"),
    //   dataIndex: "endTime",
    //   headClassName: "text-center",
    //   className: "text-center",
    //   render: (item: any) => (
    //     <span className="text-center block w-24 mx-auto">
    //       {!checkIsOnGoing(item.utcNow, item.endTime)
    //         ? FunctionBase.formatDateGMT({
    //             dateString: item?.endTime,
    //           })
    //         : "--"}
    //     </span>
    //   ),
    // },
    {
      title: t("Time (min)"),
      dataIndex: "takenTime",
      headClassName: "text-center w-[150px]",
      className: "text-center w-[150px]",
      render: (item: any) => {
        let isFinish =
          moment.utc(item.endTime).valueOf() > 0 &&
          moment.utc(item.endTime).valueOf() < moment.utc(item.utcNow).valueOf();
        let minutes =
          Math.floor(item.timeTaken / 60) > 9 ? Math.floor(item.timeTaken / 60) : "0" + Math.floor(item.timeTaken / 60);
        let seconds = item.timeTaken % 60 > 9 ? item.timeTaken % 60 : "0" + (item.timeTaken % 60);
        let takenTimeFormat = isFinish ? minutes + ":" + seconds : "--";
        return <>{takenTimeFormat}</>;
      },
    },
    {
      title: t("Actions"),
      dataIndex: "action",
      headClassName: `text-center w-120 ${viewAnswers ? "" : "hidden "}`,
      className: `text-center w-120 ${viewAnswers ? "" : "hidden "}`,
      render: (item: any) => (
        <div
          className={` flex items-center justify-center gap-3 cursor-pointer text-blue-primary hover:text-blue-800 ${
            checkIsOnGoing(item.utcNow, item.endTime) ? "cursor-not-allowed" : ""
          }`}
        >
          <span
            onClick={() => onViewAnswers(item?.id, suggestion)}
            className={`flex items-center justify-center ${
              checkIsOnGoing(item.utcNow, item.endTime) ? "pointer-events-none text-gray-primary" : ""
            }`}
          >
            <Icon name="eye" size={22} />
          </span>
        </div>
      ),
    },
  ];

  //Check if a test is ongoing
  const checkIsOnGoing = (itemUtc, itemEndtime) => {
    return moment.utc(itemUtc).valueOf() <= moment.utc(itemEndtime).valueOf();
  };
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">
        {t("Attempt history")}{" "}
        {numberOfTries || numberOfTries != 0 ? `(${roundCount}/${numberOfTries})` : `(${roundCount})`}
      </h3>
      <Table
        className="table-auto w-full"
        wrapClassName="mb-6"
        data={data != null ? data : []}
        columns={columns.filter((x) => !columnsHidden.includes(x.dataIndex))}
        isLoading={isLoading}
      ></Table>
    </>
  );
};

export default AttemptHistorys;
