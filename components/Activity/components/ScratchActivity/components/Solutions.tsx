import { Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import Table, { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { useActivityContext } from "@src/components/Activity/context";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import CodingService from "@src/services/Coding/CodingService";
import { ActivityContextType } from "@src/services/Coding/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useState } from "react";

const Solutions = (props: any) => {
  const { t } = useTranslation();

  const { activityId, contextId, contextType, isAdminContext } = useActivityContext();

  const [filter, setFilter] = useState({
    status: 0,
    pageIndex: 1,
    pageSize: 8,
    contextType: contextType,
  });

  const fetchData = async (newFilter: any) => {
    try {
      let res;
      if (contextType === ActivityContextType.Contest) {
        res = await CodingService.contestGetActivityBestSolution({
          ...newFilter,
          contextId,
          activityId,
        });
      } else if (contextType === ActivityContextType.Training) {
        res = await CodingService.trainingGetActivityBestSolution({
          ...newFilter,
          contextId,
          activityId: contextId,
        });
      } else if (contextType === ActivityContextType.Challenge) {
        res = await CodingService.challengeGetActivityBestSolution({
          ...newFilter,
          activityId,
          contextId: activityId,
        });
      }
      if (res?.data?.success) {
        return res.data;
      }
    } catch (e) {}
    return null;
  };

  const { data, refetch, isSuccess } = useQuery({
    queryKey: ["solutions", activityId, contextId, filter],
    queryFn: () => fetchData(filter),
  });

  const onChangePage = (page: number) => {
    const newFilter = { ...filter, ...{ pageIndex: page } };
    setFilter(newFilter);
  };

  const setSolution = (item: any) => {
    if (!isAdminContext) return;
    PubSub.publish(ActivityCodeChanelEnum.LOADUSERCODE, item);
  };

  const confirmSetBestSolution = async (data: any) => {
    const requestParams = {
      submitedId: data.id,
      isBest: !data.isBestSolution,
      userId: data.ownerId,
      activityId: activityId,
      contextId: contextId,
      contextType: contextType,
    };
    let res;
    if (contextType === ActivityContextType.Contest) {
      res = await CodingService.contestUpdateActivityBestSolution(requestParams);
    } else if (contextType === ActivityContextType.Training) {
      requestParams.activityId = contextId;
      res = await CodingService.trainingUpdateActivityBestSolution(requestParams);
    } else if (contextType === ActivityContextType.Challenge) {
      requestParams.contextId = activityId;
      res = await CodingService.challengeUpdateActivityBestSolution(requestParams);
    }

    refetch();
  };

  const onSetBestSolution = (data: any) => {
    const onConfirm = () => {
      confirmSetBestSolution(data);
    };
    confirmAction({
      message: data.isBestSolution
        ? "Are you sure to remove this submission from the best solution?"
        : "Are you sure to mark this submission as the best solution?",
      onConfirm,
    });
  };

  const ButtonBestSolutionAction = (props: any) => {
    const { solution } = props;
    const isBestSolution = solution?.isBestSolution;
    return (
      <Button
        size="sm"
        className="px-2"
        variant="subtle"
        color={!isBestSolution ? "blue" : "red"}
        title={t(!isBestSolution ? "Set is best solution" : "Remove")}
        onClick={() => onSetBestSolution(solution)}
      >
        <Icon size={20} name={!isBestSolution ? "iosshare" : "cancel"} />
      </Button>
    );
  };

  const columns: TableColumn[] = [
    {
      title: t("#"),
      headClassName: "w-60 text-center",
      className: "w-60 text-center",
      isIndex: true,
    },
    {
      title: t("Score"),
      dataIndex: "score",
      headClassName: "text-center",
      className: "text-center",
    },
    {
      title: t("Submit time"),
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => (
        <>
          <div className="font-semibold">{x?.owner?.userName}</div>
          {FunctionBase.formatDateGMT({ dateString: x?.createdOn })}
        </>
      ),
    },
    {
      title: t("Submitted by"),
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
      title: t("Actions"),
      headClassName: "text-left",
      className: "lowercase text-left",
      disabled: !isAdminContext,
      render: (x: any) => <ButtonBestSolutionAction solution={x} />,
    },
  ];
  return (
    <>
      <Table
        className="table-auto md:w-full w-[500px] text-xs"
        rowClassName="cursor-pointer hover:bg-[#EEEFFA] transition"
        data={data?.data || []}
        wrapData={data || {}}
        metaData={data?.metaData}
        columns={columns}
        isLoading={!isSuccess}
        onClickRow={setSolution}
        size="sm"
        noData={t("No result found")}
        paginationLabel={data?.data?.length > 1 ? t("records") : t("record")}
        onChangePage={onChangePage}
      />
    </>
  );
};
export default Solutions;
