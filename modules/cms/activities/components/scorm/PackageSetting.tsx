import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Dropzone } from "@mantine/dropzone";
import { AppIcon } from "@src/components/cms/core/Icons";
import { UploadService } from "@src/services/UploadService/UploadService";
import { Button } from "components/cms";
import { fileType } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { ScormPreview } from "./ScormPreview";

interface PackageSettingProps {
  name: string;
  setValue: any;
  getUploadStatus: Function;
  packageUrl: string;
  errors: any;
  clearErrors: any;
  getLoadingPreview: any;
  activityId: number;
  disabled?: boolean;
}

const sizeLimit = 500; //MB
const maximumSize = sizeLimit * 1024 ** 2;
export const PackageSetting = (props: PackageSettingProps) => {
  const { t } = useTranslation();
  const { name, disabled, setValue, getUploadStatus, packageUrl, errors, clearErrors, getLoadingPreview, activityId } =
    props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidPakageUrl, setIsValidPakageUrl] = useState(false);

  useEffect(() => {
    getUploadStatus && getUploadStatus(isLoading);
  }, [isLoading]);

  const onChangeFiles = (files: any) => {
    if (files && checkValidate(files[0])) {
      setIsLoading(true);
      UploadService.upload(files[0], fileType.scormFile).then((x: any) => {
        if (x?.data?.data?.url) {
          setValue("settings.packageUrl", x?.data?.data?.url);
          setValue("settings.packageName", files[0]?.name);
          clearErrors("settings.packageUrl");
          setIsLoading(false);
        }
      });
    }
  };
  const checkValidate = (file: any) => {
    if (file.size > maximumSize) {
      Notify.warning(t(`File is larger than {{size}} MB`, { size: sizeLimit }));
      return false;
    }
    return true;
  };
  const onDelete = () => {
    setValue("settings.packageUrl", "");
    setValue("settings.packageName", "");
    setIsValidPakageUrl(false);
  };

  const renderContent = (packageUrl: string) => {
    if (packageUrl)
      return (
        <ScormPreview
          activityId={activityId}
          courseId={0}
          getLoadingStatus={getLoadingPreview}
          packageUrl={packageUrl}
          getPackageUrlStatus={(value: any) => setIsValidPakageUrl(value)}
        />
      );
    else
      return (
        <Dropzone
          onDrop={(files) => onChangeFiles(files)}
          accept={["application/zip", "application/x-zip-compressed"]}
          loading={isLoading}
          disabled={disabled}
          onReject={(files) => console.log("rejected files", files)}
        >
          <div className="text-center ">
            <div className="flex justify-center">
              <AppIcon size="xl" name="arrow_upload" />
            </div>
            {t("Drag and drop the file, or Browse")}
          </div>
        </Dropzone>
      );
  };

  return (
    <>
      <div>
        <label>
          {t("Attachment files")}
          <span style={{ color: "#f03e3e" }}> *</span>
        </label>
      </div>
      {renderContent(packageUrl)}
      {packageUrl && (
        <div className="space-y-2 mb-5">
          <div className="flex justify-between items-center p-4 bg-gray-500 rounded-sm mt-2">
            <span className="font-semibold mr-2">{name}</span>
            <Button preset="primary" color="red" isSquare={true} size="xs" onClick={() => onDelete()}>
              <Icon name="delete" />
            </Button>
          </div>
          {packageUrl && !isValidPakageUrl && (
            <div style={{ color: "#E20027", marginTop: "5px " }}>
              {t("Invalid SCORM file. Please select another file.")}
            </div>
          )}
        </div>
      )}
      {errors && errors?.settings?.packageUrl?.message && (
        <div style={{ color: "#E20027", marginTop: "5px " }}>{t(errors?.settings?.packageUrl?.message as any)}</div>
      )}
    </>
  );
};
