import { confirmAction } from "@edn/components/ModalConfirm";
import Table, { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { ActionIcon } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import CodingService from "@src/services/Coding/CodingService";
import { ActivityContextType } from "@src/services/Coding/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pencil } from "tabler-icons-react";
import { CodelearnService } from "../../../services";
import { useIdeContext } from "../../CodelearnIDE/IdeContext";
import GradeAssignmentModal from "./GradeAssignmentModal";

export interface SubmissionListRef {
  showDetailUser: (userId: number | null, userName?: string) => void;
}

const SubmissionList = React.forwardRef<SubmissionListRef, any>((props, ref) => {
  const { t } = useTranslation();

  const { activityId, contextId, contextType, isAdminContext } = useIdeContext();

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 8,
  });
  const [openGradeModal, setOpenGradeModal] = useState(false);
  const selectedItem = useRef();

  useImperativeHandle(ref, () => ({
    showDetailUser: (userId: number, userName: string) => {
      setFilter({
        pageIndex: 1,
        pageSize: 8,
        getForUserId: userId,
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
    queryKey: ["solutions", contextId, contextType, activityId, filter],
    queryFn: () => fetchData(filter),
  });

  const fetchData = async (_filter: any) => {
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

  const confirmSetBestSolution = async (data: any) => {
    let requestParams = {
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
      <ActionIcon
        size="md"
        variant="outline"
        color={!isBestSolution ? "blue" : "red"}
        title={t(!isBestSolution ? "Set is best solution" : "Remove")}
        onClick={() => onSetBestSolution(solution)}
      >
        <Icon size={20} name={!isBestSolution ? "iosshare" : "cancel"} />
      </ActionIcon>
    );
  };

  let columns: TableColumn[] = [
    {
      title: t("#"),
      isIndex: true,
    },
    {
      title: t("Test case"),
      dataIndex: "testCase",
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
      render: (x: any) => (
        <div className="flex items-center gap-2">
          <ButtonBestSolutionAction solution={x} />
          <ActionIcon
            size="md"
            variant="outline"
            onClick={() => {
              selectedItem.current = x;
              setOpenGradeModal(true);
            }}
          >
            <Pencil width={16} height={16} />
          </ActionIcon>
        </div>
      ),
    },
  ];

  const onChangePage = (pageIndex: number) => {
    setFilter((prev) => ({ ...prev, pageIndex }));
  };

  return (
    <>
      {filter?.userName ? (
        <div className="p-2 font-semibold">
          {t("User")}: {filter.userName}
        </div>
      ) : null}
      {openGradeModal && (
        <GradeAssignmentModal
          data={data}
          selected={selectedItem.current}
          onSuccess={() => refetch()}
          activityId={data.activityId}
          onClose={() => setOpenGradeModal(false)}
        />
      )}
      <Table
        className="table-auto md:w-full w-[500px] text-xs"
        rowClassName="cursor-pointer hover:bg-[#EEEFFA] transition"
        data={data?.data || []}
        wrapData={data || {}}
        metaData={data?.metaData}
        columns={columns}
        isLoading={!isSuccess}
        size="sm"
        onClickRow={onViewCode}
        noData={t("No result found")}
        paginationLabel={data?.data?.length > 1 ? t("records") : t("record")}
        onChangePage={onChangePage}
      />
    </>
  );
});

SubmissionList.displayName = "SubmissionList";
export default SubmissionList;