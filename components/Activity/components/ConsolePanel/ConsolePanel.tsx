import { Tabs } from "@mantine/core";
import { useActivityContext } from "@src/components/Activity/context";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown } from "tabler-icons-react";
import styles from "./ControlPanel.module.scss";
import TestCaseList from "./TestCaseList/TestCaseList";
import TestResult from "./TestCaseList/TestResult";

interface ConsolePanelProps {
  onSubmit: (isSubmitted?: boolean) => any;
  resultTest: any;
  isSubmitResult: boolean;
  notShowEdit: boolean;
}

const ConsolePanel = (props: ConsolePanelProps) => {
  const { t } = useTranslation();
  const { resultTest, onSubmit, isSubmitResult = false, notShowEdit } = props;
  const {
    // diffTime,
    // contextData,
    activityDetails,
    codeActivity,
    // remainRetry,
    // isRunCodeSuccess,
    contextDetail,
    // isAdminContext,
    // isNotStart,
    // contextType,
    // data,
    // token,
    // hideSubmit,
  } = useActivityContext();

  const profile = useSelector(selectProfile);

  const [testResult, setTestResult] = useState(resultTest);
  const [activeTab, setActiveTab] = useState("0");

  // const limitNumberSubmission = codeActivity?.limitNumberSubmission;
  // let isHiddenSubmit = contextDetail == null ? true : Object.keys(contextDetail).length == 0;
  // if (contextType === ActivityContextType.Evaluating) {
  //   isHiddenSubmit = hideSubmit;
  // } else {
  //   isHiddenSubmit =
  //     contextType === ActivityContextType.Warehouse ||
  //     ((!(remainRetry > 0 || activityDetails?.limitNumberSubmission == 0) || (!isHiddenSubmit && remainRetry == 0)) &&
  //       limitNumberSubmission != 0 &&
  //       !isAdminContext &&
  //       contextType !== ActivityContextType.Challenge);
  // }

  const isRunCode = contextDetail == null ? true : Object.keys(contextDetail).length == 0;
  const isCompliedSuccess =
    resultTest != null &&
    resultTest.compileResult &&
    (resultTest.compileMessage == null || resultTest.compileMessage == "");

  // const now = moment().subtract(diffTime);
  // const isInTimeContest =
  //   !!contextData &&
  //   now.isSameOrAfter(convertDate(contextData.startDate)) &&
  //   now.isBefore(convertDate(contextData.endTimeCode)) &&
  //   !isNotStart;

  // let disabledRunTest = !isAdminContext && !isInTimeContest;
  // if (contextType === ActivityContextType.Training) {
  //   disabledRunTest = false;
  // } else if (contextType === ActivityContextType.Challenge) {
  //   disabledRunTest = !isAdminContext && !data?.allowSubmit;
  // } else if (contextType === ActivityContextType.Evaluating) {
  //   disabledRunTest = false;
  // }

  useEffect(() => {
    setTestResult(resultTest);
    if (resultTest != null) {
      // const countPassed = resultTest.testResults.filter((item: any) => item.pass)?.length | 0;
      if (isCompliedSuccess) {
        setActiveTab("0");
      } else {
        setActiveTab("1");
      }
    }
  }, [resultTest]);

  const showConsole = () => {
    if (testResult) {
      const { compileResult } = testResult;
      return !compileResult || (isRunCode && isSubmitResult);
    }
    return false;
  };

  //Get status error
  const getStatusError = () => {
    // setActiveTab("0")
  };

  return (
    <div
      className={clsx("mt-auto relative", {
        // "pb-[50px]": !!profile,
      })}
    >
      <div className="bg-[#1e1f26] text-sm text-right px-2 font-semibold relative">
        {/*{limitCodeCharacter == 0 && <code className="text-[#c7254e]">{t("Unlimited coding characters")}</code>}*/}
        {/*{limitCodeCharacter != 0 && (*/}
        {/*  <code className="text-[#FB606B]">*/}
        {/*    {totalChars}/{limitCodeCharacter} {t("Limit coding characters")}*/}
        {/*  </code>*/}
        {/*)}*/}
        <div
          style={{ transform: "translate(-50%,-50%)" }}
          className="rounded-full absolute top-0 left-1/2 pointer-events-none bg-white h-6 w-6 flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-ink" />
        </div>
      </div>
      <div className="text-sm h-full bg-[#1E2026] text-white">
        <Tabs
          value={activeTab}
          onTabChange={(value) => setActiveTab(value)}
          className={clsx(styles.tab, "h-full")}
          classNames={{
            tabsList: "bg-[#232432] border-[#42434D]",
            tab: "hover:bg-inherit",
            tabLabel: "text-white uppercase text-[15px] font-semibold",
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

      {/* {profile || contextType === ActivityContextType.Evaluating ? (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#232532]">
          <Group position="right" spacing="xs" className="bg-[#232532] py-[6px] px-3 w-full">
            {isAdminContext &&
              ((notShowEdit ?? false) || (
                <Button
                  onClick={() => {
                    window.open(
                      `/cms/activity-code/12/edit/${activityDetails?.externalCode}?type=${codeActivity?.activityCodeSubType}`
                    );
                  }}
                  leftIcon={<Edit width={16} />}
                  size="xs"
                  className="text-sm"
                >
                  {t("Edit task")}
                </Button>
              ))}
            <div className={isHiddenSubmit ? "hidden" : ""}>
              <Button
                variant="filled"
                color="brand"
                size="xs"
                title={t("Run Code")}
                onClick={() => onSubmit()}
                className={clsx("flex items-center justify-center my-1", {
                  "opacity-60 cursor-not-allow pointer-events-none": disabledRunTest,
                })}
                leftIcon={<Icon name="play-circle" size={20} />}
              >
                {t("Run Code")}
              </Button>
            </div>
            <Button
              variant="filled"
              color="green"
              size="xs"
              onClick={() => onSubmit(true)}
              title={t("Submit")}
              className={clsx("flex items-center justify-center my-1", {
                "opacity-60 cursor-not-allow pointer-events-none": !isRunCodeSuccess,
                hidden: contextType === ActivityContextType.Warehouse || hideSubmit,
              })}
              leftIcon={<Icon name="check-circle" size={20} />}
            >
              {t("Submit")}
              {remainRetry > 0 && contextType !== ActivityContextType.Challenge ? `(${remainRetry})` : ""}
            </Button>
          </Group>
        </div>
      ) : null} */}
    </div>
  );
};

export default ConsolePanel;
