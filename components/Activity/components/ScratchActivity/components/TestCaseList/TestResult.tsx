import HeadingResult from "@src/components/Activity/components/ConsolePanel/TestCaseList/HeadingResult";
import { useTranslation } from "next-i18next";

const TestResult = (props: any) => {
  const { data, isSubmitResult = false, getStatusError } = props;
  const { t } = useTranslation();
  if (data) {
    if (data.compileResult && isSubmitResult) {
      const totalTestCase = data.testResults.length;
      let totalPass = 0;
      let totalFailed = 0;
      data.testResults.map((item: any) => {
        item.pass ? totalPass++ : totalFailed++;
      });

      //Follow fomular: sample tests = 1/2 Total testcase, +1 if  totalPass % 2 > 0;
      const totalSampleTests = totalTestCase % 2 > 0 ? Math.floor(totalTestCase / 2) + 1 : totalTestCase / 2;

      const totalHiddenTests = totalTestCase - totalSampleTests;
      const isPassed = totalPass === totalTestCase;
      return (
        <div className="flex flex-col gap-1 p-3">
          <code className={`${isPassed ? "text-success" : "text-red-500"} font-semibold`}>
            {/* <Icon name={isPassed ? "check-circle" : "error"} /> */}
            {totalPass}/{totalTestCase} {isPassed ? t("All tests passed.") : t("You do not pass the full test set.")}
          </code>
          <code className={isPassed ? "text-success" : "hidden"}>
            {`${t("Sample tests")}: 
            ${totalPass > totalSampleTests ? totalSampleTests : totalPass}/
            ${totalSampleTests}`}
          </code>
          <code className={isPassed ? "text-success" : "hidden"}>
            {t("Hidden tests")}: {totalPass - totalSampleTests}/{totalHiddenTests}
          </code>
          {/*
          Temp hide - Don't remove, enable in future when score feature is enabled.
          <p className="py-1">
            {t("Score")}: {data.totalScore}/{data.score}
          </p> */}
          {!isPassed && (
            <code>
              {t("Wrong answers")}: {totalFailed} {totalFailed > 1 ? t("test cases") : t("test case")}
            </code>
          )}
        </div>
      );
    }
    return (
      <div className="pt-2 px-4">
        <HeadingResult
          compileResult={data.compileResult}
          getStatusError={getStatusError}
          isSubmitResult={isSubmitResult}
          data={data.testResults}
        />
      </div>
    );
  } else {
    return <div className="text-caution py-4 px-4">{t("Please run your scratch first!")}</div>;
  }
};
export default TestResult;
