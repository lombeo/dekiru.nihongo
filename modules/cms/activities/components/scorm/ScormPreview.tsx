import { LoadingOverlay } from "@mantine/core";
import { getAccessToken } from "api/axiosInstance";
import { useEffect, useState } from "react";

interface ScormPreviewProps {
  packageUrl: string;
  preview?: boolean;
  getPackageUrlStatus?: Function;
  getLoadingStatus?: Function;
  activityId: number;
  courseId: number;
}

const getUrl = ({ preview, courseId, activityId, packageUrl }: any) => {
  return `${
    process.env.NEXT_PUBLIC_SCORM_SERVICE_URL
  }/scorm/play?context=cms&preview=${preview}&courseId=${courseId}&activityId=${
    activityId == undefined ? 0 : activityId
  }&packageUrl=${packageUrl}`;
};

export const ScormPreview = (props: ScormPreviewProps) => {
  const {
    getPackageUrlStatus,
    getLoadingStatus,
    preview = true,
    activityId,
    courseId,
    packageUrl,
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [invalidPackage, setInvalidPackage] = useState(false);
  const src = getUrl({ preview, courseId, activityId, packageUrl });

  useEffect(() => {
    setTimeout(() => {
      const token = getAccessToken();
      const iframe = document.getElementById("scormiframe") as any;
      iframe?.contentWindow.postMessage({ token }, "*");
    }, 2000);

    window.addEventListener(
      "message",
      function (event) {
        if (event?.data?.invalidPackage) setInvalidPackage(true);
        if (event?.data?.loaded) setIsLoading(false);
      },
      false
    );
  }, []);

  useEffect(() => {
    getPackageUrlStatus && getPackageUrlStatus(!invalidPackage);
  }, [invalidPackage]);
  useEffect(() => {
    getLoadingStatus && getLoadingStatus(isLoading);
  }, [isLoading]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} overlayColor="#c5c5c5" />
        <iframe
          id="scormiframe"
          className="w-full border-0 m-0 p-0"
          style={{ height: 620 }}
          src={src}
        ></iframe>
      </div>
    </>
  );
};
