import { Skeleton } from "@mantine/core";
import { Notify } from "@src/components/cms";
import { ActivityTypeEnum } from "@src/constants/cms/activity/activity.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { ActivityHelper } from "@src/helpers/activity.helper";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import { useActionPage } from "@src/hooks/useActionPage";
import CmsService from "@src/services/CmsService/CmsService";
import Loading from "components/cms/core/Loading/Loading";
import { useRouter } from "hooks/useRouter";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { AssignmentForm } from "./AssignmentForm";
import { AttachmentForm } from "./AttachmentForm";
import { CQForm } from "./CQForm";
import { FeedbackForm } from "./FeedbackForm";
import { PollForm } from "./PollForm";
import { QuizForm } from "./QuizForm";
import { ReadingForm } from "./ReadingForm";
import { ScormForm } from "./ScormForm";
import { ScratchForm } from "./ScratchForm";
import { VideoForm } from "./VideoForm";

export const ActivityForm = (props: any) => {
  const { action, actionId, onFormLoaded, onCloseModal, watch } = props;
  const [currentAction, setCurrentAction] = useState(action);
  const [loading, setLoading] = useState(false);
  const actionRouter = useActionPage();
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const { profile } = useProfileContext();

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = data?.ownerId === profile?.userId || isManagerContent;

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const sectionId = actionRouter.get("sectionId") ?? null;
  const courseId = actionRouter.get("courseId") ?? null;

  useEffect(() => {
    if (!actionId) return;
    if (action === "edit" || action === "preview") {
      fetchData();
    } else {
      setData({
        ...data,
        language: keyLocale,
        title: resolveLanguage(data, locale)?.title,
        description: resolveLanguage(data, locale)?.description,
        type: actionId,
      });
    }
  }, [actionId]);

  useEffect(() => {
    const activityName = ActivityHelper.getActivityName(data?.type);
    let titleName = "Loading...";
    if (activityName !== "undefinded activity") {
      titleName = t(`${action == "edit" ? "Edit" : "Create"} ${activityName.toLowerCase()}`);
      if (!editable) {
        titleName = t(`Activity Preview`);
      }
    }
    onFormLoaded && onFormLoaded(titleName);
  }, [data?.type, editable]);

  useEffect(() => {
    const startToken = PubSub.subscribe("UPDATE_ACTIVITY_SETTINGS", (key, data) => {
      //Set loading true
      setLoading(true);
    });
    const endToken = PubSub.subscribe("UPDATE_ACTIVITY_SETTINGS_COMPLETED", (key, data) => {
      setLoading(false);
    });
    const failToken = PubSub.subscribe("UPDATE_ACTIVITY_SETTINGS_FAILED", (key, data) => {
      setLoading(false);
      if (action == "create") {
        if (data?.quiz) CmsService.deleteActivity(data.quiz.activityId);
      }
    });

    return () => {
      PubSub.unsubscribe(startToken);
      PubSub.unsubscribe(endToken);
      PubSub.unsubscribe(failToken);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    CmsService.checkCreateActivityPermission()
  }, [])

  const fetchData = () => {
    CmsService.getActivity(actionId, true).then((x: any) => {
      if (!x) {
        onCloseModal && onCloseModal();
        PubSub.publish("ACTIVITY_CHANGED", data);
        return;
      }
      if (x.data.ownerId != profile?.userId && !isManagerContent) {
        setCurrentAction("preview");
      }

      setData({
        ...x.data,
        language: keyLocale,
        title: resolveLanguage(x.data, locale, "multiLangData")?.title,
        description: resolveLanguage(x.data, locale, "multiLangData")?.description,
      });
      // onFormLoaded && onFormLoaded(x.data)
    });
  };
  const onClose = () => {
    if (getIsNew()) {
      if (courseId && sectionId) {
        router.push(`/cms/course/${courseId}?activeSectionId=${sectionId}`);
      } else {
        router.push(`/cms/activities?activityType=${data.type}`);
      }
    } else {
      onCloseModal && onCloseModal();
    }
  };
  const getIsNew = () => {
    return data?.id ? false : true;
  };

  const onSave = (requestParams: any) => {
    let id = null;
    if (!getIsNew()) {
      id = data?.id;
    }
    return CmsService.saveOrUpdateActivityIncludeSettings(
      {
        ...requestParams,
        id: id,
        sectionId: parseInt(sectionId),
        courseId: parseInt(courseId),
      },
      sectionId && courseId
    ).then((x: any) => {
      if (x?.data) {
        onCloseModal && onCloseModal();
        onClose();
        Notify.success(t("Save activity successfully"));
      }
    });
  };

  if (action == "edit" && (!data || !data?.id)) {
    return <Skeleton />;
  }
  const WhatForm = () => {
    switch (parseInt(data.type)) {
      case ActivityTypeEnum.Scratch:
        return (
          <ScratchForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.Reading:
        return (
          <ReadingForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.CQ:
        return (
          <CQForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.Assignment:
        return (
          <AssignmentForm
            isNew={getIsNew()}
            data={data}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.Feedback:
        return (
          <FeedbackForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.File:
        return (
          <AttachmentForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.SCORM:
        return (
          <ScormForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.Quiz:
        return (
          <>
            <QuizForm
              data={data}
              isNew={getIsNew()}
              onSave={onSave}
              onClose={onClose}
              courseId={courseId}
              sectionId={sectionId}
              hideSubmit={currentAction === "preview"}
            />
            <Loading visible={loading} />
          </>
        );
      case ActivityTypeEnum.Poll:
        return (
          <PollForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
      case ActivityTypeEnum.Video:
        return (
          <VideoForm
            data={data}
            isNew={getIsNew()}
            onSave={onSave}
            onClose={onClose}
            hideSubmit={currentAction === "preview"}
          />
        );
    }
  };

  return (
    <>
      <Loading visible={loading} />
      {data && WhatForm()}
      {/* <Skeleton /> */}
    </>
  );
};

export const handleMultipleLangActivity = (data: any) => {
  const currentLang = data.language;
  let multiLangData = data.multiLangData || [];
  const langData = {
    key: currentLang,
    title: data.title,
    description: data.description,
    summary: data.summary,
  };
  const langDataOther = {
    key: currentLang == "en" ? "vn" : "en",
    title: data.title,
    description: data.description,
    summary: data.summary,
  };
  multiLangData = [...multiLangData.filter((e: any) => e.key !== currentLang), langData];
  if (multiLangData.length <= 1) {
    multiLangData = [...multiLangData, langDataOther];
  }
  multiLangData.forEach((e: any) => {
    if (_.isEmpty(e.title)) {
      e.title = data.title;
    }
    if (_.isEmpty(e.description)) {
      e.description = data.description;
    }
    if (_.isEmpty(e.summary)) {
      e.summary = data.summary;
    }
  });
  data.multiLangData = multiLangData?.filter((e: any) => !!e.key);

  return data;
};
