import { Text } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Container } from "@src/components";
import { DocPreview } from "@src/components/DocViewer";
import RawText from "@src/components/RawText/RawText";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import { CourseUserRole } from "@src/constants/courses/courses.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";

interface AttachmentActivityProps {
  data: any;
  permalink: any;
  isExpired: boolean;
}
const AttachmentActivity = (props: AttachmentActivityProps) => {
  const { data, permalink, isExpired } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const [previewFile, setPreviewFile] = useState<any>(null);
  const activityId = data.activityId;
  const { profile } = useProfileContext();

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const isOwner = profile && data && profile.userId === data.courseOwner?.userId;

  const isManager =
    isOwner ||
    isManagerContent ||
    (profile &&
      data &&
      data?.courseUsers &&
      data.courseUsers.some((e) => e.userId == profile.userId && e.role === CourseUserRole.CourseManager));

  const isCompleted = data.progressActivityStatus === ACTIVITY_LEARN_STATUS.COMPLETED;
  const [, setListDownloaded] = useState<any[]>([]);
  const listFile = data?.activityData?.listAttachmentFile ? data?.activityData?.listAttachmentFile : [];
  const supportFileOnline = [".docx", ".xlsx", ".pptx", ".pdf", ".ppt"];
  const supportLinkOnline = "https://docs.google.com/viewer?url=";

  let totalFiles = 0;
  if (isManager) {
    totalFiles = listFile.length;
  } else {
    let count = 0;
    listFile.map((item: any, idx: any) => {
      //Check is JSON or not
      if (FunctionBase.isJsonString(item?.fileName)) {
        let fileNameObj = JSON.parse(item?.fileName);
        if (!fileNameObj?.lockDownload) {
          count++;
        }
      } else {
        count++;
      }
    });
    totalFiles = count;
  }

  useEffect(() => {
    if (!isCompleted && listFile?.length > 0 && totalFiles === 0 && !isManager) {
      setTimeout(() => {
        onHandleComplete();
      }, 1000);
    }
  }, [listFile]);

  const onHandleComplete = async () => {
    if (isExpired) return;
    const response = await LearnCourseService.markAsComplete({
      status: ACTIVITY_LEARN_STATUS.COMPLETED,
      activityId: activityId,
      courseId: data.courseId,
    });
    if (response?.data.success) {
      PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_COMPLETE_ACTIVITY, {
        activityId,
      });
    }
  };

  const description = data.activityData?.description;

  return (
    <div>
      <Container>
        <div className="py-6">
          <Text className="my-2 font-semibold text-base">1. {t("Content")}</Text>
          <div className="bg-blue-light p-4 pl-6 border-l-8 border-blue-primary mb-5">
            <RawText content={description} className="break-words" />
          </div>
          <p className="font-semibold mb-2 text-base">
            2. {t("ATTACHMENT_LABEL_RESOURCE")} ({totalFiles} {totalFiles > 1 ? t("files") : t("file")})
          </p>
          <ul>
            {listFile.length > 0 &&
              listFile.map((item: any, idx: any) => {
                let fileName = "";
                let isLockDownload = false;
                //Check is JSON or not
                if (FunctionBase.isJsonString(item?.fileName)) {
                  let fileNameObj = JSON.parse(item?.fileName);
                  fileName = fileNameObj?.name;
                  isLockDownload = fileNameObj?.lockDownload;
                } else {
                  fileName = item?.fileName;
                }
                let urlFileOnline;
                const url = supportFileOnline.some((i) => fileName.includes(i));

                if (url) {
                  urlFileOnline = supportLinkOnline + item?.fileUrl;
                } else urlFileOnline = item?.fileUrl;

                if (!isManager && isLockDownload) {
                  return <></>;
                } else {
                  const onDownload = () => {
                    setListDownloaded((prev) => {
                      if (!prev.includes(item.fileUrl)) {
                        const isDone = isManager ? prev.length === listFile.length - 1 : prev.length === totalFiles - 1;
                        if (isDone) {
                          onHandleComplete();
                        }
                        return [...prev, item.fileUrl];
                      }
                      return prev;
                    });
                  };
                  return (
                    <li key={`${item.fileId}-${item.fileUrl}`} className={`mb-1 flex`}>
                      {url && (
                        <a
                          rel="noreferrer"
                          target="_blank"
                          onClick={() => {
                            setPreviewFile({ urlFile: item.fileUrl, dataName: fileName });
                            onDownload();
                          }}
                          className="cursor-pointer inline-flex items-center gap-2 hover:bg-smoke hover:text-blue-primary rounded-md px-1 py-1"
                        >
                          {fileName}
                        </a>
                      )}
                      {!url && (
                        <a
                          rel="noreferrer"
                          target="_blank"
                          href={urlFileOnline}
                          onClick={(e) => {
                            onDownload();
                          }}
                          className="inline-flex items-center gap-2 hover:bg-smoke hover:text-blue-primary rounded-md px-1 py-1"
                        >
                          {fileName}
                        </a>
                      )}
                      {profile ? (
                        <a
                          rel="noreferrer"
                          target="_blank"
                          href={item?.fileUrl}
                          onClick={(e) => {
                            onDownload();
                          }}
                          className="inline-flex items-center gap-2 hover:bg-smoke hover:text-blue-primary rounded-md px-1 py-1"
                        >
                          <span className="text-blue-primary inline-flex items-center">
                            <Icon name="download" size={22} />
                          </span>
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-2 hover:text-blue-primary rounded-md px-1 py-1">
                          <span className="text-gray-400 inline-flex items-center">
                            <Icon name="download" size={22} />
                          </span>
                        </div>
                      )}
                    </li>
                  );
                }
              })}
            {totalFiles == 0 ? <li>{t("No attachment files")}</li> : <></>}
          </ul>
          {/*{!isCompleted && (*/}
          {/*  <Button*/}
          {/*    size="sm"*/}
          {/*    disabled={!isDownloaded}*/}
          {/*    onClick={onHandleComplete}*/}
          {/*    className="bg-blue-primary font-semibold mt-5"*/}
          {/*  >*/}
          {/*    {t("Mark as complete")}*/}
          {/*  </Button>*/}
          {/*)}*/}
        </div>
      </Container>
      {!!previewFile?.urlFile && (
        <DocPreview
          url={previewFile.urlFile}
          dataName={previewFile.dataName}
          opened={true}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};
export default AttachmentActivity;
