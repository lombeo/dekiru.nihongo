import Icon from "@edn/font-icons/icon";
import { ActionIcon, Checkbox } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { DocPreview } from "components/cms/core/DocViewer";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export const InputAdditionFileItem = (props: any) => {
  const { data, onDelete, isLoading, isShowLockDownLoad = false, onChangeLockDownload, disabled } = props;
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  var fileInfor: any = "";
  if (FunctionBase.isJsonString(data.name)) {
    fileInfor = JSON.parse(data.name);
  }
  const dataName = FunctionBase.isJsonString(data.name) ? fileInfor?.name : data.name;
  const supportFilePreview = [".docx", ".pptx", ".xlsx", ".pdf", ".ppt"];

  return (
    <div className={`${isLoading ? "pointer-events-none" : ""}`}>
      <div className="bg-smoke p-4 hover:bg-gray-500">
        <div className="flex justify-between items-center">
          {supportFilePreview.some((i) => dataName.includes(i)) ? (
            <a onClick={() => setOpened(true)}>
              <span>{dataName}</span>
            </a>
          ) : (
            <a rel="noreferrer" href={data.url} target="_blank" className="">
              <span>{dataName}</span>
            </a>
          )}
          <div className="flex">
            <a rel="noreferrer" href={data.url} target="_blank" className="">
              <ActionIcon variant="outline" size="lg" radius="xl" color="blue">
                <AppIcon name="arrow_download" className="text-blue-500" />
              </ActionIcon>
            </a>
            <div className="w-1.5"></div>
            <ActionIcon
              variant="outline"
              onClick={() => onDelete(data)}
              size="lg"
              radius="xl"
              color="red"
              disabled={disabled}
            >
              <Icon name="delete" className="text-red-500" />
            </ActionIcon>
          </div>
        </div>
        {isShowLockDownLoad && isShowLockDownLoad == true ? (
          <div>
            <Checkbox
              key={data.url}
              disabled={disabled}
              onChange={(e) => onChangeLockDownload(data, e.currentTarget.checked)}
              defaultChecked={FunctionBase.isJsonString(data.name) ? fileInfor?.lockDownload : false}
              label={t("Hidden for learners")}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {data.url && (
        <DocPreview
          url={data.url}
          dataName={dataName}
          opened={opened}
          onClose={() => {
            setOpened(false);
          }}
        />
      )}
    </div>
  );
};
