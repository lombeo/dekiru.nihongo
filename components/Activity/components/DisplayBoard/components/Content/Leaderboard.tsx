import { Table } from "@edn/components/Table";
import { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { useActivityContext } from "@src/components/Activity/context";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getLanguageSelection } from "@src/packages/codelearn/src/components/CodelearnIDE/EditorBoard";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import CodingService from "@src/services/Coding/CodingService";
import { ActivityContextType } from "@src/services/Coding/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";

interface LeaderboardProps {
  onViewDetailUserSubmission: (userId: number, userName: string) => void;
}

const Leaderboard = (props: LeaderboardProps) => {
  const { t } = useTranslation();
  const { activityId, activityType, contextType, contextId, isAdminContext } = useActivityContext();
  const { onViewDetailUserSubmission } = props;
  const [filter, setFilter] = useState({
    status: 0,
    pageIndex: 1,
    pageSize: 10,
    textSearch: "",
    contextType: contextType,
  });

  const fetchData = async (filter: any) => {
    try {
      let res;
      if (contextType === ActivityContextType.Contest) {
        res = await CodingService.contestGetActivityLeaderBoard({
          ...filter,
          contextId,
          activityId,
        });
      } else if (contextType === ActivityContextType.Training) {
        res = await CodingService.trainingGetActivityLeaderBoard({
          ...filter,
          contextId,
          activityId: contextId,
        });
      } else if (contextType === ActivityContextType.Challenge) {
        res = await CodingService.challengeGetActivityLeaderBoard({
          ...filter,
          activityId,
          contextId: activityId,
        });
      }
      if (res?.data?.success) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  const { data, refetch, isSuccess } = useQuery({
    queryKey: ["leaderboard", filter, contextId, activityId],
    queryFn: () => fetchData(filter),
  });

  useEffect(() => {
    let token = PubSub.subscribe(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, () => {
      refetch();
    });
    let submitcode = PubSub.subscribe(ActivityCodeChanelEnum.SUBMIT_CODE_DONE, () => {
      refetch();
    });
    return () => {
      PubSub.unsubscribe(token);
      PubSub.unsubscribe(submitcode);
    };
  }, []);

  let columns: TableColumn[] = [
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
          <Avatar userExpLevel={x?.userExpLevel} src={x?.userAvatarUrl} userId={x?.userId} size="sm" />
          <div className="flex items-center">
            <Link className="text-primary max-w-[100px]" href={`/profile/${x?.userId}`}>
              <TextLineCamp>{x?.userName}</TextLineCamp>
            </Link>
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
      dataIndex: "minExcuteTime",
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

  if (activityType === ActivityTypeEnum.Quiz) {
    columns = [
      {
        title: t("#"),
        isIndex: true,
        isRanking: true,
      },
      {
        title: t("Name"),
        render: (x: any) => (
          <div className="grid gap-1 grid-cols-[44px_auto]">
            <Avatar userExpLevel={x?.userExpLevel} src={x?.userAvatarUrl} userId={x?.userId} size="sm" />
            <div className="flex items-center">
              <Link className="text-primary" href={`/profile/${x?.userId}`}>
                <TextLineCamp>{x?.userName}</TextLineCamp>
              </Link>
            </div>
          </div>
        ),
        headClassName: "text-left",
        className: "text-left",
      },
      {
        title: t("Score"),
        dataIndex: "score",
        headClassName: "text-center",
        className: "text-center",
      },
      {
        title: t("Submit time"),
        dataIndex: "submitTime",
        headClassName: "text-left",
        className: "text-left",
        render: (x: any) => (x.createdOn ? FunctionBase.formatDateGMT({ dateString: x?.createdOn }) : ""),
      },
    ];
  }

  const onChangePage = (page: number) => {
    const newFilter = { ...filter, ...{ pageIndex: page } };
    setFilter(newFilter);
  };

  return (
    <Table
      className="table-auto md:w-full w-[500px] text-xs"
      wrapClassName="mb-6"
      data={data?.data || []}
      metaData={data?.metaData}
      columns={columns}
      isLoading={!isSuccess}
      noData={t("No result found")}
      paginationLabel={data?.data?.length > 1 ? t("records") : t("record")}
      onChangePage={onChangePage}
      size="sm"
      onClickRow={(x: any) => {
        isAdminContext && onViewDetailUserSubmission(x.userId, x.userName);
      }}
    />
  );
};

export default Leaderboard;
