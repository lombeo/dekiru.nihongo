import { Tooltip } from "@mantine/core";
import { Dropzone, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import { AppIcon } from "@src/components/cms/core/Icons";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { Button, Card, Group, Modal, Notify, Text } from "components/cms";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import PubSub from "pubsub-js";
import { useState } from "react";
import { QuestionBankService } from "services/question-bank";

export const CreateQuestionPopupImport = (props: any) => {
  const { questionBankId } = props;
  const { t } = useTranslation();
  const { isOpen, onClose } = props;
  const [listFile, setListFile] = useState(null);
  const [isShowPopupImport, setIsShowPopupImport] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const onClosePopupImport = () => {
    setIsShowPopupImport(false);
  };

  //Show modal import
  const showModalImport = () => {
    onClose();
    setIsShowPopupImport(true);
    setListFile(null);
    setIsDisable(false);
  };

  //On change file
  const onChangeFiles = (data: any) => {
    const isValid = validation(data);
    if (!isValid) {
      setListFile(null);
      return;
    }
    setListFile(data);
    setIsDisable(false);
  };

  //Validate file
  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 2000) {
      Notify.error(t("Attachment file size cannot exceed 2MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  //Get render file
  const getRenderData = () => {
    return listFile ? listFile : [];
  };

  //Delete file
  const onDelete = () => {
    setListFile(null);
  };

  //Import question
  const onImportQuestion = () => {
    setIsDisable(true);
    if (listFile != null) {
      let formData = new FormData();
      formData.append("file", listFile[0]);
      formData.append("bankId", questionBankId);
      QuestionBankService.importQuestion(formData).then((res: any) => {
        let data = res?.data;
        if (data?.success) {
          Notify.success(t("Import questions successfully"));
          PubSub.publish("QUESTIONLIST_CHANGED", {});
          setIsShowPopupImport(false);
        } else {
          let templateError = "";
          let arr = data?.errorData ?? [];
          templateError = arr
            .map((item: any) => {
              return FunctionBase.normallyMessageWithParams(item?.errorMessage);
            })
            .join(", ");
          if (templateError.trim().length > 0) {
            Notify.error(templateError);
          }
        }
        setListFile(null);
        setIsDisable(false);
      });
    } else {
      Notify.error(t("Import file is required"));
    }
  };

  return (
    <>
      {/* Modal choose type */}
      <Modal
        opened={isOpen}
        onClose={onClose}
        closeOnClickOutside={false}
        title={t(LocaleKeys["Type of question"])}
        size="xl"
      >
        <div className={"grid grid-cols-3 gap-5"}>
          <div onClick={() => showModalImport()}>
            <a>
              <Tooltip
                label={
                  <p>
                    {t("Apply for Single choice, ")}
                    <br></br>
                    {t("Multiple choice and True/False question")}
                  </p>
                }
                color="blue"
                position="right"
                withArrow
              >
                <Card
                  className="rounded bg-smoke text-sm font-semibold flex items-center gap-5 hover:shadow cursor-pointer"
                  padding="lg"
                >
                  <AppIcon name="IconReading" size="lg" />
                  <div>{t(LocaleKeys["Choice question"])}</div>
                </Card>
              </Tooltip>
            </a>
          </div>
        </div>
      </Modal>
      {/* Modal import */}
      <Modal
        opened={isShowPopupImport}
        onClose={onClosePopupImport}
        closeOnClickOutside={false}
        title={t(LocaleKeys["Import choice question"])}
        size="lg"
      >
        <div className="h-2"></div>
        <Dropzone
          multiple={false}
          onDrop={(files) => onChangeFiles(files)}
          onReject={(files) => console.log("rejected files", files)}
          accept={MS_EXCEL_MIME_TYPE}
        >
          <Group position="center" spacing="sm" style={{ height: 34, pointerEvents: "none" }}>
            <span className="text-blue-500">
              <AppIcon size={"lg"} name="cloud_arrow_up" />
            </span>
            <div className="text-blue-500">
              <Text size="md" inline>
                {t("Drag and drop the file, or Browse")}
              </Text>
            </div>
          </Group>
        </Dropzone>
        <div className="space-y-2 mb-5">
          {getRenderData().map((x: any, idx: any) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-gray-lighter rounded-sm mt-2">
              <span className="font-semibold text-sm">
                {x.name} <span className="font-normal italic text-sm">({(parseInt(x.size) / 1024).toFixed(2)} KB)</span>
              </span>
              <span className="cursor-pointer text-critical" onClick={() => onDelete()}>
                <AppIcon name="delete" />
              </span>
            </div>
          ))}
        </div>
        <div>
          <a
            className="text-blue-500"
            href="https://s3-sgn09.fptcloud.com/ednstorage/files/attachfiles/EduNext_Template_Choice_Questions_v30052023_328ffe4238934c7992b1e5246f6a1bff.xlsx"
          >
            {t("Download template here")}
          </a>
          <div className="border-b pt-4 mb-4"></div>
          <div className="pb-5 border-b mb-5">
            <p>{t("Upload file")}:</p>
            <p>
              <span className="font-bold">{t("Step 1")}</span>:{" "}
              {t('To create question, you need to download the template by clicking link "Download template here"')}
            </p>
            <p>
              <span className="font-bold">{t("Step 2")}</span>: {t("GUIDE_DRAG_FILE")}
            </p>
            <p>
              <span className="font-bold">{t("Step 3")}</span>: {t("Click Import")}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button preset="secondary" size="md" onClick={() => onClosePopupImport()}>
            {t("Discard")}
          </Button>
          <Button
            onClick={() => onImportQuestion()}
            preset="primary"
            size="md"
            disabled={listFile == null || isEmpty(listFile) || listFile == "" || isDisable}
          >
            {t("Import")}
          </Button>
        </div>
      </Modal>
    </>
  );
};
