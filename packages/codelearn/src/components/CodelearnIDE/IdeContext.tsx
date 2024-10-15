import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { createContext, useContext, useEffect, useState } from "react";
import { CodelearnService } from "../../services";

export interface IdeContextProps {
  activityId: number;
  contextId: number;
  contextType: number;
  activityDetails: any;
  isAdminContext: boolean;
  languagesCodeSubmitted?: any;
  codeActivity?: any;
  activitiesCompleted?: any;
  activitiesFailed?: any;
  limitNumberSubmission?: number;
  totalSubmitted?: number;
  remainRetry?: number;
  contextDetail?: any;
  fullSize?: boolean;
  onToggleFullSize?: any;
  isRunCodeSuccess?: boolean | false;
  setIsRunCodeSuccess?: (success: boolean) => void;
  fetchCourse?: any;
  data?: any;
  permalink?: string;
  isEnrolled?: boolean;
  isFetched?: boolean;
  isRunCodePage?: boolean;
  allowPreview?: boolean;
}
export const IdeContext = createContext<IdeContextProps>({
  activityId: 0,
  contextId: 0,
  contextType: 1,
  activityDetails: undefined,
  isAdminContext: false,
});

const IdeContextProvider = (props: any) => {
  const { contextType = 1, isRunCodePage } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const { query, locale } = router;
  const { permalink, activityId: queryActivityId } = query;
  const courseId: any = FunctionBase.getParameterByName("courseId");
  const activityIdInParam: any = FunctionBase.getParameterByName("activityId");
  const activityId = isRunCodePage ? +queryActivityId : +activityIdInParam;

  const queryClient = useQueryClient();
  const queryKey = ["activity-code", activityId];

  const [fullSize, setFullSize] = useState(false);
  const [isRunCodeSuccess, setIsRunCodeSuccess] = useState(false);
  const [reload, setReload] = useState(0);

  const onToggleFullSize = () => {
    setFullSize(!fullSize);
  };

  const { data, isFetched, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      let filter = {
        activityId: activityId,
        //contextId: +contextId,
        permalink: permalink,
        contextType: contextType,
        courseId: courseId,
      };
      const res = await CodelearnService.getUserActivities(filter);
      const data = res?.data?.data;
      const message = res?.data?.message;
      if (
        data &&
        !data.isPublicView &&
        !data.isAdminContext &&
        !data.isEnrolled &&
        !data.codeActivity.activity.allowPreview
      ) {
        confirmAction({
          message: t("You have not allowed this course. Please back"),
          title: t("Notice"),
          labelConfirm: t("Ok"),
          allowCancel: false,
          onConfirm: () => {
            router.push(`/learning/${permalink}`);
          },
          withCloseButton: false,
        });
        return null;
      }
      if (!data) {
        if (message) {
          if (message === "Learn_302") {
            confirmAction({
              message: t("You have not enrolled this course. Please back"),
              title: t("Notice"),
              labelConfirm: t("Ok"),
              allowCancel: false,
              onConfirm: () => {
                router.push(`/learning/${permalink}`);
              },
              withCloseButton: false,
            });
          } else if (message === "Learn_309") {
            confirmAction({
              message: t("The course has expired. Please back"),
              title: t("Notice"),
              labelConfirm: t("Ok"),
              allowCancel: false,
              onConfirm: () => {
                router.push(`/learning/${permalink}`);
              },
              withCloseButton: false,
            });
          } else {
            Notify.error(t(message));
          }
        }
        return null;
      }
      return {
        ...data,
        contextDetail: {
          ...(data?.contextDetail || {}),
          contextPermalink: permalink,
        },
      };
    },
  });

  const { codeActivity = {}, contextDetail = {}, totalSubmitted = 0, languagesCodeSubmitted } = data ?? {};
  const { activityDetails = {}, limitNumberSubmission = 0 } = codeActivity ?? {};
  const { contextId } = contextDetail ?? {};
  const remainRetry = limitNumberSubmission - totalSubmitted;

  useEffect(() => {
    const onSetData = PubSub.subscribe(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, (message, newData: any) => {
      const data: any = queryClient.getQueryData(queryKey) || {};
      queryClient.setQueryData(queryKey, {
        ...data,
        ...newData,
      });
      setReload((prev) => (prev += 1));
    });
    const onComplete = PubSub.subscribe(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, (message, newData: any) => {
      if (newData.activityId) {
        const data: any = queryClient.getQueryData(queryKey) || {};
        queryClient.setQueryData(queryKey, {
          ...data,
          activitiesCompleted: [...(data.activitiesCompleted || []), newData.activityId],
        });
        setReload((prev) => (prev += 1));
      }
    });
    return () => {
      PubSub.unsubscribe(onSetData);
      PubSub.unsubscribe(onComplete);
    };
  }, []);

  const allowPreview = codeActivity?.activity?.allowPreview;

  return (
    <IdeContext.Provider
      value={{
        ...data,
        activityId,
        contextId,
        contextType,
        fullSize,
        activityDetails,
        contextDetail,
        remainRetry,
        onToggleFullSize,
        isRunCodeSuccess,
        setIsRunCodeSuccess,
        fetchCourse: refetch,
        languagesCodeSubmitted,
        limitNumberSubmission,
        permalink,
        data,
        isFetched,
        reload,
        isRunCodePage,
        allowPreview,
      }}
    >
      <HeadSEO title={resolveLanguage(codeActivity?.activity, locale)?.title} />
      {props.children}
    </IdeContext.Provider>
  );
};
export function useIdeContext() {
  return useContext(IdeContext);
}

export default IdeContextProvider;
