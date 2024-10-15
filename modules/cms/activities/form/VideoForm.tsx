import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { FormActionButton, Modal, Notify, Space } from "components/cms";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { ActivityHelper } from "helpers/activity.helper";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { VideoSchema } from "validations/cms/activity.schemal";
import { Video } from "../../video";
import { ActivityBaseInput } from "../components";
import { ActivityFormAction } from "../components/ActivityFormAction";
import { VideoSettingForm } from "./settings/VideoSettingForm";

export const VideoForm = (props: any) => {
  const { isNew, data, onSave, hideSubmit, onClose } = props;
  // const originDuration = data.duration || 5
  const [isInvalidVideoUrl, setIsInvalidVideoUrl] = useState(false);
  const [subtitles, setSubtitles] = useState(null);
  // const [duration, setDuration] = useState(originDuration);
  const { t } = useTranslation();

  const settings = ActivityHelper.getSettings(data);
  const defaultSettings = {
    activityType: ActivityTypeEnum.Video,
    enableFields: [],
    url: "",
    allowSkip: true,
    allowPreview: true,
    duration: 0,
    subtitles: null,
    activityId: 0,
  };

  const [vodIdSelected, setvodIdSelected] = useState(settings?.streamId || null);
  const [videoIdSelected, setVideoIdSelected] = useState(null);
  const [isStillPrevVideo, setStillPrevVideo] = useState<boolean>(false);
  const [isOpenVideoBrowse, setIsOpenVideoBrowse] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(VideoSchema),
    defaultValues: {
      ...data,
      id: data?.id ? data?.id : 0,
      title: data.title,
      description: data.description,
      duration: data?.duration || 5,
      point: data?.point || 100,
      levelId: +data?.levelId || 1,
      tags: data?.tags,
      type: ActivityTypeEnum.Video,
      activityId: 0,
      activityUsers: data ? data.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")) : [],
      settings: settings ? settings : defaultSettings,
    },
  });
  const onSaveVideoBrowse = () => {
    videoIdSelected &&
      CmsService.antVideoById(videoIdSelected)
        .then((data: any) => data?.data)
        .then((res: any) => {
          const url = res?.previewFilePath;
          if (isStillPrevVideo) {
            setValue("settings.url", "");
          }
          url && setValue("settings.url", url);
          reset({ ...getValues() });
          setIsOpenVideoBrowse(false);
        });
  };

  const onDiscard = () => {
    onClose();
  };

  useEffect(() => {
    PubSub.subscribe("INVALID_VIDEO_URL", (message: any, data: any) => {
      setIsInvalidVideoUrl(data);
    });
  }, []);

  const onSubmit = (formData: any) => {
    if (isInvalidVideoUrl || !ReactPlayer.canPlay(formData?.settings?.url)) {
      Notify.error(t("Invalid video url"));
    } else {
      formData.title = FunctionBase.normalizeSpace(formData.title);

      const requestData = FunctionBase.parseIntValue(formData.settings, []);
      const settingForm = {
        ...requestData,
        subtitles,
        streamId: vodIdSelected,
      };
      const data = ActivityHelper.getActivityIncludeSettingsData(formData, settingForm, ActivityTypeEnum.Video);
      onSave && onSave(data);
    }
  };

  const onGetVodId = (id: string) => {
    setvodIdSelected((prevId: any) => {
      setStillPrevVideo(prevId == id);
      return id;
    });
  };

  // const overrideDuration = () => {
  //   const watchDuration = watch("duration");
  //   if (watchDuration != originDuration) {
  //     return watchDuration;
  //   }
  //   return duration
  // };

  return (
    <>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <ActivityBaseInput
          watch={watch}
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          requiredDescription={false}
          disabled={hideSubmit}
        >
          <VideoSettingForm
            data={data}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
            register={register}
            control={control}
            errors={errors}
            isEdit={!isNew}
            reset={reset}
            setIsOpenVideoBrowse={setIsOpenVideoBrowse}
            getSubtitles={(values: any) => setSubtitles(values)}
            getDuration={(duration: any) => {
              if (duration) {
                // setDuration(duration);
                setValue("duration", duration);
              }
            }}
            disabled={hideSubmit}
          />
        </ActivityBaseInput>
        {!hideSubmit && <ActivityFormAction onDiscard={onDiscard} />}
      </form>
      <Modal title={t("Video browse")} size="xl" opened={isOpenVideoBrowse} onClose={() => setIsOpenVideoBrowse(false)}>
        <Video
          pickStatus={true}
          onChangeCheckbox={(value: any) => setVideoIdSelected(value)}
          visibleCheckbox={true}
          getVodId={onGetVodId}
        />
        <Space h="xl" />
        <FormActionButton
          saveDisabled={vodIdSelected ? false : true}
          onDiscard={() => setIsOpenVideoBrowse(false)}
          onSave={onSaveVideoBrowse}
        />
      </Modal>
    </>
  );
};
