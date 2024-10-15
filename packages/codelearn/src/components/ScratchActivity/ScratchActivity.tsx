import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, clsx, Loader } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { LiveVideo, NewFile } from "@src/components/Svgr/components";
import SvgOneFingerTap from "@src/components/Svgr/components/OneFingerTap";
import { fileType } from "@src/config";
import { PubsubTopic } from "@src/constants/common.constant";
import useScratch from "@src/hooks/useScratch";
import useScratchPostMessage, { SCRATCH_POST_MESSAGE } from "@src/hooks/useScratchPostMessage";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import { ActivityContextType } from "@src/services/Coding/types";
import { InternalService } from "@src/services/InternalService";
import { UploadService } from "@src/services/UploadService/UploadService";
import { selectProfile } from "@src/store/slices/authSlice";
import { selectStatus } from "@src/store/slices/scratchSlice";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Download, Upload, X } from "tabler-icons-react";
import { CodelearnService } from "../../services";
import { Activities } from "../CodelearnIDE/CodelearnIDE";
import { useIdeContext } from "../CodelearnIDE/IdeContext";
import ModalFinishSubmit from "../Modal/ModalFinishSubmit";
import BoxTab from "./components/BoxTab";

interface ScratchActivityProps {
  isAssignment?: boolean;
}

const PROJECT_SCRATCH_EMPTY =
  "https://s3-sgn09.fptcloud.com/duonghh/files/scratch/scratch-23794203-5144-02561622072024_197152896293445aafe4267598fc0a65.sb3";

