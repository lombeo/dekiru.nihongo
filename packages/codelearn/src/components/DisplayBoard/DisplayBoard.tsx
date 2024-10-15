import { Tabs } from "@mantine/core";
import { SubmissionListRef } from "@src/components/Activity/components/DisplayBoard/components/Content/SubmissionList";
import Comment from "@src/components/Comment/Comment";
import {
  AiTechnologySpark,
  BulletList,
  ChatBubble,
  Fastforward,
  HelpQuestion,
  NewFile,
  TaskList,
} from "@src/components/Svgr/components";
import { PubsubTopic } from "@src/constants/common.constant";
import { useProfileContext } from "@src/context/Can";
import Description from "@src/packages/codelearn/src/components/DisplayBoard/components/Content/Description";
import Leaderboard from "@src/packages/codelearn/src/components/DisplayBoard/components/Content/Leaderboard";
import Solutions from "@src/packages/codelearn/src/components/DisplayBoard/components/Content/Solutions";
import SubmissionList from "@src/packages/codelearn/src/components/DisplayBoard/components/Content/SubmissionList";
import Help from "@src/packages/codelearn/src/components/DisplayBoard/components/Help/Help";
import { CommentContextType } from "@src/services/CommentService/types";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import { ActivityCodeChanelEnum } from "../../configs";
import { useIdeContext } from "../CodelearnIDE/IdeContext";
import BoxSyllabus from "./components/BoxSyllabus";
import styles from "./styles.module.scss";

const DisplayBoard = (props: any) => {
  const {
    data,
    isAdminContext,
    codeActivity,
    permalink,
    activityId,
    contextId,
    activityDetails,
    onToggleFullSize,
    fullSize,
    isRunCodePage,
  } = useIdeContext();
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const { profile } = useProfileContext();
  const parts = router.asPath.split("?");
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();
  const activeTabKey = params.get("tab") || "description";

  const completedActs = data?.activitiesCompleted || [];
  const [isShowTabSolution, setIsShowTabSolution] = useState(false);
  const [currentUser, setCurrentUser] = useState(0);

  const activity = codeActivity?.activity;
  const multiLangData = activity?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activity?.title;

  const refSubmission = useRef<SubmissionListRef>(null);

  useEffect(() => {
    if (currentUser) {
      router.push(
        {
          pathname: `/learning/${permalink}`,
          query: {
            tab: "submission",
            activityId: activityId,
            activityType: 12,
          },
        },
        null,
        {
          shallow: true,
        }
      );
    }
    let token = PubSub.subscribe(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, () => {
      setIsShowTabSolution(true);
    });
    return () => {
      PubSub.unsubscribe(token);
    };
  }, [currentUser]);

  const showBestSolution = () => {
    return (data?.activitiesCompleted && data?.activitiesCompleted.includes(+activityId)) || isAdminContext;
  };
  const handleViewDetailUserSubmission = (userId: number, userName: string) => {
    router
      .push(
        {
          pathname: `/learning/${permalink}`,
          query: {
            tab: "submission",
            activityId: activityId,
            activityType: 12,
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

  const handlePushTab = (tabKey: string) => {
    router.push(
      {
        pathname: `/learning/${permalink}`,
        query: {
          tab: tabKey,
          activityId: activityId,
          activityType: 12,
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
    setCurrentUser(null);
    handlePushTab(tabKey);
    if (fullSize) onToggleFullSize();
  };
  const content = () => {
    switch (activeTabKey) {
      case "leaderboard":
        return (
          <div className="mt-2 mx-4">
            <Leaderboard onViewDetailUserSubmission={handleViewDetailUserSubmission} />
          </div>
        );
      case "syllabus":
        return (
          <div className="mt-2">
            <BoxSyllabus activitiesCompleted={completedActs} permalink={permalink} activeId={activityId} />
          </div>
        );
      case "submission":
        return (
          <div className="mt-2 mx-4">
            <SubmissionList ref={refSubmission} />
          </div>
        );
      case "solution":
        return (
          (showBestSolution() || isShowTabSolution) && (
            <div className="mt-2 mx-4">
              <Solutions />
            </div>
          )
        );
      case "comment":
        return (
          <div className="mt-2 mx-4 mb-8 pt-2 md:mb-0">
            <Comment
              fetchedCallback={(data) => {
                PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, { totalComment: data?.total });
              }}
              title={title}
              detailedLink={router.asPath}
              contextId={activityId}
              isManager={isAdminContext}
              contextType={CommentContextType.CourseActivity}
            />
          </div>
        );
      case "help":
        return (
          <div className="mt-2 mx-4">
            <Help />
          </div>
        );

      default:
        return <Description activityDetails={activityDetails} />;
    }
  };

  const MainContent = <div>{content()}</div>;

  return (
    <div className="h-full bg-white overflow-auto relative flex">
      {/*fixtab*/}
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
          {!isRunCodePage && (
            <Tabs.Tab
              data-tooltip-id="global-tooltip"
              data-tooltip-place="right"
              data-tooltip-content={t("Syllabus")}
              className={activeTabKey === "syllabus" ? "!bg-primary !text-[#fff] rounded-none" : ""}
              hidden={contextId < 1}
              icon={<TaskList height={18} width={18} />}
              value="syllabus"
            />
          )}
          {contextId && contextId > 0 && (
            <>
              <Tabs.Tab
                data-tooltip-id="global-tooltip"
                data-tooltip-place="right"
                data-tooltip-content={t("Leaderboard")}
                className={activeTabKey === "leaderboard" ? "!bg-primary !text-[#fff] rounded-none" : ""}
                hidden={contextId < 1}
                icon={<BulletList height={18} width={18} />}
                value="leaderboard"
              />

              {!!profile && (
                <Tabs.Tab
                  data-tooltip-id="global-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content={t("Submissions")}
                  className={activeTabKey === "submission" ? "!bg-primary !text-[#fff] rounded-none" : ""}
                  hidden={contextId < 1}
                  icon={<Fastforward height={18} width={18} />}
                  value="submission"
                />
              )}
              {data?.hasSolution && (
                <Tabs.Tab
                  data-tooltip-id="global-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content={t("Solutions")}
                  className={activeTabKey === "solution" ? "!bg-primary !text-[#fff] rounded-none" : ""}
                  hidden={contextId < 1 || (!showBestSolution() && !isShowTabSolution)}
                  icon={<AiTechnologySpark height={18} width={18} />}
                  value="solution"
                />
              )}

              {!!profile && (
                <Tabs.Tab
                  data-tooltip-id="global-tooltip"
                  data-tooltip-place="right"
                  data-tooltip-content={t("Comments")}
                  className={clsx(styles["comment"], {
                    "!bg-primary !text-[#fff] rounded-none relative active": activeTabKey === "comment",
                  })}
                  hidden={contextId < 1}
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
                hidden={contextId < 1}
                icon={<HelpQuestion height={18} width={18} />}
                value="help"
              />
            </>
          )}
        </Tabs.List>
      </Tabs>
      <div className="justify-between w-full overflow-auto">
        <div className="flex-grow overflow-auto ">{MainContent}</div>
      </div>
    </div>
  );
};

export default DisplayBoard;
