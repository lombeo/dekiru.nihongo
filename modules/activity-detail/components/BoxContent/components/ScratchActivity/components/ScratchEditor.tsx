import { confirmAction } from "@edn/components/ModalConfirm";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, clsx, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notify } from "@src/components/cms";
import RawText from "@src/components/RawText/RawText";
import { NewFile } from "@src/components/Svgr/components";
import SvgOneFingerTap from "@src/components/Svgr/components/OneFingerTap";
import { fileType } from "@src/config";
import useScratch from "@src/hooks/useScratch";
import useScratchPostMessage, { SCRATCH_POST_MESSAGE } from "@src/hooks/useScratchPostMessage";
import { LearnActivityService } from "@src/services";
import { InternalService } from "@src/services/InternalService";
import { UploadService } from "@src/services/UploadService/UploadService";
import { selectProfile } from "@src/store/slices/authSlice";
import { selectStatus } from "@src/store/slices/scratchSlice";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Download, Upload } from "tabler-icons-react";

interface ScratchEditorProps {
  title: string;
  activityId: number;
  defaultValue: any;
  description: string;
  submissionId: number | null;
  type: "view" | "default";
  onClose: () => void;
  onSubmitted: () => void;
}

const ScratchEditor = (props: ScratchEditorProps) => {
  const { title, type, description, activityId, defaultValue, submissionId, onClose, onSubmitted } = props;

  const { t } = useTranslation();

  const profile = useSelector(selectProfile);
  const scratchStatus = useSelector(selectStatus);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [opened, { close, toggle }] = useDisclosure(false);

  const scratchPostMessage = useScratchPostMessage("scratch-iframe");

  const isValid = (data: any) => {
    const file = data;
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      return false;
    }
    if (file.size > 1024 * 1000 * 5) {
      Notify.error(
        t("Attachment file size cannot exceed {{size}}", {
          size: "5MB",
        })
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (data: any) => {
    if (!isValid(data)) {
      setSubmitLoading(false);
      return;
    }
    const fileName = `scratch-${profile?.userId || 0}-${activityId}-${moment().format("hhmmssDDMMYYYY")}`;
    const file = new File([data], fileName + ".sb3");

    const res = await UploadService.upload(file, fileType.scratchAttach);
    if (res.data?.success && res.data.data) {
      const fileUrl = res.data.data.url;
      const submitRes = await LearnActivityService.submitScratch({
        activityId,
        fileUrl,
        fileName,
        id: submissionId,
        shortDescription: "",
      });
      setSubmitLoading(false);
      if (submitRes?.data?.success) {
        Notify.success(t("Submitted successfully!"));
        onSubmitted();
      } else if (submitRes.data?.message) {
        switch (submitRes.data.message) {
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
            Notify.error(t(submitRes.data.message));
            break;
        }
      }
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    setSubmitLoading(false);
  };

  const { initSuccess } = useScratch({
    saveProjectCb: (projectData) => {
      handleSubmit(projectData);
    },
  });

  const handleLoadProject = async () => {
    try {
      const response = await InternalService.getFileS3(defaultValue.fileUrl);
      const blob = new Blob([response.data], { type: "application/zip" });
      const arrayBuffer = await blob.arrayBuffer();
      const projectData = new Uint8Array(arrayBuffer);
      scratchPostMessage(SCRATCH_POST_MESSAGE["load-project"], projectData);
    } catch (e) {}
  };

  useEffect(() => {
    if (defaultValue && initSuccess) {
      handleLoadProject();
    }
  }, [initSuccess, defaultValue]);

  const handleUpload = () => {
    const inputElement: any = document.createElement("input");
    inputElement.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const projectData = new Uint8Array(arrayBuffer);
        scratchPostMessage(SCRATCH_POST_MESSAGE["load-project"], projectData);
      }
      document.body.removeChild(inputElement);
    };
    inputElement.accept = ".sb,.sb2,.sb3";
    inputElement.type = "file";
    document.body.appendChild(inputElement);
    inputElement.click();
  };

  return (
    <div>
      <Drawer
        zIndex={120}
        classNames={{
          inner: "top-[128px]",
          header: "h-0 !p-0",
          close: "top-3 right-2",
          overlay: "!opacity-0",
        }}
        position="left"
        size={382}
        opened={opened}
        onClose={close}
      >
        <div>
          <RawText content={description} className="overflow-auto break-words max-w-full" />
        </div>
      </Drawer>

      <div className="fixed h-[100vh-68px] top-[68px] left-0 right-0 z-100">
        <div className="h-[60px] bg-[#0E2643] px-4 text-white flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="pr-1 flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => onClose()}>
              <Image alt="chevron_left" src="/images/learning/chevron_left.png" height={16} width={16} />
              <TextLineCamp className="text-base">{t("Lesson")}</TextLineCamp>
            </div>
            <div className="h-[60px] w-[1px] bg-[#374151] mx-8" />
            <TextLineCamp className="text-base text-inherit font-semibold">{title}</TextLineCamp>
          </div>

          <div className="flex gap-2">
            <ActionIcon
              data-tooltip-id="global-tooltip"
              data-tooltip-place="bottom"
              data-tooltip-content={t("Upload")}
              onClick={() => handleUpload()}
              variant="filled"
              radius="md"
            >
              <Upload width={16} height={16} />
            </ActionIcon>
            <ActionIcon
              data-tooltip-id="global-tooltip"
              data-tooltip-place="bottom"
              data-tooltip-content={t("Download")}
              onClick={() => {
                setSubmitLoading(true);
                scratchPostMessage(SCRATCH_POST_MESSAGE["save-project"]);
              }}
              variant="filled"
              radius="md"
              className={clsx({
                "pointer-events-none": submitLoading,
              })}
            >
              <Download width={16} height={16} />
            </ActionIcon>
            <Button
              classNames={{
                root: "rounded-md hover:bg-navy-primary bg-navy-primary h-[28px] px-2",
                leftIcon: "mr-1.5",
              }}
              size="sm"
              color="blue"
              leftIcon={<NewFile width={14} height={14} />}
              onClick={() => toggle()}
            >
              {t("ScratchPage.Task")}
            </Button>
            {/* <Button
              classNames={{
                root: "rounded-md w-[98px] hover:bg-green-secondary bg-green-secondary h-[28px] px-2",
                leftIcon: "mr-1.5",
              }}
              size="sm"
              color="green"
              leftIcon={<LiveVideo width={14} height={14} />}
              onClick={() => {
                if (scratchStatus?.running) {
                  scratchPostMessage(SCRATCH_POST_MESSAGE["stop"]);
                  return;
                }
                scratchPostMessage(SCRATCH_POST_MESSAGE["run"]);
              }}
            >
              {t(scratchStatus?.running ? "Stop" : "Run test")}
            </Button> */}
            {type === "default" && (
              <Button
                classNames={{
                  root: "rounded-md hover:bg-[#F84F39] bg-[#F84F39] h-[28px] px-2",
                  leftIcon: "mr-1.5",
                }}
                size="sm"
                color="red"
                leftIcon={<SvgOneFingerTap width={14} height={14} />}
                onClick={() => {
                  setSubmitLoading(true);
                  scratchPostMessage(SCRATCH_POST_MESSAGE["save-project"]);
                }}
                loading={submitLoading}
              >
                {t("Submit")}
              </Button>
            )}
          </div>
        </div>
        <div className="bg-white">
          <div>
            <iframe
              id="scratch-iframe"
              src={process.env.NEXT_PUBLIC_SCRATCH_URL + "?embedded=true"}
              height="100%"
              width="100%"
              className="w-full min-w-[1000px] h-[calc(100vh_-_128px)] max-h-full min-h-[640px] overflow-auto border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchEditor;
