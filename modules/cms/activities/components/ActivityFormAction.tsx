//import { Button } from "components/cms";

import { Button } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";

let enable = true;
export const ActivityFormAction = (props: any) => {
  const { onDiscard, onLoadDefault, additions, disableStatus = false } = props;
  const [disabled, setDisabled] = useState(disableStatus);
  const { t } = useTranslation();

  useEffect(() => {
    setDisabled(disableStatus);
  }, [disableStatus]);

  const onSave = (e: any) => {
    if (enable) {
      //PubSub.publish(PubsubTopic.UPDATE_ACTIVITY_SETTINGS, {})
      enable = false;
      setDisabled(true);
      document.getElementById("submitform")?.click();
      setTimeout(() => {
        enable = true;
        setDisabled(false);
      }, 2000);
    }
    e.stopPropagation();
  };

  return (
    <div className={`flex ${additions ? "justify-between" : "justify-end"} gap-5 items-center`}>
      {additions && <>{additions}</>}
      <div className="flex gap-3">
        {onLoadDefault && (
          <Button variant="outline" size="md" onClick={onLoadDefault}>
            {t(LocaleKeys["Reset Setting"])}
          </Button>
        )}
        <Button variant="outline" size="md" onClick={onDiscard}>
          {t(LocaleKeys["Discard"])}
        </Button>
        <div className="bg-white" onClick={onSave}>
          <Button id="submitform" type="submit" size="md" disabled={disabled}>
            {t(LocaleKeys["Save"])}
          </Button>
        </div>
      </div>
    </div>
  );
};
