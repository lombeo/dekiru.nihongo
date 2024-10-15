import { Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import Table, { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { getLanguageSelection } from "@src/packages/codelearn/src/components/CodelearnIDE/EditorBoard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import React, { useEffect, useImperativeHandle, useState } from "react";
import { ActivityCodeChanelEnum } from "../../../../configs";
import { CodelearnService } from "../../../../services/codelearn.service";
import { useIdeContext } from "../../../CodelearnIDE/IdeContext";

export interface SubmissionListRef {
  showDetailUser: (userId: number | null, userName?: string) => void;
}

const SubmissionList = React.forwardRef<SubmissionListRef, any>((props, ref) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const { activityId, contextId, contextType, isAdminContext } = useIdeContext();

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 8,
  });

  useImperativeHandle(ref, () => ({
    showDetailUser: (userId: number, userName: string) => {
      setFilter({
        pageIndex: 1,
        pageSize: 8,
        userId: userId,
        userName: userName,
      });
    },
  }));

  useEffect(() => {
    let onSubmitSuccess = PubSub.subscribe(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, () => {
      refetch();
    });
    let onSubmit = PubSub.subscribe(ActivityCodeChanelEnum.SUBMIT_CODE_DONE, () => {
      refetch();
    });
    return () => {
      PubSub.unsubscribe(onSubmitSuccess);
      PubSub.unsubscribe(onSubmit);
    };
  }, []);

  const { data, isSuccess, refetch } = useQuery({
    queryKey: ["solutions", filter, activityId, contextId],
    queryFn: () => fetchData(),
  });

  const fetchData = async () => {
    if (!contextId || !activityId) return null;
    try {
      if (!filter.userId) {
        delete filter.userId;
      }
      const res = await CodelearnService.getSubmissions({
        params: {
          ...filter,
          contextId: contextId,
          activityId: activityId,
          contextType: contextType,
        },
      });
      if (!res?.data) return null;
      return res.data.data;
    } catch (e) {
      return null;
    }
  };

  const confirmSetBestSolution = (data: any) => {
    const requestParams = {
      submitedId: data.id,
      isSet: !data.isBestSolution,
      userId: data.ownerId,
      activityId: +activityId,
      contextId: +contextId,
      contextType: contextType,
    };
    CodelearnService.updateBestSolution(requestParams).then(() => {
      refetch();
    });
  };

  //Set Best solution
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

  const onViewCode = (item: any) => {
    PubSub.publish(ActivityCodeChanelEnum.LOADUSERCODE, item);
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
  //Define Table Columns
  const columns: TableColumn[] = [
    {
      title: t("#"),
      isIndex: true,
    },
    {
      title: t("Submit time"),
      dataIndex: "submitTime",
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => (x.createdOn ? FunctionBase.formatDateGMT({ dateString: x?.createdOn }) : ""),
    },
    {
      title: t("Language"),
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => getLanguageSelection(x?.languageKey)?.label,
    },
    {
      title: t("Test case"),
      dataIndex: "testResult",
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
      title: t("Submitted by"),
      render: (x: any) => (
        <div className="grid gap-1 grid-cols-[44px_auto]">
          <Avatar userExpLevel={x?.owner?.userExpLevel} src={x?.owner?.avatarUrl} userId={x?.owner?.userId} size="sm" />
          <div className="flex items-center">
            <ExternalLink className="text-primary" href={`/profile/${x?.owner?.userId}`}>
              <TextLineCamp>{x?.owner?.userName}</TextLineCamp>
            </ExternalLink>
          </div>
        </div>
      ),
      headClassName: "text-left",
      className: "text-left",
    },
    {
      title: t("Total execute time (ms)"),
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) => `${x?.totalExcuteTime < 0 ? 0 : x?.totalExcuteTime}`,
    },
    {
      title: t("Actions"),
      headClassName: "text-left",
      className: "lowercase text-left",
      disabled: !isAdminContext,
      render: (x: any) => <ButtonBestSolutionAction solution={x} />,
    },
  ];
  const onChangePage = (page: number) => {
    const newFilter = { ...filter, ...{ pageIndex: page } };
    setFilter(newFilter);
  };
  return (
    <>
      {filter?.userName ? (
        <div className="p-2 font-semibold">
          {t("User")}: {filter.userName}
        </div>
      ) : null}
      <Table
        className="table-auto md:w-full w-[500px] text-xs"
        rowClassName="cursor-pointer hover:bg-[#EEEFFA] transition"
        data={data?.results || []}
        wrapData={data || {}}
        columns={columns}
        isLoading={!isSuccess}
        size="sm"
        onClickRow={onViewCode}
        noData={t("No result found")}
        paginationLabel={data?.results?.length > 1 ? t("records") : t("record")}
        onChangePage={onChangePage}
      />
    </>
  );
});

SubmissionList.displayName = "SubmissionList";
export default SubmissionList;
