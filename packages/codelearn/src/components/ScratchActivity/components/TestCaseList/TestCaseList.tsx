import Icon from "@edn/font-icons/icon";
import { Grid, Table, Tabs } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { ActivityCodeSubTypeEnum } from "@src/packages/codelearn/src/configs";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import HeadingResult from "./HeadingResult";
import styles from "./TestCaseList.module.scss";

//Display row content for table sql
const TableRowContent = (props: any) => {
  const { content } = props;
  return (
    <tr>
      {content.map((row: any, index: number) => (
        <td key={index}>{row}</td>
      ))}
    </tr>
  );
};
//Table display test case for SQL
const TableTestCaseContent = (content: any) => {
  const columns = content?.columns || content?.Columns;
  const values = _.cloneDeep(content?.values || content?.Values || []);
  const maxLength = +process.env.NEXT_PUBLIC_MAX_TEST_CASE || 1000;
  const isLargest = values.length > maxLength;

  return (
    <>
      <Table className="w-full mb-2 border">
        <thead>
          <tr>
            {columns &&
              columns.length > 0 &&
              columns.map((col: any, index: number) => {
                return <th key={index}>{col}</th>;
              })}
          </tr>
        </thead>
        <tbody>
          {values.splice(0, maxLength).map((val: any, index: number) => (
            <TableRowContent content={val} key={index} />
          ))}
        </tbody>
      </Table>
      {(!columns || !values) && <>--</>}
      {isLargest && "..."}
    </>
  );
};
const StateTestCase = (props: any) => {
  const { isPassed } = props;
  const icon = isPassed ? "check-circle" : "error";
  const state = isPassed ? "text-success" : "text-red-500";
  return <Icon name={icon} className={state} />;
};
/**
 * TestCaseList - Display list test case.
 * @param props
 * @returns
 */

