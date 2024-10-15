import { Label } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { clsx, Drawer, Select, Tabs } from "@mantine/core";
import { useActivityContext } from "@src/components/Activity";
import Avatar from "@src/components/Avatar";
import Comment from "@src/components/Comment/Comment";
import Link from "@src/components/Link";
import RawText from "@src/components/RawText/RawText";
import {
  AiTechnologySpark,
  BulletList,
  ChatBubble,
  Fastforward,
  HelpQuestion,
  NewFile,
  TaskPoint,
} from "@src/components/Svgr/components";
import { ActivityTypeEnum, PubsubTopic } from "@src/constants/common.constant";
import { useProfileContext } from "@src/context/Can";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import { ActivityContextType } from "@src/services/Coding/types";
import { CommentContextType } from "@src/services/CommentService/types";
import Cookies from "js-cookie";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";
import { Flask, Help } from "tabler-icons-react";
import styles from "./BoxTab.module.scss";
import Leaderboard from "./Leaderboard";
import Solutions from "./Solutions";
import SubmissionList, { SubmissionListRef } from "./SubmissionList";
import TestCaseList from "./TestCaseList/TestCaseList";
import TestResult from "./TestCaseList/TestResult";

interface BoxTabProps {
  activeTabKey: any;
  setActiveTabKey: any;
  testResult: any;
}

const BoxTab = (props: BoxTabProps) => {
  const { activeTabKey, setActiveTabKey, testResult } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const { asPath, query, locale } = router;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const { authorized } = useProfileContext();

  const { activityDetails, activityType, contextType, isAdminContext, activityId, contextId, activity } =
    useActivityContext();
  const multiLangData = activityDetails?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activityDetails?.title;
  const description = currentLanguage ? currentLanguage.description : activityDetails?.description;
  const refSubmission = useRef<SubmissionListRef>(null);

  let commentContextType = CommentContextType.ContestActivity;
  if (contextType === ActivityContextType.Training) {
    commentContextType = CommentContextType.Training;
  } else if (contextType === ActivityContextType.Challenge) {
    commentContextType = CommentContextType.Challenge;
  }

  const onChangeLanguage = (nextLocale: string) => {
    router.push({ pathname: router.pathname, query }, asPath, { locale: nextLocale });
    Cookies.set("locale", nextLocale);
  };

  const localeNames = {
    vi: "Vietnamese",
    en: "English",
  };

  const localeOptions = Object.keys(localeNames)
    .filter(
      (key) =>
        !_.isEmpty(
          multiLangData?.find((e) => {
            const keyMapLang = key === "vi" ? "vn" : "en";
            return e.key === keyMapLang;
          })?.description
        )
    )
    .map((key) => ({ label: t(localeNames[key]), value: key }));

  const handleViewDetailUserSubmission = (userId: number, userName: string, dataRow: any) => {
    PubSub.publish(ActivityCodeChanelEnum.LOADUSERCODE, {
      code: dataRow?.userCode,
      userName,
    });
    if (isAdminContext) {
      setActiveTabKey("submissions");
      setTimeout(() => {
        refSubmission.current?.showDetailUser(userId, userName);
      }, 500);
    }
  };

  return (
    <>
      <Drawer
        zIndex={120}
        classNames={{
          inner: "top-[128px] left-[46px]",
          header: "h-0 !p-0",
          body: "p-0",
          close: "top-4 right-2 hidden",
          overlay: "!opacity-0 left-[46px]",
        }}
        position="left"
        size={520}
        opened={activeTabKey !== null}
        onClose={() => setActiveTabKey(null)}
      >
        <div>
          {activeTabKey === "description" && (
            <div className="divide-y-1 px-4">
              <div className="flex flex-wrap gap-4 items-center justify-between text-sm min-h-[52px]">
                {activityDetails?.owner && (
                  <Link className="flex items-center gap-3" href={`/profile/${activityDetails.owner.userId}`}>
                    <Avatar
                      userExpLevel={activityDetails?.owner?.userExpLevel}
                      src={activityDetails?.owner?.avatarUrl}
                      userId={activityDetails?.owner?.userId}
                      size="md"
                    />
                    <TextLineCamp className="text-primary max-w-[100px]">{activityDetails.owner.userName}</TextLineCamp>
                  </Link>
                )}
                {activity?.level ? (
                  <Label className={clsx(styles.level, activity?.level)} text={t(activity?.level)} />
                ) : null}
                {activity?.point ? <Label text={`${activity?.point} ${t("Points")}`} icon={<TaskPoint />} /> : null}
                {multiLangData && multiLangData.length > 1 && (
                  <div>
                    <Select
                      size="xs"
                      radius={0}
                      classNames={{ input: styles["select-language"] }}
                      onChange={onChangeLanguage}
                      value={locale}
                      data={localeOptions}
                    />
                  </div>
                )}
              </div>
              <RawText content={description} className="overflow-auto break-words max-w-full" />
            </div>
          )}
          {activeTabKey === "testcase" && <BoxTestCase testResult={testResult} />}
          {activeTabKey === "leaderboard" && (
            <div className="px-4 py-2">
              <Leaderboard onViewDetailUserSubmission={handleViewDetailUserSubmission} />{" "}
            </div>
          )}
          {activeTabKey === "submissions" && (
            <div className="px-4 py-2">
              <SubmissionList ref={refSubmission} />{" "}
            </div>
          )}
          {activeTabKey === "solutions" && (
            <div className="px-4 py-2">
              <Solutions />
            </div>
          )}
          {activeTabKey === "comments" && (
            <div className="px-4">
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
            <div className="p-4">
              <Help />
            </div>
          )}
        </div>
      </Drawer>
      <Tabs
        classNames={{
          tab: "w-[46px] h-[60px] flex items-center justify-center",
          tabsList: "bg-navy-light5 border-r w-[46px] flex flex-nowrap overflow-auto",
          root: "md:h-[calc(100vh_-_128px)]", // header: 68px + 60px
        }}
        value={activeTabKey}
        onTabChange={(value: any) => setActiveTabKey(value)}
        orientation="vertical"
      >
        <Tabs.List>
          {[
            {
              label: t("ScratchPage.Task"),
              icon: <NewFile height={18} width={18} className="text-inherit" />,
              id: "description",
            },
            {
              label: t("Test case"),
              icon: <Flask height={18} width={18} className="text-inherit" />,
              id: "testcase",
              isHidden: activityType === ActivityTypeEnum.Scratch,
            },
            {
              label: t("Leaderboard"),
              icon: <BulletList height={18} width={18} className="text-inherit" />,
              id: "leaderboard",
            },
            {
              label: t("Submissions"),
              icon: <Fastforward height={18} width={18} className="text-inherit" />,
              id: "submissions",
              isHidden: !authorized,
            },
            {
              label: t("Solutions"),
              icon: <AiTechnologySpark height={18} width={18} className="text-inherit" />,
              id: "solutions",
            },
            {
              label: t("Comments"),
              icon: <ChatBubble height={18} width={18} className="text-inherit" />,
              id: "comments",
            },
            {
              label: t("Help"),
              icon: <HelpQuestion height={18} width={18} className="text-inherit" />,
              id: "help",
            },
          ]
            .filter((item) => !item.isHidden)
            .map((item) => (
              <Tabs.Tab
                key={item.id}
                value={item.id}
                data-tooltip-id="global-tooltip"
                data-tooltip-place="right"
                data-tooltip-content={item.label}
                className={activeTabKey === item.id ? "!bg-primary !text-[#fff] rounded-none" : ""}
                icon={item.icon}
              />
            ))}
        </Tabs.List>
      </Tabs>
    </>
  );
};

