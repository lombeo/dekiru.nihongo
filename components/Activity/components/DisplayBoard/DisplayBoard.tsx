import { Tabs } from "@mantine/core";
import { useActivityContext } from "@src/components/Activity/context";
import Comment from "@src/components/Comment/Comment";
import { ActivityTypeEnum, PubsubTopic } from "@src/constants/common.constant";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { useRouter } from "@src/hooks/useRouter";
import Help from "@src/packages/codelearn/src/components/DisplayBoard/components/Help/Help";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import { ActivityContextType } from "@src/services/Coding/types";
import { CommentContextType } from "@src/services/CommentService/types";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// import { Bulb, ClockHour3, InfoCircle, List, Message } from "tabler-icons-react";
import {
  AiTechnologySpark,
  BulletList,
  ChatBubble,
  Fastforward,
  HelpQuestion,
  NewFile,
} from "@src/components/Svgr/components";
import styles from "./DisplayBoard.module.scss";
import Description from "./components/Content/Description";
import Leaderboard from "./components/Content/Leaderboard";
import Solutions from "./components/Content/Solutions";
import SubmissionList, { SubmissionListRef } from "./components/Content/SubmissionList";

const DisplayBoard = (props: any) => {
  const { t } = useTranslation();
  const {
    data,
    isAdminContext,
    contextType,
    activityType,
    activityId,
    contextId,
    permalink,
    activityDetails,
    onToggleFullSize,
    fullSize,
    token,
  } = useActivityContext();
  const profile = useSelector(selectProfile);

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const activeTabKey = useNextQueryParam("tab") || "description";

  const multiLangData = activityDetails?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activityDetails?.title;

  const haveContext = !!contextId || !!permalink;

  const [completedActs, setCompletedActs] = useState(data?.activitiesCompleted);
  const [isShowTabSolution, setIsShowTabSolution] = useState(false);
  const refSubmission = useRef<SubmissionListRef>(null);

  let commentContextType = CommentContextType.ContestActivity;
  if (contextType === ActivityContextType.Training) {
    commentContextType = CommentContextType.Training;
  } else if (contextType === ActivityContextType.Challenge) {
    commentContextType = CommentContextType.Challenge;
  }

  useEffect(() => {
    let token = PubSub.subscribe(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, () => {
      setIsShowTabSolution(true);
      if (completedActs == null) {
        setCompletedActs([activityId]);
      } else if (!completedActs.includes(activityId)) {
        const acts = completedActs.push(activityId);
        setCompletedActs(acts);
      }
    });
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  const handleViewDetailUserSubmission = (userId: number, userName: string) => {
    let pathname = `/fights/detail/${contextId}`;
    if (contextType === ActivityContextType.Training) {
      pathname = `/training/${contextId}`;
    } else if (contextType === ActivityContextType.Challenge) {
      pathname = `/challenge/${permalink}`;
    }
    router
      .push(
        {
          pathname,
          query: {
            tab: "submission",
            activityId: activityId,
            activityType: activityType,
          },
        },
        null,
        {
          shallow: true,
        }
      )
      .finally(() => {
        refSubmission.current?.showDetailUser(userId, userName);
      });
  };

  const showBestSolution = () => {
    return (data?.activitiesCompleted && data?.activitiesCompleted.includes(+activityId)) || isAdminContext;
  };

  const handlePushTab = (tabKey: string) => {
    let pathname = `/fights/detail/${contextId}`;
    if (contextType === ActivityContextType.Training) {
      pathname = `/training/${contextId}`;
    } else if (contextType === ActivityContextType.Challenge) {
      pathname = `/challenge/${permalink}`;
    } else if (contextType === ActivityContextType.Evaluating) {
      pathname = `/evaluating/detail/${contextId}/${activityId}`;
    }

    router.push(
      {
        pathname,
        query: {
          tab: tabKey,
          activityId,
          activityType,
          token,
        },
      },
      null,
      {
        shallow: true,
      }
    );
    refSubmission.current?.showDetailUser(null);
  };

  const handleTabChange = (tabKey: string) => {
    handlePushTab(tabKey);
    if (fullSize) onToggleFullSize();
  };

  return (
    <div className="h-full bg-white overflow-auto relative flex">
      <Tabs
        classNames={{
          tab: "w-[46px] h-[60px] flex items-center justify-center",
          tabsList: "bg-navy-light5 border-r w-[46px]",
          root: "md:h-[calc(100vh_-_128px)]", // header: 68px + 60px
        }}
        value={activeTabKey}
        onTabChange={handleTabChange}
        orientation="vertical"
      >
        <Tabs.List>
          <Tabs.Tab
            data-tooltip-id="global-tooltip"
            data-tooltip-place="right"
            data-tooltip-content={t("Description")}
            className={activeTabKey === "description" ? "!bg-primary !text-[#fff] rounded-none" : ""}
            icon={<NewFile height={18} width={18} className="text-inherit" />}
            value="description"
          />
          {haveContext && (
            <>
              {!(contextType === ActivityContextType.Evaluating) && (
                <Tabs.Tab
                  data-tooltip-id="global-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content={t("Leaderboard")}
                  className={activeTabKey === "leaderboard" ? "!bg-primary !text-[#fff] rounded-none" : ""}
                  hidden={!haveContext}
                  icon={<BulletList height={18} width={18} />}
                  value="leaderboard"
                />
              )}

              {(!!profile || contextType === ActivityContextType.Evaluating) && (
                <Tabs.Tab
                  data-tooltip-id="global-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content={t("Submissions")}
                  className={activeTabKey === "submission" ? "!bg-primary !text-[#fff] rounded-none" : ""}
                  hidden={!haveContext}
                  icon={<Fastforward height={18} width={18} />}
                  value="submission"
                />
              )}
              {activityType === ActivityTypeEnum.Code &&
                !(contextType === ActivityContextType.Evaluating) &&
                data?.hasSolution && (
                  <Tabs.Tab
                    data-tooltip-id="global-tooltip"
                    data-tooltip-place="right"
                    data-tooltip-content={t("Solutions")}
                    className={activeTabKey === "solution" ? "!bg-primary !text-[#fff] rounded-none" : ""}
                    hidden={!haveContext || (!showBestSolution() && !isShowTabSolution)}
                    icon={<AiTechnologySpark height={18} width={18} />}
                    value="solution"
                  />
                )}
              {!!profile && !(contextType === ActivityContextType.Evaluating) && (
                <Tabs.Tab
                  data-tooltip-id="global-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content={t("Comments")}
                  className={clsx(styles["comment"], {
                    "!bg-primary !text-[#fff] rounded-none relative active": activeTabKey === "comment",
                  })}
                  hidden={!haveContext}
                  icon={
                    <>
                      <ChatBubble height={18} width={18} />
                      {data?.totalComment > 0 && <div className="count">{data.totalComment}</div>}
                    </>
                  }
                  value="comment"
                />
              )}
              <Tabs.Tab
                data-tooltip-id="global-tooltip"
                data-tooltip-place="right"
                data-tooltip-content={t("Help")}
                className={activeTabKey === "help" ? "!bg-primary !text-[#fff] rounded-none" : ""}
                hidden={!haveContext}
                icon={<HelpQuestion height={18} width={18} />}
                value="help"
              />
            </>
          )}
        </Tabs.List>
      </Tabs>
      <div className="justify-between w-full overflow-auto">
        <div className="flex-grow overflow-auto ">
          {activeTabKey === "description" && <Description />}
          {activeTabKey === "leaderboard" && (
            <div className="mt-2 mx-4">
              <Leaderboard onViewDetailUserSubmission={handleViewDetailUserSubmission} />
            </div>
          )}
          {activeTabKey === "submission" && (
            <div className="mt-2 mx-4">
              <SubmissionList ref={refSubmission} />
            </div>
          )}
          {activeTabKey === "solution" && <Solutions />}
          {activeTabKey === "comment" && (
            <div className="mt-2 mx-4 mb-8 pt-2 md:mb-0">
              <Comment
                title={title}
                detailedLink={router.asPath}
                fetchedCallback={(data) => {
                  PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, { totalComment: data?.total });
                }}
                contextId={activityId || contextId}
                isManager={isAdminContext}
                contextType={commentContextType}
              />
            </div>
          )}
          {activeTabKey === "help" && (
            <div className="mt-2 mx-4">
              <Help />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayBoard;
