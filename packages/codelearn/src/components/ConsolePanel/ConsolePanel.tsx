import { Tabs } from "@mantine/core";
import TestCaseList from "@src/components/Activity/components/ConsolePanel/TestCaseList/TestCaseList";
import TestResult from "@src/components/Activity/components/ConsolePanel/TestCaseList/TestResult";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { ChevronDown } from "tabler-icons-react";
import { useIdeContext } from "../CodelearnIDE/IdeContext";
import styles from "./ControlPanel.module.scss";

let currentIsSubmit = false;
let submitChars = -1;
interface ConsolePanelProps {
  activityDetails: any;
  onSubmitCode: any;
  resultTest: any;
  remainRetry: number;
  isSubmitResult: boolean;
}
const ConsolePanel = (props: ConsolePanelProps) => {
  const { t } = useTranslation();
  const { resultTest, remainRetry, isSubmitResult = false } = props;
  const { activityDetails, contextDetail, codeActivity } = useIdeContext();
  const [testResult, setTestResult] = useState(resultTest);
  const [activeTab, setActiveTab] = useState("0");
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const isRuncode = contextDetail == null ? true : Object.keys(contextDetail).length == 0;
  const isComplieSuccess =
    resultTest && resultTest.compileResult && (resultTest.compileMessage == null || resultTest.compileMessage == "");

  useEffect(() => {
    setTestResult(resultTest);
    if (resultTest) {
      // const countPassed = resultTest.testResults.filter((item: any) => item.pass)?.length | 0;
      if (isComplieSuccess) {
        setActiveTab("0");
      } else {
        setActiveTab("1");
      }
    }
    let countPassed = 0;
    let totalTest = 0;
    if (resultTest && resultTest.testResults != null) {
      totalTest = resultTest?.testResults.length;
      countPassed = resultTest.testResults?.filter((item: any) => item.pass)?.length;
      setEnableSubmit(
        countPassed == totalTest &&
          (remainRetry != 0 || activityDetails?.limitNumberSubmission == 0) &&
          !currentIsSubmit
      );
    } else {
      setEnableSubmit(false);
    }
  }, [resultTest]);
  //Use for set active tab
  const onChange = (value: string) => {
    setActiveTab(value);
  };

  //Check condition for show console tab
  const showConsole = () => {
    if (testResult) {
      const { compileResult } = testResult;
      return !compileResult || (isRuncode && isSubmitResult);
    }
    return false;
  };

  //Get status error
  const getStatusError = () => {
    // setActiveTab("0")
  };

  return (
    <div className="mt-auto">
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
      {!minimized && (
        <div className="text-sm h-full bg-[#1E2026] text-white">
          <Tabs
            value={activeTab}
            onTabChange={(value) => onChange(value)}
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
      )}
    </div>
  );
};

export default ConsolePanel;
