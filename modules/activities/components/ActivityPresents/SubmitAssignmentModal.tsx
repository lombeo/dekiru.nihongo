import { Button, Group, Modal, Text, Textarea, TextInput } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { yupResolver } from "@hookform/resolvers/yup";
import { Radio } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { fileType } from "@src/config";
import { LearnActivityService } from "@src/services/LearnActivityService";
import { UploadService } from "@src/services/UploadService/UploadService";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const isUrl = (url: string) => {
  const regexp =
    /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
  return regexp.test(url);
};

const SubmitAssignmentModal = (props: any) => {
  const { open, onClose, onSuccess, activityId, title, submission } = props;
  const { t } = useTranslation();
  const [loadingForm, setLoadingForm] = useState<any>(false);
  const [file, setFile] = useState<any>(
    !!submission?.fileName
      ? {
          fileUrl: submission.fileUrl,
          fileName: submission.fileName,
        }
      : null
  );

  //Validate file
  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 25) {
      Notify.error(t("Attachment file size cannot exceed 25MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  const onChangeFiles = async (data: any) => {
    const isValid = validation(data);
    if (!isValid) {
      return;
    }
    const file = data[0];
    const res = await UploadService.upload(file, fileType.assignmentAttach);
    if (res.data?.success && res.data.data) {
      const url = res.data.data.url;
      setFile({
        fileUrl: url,
        fileName: file.name,
      });
    }
  };

  const initialValues: any = {
    option: submission && !submission?.fileName ? 2 : 1,
    fileUrl: !!submission?.fileName ? "" : submission?.fileUrl,
    shortDescription: submission?.shortDescription,
  };

  const getSchemaValidate = () => {
    return yup.object().shape({});
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(getSchemaValidate()),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      if (data.option == 2) {
        if (!data.fileUrl) {
          return Notify.error(t("File submission is required"));
        }
        if (!isUrl(data.fileUrl)) {
          return Notify.error(t("Invalid URL"));
        }
      } else if (data.option != 2 && !file) {
        return Notify.error(t("File submission is required"));
      }
      if (data.shortDescription && data.shortDescription.length > 256) {
        return Notify.error(t("Short description cannot exceed 256 characters"));
      }
      setLoadingForm(true);
      const res = await LearnActivityService.submitAssignment({
        activityId,
        id: submission?.id,
        fileUrl: data.option == 2 ? data.fileUrl : file.fileUrl,
        fileName: data.option == 2 ? "" : file.fileName,
        shortDescription: data.shortDescription,
      });
      setLoadingForm(false);
      if (res.data?.success) {
        onSuccess();
        Notify.success(t("Submitted successfully!"));
      } else if (res.data?.message) {
        switch (res.data.message) {
          case "Learn_309":
            confirmAction({
              message: t("The course has expired"),
              title: t("Notice"),
              labelConfirm: t("Ok"),
              allowCancel: false,

              withCloseButton: false,
            });
            break;
          default:
            Notify.error(t(res.data.message));
            break;
        }
      }
      onClose();
    })();
  };

  return (
    <>
      <Modal
        title={title}
        classNames={{
          title: "font-semibold text-lg",
        }}
        size="xl"
        opened={open}
        zIndex={300}
        onClose={onClose}
      >
        <div>
          <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => <Textarea label={t("Short description")} size="md" {...field} minRows={3} />}
          />
          <Text className="mt-4">
            {t("Submission files")} <span className="text-red-500">*</span>
          </Text>
          <div className="flex gap-5 justify-between mt-4">
            <div className="mt-5">
              <Radio value={"1"} onClick={() => setValue("option", 1)} checked={watch("option") == 1} />
            </div>
            <div
              className={clsx(" flex-none w-[calc(100%_-_40px)]", {
                "cursor-not-allowed opacity-40 pointer-events-none": watch("option") != 1,
              })}
            >
              <Dropzone
                multiple={false}
                onDrop={(files) => onChangeFiles(files)}
                onReject={(files) => console.log("rejected files", files)}
              >
                <Group position="center" spacing="sm" style={{ height: 34, pointerEvents: "none" }}>
                  <span className="text-blue-primary">
                    <Icon name="upload-cloud" size={30}></Icon>
                  </span>
                  <div className="text-blue-primary">
                    <Text size="md" inline>
                      {t("Drag and drop the file, or Browse")}
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </div>
          </div>
          {file && (
            <div className="mt-4 bg-[#F1F3F5] px-4 py-2 rounded-md min-h-[50px] flex gap-5 justify-between items-center">
              <Text className="font-semibold">{file.fileName}</Text>
              <div className="cursor-pointer w-6 " onClick={() => setFile(null)}>
                <Icon name="close" className="text-[#868e96] hover:text-[#045fbb]" />
              </div>
            </div>
          )}
          <Text className="mt-4">
            (<span className="text-red-500">*</span>) {t("File size limit: {{limit}}", { limit: "25MB" })}
          </Text>
          <Text className="mt-5">
            {t("Link submission")} <span className="text-red-500">*</span>
          </Text>
          <div className="flex gap-5 items-center mt-4">
            <div>
              <Radio value={"2"} onClick={() => setValue("option", 2)} checked={watch("option") == 2} />
            </div>
            <Controller
              name="fileUrl"
              control={control}
              render={({ field }) => (
                <TextInput disabled={watch("option") != 2} className="w-full" required size="md" {...field} />
              )}
            />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Group>
            <Button onClick={() => onClose()} variant="outline">
              {t("Cancel")}
            </Button>
            <Button loading={loadingForm} onClick={() => submit()}>
              {t("Submit")}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};

export default SubmitAssignmentModal;