const ScratchActivity = (props: any) => {
  const { backLink, activities } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const {
    activityId,
    remainRetry,
    contextType,
    contextId,
    activityDetails,
    codeActivity,
    isAdminContext,
    totalSubmitted,
    languagesCodeSubmitted,
    contextDetail,
  } = useIdeContext();

  const limitNumberSubmission = codeActivity?.limitNumberSubmission;

  const profile = useSelector(selectProfile);

  const multiLangData = activityDetails?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activityDetails?.title;
  const currentIndex = activities?.findIndex((item: any) => item.activityId === activityId);
  const nextActivity = activities && currentIndex < activities.length && activities[currentIndex + 1];

  const scratchStatus = useSelector(selectStatus);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string | null>("description");
  const [testResult, setTestResult] = useState();
  const [openFinishLesson, setOpenFinishLesson] = useState(false);
  const [playScreen, setPlayScreen] = useState<any>();

  const isRunCodePage = router.pathname === "/runcode";

  const actionType = useRef<"submit" | "test" | "download" | null>(null);

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

  const handleDownload = (blob: any) => {
    setSubmitLoading(false);
    const fileName = `scratch-${profile?.userId || 0}-${activityId}-${moment().format("hhmmssDDMMYYYY")}`;
    const file = new File([blob], fileName + ".sb3");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const { initSuccess } = useScratch({
    saveProjectCb: (projectData) => {
      if (actionType.current === "submit" || actionType.current === "test") {
        handleSubmit(projectData, actionType.current === "submit");
      } else if (actionType.current === "download") {
        handleDownload(projectData);
      }
    },
  });

  const defaultValue = languagesCodeSubmitted?.[0]?.code;

  const handleLoadProject = async (fileUrl: string) => {
    try {
      const response = await InternalService.getFileS3(fileUrl);
      const blob = new Blob([response.data], { type: "application/zip" });
      const arrayBuffer = await blob.arrayBuffer();
      const projectData = new Uint8Array(arrayBuffer);
      scratchPostMessage(SCRATCH_POST_MESSAGE["load-project"], projectData);
    } catch (e) {}
  };

  useEffect(() => {
    if (defaultValue && initSuccess) {
      handleLoadProject(defaultValue);
    }
  }, [initSuccess, defaultValue]);

  useEffect(() => {
    let token = PubSub.subscribe(ActivityCodeChanelEnum.LOADUSERCODE, (mess, data: any) => {
      if (data?.code) {
        setActiveTabKey(null);
        scratchPostMessage(SCRATCH_POST_MESSAGE["full-screen"], !isAdminContext);
        scratchPostMessage(SCRATCH_POST_MESSAGE["set-show-btn-full-screen"], isAdminContext);
        handleLoadProject(data.code);
        setPlayScreen(data);
      }
    });
    return () => {
      PubSub.unsubscribe(token);
    };
  }, [isAdminContext]);

  const handleSubmit = async (data: any, isSubmitted: boolean) => {
    if (!isValid(data)) {
      setSubmitLoading(false);
      return;
    }
    const fileName = `scratch-${profile?.userId || 0}-${activityId}-${moment().format("hhmmssDDMMYYYY")}`;
    const file = new File([data], fileName + ".sb3");

    const res = await UploadService.upload(file, fileType.scratchAttach, null, isSubmitted);
    if (res.data?.success && res.data.data) {
      const fileUrl = res.data.data.url;
      let requestParams = {
        activityId,
        contextId,
        contextType,
        languageKey: "scratch",
        isSubmitted,
        userCode: Buffer.from(fileUrl).toString("base64"),
        href: location.origin + location.pathname,
      };
      const resSubmit = await CodelearnService.submitSolution(requestParams);
      setSubmitLoading(false);

      const data = resSubmit?.data?.data;
      const message = resSubmit?.data?.message;

      //handle error
      if (!resSubmit?.data?.success) {
        setTestResult(undefined);
        if (!message) {
          return;
        }
        switch (message) {
          case "Coding_102":
            break;
          case "Coding_103":
          case "Learn_303":
            break;
          case "Source code is empty!":
            break;
          case "Source code exceeds the allowed number of characters!":
            break;
          case "The allowed number of submissions has been exceeded!":
            PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
              totalSubmitted: limitNumberSubmission,
            });
            break;
          case "This task is not part of the contest!":
            break;
          case "You need to complete the previous task!":
            PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
              totalSubmitted: limitNumberSubmission,
            });
            break;
          case "Coding_043":
            confirmAction({
              message: t("Coding_043"),
              title: t("Notice"),
              labelConfirm: t("Ok"),
              allowCancel: false,
              withCloseButton: false,
            });
            break;
          case "CODING_REQUEST_PENDING":
            let message = t("SUBMIT_REQUEST_PENDING");
            showNotification({
              color: "cyan",
              message: <span className="font-medium">{message}</span>,
              style: { marginTop: "45px", marginRight: "-10px" },
              classNames: {
                description: "break-words",
              },
              loading: true,
              autoClose: 3000,
            });
            break;
          default:
            break;
        }
        if (message != "CODING_REQUEST_PENDING" && message != "Learn_309") {
          let message = t(resSubmit.data.message);
          if (resSubmit.data.message.trim().startsWith("BLOCK_RUNCODE_MESSAGE")) {
            message = t(
              "You can't perform this action due to system attack suspicion. Try again after {{second}} seconds",
              {
                second: resSubmit.data.message.replace("BLOCK_RUNCODE_MESSAGE_", "").replace("_SECONDS", ""),
              }
            );
          }
          confirmAction({
            message: message,
            title: t("Notice"),
            labelConfirm: t("Ok"),
            allowCancel: false,
          });
          return;
        }
        Notify.error(t(message));
        return;
      }

      //handle success
      // reFetchContextData();

      setActiveTabKey("testcase");
      setTestResult(data);

      if (isRunCodePage || !isSubmitted) return;

      const countPassed = data?.testResults ? data?.testResults.filter((item: any) => item.pass)?.length : 0;
      if (data?.testResults && countPassed === data?.testResults.length) {
        setOpenFinishLesson(true);
        PubSub.publish(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, {
          data,
          activityId,
        });
      } else {
        PubSub.publish(ActivityCodeChanelEnum.SUBMIT_CODE_DONE, {
          data,
        });
      }
      if (!isAdminContext) {
        PubSub.publish(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, {
          totalSubmitted: totalSubmitted + 1,
        });
      }
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    setSubmitLoading(false);
  };

  const handleBack = () =>
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        router.push(backLink);
      },
    });

  return (
    <div className="h-full bg-white">
      {openFinishLesson && (
        <ModalFinishSubmit
          open
          // contextId={contextId}
          // contextType={contextType}
          onClose={() => setOpenFinishLesson(false)}
          nextActivity={nextActivity}
          // token={token}
          // chapters={chapters}
          // activityId={activityId}
        />
      )}
      <div className="h-[60px] bg-[#0E2643] px-4 text-white flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          {backLink ? (
            <Image
              alt="chevron_left"
              src="/images/learning/chevron_left.png"
              height={16}
              width={16}
              className="cursor-pointer"
              onClick={handleBack}
            />
          ) : (
            <div className="h-[28px] w-[60px]"></div>
          )}
          <TextLineCamp className="text-base text-inherit font-semibold">{title}</TextLineCamp>
        </div>
        <Activities data={activities} permalink={contextDetail?.contextPermalink} activeId={codeActivity?.activityId} />
        <div className="flex gap-2 z-[150]">
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
              actionType.current = "download";
              setSubmitLoading(true);
              scratchPostMessage(SCRATCH_POST_MESSAGE["save-project"]);
            }}
            loading={submitLoading && actionType.current === "download"}
            variant="filled"
            radius="md"
            className={clsx({
              "pointer-events-none": submitLoading,
            })}
          >
            <Download width={16} height={16} />
          </ActionIcon>
          {/* {isAdminContext && (
            <Button
              classNames={{
                root: "rounded-md hover:bg-gray-primary bg-gray-primary text-xs font-bold h-[28px] px-2",
                leftIcon: "mr-1.5",
              }}
              size="sm"
              color="blue"
              leftIcon={<Edit width={16} />}
              onClick={() => {
                const url = `/cms/activity-code/12/edit/${activityDetails?.externalCode}?type=${codeActivity?.activityCodeSubType}`;
                window.open(url);
              }}
            >
              {t("Edit task")}
            </Button>
          )} */}
          <Button
            classNames={{
              root: "rounded-md hover:bg-navy-primary bg-navy-primary text-xs font-bold h-[28px] px-2",
              leftIcon: "mr-1.5",
            }}
            size="sm"
            color="blue"
            leftIcon={<NewFile width={14} height={14} />}
            onClick={() => setActiveTabKey("description")}
          >
            {t("ScratchPage.Task")}
          </Button>
          {playScreen ? (
            <div className="ml-4 flex items-center gap-2 font-semibold text-sm">
              <div>
                {t("Watching")}: {playScreen.userName}
              </div>
              <ActionIcon
                variant="transparent"
                className="hover:text-white"
                onClick={() => {
                  handleLoadProject(PROJECT_SCRATCH_EMPTY).finally(() => {
                    setPlayScreen(null);
                    scratchPostMessage(SCRATCH_POST_MESSAGE["full-screen"], false);
                    scratchPostMessage(SCRATCH_POST_MESSAGE["set-show-btn-full-screen"], true);
                  });
                }}
              >
                <X className="text-inherit" width={16} height={16} />
              </ActionIcon>
            </div>
          ) : (
            <>
              <Button
                classNames={{
                  root: clsx(
                    "rounded-md w-[98px] hover:bg-green-secondary bg-green-secondary text-xs font-bold h-[28px] px-2",
                    {
                      "pointer-events-none": submitLoading,
                    }
                  ),
                  leftIcon: "mr-1.5",
                }}
                size="sm"
                color="green"
                disabled={!profile}
                leftIcon={<LiveVideo width={14} height={14} />}
                onClick={() => {
                  actionType.current = "test";
                  setSubmitLoading(true);
                  scratchPostMessage(SCRATCH_POST_MESSAGE["save-project"]);
                }}
                loading={submitLoading && actionType.current === "test"}
              >
                {t("Run test")}
              </Button>
              <Button
                classNames={{
                  root: clsx("rounded-md hover:bg-[#F84F39] bg-[#F84F39] text-xs font-bold h-[28px] px-2", {
                    "pointer-events-none": submitLoading,
                  }),
                  leftIcon: "mr-1.5",
                }}
                disabled={!profile}
                size="sm"
                color="red"
                leftIcon={<SvgOneFingerTap width={14} height={14} />}
                onClick={() => {
                  actionType.current = "submit";
                  setSubmitLoading(true);
                  scratchPostMessage(SCRATCH_POST_MESSAGE["save-project"]);
                }}
                loading={submitLoading && actionType.current === "submit"}
              >
                {t("Submit")}
                {remainRetry > 0 && contextType !== ActivityContextType.Challenge ? `(${remainRetry})` : ""}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-[46px_1fr] relative h-full">
        <BoxTab activeTabKey={activeTabKey} setActiveTabKey={setActiveTabKey} testResult={testResult} />
        {!initSuccess && (
          <div className="z-10 flex items-center justify-center absolute top-0 bottom-0 right-0 left-[46px]">
            <Loader color="blue" />
          </div>
        )}
        <div
          className={clsx("flex flex-col", {
            "opacity-0 -z-10": !initSuccess,
          })}
        >
          <iframe
            id="scratch-iframe"
            src={process.env.NEXT_PUBLIC_SCRATCH_URL + "?embedded=true"}
            height="100%"
            width="100%"
            className="w-full h-full overflow-auto border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ScratchActivity;