export default BoxTab;

const BoxTestCase = (props: any) => {
  const { testResult, isSubmitResult } = props;

  const { t } = useTranslation();

  const { activityDetails, codeActivity, contextDetail } = useActivityContext();

  const [activeTab, setActiveTab] = useState("0");

  const isRunCode = contextDetail == null ? true : Object.keys(contextDetail).length == 0;
  const isCompliedSuccess =
    testResult != null &&
    testResult.compileResult &&
    (testResult.compileMessage == null || testResult.compileMessage == "");

  useEffect(() => {
    if (testResult != null) {
      if (isCompliedSuccess) {
        setActiveTab("0");
      } else {
        setActiveTab("1");
      }
    }
  }, [testResult]);

  const getStatusError = () => {};

  const showConsole = () => {
    if (testResult) {
      const { compileResult } = testResult;
      return !compileResult || (isRunCode && isSubmitResult);
    }
    return false;
  };

  return (
    <div className="">
      <Tabs
        value={activeTab}
        onTabChange={(value) => setActiveTab(value)}
        classNames={{
          tabsList: "h-[45px] border-b",
          tab: "hover:bg-inherit",
          tabLabel: "uppercase text-[15px] font-semibold",
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="0">{t("Test case")}</Tabs.Tab>
          <Tabs.Tab className={showConsole() ? "" : "hidden"} value="1">
            {t("Console")}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="0" className="h-full overflow-hidden">
          <TestResult getStatusError={getStatusError} data={testResult} isSubmitResult={isSubmitResult} />
          <TestCaseList
            getStatusError={getStatusError}
            testcases={activityDetails?.listTestCase}
            results={testResult?.testResults || []}
            compileResult={testResult?.compileResult}
            activityDetails={activityDetails}
            isSubmitResult={isSubmitResult}
            codeActivity={codeActivity}
          />
        </Tabs.Panel>
        <Tabs.Panel className={`p-4 ${showConsole() ? "" : "hidden"}`} value="1">
          <code className="text-red-500">{testResult?.compileMessage}</code>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
