import { Switch, TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

export const InputCQCompletionSetting = (props: any) => {
  const { register, watch } = props;
  const { t } = useTranslation();
  return (
    <>
      <div>
        <label className="font-bold">{t(LocaleKeys["Pass Criteria"])}</label>
      </div>
      <div className="flex flex-col border  rounded px-4 divide-y ">
        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="font-normal text-sm">{t("View question")}</label>
            </div>
          </div>
          <div className="col-span-1">
            <Switch size="md" {...register("settings.viewQuestionRequired")} />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="font-normal text-sm">{t(LocaleKeys["No. of comments posted"])}</label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex gap-3">
              <Switch size="md" {...register("settings.enabledFields.commentCountRequired")} />
              <TextInput
                size="sm"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                {...register("settings.commentCountRequired")}
                disabled={!watch("settings.enabledFields.commentCountRequired")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="font-normal text-sm">{t(LocaleKeys["No. of stars rated by others"])}</label>
            </div>
          </div>
          <div className="flex gap-3">
            <Switch size="md" {...register("settings.enabledFields.starReceivedCountRequired")} />
            <TextInput
              size="sm"
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              {...register("settings.starReceivedCountRequired")}
              disabled={!watch("settings.enabledFields.starReceivedCountRequired")}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="font-normal text-sm">{t(LocaleKeys["No. of votes"])}</label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex gap-3">
              <Switch size="md" {...register("settings.enabledFields.numberOfVoteRequired")} />
              <TextInput
                size="sm"
                onWheel={(e) => e.currentTarget.blur()}
                type="number"
                {...register("settings.numberOfVoteRequired")}
                disabled={!watch("settings.enabledFields.numberOfVoteRequired")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
