import { Table } from "@edn/components/Table";
import { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getLanguageSelection } from "@src/packages/codelearn/src/components/CodelearnIDE/EditorBoard";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { ActivityCodeChanelEnum } from "../../../../configs";
import { CodelearnService } from "../../../../services/codelearn.service";
import { useIdeContext } from "../../../CodelearnIDE/IdeContext";

interface LeaderboardProps {
  onViewDetailUserSubmission: (userId: number, userName: string) => void;
}

const Leaderboard = (props: LeaderboardProps) => {
  const { onViewDetailUserSubmission } = props;

  const { t, i18n } = useTranslation();

  const { activityId, contextId, contextType, isAdminContext } = useIdeContext();

  const [filter, setFilter] = useState({
    status: 0,
    pageIndex: 1,
    pageSize: 10,
    textSearch: "",
  });

  const fetchLeaderBoard = async (filter: any) => {
    if (!contextId) return null;
    try {
      const response = await CodelearnService.getLeaderboard({
        params: {
          ...filter,
          contextId: contextId,
          activityId: activityId,
          contextType: contextType,
        },
      });
      if (response?.status === 200) {
        const data = response.data;
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  const { data, refetch, isSuccess } = useQuery({
    queryKey: ["leaderboard", filter, contextId, activityId],
    queryFn: () => fetchLeaderBoard(filter),
  });

  useEffect(() => {
    let token = PubSub.subscribe(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, () => {
      // fetchCourse(filter)
      refetch();
    });
    let submitcode = PubSub.subscribe(ActivityCodeChanelEnum.SUBMIT_CODE_DONE, () => {
      // fetchCourse(filter)
      refetch();
    });
    return () => {
      PubSub.unsubscribe(token);
      PubSub.unsubscribe(submitcode);
    };
  }, []);
  //Define Table Columns
  const columns: TableColumn[] = [
    {
      title: t("#"),
      isIndex: true,
      isRanking: true,
    },
    {
      title: t("Name"),
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => (
        <div className="grid gap-1 grid-cols-[44px_auto]">
          <Avatar userId={x?.owner?.userId} src={x?.owner?.avatarUrl} userExpLevel={x?.owner?.userExpLevel} size="sm" />
          <div className="flex items-center">
            <ExternalLink className="text-primary" href={`/profile/${x?.owner?.userId}`}>
              <TextLineCamp>{x?.owner?.userName}</TextLineCamp>
            </ExternalLink>
          </div>
        </div>
      ),
    },
    {
      title: t("Language"),
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => getLanguageSelection(x?.languageKey)?.label,
    },
    {
      title: t("Score"),
      dataIndex: "score",
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) => (
        <div>
          {x?.score}{" "}
          <span className="text-gray-400">
            ({x?.tries <= 0 ? 1 : x.tries} {t("try")})
          </span>
        </div>
      ),
    },
    {
      title: t("Execute time (ms)"),
      dataIndex: "testResult",
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) =>
        `${x?.minExcuteTime < 0 ? 0 : x?.minExcuteTime} - ${x?.maxExcuteTime < 0 ? 0 : x?.maxExcuteTime}`,
    },
    {
      title: t("Submit time"),
      dataIndex: "submitTime",
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => (x.createdOn ? FunctionBase.formatDateGMT({ dateString: x?.createdOn }) : ""),
    },
  ];

  const onChangePage = (page: number) => {
    const newFilter = { ...filter, ...{ pageIndex: page } };
    setFilter(newFilter);
  };
  return (
    <Table
      className="table-auto md:w-full w-[500px] text-xs"
      wrapClassName="mb-6"
      data={data?.data?.results}
      wrapData={data?.data}
      columns={columns}
      isLoading={!isSuccess}
      noData={t("No result found")}
      paginationLabel={data?.data?.results?.length > 1 ? t("records") : t("record")}
      onChangePage={onChangePage}
      size="sm"
      onClickRow={(x: any) => isAdminContext && onViewDetailUserSubmission(x.owner?.userId, x.owner?.userName)}
    />
  );
};

export default Leaderboard;
