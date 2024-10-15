import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { ActivityTypeEnum, PubsubTopic } from "@src/constants/common.constant";
import { cookieEvaluate } from "@src/constants/evaluate/evaluate.constant";
import UserRole from "@src/constants/roles";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { useRouter } from "@src/hooks/useRouter";
import { ActivityCodeChanelEnum } from "@src/packages/codelearn/src/configs";
import CodingService from "@src/services/Coding/CodingService";
import { ActivityContextType } from "@src/services/Coding/types";
import _ from "lodash";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { createContext, useContext, useEffect, useState } from "react";

export interface ActivityContextProps {
  diffTime: number;
  activityId: number;
  contextId?: number;
  warehouseId?: number;
  permalink?: string;
  contextData?: any;
  contextType: number;
  activityDetails: any;
  isAdminContext: boolean;
  languagesCodeSubmitted?: any;
  codeActivity?: any;
  quizActivity?: any;
  activitiesCompleted?: any;
  activitiesFailed?: any;
  totalSubmitted?: number;
  remainRetry?: number;
  contextDetail?: any;
  fullSize?: boolean;
  onToggleFullSize?: any;
  isRunCodeSuccess?: boolean | false;
  setIsRunCodeSuccess?: (success: boolean) => void;
  fetch?: any;
  data?: any;
  isEnrolled?: boolean;
  isFetched?: boolean;
  isRunCodeTest?: boolean;
  activityType: number;
  activity?: any;
  reFetchContextData?: () => void;
  isNotStart: boolean;
  activities?: any[] | null;
  chapters?: any[] | null;
  hideSubmit: boolean;
  token: string | null;
  setHideSubmit: any;
}
export const ActivityContext = createContext<ActivityContextProps>({
  activityId: 0,
  diffTime: 0,
  activityType: ActivityTypeEnum.Code,
  contextType: ActivityContextType.Contest,
  activityDetails: undefined,
  isAdminContext: false,
  isNotStart: true,
  hideSubmit: false,
  token: "",
  setHideSubmit: null,
});

