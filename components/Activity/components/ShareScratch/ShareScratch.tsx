import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, clsx, Loader } from "@mantine/core";
import { Notify } from "@src/components/cms";
import Link from "@src/components/Link";
import { ArrowCorner, InFull } from "@src/components/Svgr/components";
import { useNextQueryParam } from "@src/helpers/query-utils";
import useScratch from "@src/hooks/useScratch";
import useScratchPostMessage, { SCRATCH_POST_MESSAGE } from "@src/hooks/useScratchPostMessage";
import { LearnCourseService } from "@src/services";
import CodingService from "@src/services/Coding/CodingService";
import { CommentContextType } from "@src/services/CommentService/types";
import { InternalService } from "@src/services/InternalService";
import { selectStatus } from "@src/store/slices/scratchSlice";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import BoxTab from "./components/BoxDescription/BoxDescription";
import BoxReviews, { FromRating } from "./components/BoxReviews/BoxReviews";
import { confirmAction } from "@edn/components/ModalConfirm";

const ShareScratch = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const contextId = router.query?.id as any;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const shareId = +useNextQueryParam("shareId");
  const activityId = +useNextQueryParam("activityId");
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const activityDetails: any = {};

  const { data, refetch, isSuccess } = useQuery({
    queryKey: ["share-scratch", contextId, shareId, activityId],
    queryFn: async () => {
      const res = await CodingService.contestGetSubmitHistoryDetail({
        contextId,
        activityId,
        submissionId: shareId,
      });
      const data = res?.data?.data;
      if (res?.data?.success && data) {
        setTimeout(() => {
          handleLoadProject(data.userCode);
          setLoading(false);
        }, 2000);
        return data;
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
      return null;
    },
  });

  const ratingQuery = useQuery({
    queryKey: ["rating", contextId, filter],
    queryFn: async () => {
      if (!contextId) return null;
      const res = await LearnCourseService.getCourseRatings({
        ...filter,
        contextId: shareId,
        contextType: CommentContextType.Submission,
        getDetails: true,
      });
      return res?.data?.data;
    },
  });

  const activity = data?.codeActivity?.activity;

  const multiLangData = activityDetails?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activityDetails?.title;
  const backLink = `/fights/detail/${contextId}`;

  const scratchStatus = useSelector(selectStatus);

  const actionType = useRef<"submit" | "test" | "download" | null>(null);

  const scratchPostMessage = useScratchPostMessage("scratch-iframe");

  const { initSuccess } = useScratch({
    saveProjectCb: (projectData) => {},
  });

  useEffect(() => {
    if (initSuccess) {
      scratchPostMessage(SCRATCH_POST_MESSAGE["full-screen"], true);
      scratchPostMessage(SCRATCH_POST_MESSAGE["set-show-btn-full-screen"], false);
    }
  }, [initSuccess]);

  const handleLoadProject = async (fileUrl: string) => {
    try {
      const response = await InternalService.getFileS3(fileUrl);
      const blob = new Blob([response.data], { type: "application/zip" });
      const arrayBuffer = await blob.arrayBuffer();
      const projectData = new Uint8Array(arrayBuffer);
      scratchPostMessage(SCRATCH_POST_MESSAGE["load-project"], projectData);
    } catch (e) {}
  };

  const onToggleFullEditor = () => {
    setIsFullScreen((prev) => !prev);
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
        <div className="flex gap-2 z-[150]"></div>
      </div>
      <div className="grid md:grid-cols-[460px_1fr_460px] h-[calc(100vh-128px)] relative">
        {(!initSuccess || loading) && (
          <div className="z-10 flex items-center justify-center absolute top-0 bottom-0 right-0 left-[46px]">
            <Loader color="blue" />
          </div>
        )}
        <BoxTab activity={activity} />
        <div
          className={clsx("flex flex-col relative", {
            "opacity-0 -z-10": !initSuccess || loading,
          })}
        >
          <ActionIcon
            variant="transparent"
            size="xs"
            onClick={onToggleFullEditor}
            className={clsx("h-[30px] rounded-md w-[30px] text-white bg-[#0E2643]  z-[500]", {
              "fixed top-1.5 right-2": isFullScreen,
              "absolute top-1.5 right-2": !isFullScreen,
            })}
          >
            {isFullScreen ? <InFull className="rotate-180" /> : <ArrowCorner height={12} width={12} />}
          </ActionIcon>
          <iframe
            id="scratch-iframe"
            src={process.env.NEXT_PUBLIC_SCRATCH_URL + "?embedded=true"}
            height="100%"
            width="100%"
            className={clsx("w-full h-full overflow-auto border-none", {
              "fixed top-0 right-0 left-0 bottom-0 z-[400]": isFullScreen,
            })}
          />
          <div className="py-4 border-t flex items-center justify-center gap-2.5 bg-[#E5F0FF]">
            <div className="max-w-[540px] w-full">
              <FromRating
                contextId={shareId}
                contextType={CommentContextType.Submission}
                onSuccess={ratingQuery.refetch}
              />
            </div>
          </div>
        </div>
        <BoxReviews data={ratingQuery.data} />
      </div>
    </div>
  );
};

export default ShareScratch;
