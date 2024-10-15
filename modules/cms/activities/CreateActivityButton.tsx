import { Button } from "@mantine/core";
import Link from "@src/components/Link";
import { ActivityTypeEnum, menuItems } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { CreateActivityPopup } from "./CreateActivityPopup";

export const CreateActivityButton = (props?: any) => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const { t } = useTranslation();
  const { activityType } = props;

  const item = menuItems.find((i) => i.type == activityType);

  const renderButton = (type: any) => {
    if (type != ActivityTypeEnum.All && type != ActivityTypeEnum.Code) {
      return (
        <Link href={`/cms/activity/create/${type}`}>
          <Button
            size="lg"
            title={t(LocaleKeys.D_CREATE_NEW_SPECIFIC_ITEM, {
              name: t(LocaleKeys.Activity).toLowerCase(),
            })}
          >
            {t(`Create ${item?.label?.toLowerCase()}`)}
          </Button>
        </Link>
      );
    } else if (type == ActivityTypeEnum.Code) {
      return (
        <Link href={`/cms/activity-code/${type}/create`}>
          <Button size="lg">{t(`Create ${item?.label?.toLowerCase()}`)}</Button>
        </Link>
      );
    } else {
      return (
        <Button
          size="lg"
          onClick={() => {
            setIsShowPopup(true);
          }}
          title={t(LocaleKeys.D_CREATE_NEW_SPECIFIC_ITEM, {
            name: t(LocaleKeys.Activity).toLowerCase(),
          })}
        >
          {t("Create activity")}
        </Button>
      );
    }
  };

  return (
    <>
      <CreateActivityPopup isOpen={isShowPopup} onClose={() => setIsShowPopup(false)} />
      {renderButton(activityType)}
    </>
  );
};
