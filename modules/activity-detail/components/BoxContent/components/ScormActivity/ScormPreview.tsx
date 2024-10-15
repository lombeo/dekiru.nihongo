import { LoadingOverlay } from "@mantine/core";
import { getAccessToken } from "api/axiosInstance";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { ACTIVITY_LEARN_STATUS, ACTIVITY_SUB_CHANEL } from "@src/constants/activity/activity.constant";
import PubSub from "pubsub-js";

interface ScormPreviewProps {
  packageUrl: string;
  preview?: boolean;
  getPackageUrlStatus?: Function;
  activityId: number;
  courseId: number;
}

const getUrl = (data: any) => {
  const params = new URLSearchParams(data);
  return `${process.env.NEXT_PUBLIC_SCORM_SERVICE_URL}/scorm/play?` + params.toString();
};

export const ScormPreview = (props: ScormPreviewProps) => {
  const { t } = useTranslation();
  const { packageUrl, getPackageUrlStatus, activityId, courseId, preview = true } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [invalidPackage, setInvalidPackage] = useState(false);

  const src = getUrl({ context: "lms", preview, activityId, courseId });
  useEffect(() => {
    setTimeout(() => {
      const iframe = document.getElementById("scormiframe") as any;
      const token = getAccessToken();
      iframe?.contentWindow.postMessage({ token }, "*");
    }, 2000);

    const listen = (event: any) => {
      if (event?.data?.invalidPackage) setInvalidPackage(true);
      if (event?.data?.loaded) setIsLoading(false);
      if (event?.data?.status == ACTIVITY_LEARN_STATUS.COMPLETED) {
        PubSub.publish(ACTIVITY_SUB_CHANEL.MARK_COMPLETE_ACTIVITY, { activityId });
      }
    };

    window.addEventListener("message", listen, false);

    return () => {
      window.removeEventListener("message", listen);
    };
  }, []);

  useEffect(() => {
    getPackageUrlStatus && getPackageUrlStatus(!invalidPackage);
  }, [invalidPackage]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayColor="#c5c5c5" />
        <iframe id="scormiframe" className="w-full border-0 m-0 p-0" style={{ height: 620 }} src={src}></iframe>
      </div>
    </>
  );
};
