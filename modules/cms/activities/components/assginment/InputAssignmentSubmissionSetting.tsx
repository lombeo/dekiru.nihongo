import { Switch, TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";

export const InputAssignmentSubmissionSetting = (props: any) => {
  const { register } = props;
  const { t } = useTranslation();

  return (
    <>
      <div>
        <label className="font-bold">{t(LocaleKeys["Submission"])}</label>
      </div>
      <div className="flex flex-col border  rounded px-4 divide-y ">
        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="text-sm font-normal">{t(LocaleKeys["Submission types"])}</label>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex flex-col gap-5">
              <Switch size="md" label="File submission" {...register("settings.allowTextSubmission")} />
              <Switch size="md" label="Online text" {...register("settings.allowFileSubmission")} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="text-sm font-normal">{t(LocaleKeys["Maximum number of upload files"])}</label>
            </div>
          </div>
          <div className="col-span-1">
            <TextInput size="sm" type="number" {...register("settings.maximumUploadFiles")} />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center py-3">
          <div className="col-span-2">
            <div className="flex flex-col">
              <label className="text-sm font-normal">{t(LocaleKeys["Maximum submission file size (MB)"])}</label>
            </div>
          </div>
          <div className="col-span-1">
            <TextInput size="sm" type="number" {...register("settings.maximumUploadFileSize")} />
          </div>
        </div>
      </div>
    </>
  );
};
