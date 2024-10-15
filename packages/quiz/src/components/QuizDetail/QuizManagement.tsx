import { Button, Table } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TableColumn } from "@edn/components/Table/Table";
import Icon from "@edn/font-icons/icon";
import { TextInput } from "@mantine/core";
import { PubsubTopic } from "@src/config";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import QueryUtils from "@src/helpers/query-utils";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { QuizService } from "../../services";

const QuizManagement = (props: any) => {
  const { activityId, courseId, onAdminReviewStudentQuiz, percentPass } = props;
  const [data, setData] = useState<any>(null);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  //Load all test
  useEffect(() => {
    fetchData();
  }, [pageIndex]);

  //Load all test
  const fetchData = (_textSearch = textSearch) => {
    let filter = {
      quizActivityId: activityId,
      pageIndex: pageIndex,
      textSearch: _textSearch,
      courseId: courseId,
    };
    setTextSearch(QueryUtils.sanitize(_textSearch));
    QuizService.getAllTest(filter)
      .then((data: any) => {
        let response = data?.data?.data;
        if (response) {
          setData(response);
          PubSub.publish(PubsubTopic.QUIZ_SUMMARY, { data: response });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const columns: TableColumn[] = [
    {
      title: t("#"),
      headClassName: "w-60 text-center",
      className: "w-60 text-center",
      isIndex: true,
    },
    {
      title: t("Learner"),
      render: (x: any) => (
        <div>
          <h3
            title={x?.fullName || x?.userName}
            style={{ maxWidth: "216px" }}
            className="font-semibold text-base overflow-hidden overflow-ellipsis whitespace-nowrap m-0"
          >
            {x?.fullName || x?.userName}
          </h3>
          <span className="text-sm">{x?.rollNumber ? x?.rollNumber : ""}</span>
        </div>
      ),
      headClassName: "text-left",
      className: "text-left",
    },
    {
      title: t("Lowest score (%)"),
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) => getLabelScore(x?.lowestScore?.toFixed(), x?.completedPercentage, percentPass, x?.testStatus),
    },
    {
      title: t("Highest score (%)"),
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) => getLabelScore(x?.highestScore?.toFixed(), x?.completedPercentage, percentPass, x?.testStatus),
    },
    {
      title: t("Attempt"),
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) => <span className="font-semibold">{x?.testStatus == "ONGOING" ? x?.round - 1 : x?.round}</span>,
    },
    {
      title: t("Submit time"),
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) => <span className="font-semibold">{formatDateGMT(x.endTime, "HH:mm DD/MM/YYYY")}</span>,
    },
    {
      title: t("Action"),
      render: (x: any) => {
        return (
          <div
            className={` flex items-center justify-center gap-3 cursor-pointer text-blue-primary hover:text-blue-800 ${
              isDisableButton(x?.round, x?.testStatus) ? "cursor-not-allowed" : ""
            }`}
          >
            <span
              onClick={() => onAdminReviewStudentQuiz(x?.userId, activityId, x?.fullName || x?.userName)}
              className={`flex items-center justify-center ${
                isDisableButton(x?.round, x?.testStatus) ? "pointer-events-none text-gray-primary" : ""
              }`}
            >
              <Icon name="eye" size={22} />
            </span>
          </div>
        );
      },
      headClassName: "text-center",
      className: "text-center",
    },
  ];

  //Get label
  const getLabelScore = (score: any, completedPercentage: any, percentPass: any, testStatus: string) => {
    if (score != null && completedPercentage != null) {
      if (testStatus == "ONGOING") {
        return <>--</>;
      } else {
        return (
          <span className={`font-semibold ${score < percentPass ? "text-red-500" : "text-green-500"}`}>{score}</span>
        );
      }
    } else {
      return <>--</>;
    }
  };

  //Check disable button
  const isDisableButton = (round = 0, teststatus = "") => {
    if (teststatus == "ONGOING") {
      if (round <= 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return round <= 0;
    }
  };

  //On change page
  const onChangePage = (page: number) => {
    setPageIndex(page);
  };

  //Export quiz
  const exportQuiz = () => {
    setIsLoadingExport(true);
    const model = {
      quizActivityId: activityId,
      courseId: courseId,
      syllabusUrl: location?.href,
    };
    QuizService.exportTest(model).then((data: any) => {
      let response = data.data.data;
      if (response?.filename != undefined && response?.filename.length > 0 && response?.contents != undefined) {
        Notify.success(t("Export quiz successfully."));
        let contentType = "application/vnd.ms-excel";
        let excelFile = FunctionBase.b64toBlob(response?.contents, contentType);
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(excelFile);
        link.download = response?.filename;
        link.click();
      } else {
        if (response?.message && response?.message != "") {
          Notify.error(t(response?.message));
        } else {
          Notify.error(t("Export quiz failed"));
        }
      }
      setIsLoadingExport(false);
    });
  };

  //On change search
  const onChangeSearch = (value: any) => {
    setTextSearch(value);
    if (value.length == 0) {
      setPageIndex(1);
      fetchData(value);
    }
  };

  //On submit search
  const onSearch = (e) => {
    e.preventDefault();
    setPageIndex(1);
    fetchData();
  };

  return (
    <>
      <div className="flex flex-wrap justify-between gap-4 mb-5">
        <form onSubmit={(e) => onSearch(e)} noValidate className="flex items-center">
          <TextInput
            value={textSearch}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder={t("Search users")}
            className="mr-4 md:w-72"
            size="md"
          />
          <Button type="submit">
            <Icon name="search" size={20} />
            <span className="ml-1">{t("Search")}</span>
          </Button>
        </form>
        <Button loading={isLoadingExport} onClick={() => exportQuiz()}>
          <Icon size={20} name="cloud-download" />
          <span className="ml-2">{t("Export")}</span>
        </Button>
      </div>
      <Table
        data={data?.results}
        className="table-auto w-full"
        wrapClassName="mb-6"
        rowClassName="hover:bg-[#EEEFFA] transition"
        wrapData={data}
        columns={columns}
        isLoading={isLoading}
        size="sm"
        noData={t("No data")}
        paginationLabel={data?.rowCount > 1 ? t("learners") : t("leaner")}
        onChangePage={onChangePage}
      />
    </>
  );
};

export default QuizManagement;
