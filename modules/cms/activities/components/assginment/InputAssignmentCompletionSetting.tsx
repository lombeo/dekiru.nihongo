import { Switch } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

export const InputAssignmentCompletionSetting = (props: any) => {
  const { register } = props;
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
              <label className="text-sm font-semibold">{t(LocaleKeys["View question"])}</label>
              <label className="font-normal text-sm">
                {t(LocaleKeys.D_ACTIVITY_LABEL_STUDENT_MUST_DO_SPECIFIC_TO_COMPLETE, {
                  name: t(LocaleKeys["View"]).toLowerCase(),
                })}
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <Switch size="md" {...register("settings.viewRequired")} />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">{t(LocaleKeys["Require submission"])}</label>
              <label className="font-normal text-sm">
                {t(LocaleKeys.D_ACTIVITY_LABEL_STUDENT_MUST_DO_SPECIFIC_TO_COMPLETE, {
                  name: t(LocaleKeys["Submit"]).toLowerCase(),
                })}
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <Switch size="md" {...register("settings.submissionRequired")} />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">{t(LocaleKeys["Require grade"])}</label>
              <label className="font-normal text-sm">
                {t(LocaleKeys.D_ACTIVITY_LABEL_STUDENT_MUST_DO_SPECIFIC_TO_COMPLETE, {
                  name: t(LocaleKeys["Receive grade"]).toLowerCase(),
                })}
              </label>
            </div>
          </div>
          <div className="col-span-1">
            <Switch size="md" {...register("settings.gradeRequired")} />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">{t(LocaleKeys["Require passing grade"])}</label>
              <label className="font-normal text-sm">{t(LocaleKeys["Require passing grade"])}</label>
            </div>
          </div>
          <div className="col-span-1">
            <Switch size="md" {...register("settings.passingGradeRequired")} />
          </div>
        </div>
      </div>
    </>
  );
};
