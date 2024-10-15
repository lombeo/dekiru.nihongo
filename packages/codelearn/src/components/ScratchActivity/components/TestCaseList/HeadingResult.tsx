import { useTranslation } from "next-i18next";
import { useIdeContext } from "../../../CodelearnIDE/IdeContext";

const HeadingResult = (props: any) => {
  const { t } = useTranslation();
  const { data, compileResult, isSubmitResult = false, getStatusError } = props;
  const { contextId } = useIdeContext();
  if (compileResult === undefined) {
    return null;
  }
  if (data && data.length > 0) {
    const countPassed = data.filter((item: any) => item.pass)?.length | 0;
    if (data.compileResult) {
      return <div className="text-success border-b pb-2">{t("Compilation successfully!")}</div>;
    }
    if (countPassed === data.length) {
      return (
        <div className="text-[#37B24D] border-b pb-2">
          {contextId != 0 && contextId != undefined ? (
            <b>{t("Sample tests passed")}</b>
          ) : (
            <b>{t("All tests passed.")}</b>
          )}
          {!isSubmitResult && contextId != 0 && contextId != undefined && (
            <>
              <br />
              <i>{t("Click Submit to run the full test set and save your result")}</i>
            </>
          )}
        </div>
      );
    }
    getStatusError && getStatusError();
    return (
      <div className="text-red-500 border-b pb-2">
        {data.length - countPassed}/{data.length}{" "}
        {compileResult ? t("test case(s) is/are incorrect.") : t("Compilation error")}
      </div>
    );
  }
  if (!compileResult) {
    getStatusError && getStatusError();
    return <div className="text-red-500 pb-2">{t("Compilation error")}</div>;
  }
  return null;
};
export default HeadingResult;
