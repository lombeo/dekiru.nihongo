import Icon from "@edn/font-icons/icon";
import { ActionIcon, Divider, Image, Menu } from "@mantine/core";
import { useProfileContext } from "@src/context/Can";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { Dots } from "tabler-icons-react";
import { confirmAction } from "../common";
import { fileExtension, fileType } from "./constant/common.constant";
import classes from "./fileManagement.module.scss";
import { fileExtensionType } from "./helper/helper";
import { AppIcon } from "../../core/Icons";

export const FileItem = (props: any) => {
  const { t } = useTranslation();
  const { profile } = useProfileContext();
  const { file, onOpenFolder, onSelect, fileSelected } = props;
  const { id, type, name, url, modifiedOn } = file;
  const isFolder = type == fileType.Folder;
  const isOwner = profile?.userId == file.ownerId;
  const isAnonymous = file.ownerId == 0;
  const [selected, setSelected] = useState<boolean>(fileSelected);
  useEffect(() => {
    setSelected(fileSelected);
  }, [fileSelected]);

  const onClick = (currentFile: any) => {
    if (!isFolder) {
      onSelect(currentFile);
    }
  };

  const dbClickHandle = () => {
    if (isFolder) {
      onOpenFolder(id, isOwner || isAnonymous);
    }
  };

  const borderClass = selected ? "bg-blue-light" : "";
  const className =
    "fm-file p-2 m-1 cursor-pointer rounded-sm duration-300 hover:bg-blue-light text-center " +
    (isFolder ? "folder order-first" : "file " + borderClass);
  const title = `${name}
${t("Last modified")}: ${new Date(modifiedOn).toUTCString()}`;

  const getFileDisplay = () => {
    const fileEx = fileExtensionType(url);
    if (!fileEx) return null;
    if (fileEx.ext == fileExtension.Image && url) {
      return <Image src={url} alt={name} width={48} height={48} className="mx-auto h-12 w-12" />;
    }
    return <Icon name={fileEx.icon as any} size="lg" />;
  };

  const titleClass = classes["fm-file-name"] + " text-sm pt-1";
  const EditFolder = () => {
    PubSub.publish("UPDATE_FOLDER", {
      folderName: name,
      id: id,
    });
  };
  const DelteFolder = () => {
    const onConfirm = () => {
      PubSub.publish("DELETE", {
        folderName: name,
        id: id,
      });
    };
    confirmAction({
      message: t("Are you sure you want to delete") + " " + name + "?",
      onConfirm,
    });
  };
  return (
    <div className={className} title={title} onDoubleClick={dbClickHandle} onClick={() => onClick(file)} key={id}>
      <span className="flex items-center justify-center h-12 relative">
        {isFolder ? <AppIcon name="folder" size="lg" /> : getFileDisplay()}
        {(isOwner || isAnonymous) && (
          <div className="absolute top-0 right-0">
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <Dots width={20} height={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {isFolder && (
                  <Menu.Item icon={<Icon name="edit" />} onClick={EditFolder}>
                    {t("Rename")}
                  </Menu.Item>
                )}
                {isFolder && <Divider />}

                <Menu.Item color="red" onClick={DelteFolder} icon={<Icon name="delete" className="text-red-500" />}>
                  {t("Delete")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        )}
      </span>
      <div className={titleClass}>{name}</div>
    </div>
  );
};
