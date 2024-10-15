import { Table } from "@edn/components/Table";
import { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { CodelearnService } from "../../../services";
import { useIdeContext } from "../../CodelearnIDE/IdeContext";

interface LeaderboardProps {
  onViewDetailUserSubmission: (userId: number, userName: string, data: any) => void;
}

const Leaderboard = (props: LeaderboardProps) => {
  const { t } = useTranslation();
  const { activityId, contextType, contextId } = useIdeContext();
  const { onViewDetailUserSubmission } = props;
  const [filter, setFilter] = useState({
    status: 0,
    pageIndex: 1,
    pageSize: 10,
    textSearch: "",
    contextType: contextType,
  });

  const fetchData = async (filter: any) => {
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
      rowClassName="cursor-pointer hover:bg-[#EEEFFA] transition"
      data={data?.data || []}
      metaData={data?.metaData}
      columns={columns}
      isLoading={!isSuccess}
      noData={t("No result found")}
      paginationLabel={data?.data?.length > 1 ? t("records") : t("record")}
      onChangePage={onChangePage}
      size="sm"
      onClickRow={(x: any) => {
        onViewDetailUserSubmission(x.userId, x.userName, x);
      }}
    />
  );
};

export default Leaderboard;