const TestCaseList = (props: any) => {
  const { t } = useTranslation();
  const { results = [], codeActivity = {} } = props;
  const { listTestCase, compileResult, isSubmitResult, getStatusError } = codeActivity;

  //console.log(results)

  const testcases = listTestCase;
  // console.log('testcases', testcases)
  const { activityCodeSubType } = codeActivity || {};
  //Normally view for subType of code activity
  const getTestCase = (testcase: any) => {
    if (activityCodeSubType === ActivityCodeSubTypeEnum.SQL && testcase && testcase !== "null") {
      const testCaseData = FunctionBase.isJsonString(testcase) ? JSON.parse(testcase) : null;
      return Array.isArray(testCaseData)
        ? testCaseData.map((item: any, index: number) => {
            const table = item.table || item.Table;
            return (
              <div key={index} className="table-testcase">
                {table && <h3 className="text-sm font-semibold mb-1">{table}</h3>}
                {TableTestCaseContent(item)}
              </div>
            );
          })
        : TableTestCaseContent(testCaseData);
    }
    if (testcase != null) {
      //For return case testcase is number
      if (testcase.replace && typeof testcase === "string") {
        let content = DOMPurify.sanitize(testcase);
        const maxLength = +process.env.NEXT_PUBLIC_MAX_TEST_CASE || 1000;
        const isLargest = content.length > maxLength;
        if (isLargest) {
          content = content.slice(0, maxLength) + "<br />...";
        }
        return <div dangerouslySetInnerHTML={{ __html: content.replace(/;#/g, "<br />").replace(/\\n/g, "<br />") }} />;
      } else {
        return testcase;
      }
    }
    return "";
  };

  if (!testcases) return null;

  let wrapCols = 2,
    returnCols = 1;

  const renderTestCaseContent = (testCase: any, currentResult: any) => {
    let excuteTime = "";
    if (
      (currentResult[0]?.excuteTime || currentResult[0]?.excuteTime == 0) &&
      currentResult[0]?.message !== "Time limit exceed"
    ) {
      if (currentResult[0]?.excuteTime > 0) {
        excuteTime = currentResult[0]?.excuteTime + " ms";
      } else {
        excuteTime = 0 + " ms";
      }
    }

    return (
      <>
        {testCase.isHidden && (
          <Grid columns={1} className="w-full">
            <Grid.Col className="py-1 pr-2" span={1}>
              {t("Hidden test case")}
            </Grid.Col>
          </Grid>
        )}
        {!testCase.isHidden && (
          <>
            <Grid columns={wrapCols} className="w-full mb-1">
              <Grid.Col className="py-1 pr-2" span={1}>
                {t("Input")}
              </Grid.Col>
              <Grid.Col className="py-1 whitespace-pre-wrap break-words" span={returnCols}>
                {getTestCase(testCase.input)}
              </Grid.Col>
            </Grid>
            <Grid columns={wrapCols} className="w-full mb-1">
              <Grid.Col className="py-1 pr-2" span={1}>
                {t("Actual output")}
              </Grid.Col>
              <Grid.Col className="py-1 whitespace-pre-wrap" span={returnCols}>
                {getTestCase(currentResult[0]?.testResult)}
              </Grid.Col>
            </Grid>
            <Grid columns={wrapCols} className="w-full mb-1">
              <Grid.Col className="py-1 pr-2" span={1}>
                {t("Expected output")}
              </Grid.Col>
              <Grid.Col className="py-1 whitespace-pre-wrap" span={returnCols}>
                {getTestCase(testCase.output)}
              </Grid.Col>
            </Grid>
            <Grid columns={wrapCols} className="w-full mb-1">
              <Grid.Col className="py-1 pr-2" span={1}>
                {t("Execute time limit")}
              </Grid.Col>
              <Grid.Col className="py-1" span={returnCols}>
                {testCase.executeLimitTime} ms
              </Grid.Col>
            </Grid>
            <Grid columns={wrapCols} className="w-full mb-1">
              <Grid.Col className="py-1 pr-2" span={1}>
                {t("Execute time")}
              </Grid.Col>
              <Grid.Col className="py-1" span={returnCols}>
                {excuteTime}
              </Grid.Col>
            </Grid>
          </>
        )}
        <Grid columns={2} className="w-full mb-1">
          <Grid.Col className={`py-1 pr-2 ${currentResult[0] ? "" : "hidden"}`} span={1}>
            {t("Description")}:
          </Grid.Col>
          <Grid.Col className="py-1" span={1}>
            {currentResult[0] && (
              <div
                className={`${currentResult[0].pass ? "text-success" : "text-red-500"} break-words`}
                dangerouslySetInnerHTML={{ __html: currentResult[0]?.message }}
              ></div>
            )}
          </Grid.Col>
        </Grid>
        {currentResult[0]?.console && !testCase.isHidden && (
          <Grid columns={3} className="w-full">
            <Grid.Col className="py-1 pr-2" span={1}>
              {t("Log")}
            </Grid.Col>
            <Grid.Col className="py-1" span={2}>
              {currentResult[0] && <div className="break-words">{currentResult[0]?.console}</div>}
            </Grid.Col>
          </Grid>
        )}
      </>
    );
  };

  let firstValue = "";
  if (testcases) {
    if (testcases[0]) firstValue = testcases[0].id.toString();
  }

  return (
    <>
      <div>
        <HeadingResult data={results} compileResult={compileResult} isSubmitResult={isSubmitResult} />
      </div>
      <Tabs
        orientation="vertical"
        defaultValue={firstValue}
        className={clsx(styles.tab, "h-full overflow-auto border-t")}
        classNames={{
          tab: "px-5 h-[45px]",
          tabLabel: "text-[15px] font-semibold",
          panel: "pt-3.5 px-5",
          tabsList: "border-r",
        }}
      >
        <Tabs.List>
          {testcases &&
            testcases.map((testCase: any, idx: any) => {
              const currentResult = results?.filter((item: any) => item.id === testCase.id);
              const isCheckResult =
                currentResult && currentResult[0] ? <StateTestCase isPassed={currentResult[0].pass} /> : null;
              const icon = testCase.isHidden ? <Icon name="lock" /> : isCheckResult;
              return (
                <Tabs.Tab disabled={testCase.idHidden} icon={icon} key={testCase.id} value={testCase.id.toString()}>
                  {t("Testcase") + " " + (idx + 1)}
                </Tabs.Tab>
              );
            })}
        </Tabs.List>
        {testcases &&
          testcases.map((testCase: any, idx: any) => {
            const currentResult = results?.filter((item: any) => item.id === testCase.id);
            return (
              <Tabs.Panel key={testCase.id} value={testCase.id.toString()} className="h-full overflow-auto">
                {renderTestCaseContent(testCase, currentResult)}
              </Tabs.Panel>
            );
          })}
      </Tabs>
      <></>
    </>
  );
};
export default TestCaseList;
