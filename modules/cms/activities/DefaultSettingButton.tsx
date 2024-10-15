import { AppIcon } from "@src/components/cms/core/Icons/AppIcon";
import { Button } from "components/cms";
import { activityTypes } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { DefaultActivitySettingPopup } from "./DefaultActivitySettingPopup";

export const DefaultSettingButton = (props: any) => {
  const { type } = props;
  const { t } = useTranslation();

  const [isShowPopup, setIsShowPopup] = useState(false);
  const activity: any = activityTypes.find((x: any) => x.type == type) ?? "";
  return (
    <>
      <DefaultActivitySettingPopup isOpen={isShowPopup} onClose={() => setIsShowPopup(false)} type={type} />

      <Button
        preset="secondary"
        leftIcon={<AppIcon name="settings" />}
        onClick={() => setIsShowPopup(true)}
        title={t([`Setting for ${activity?.label}`])}
        size="lg"
      >
        {t(LocaleKeys["Default setting"])}
      </Button>
    </>
  );
};
