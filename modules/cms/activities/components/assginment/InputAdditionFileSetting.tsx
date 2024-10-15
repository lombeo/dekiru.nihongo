import { Notify } from "@edn/components/Notify/AppNotification";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { UploadService } from "@src/services/UploadService/UploadService";
import { fileType } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { Upload } from "tabler-icons-react";
import { InputAdditionFileItem } from "./InputAdditionFileItem";

function ImageUploadIcon({ status, ...props }: any) {
  // if (status.accepted) {
  //   return <Check {...props} />;
  // }
  // if (status.rejected) {
  //   return <Plus {...props} />;
  // }
  return <Upload {...props} />;
}

function getIconColor(status: any, theme: any) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

const fileActtachmentLimit = process.env.NEXT_PUBLIC_FILES_MAXIMUM_ATTACHMENT_LIMIT
  ? parseInt(process.env.NEXT_PUBLIC_FILES_MAXIMUM_ATTACHMENT_LIMIT)
  : 0;

export const InputAdditionFileSetting = (props: any) => {
  const { data, onChange, disabled, isShowLockDownLoad = false } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  const [listFile, setListFile] = useState<any>(data);
  const theme = useMantineTheme();

  useEffect(() => {
    setListFile(data);
  }, [data]);

  const onUploadFile = (data: any) => {
    setIsLoading(true);
    const isValid = validation(data);
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    UploadService.upload(data[0], fileType.assignmentAttach).then((x: any) => {
      if (x?.data?.data?.url) {
        let fileInfor = JSON.stringify({
          name: data[0].name,
          lockDownload: false,
        });
        const newElement = {
          ...listFile,
          //Check type if attachment or assignment to define key name
          [isShowLockDownLoad ? fileInfor : data[0].name]: x.data.data.url,
        };
        onChange("settings.additionalFiles", newElement);
        setListFile(newElement);
        setIsLoading(false);
      }
    });
  };

  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Uploaded file size is too small or invalid, please check again"));
      isValid = false;
    } else if (file.size > 1024 * 1000 * fileActtachmentLimit) {
      Notify.error(
        t(`The attachment file size cannot exceed {{fileActtachmentLimit}}MB`, {
          fileActtachmentLimit,
        })
      );
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    if (listFile && Object.entries(listFile).length > 0) {
      Object.entries(listFile).map((item) => {
        let name = "";
        if (FunctionBase.isJsonString(item[0])) {
          name = JSON.parse(item[0]).name;
        } else {
          name = item[0];
        }
        if (file.name === name) {
          Notify.error(t("The file already exists, please delete the existed file or change the file name"));
          isValid = false;
        }
      });
    }
    return isValid;
  };

  const onDeleteAdditionFile = (data: any) => {
    let newListFile = { ...listFile };
    delete newListFile[data.name];
    onChange("settings.additionalFiles", newListFile);
    setListFile(newListFile);
  };

  const getRenderData = () => {
    if (!listFile) return [];
    return Object.entries(listFile).map(([k, v]) => {
      return {
        name: k,
        url: v,
      };
    });
  };

  const checkNumberOfFile = () => {
    if (listFile && Object.entries(listFile).length >= 5) {
      return {
        className: "cursor-not-allowed opacity-70",
        disabled: true,
      };
    }
    return {
      className: "",
      disabled: false,
    };
  };

  const dropZoneOption = checkNumberOfFile();

  const onChangeLockDownload = (data: any, value: any) => {
    let updatedValue: any = null;
    let altList: any = null;
    if (FunctionBase.isJsonString(data.name)) {
      updatedValue = JSON.parse(data.name);
      updatedValue.lockDownload = value;
      let newListFile = { ...listFile };
      //Update
      altList = Object.fromEntries(
        Object.entries(newListFile).map(([key, value]) => {
          if (key == data.name) {
            return [`${JSON.stringify(updatedValue)}`, value];
          } else {
            return [`${key}`, value];
          }
        })
      );
    } else {
      updatedValue = {
        name: data.name,
        lockDownload: value,
      };
      let newListFile = { ...listFile };
      //Update
      altList = Object.fromEntries(
        Object.entries(newListFile).map(([key, value]) => {
          if (key == data.name) {
            return [`${JSON.stringify(updatedValue)}`, value];
          } else {
            return [`${key}`, value];
          }
        })
      );
    }
    onChange("settings.additionalFiles", altList);
    setListFile(altList);
  };

  return (
    <>
      <div>
        <label>{t("Attachment files")}</label>
      </div>
      {!disabled && (
        <Dropzone
          className={dropZoneOption.className}
          disabled={dropZoneOption.disabled}
          multiple={false}
          onDrop={onUploadFile}
          loading={isLoading}
        >
          {/* {(status) => ( */}
          <Group position="center" spacing="xl" style={{ minHeight: 80, pointerEvents: "none" }}>
            <ImageUploadIcon
            // status={status}
            // style={{
            //   width: 50,
            //   height: 50,
            //   color: getIconColor(status, theme),
            // }}
            />

            <div>
              <Text size="md" inline>
                {t("Drag and drop the files, or Browse")}
              </Text>
            </div>
          </Group>
          {/* )} */}
        </Dropzone>
      )}
      <div className="notice text-sm text-gray-primary">
        <div>
          (<span className="text-critical">*</span>) {t(LocaleKeys["File size limit"])}: {fileActtachmentLimit}MB
        </div>
        <div>
          (<span className="text-critical">*</span>) {t(LocaleKeys["Maximum numbers of files to upload"])}: 5{" "}
          {t(LocaleKeys["FILES_LABEL"])}
        </div>
        <div>
          (<span className="text-critical">*</span>) {t("Please drag and drop 1 file per time")}
        </div>
      </div>
      <div className={`${isLoading ? "opacity-50 cursor-not-allowed" : "space-y-2"}`}>
        {getRenderData().map((x: any, idx: any) => (
          <InputAdditionFileItem
            isShowLockDownLoad={isShowLockDownLoad}
            data={x}
            key={idx}
            index={idx}
            onDelete={onDeleteAdditionFile}
            isLoading={isLoading}
            onChangeLockDownload={onChangeLockDownload}
            disabled={disabled}
          />
        ))}
      </div>
    </>
  );
};
