import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { Button } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { Upload } from "tabler-icons-react";

function getIconColor(status: any, theme: any) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

function ImageUploadIcon({ status, ...props }: any) {
  // if (status.accepted) {
  //   return <Check {...props} />;
  // }
  // if (status.rejected) {
  //   return <Plus {...props} />;
  // }
  return <Upload {...props} />;
}

export const ImportFileTestCase = (props: any) => {
  const { register, data, setValue, actionType } = props;
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const [listFile, setListFile] = useState<any>(data);

  const getRenderData = () => {
    return listFile ? listFile : [];
  };

  useEffect(() => {
    setListFile([]);
  }, [actionType]);
  const onChangeFiles = (data: any) => {
    const isValid = validation(data);
    if (!isValid) {
      setListFile([]);
      return;
    }
    setListFile(data);
    setValue("file", data);
  };
  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 2000) {
      Notify.error(
        t(`The attachment file size cannot exceed {{fileActtachmentLimit}}MB`, {
          fileActtachmentLimit: 2,
        })
      );
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  const onDelete = () => {
    setListFile([]);
    setValue("file", []);
  };

  return (
    <>
      <p className="mb-1">
        {t("Import file data table & test cases")} <span style={{ color: "#F03E3E" }}>*</span>
      </p>
      <Dropzone
        multiple={false}
        onDrop={(files) => onChangeFiles(files)}
        onReject={(files) => console.log("rejected files", files)}
        accept={["application/zip", "application/x-zip-compressed"]}
      >
        <Group position="center" spacing="sm" style={{ height: 24, pointerEvents: "none" }}>
          <ImageUploadIcon
          // status={status}
          // style={{
          //   width: 34,
          //   height: 24,
          //   color: getIconColor(status, theme),
          // }}
          />

          <div>
            <Text size="md" inline>
              {t(LocaleKeys["Drag and drop the file, or Browse"])}
            </Text>
          </div>
        </Group>
      </Dropzone>
      <div className="notice text-sm text-gray-primary">
        <div>
          (<span className="text-critical">*</span>) {t(LocaleKeys["File size limit"])}: 2MB
        </div>
        <div>
          (<span className="text-critical">*</span>) {t(LocaleKeys["Please drag and drop 1 file per time"])}
        </div>
      </div>
      <div className="space-y-2 mb-5">
        {getRenderData().map((x: any, idx: any) => (
          <div key={idx} className="flex justify-between items-center p-4 bg-gray-500 rounded-sm mt-2">
            <div className="truncate">
              <span className="font-semibold truncate">
                {x.name}
                <span className="font-normal italic text-sm">({(parseInt(x.size) / 1024).toFixed(2)} KB)</span>
              </span>
            </div>
            <Button
              className="ml-5"
              preset="primary"
              color="red"
              isSquare={true}
              onClick={() => onDelete()}
              size={"xs"}
            >
              <Icon name="delete" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
