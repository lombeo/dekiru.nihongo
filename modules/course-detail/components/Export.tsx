import { Button, OverlayLoading, Visible } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { LearnExportServices } from "@src/services/LearnExportService";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";

interface ExportProps {
  courseId: number;
  onCloseModal: any;
}
const Export = (props: ExportProps) => {
  const { t } = useTranslation();
  const { courseId, onCloseModal } = props;
  const [isLoadingFinalQuiz, setIsLoadingFinalQuiz] = useState(false);
  const [isLoadingFinalGeneralQuiz, setIsLoadingFinalGeneralQuiz] = useState(false);
  const [isLoadingLearnPlant, setIsLoadingLearnPlant] = useState(false);

  const onExportQuiz = () => {
    setIsLoadingFinalQuiz(true);
    LearnExportServices.exportQuizFinal({
      courseId: courseId,
      isAllColumn: true,
    })
      .then((res: any) => {
        let returnData = res.data.data;
        if (returnData.filename != undefined && returnData.filename.length > 0 && returnData.contents != undefined) {
          let contentType = "application/vnd.ms-excel";
          let excelFile = FunctionBase.b64toBlob(returnData.contents, contentType);
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(excelFile);
          link.download = returnData.filename;
          link.click();
        }
        Notify.success(t("Export quiz final successfully."));
        setIsLoadingFinalQuiz(false);
      })
      .catch(() => {
        setIsLoadingFinalQuiz(false);
        Notify.error(t("Export failed"));
      });
  };

  const onExportGeneralQuiz = () => {
    setIsLoadingFinalGeneralQuiz(true);
    LearnExportServices.exportQuizFinal({
      courseId: courseId,
      isAllColumn: false,
    })
      .then((res: any) => {
        let returnData = res.data.data;
        if (returnData.filename != undefined && returnData.filename.length > 0 && returnData.contents != undefined) {
          let contentType = "application/vnd.ms-excel";
          let excelFile = FunctionBase.b64toBlob(returnData.contents, contentType);
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(excelFile);
          link.download = returnData.filename;
          link.click();
        }
        Notify.success(t("Export general quiz final successfully."));
        setIsLoadingFinalGeneralQuiz(false);
      })
      .catch(() => {
        setIsLoadingFinalGeneralQuiz(false);
        Notify.error(t("Export failed"));
      });
  };

  const onExportLearn = () => {
    setIsLoadingLearnPlant(true);

    LearnExportServices.exportLearningPlan({
      courseId: courseId,
    })
      .then((res: any) => {
        let returnData = res.data.data;
        if (returnData.filename != undefined && returnData.filename.length > 0 && returnData.contents != undefined) {
          let contentType = "application/vnd.ms-excel";
          let excelFile = FunctionBase.b64toBlob(returnData.contents, contentType);
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(excelFile);
          link.download = returnData.filename;
          link.click();
        }
        Notify.success(t("Export learning plan successfully."));
        setIsLoadingLearnPlant(false);
      })
      .catch(() => {
        setIsLoadingLearnPlant(false);
        Notify.error(t("Export failed"));
      });
  };

  return (
    <>
      <div className="flex flex-col py-5 gap-5">
        <Button variant="light" onClick={onExportQuiz} disabled={isLoadingFinalQuiz}>
          <Visible visible={isLoadingFinalQuiz}>
            <OverlayLoading size={28} />
          </Visible>
          {t("Export Quiz Final")}
        </Button>
        <Button variant="gradient" onClick={onExportGeneralQuiz} disabled={isLoadingFinalGeneralQuiz}>
          <Visible visible={isLoadingFinalGeneralQuiz}>
            <OverlayLoading size={28} />
          </Visible>
          {t("Export Quiz Final General")}
        </Button>
        <Button variant="filled" onClick={onExportLearn} disabled={isLoadingLearnPlant}>
          <Visible visible={isLoadingLearnPlant}>
            <OverlayLoading size={28} />
          </Visible>
          {t("Export Learning Plan")}
        </Button>
      </div>
      <div className="flex justify-end w-full">
        <Button variant="outline" className="mt-4 mr-4" onClick={() => onCloseModal(false)}>
          {t("Cancel")}
        </Button>
      </div>
    </>
  );
};

export default Export;