const ActivityContextProvider = (props: any) => {
  const { isRunCodeTest, contextType } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const contextId = +router.query.id || 0;
  const permalink = router.query.permalink;

  const activityType = +useNextQueryParam("activityType") || 12;
  const activityId = +useNextQueryParam("activityId") || +router.query.activityId;
  const warehouseId = +useNextQueryParam("warehouseId");
  const token = useNextQueryParam("token");
  const [data, setData] = useState<any>(null);
  const [contextData, setContextData] = useState(null);

  const [fullSize, setFullSize] = useState(false);
  const [isRunCodeSuccess, setIsRunCodeSuccess] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [diffTime, setDiffTime] = useState(0);
  const [hideSubmit, setHideSubmit] = useState(false);

  const onToggleFullSize = () => {
    setFullSize(!fullSize);
  };

  const fetch = async () => {
    setIsFetched(false);
    setData(null);
    let res: any = null;

    if (contextType === ActivityContextType.Training) {
      res = await CodingService.trainingGetCodeActivity({
        activityId: contextId,
        contextId: contextId,
        contextType: contextType,
      });
    } else if (contextType === ActivityContextType.Challenge) {
      res = await CodingService.challengeGetCodeActivity({
        activityId: activityId,
        contextId: activityId,
        contextType: contextType,
      });
      const data = res?.data?.data;
      if (data?.utcNow) {
        setDiffTime(moment().diff(convertDate(data.utcNow)));
      }
    } else if (contextType === ActivityContextType.Evaluating) {
      if (activityType === ActivityTypeEnum.Code) {
        res = await CodingService.getCodeActivityEvaluate({
          activityId: activityId,
          contextId: contextId,
          token: token,
          cookie: cookieEvaluate,
        });
      } else if (activityType === ActivityTypeEnum.Quiz) {
        res = await CodingService.getQuizActivityEvaluate({
          activityId: activityId,
          contextId: contextId,
          token: token,
          cookie: cookieEvaluate,
        });
      }
    } else if (contextType === ActivityContextType.Warehouse) {
      if (activityType === ActivityTypeEnum.Code) {
        res = await CodingService.getActivityCode({
          activityId: activityId,
          contextId: warehouseId,
          contextType: contextType,
        });
      } else if (activityType === ActivityTypeEnum.Quiz) {
        res = await CodingService.getActivityQuiz({
          activityId: activityId,
          contextId: warehouseId,
          contextType: contextType,
        });
      }
    } else {
      if (activityType === ActivityTypeEnum.Code || activityType === ActivityTypeEnum.Scratch) {
        res = await CodingService.contestGetCodeActivity({
          activityId: activityId,
          permalink: permalink,
          contextId: contextId ? contextId : null,
          contextType: contextType,
        });
      } else if (activityType === ActivityTypeEnum.Quiz) {
        res = await CodingService.contestGetQuizActivity({
          activityId: activityId,
          permalink: permalink,
          contextId: contextId ? contextId : null,
          contextType: contextType,
        });
      }
    }

    setIsFetched(true);

    const newData = res?.data?.data;
    const message = res?.data?.message;

    if (!newData && message) {
      switch (message) {
        case "Coding_102":
          confirmAction({
            message: t("You haven't registered this contest yet!. Please back."),
            title: t("Notice"),
            labelConfirm: t("Ok"),
            allowCancel: false,
            onConfirm: () => {
              router.push(contextId ? `/fights/detail/${contextId}` : "/fights");
            },
            withCloseButton: false,
          });
          break;
        case "Coding_043":
          confirmAction({
            message: t("The contest has expired. Please back."),
            title: t("Notice"),
            labelConfirm: t("Ok"),
            allowCancel: false,
            onConfirm: () => {
              router.push(contextId ? `/fights/detail/${contextId}` : "/fights");
            },
            withCloseButton: false,
          });
          break;
        case "Common_403":
        case "PERMISSION_REQUIRED":
          router.push("/403");
          Notify.error(t(message));
          break;
        default:
          Notify.error(t(message));
          break;
      }
      return;
    }

    setData(newData);
  };

  useEffect(() => {
    const onSetData = PubSub.subscribe(PubsubTopic.SET_ACTIVITY_CODE_CONTEXT, (message, e: any) => {
      setData((prev) => ({ ...prev, ...e }));
    });
    const onComplete = PubSub.subscribe(ActivityCodeChanelEnum.SUBMITSUCCESSFULLY, (message, e: any) => {
      if (e.activityId) {
        setData((prev) => ({ ...prev, activitiesCompleted: [...(prev.activitiesCompleted || []), e.activityId] }));
      }
    });
    return () => {
      PubSub.unsubscribe(onSetData);
      PubSub.unsubscribe(onComplete);
    };
  }, []);

  const fetchContextData = async () => {
    if (!contextId) return;
    let res;
    if (contextType === ActivityContextType.Contest) {
      res = await CodingService.contestDetail({
        contestId: contextId,
      });
    }
    if (contextType === ActivityContextType.Evaluating) {
      if (activityType === ActivityTypeEnum.Code) {
        res = await CodingService.getCodeActivityEvaluate({
          activityId: activityId,
          contextId: contextId,
          token: token,
          cookie: cookieEvaluate,
        });
      } else if (activityType === ActivityTypeEnum.Quiz) {
        res = await CodingService.getQuizActivityEvaluate({
          activityId: activityId,
          contextId: contextId,
          token: token,
          cookie: cookieEvaluate,
        });
      }
      setData(res?.data?.data);
    }
    const newContextData = res?.data?.data;
    if (res?.data?.success && newContextData) {
      setContextData(newContextData);
      if (newContextData.utcNow) {
        setDiffTime(moment().diff(convertDate(newContextData.utcNow)));
      }
    }
  };

  useEffect(() => {
    fetchContextData();
  }, [contextId]);

  useEffect(() => {
    fetch();
  }, [activityId]);

  const { codeActivity = {}, quizActivity = {}, totalSubmitted = 0 } = data ?? {};
  const { limitNumberSubmission = 0 } = codeActivity ?? {};
  const remainRetry = limitNumberSubmission - totalSubmitted;

  let activityDetails = codeActivity.activity;
  if (activityType === ActivityTypeEnum.Quiz) {
    activityDetails = quizActivity.activity;
  }

  let activity = codeActivity;
  if (activityType === ActivityTypeEnum.Quiz) {
    activity = quizActivity;
  }

  let isNotStart =
    contextData?.contestActivityDTOs &&
    contextData.contestActivityDTOs.some((e) => {
      const now = moment().subtract(diffTime);
      return e.startTime && e.activityId === activityId && now.isBefore(convertDate(e.startTime));
    });

  let activities = contextData?.contestActivityDTOs?.filter((e) => !e.isDeleted) || [];
  let chapters = [];
  // let hideSubmit = false;

  useEffect(() => {
    if (contextType === ActivityContextType.Evaluating) {
      setHideSubmit(!data?.allowSubmit);
      chapters = data?.contextDetail?.activitiesRelatedOfContext;
      activities = data?.contextDetail?.activitiesRelatedOfChapter?.map((act) => {
        return {
          ...act,
          activityId: act.id,
          userStatus: act.status,
          name: act.point,
        };
      });
    }

    if (contextType === ActivityContextType.Contest) {
      setHideSubmit(!data?.allowSubmit);

      const groupedBySubName = _.groupBy(activities, "subName");
      const groupedBySubNameMapped = _.flatMap(groupedBySubName, (e, key) => {
        return {
          subName: key,
          activities: e,
        };
      });
      const batches = groupedBySubNameMapped?.filter((e) => !_.isEmpty(e.subName) && e.subName !== "null");
      const activityNotInBatch = groupedBySubNameMapped?.flatMap((e) =>
        _.isEmpty(e.subName) || e.subName == "null" ? e.activities : []
      );
      activities = [...batches?.flatMap((e) => e.activities), ...activityNotInBatch];
    }
  }, [data]);

  const isContentManager = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent]);
  let isAdminContext = data?.isAdminContext || isContentManager;

  return (
    <ActivityContext.Provider
      value={{
        ...data,
        isAdminContext,
        isNotStart,
        activity,
        isRunCodeTest,
        activityId,
        warehouseId,
        contextType,
        contextId,
        permalink,
        fullSize,
        activityDetails,
        activityType,
        remainRetry,
        onToggleFullSize,
        isRunCodeSuccess,
        setIsRunCodeSuccess,
        fetch,
        data,
        isFetched,
        diffTime,
        contextData,
        activities,
        chapters,
        hideSubmit,
        setHideSubmit,
        token,
        reFetchContextData: fetchContextData,
      }}
    >
      <HeadSEO title={resolveLanguage(activity?.activity, locale)?.title} />
      {props.children}
    </ActivityContext.Provider>
  );
};
export function useActivityContext() {
  return useContext(ActivityContext);
}

export default ActivityContextProvider;
