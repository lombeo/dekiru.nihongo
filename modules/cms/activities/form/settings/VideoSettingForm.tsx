import { Divider, TextInput } from "@mantine/core";
import { VideoPreview } from "@src/modules/cms/video/components/VideoPreview";
import { Button } from "components/cms";
import FormCard from "components/cms/core/FormCard/FormCard";
import { RequiredLabel } from "components/cms/core/RequiredLabel";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { VideoSubtitle } from "../../components/VideoSubtitle";

function isValidHttpUrl(string = "") {
  var expression = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?%#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  var regex = new RegExp(expression);
  return string.match(regex);
}

export const VideoSettingForm = (props: any) => {
  const { watch, register, errors, isEdit, setIsOpenVideoBrowse, getSubtitles, getDuration, disabled } = props;
  const { t } = useTranslation();
  const [isShowIframe, setIsShowIframe] = useState(isEdit);
  const [isUrlPublic, setIsUrlPublic] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const urlValue = watch("settings.url");
  useEffect(() => {
    setIsShowIframe(isValidHttpUrl(urlValue));
    if (urlValue?.includes(".m3u8") || urlValue?.includes(".mp4")) setIsUrlPublic(false);
    else setIsUrlPublic(true);
  }, [urlValue]);

  const renderVideoPreview = (url: any) => {
    return (
      <VideoPreview
        activityId={watch("settings.activityId")}
        subtitles={watch("settings.subtitles")}
        url={url}
        getDuration={(value: any) => {
          const currentValue = value > 60 ? Math.round(value / 60) : 1;
          getDuration(isFirstTime && isEdit ? null : currentValue);
          setIsFirstTime(false);
        }}
      />
    );
  };

  return (
    <>
      <FormCard
        label={<label className="font-bold">{t("Video settings")}</label>}
        className="space-y-3 border "
        padding={0}
        radius={"md"}
      >
        <FormCard.Row>
          <div className="mb-2">
            <RequiredLabel> {t("Video url")}</RequiredLabel>
          </div>
          <div className="flex items-start pb-4">
            <div className="flex-grow">
              <TextInput
                {...register("settings.url")}
                size="md"
                error={t(errors?.settings && errors?.settings?.url?.message) as any}
                autoComplete="off"
                disabled={disabled}
              />
            </div>
          </div>
          <div className=""></div>
          <Visible visible={isShowIframe}>{renderVideoPreview(watch("settings.url"))}</Visible>
          <div className="text-right pt-4">
            <Button disabled={disabled} preset="secondary" size="xs" onClick={() => setIsOpenVideoBrowse(true)}>
              {t("Browse")}
            </Button>
          </div>

          {!isUrlPublic && (
            <>
              <Divider variant="dashed" className="my-4" />
              <VideoSubtitle getSubtitles={getSubtitles} subtitlesInit={watch("settings.subtitles")} />
            </>
          )}
        </FormCard.Row>
      </FormCard>
    </>
  );
};
