import { fileExtensionType } from "@chatbox/constants";
import { confirmAction } from "@edn/components/ModalConfirm";
import { ActionIcon, Divider, Image, Menu } from "@mantine/core";
import { PubsubTopic } from "@src/components/FileManager/constant/common.constant";
import { fileExtension, fileState } from "@src/config";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dots, Edit, Folder, Trash } from "tabler-icons-react";

export const FileItem = (props: any) => {
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  const { file, onOpenFolder, onSelect, fileSelected } = props;
  const { id, type, name, url, modifiedOn } = file;
  const isFolder = type == fileState.Folder;
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
    return <Image src={fileEx.icon as any} width={48} height={48} className="mx-auto h-12 w-12" />;
  };

  const titleClass = "line-clamp-2 text-ellipsis font-[700]" + " text-sm pt-1";
  const handleEditFolter = () => {
    PubSub.publish(PubsubTopic.UPDATE_FOLDER, {
      folderName: name,
      id: id,
    });
  };
  const handleDeleteFolder = () => {
    const onConfirm = () => {
      PubSub.publish(PubsubTopic.DELETE, {
        folderName: name,
        id: id,
      });
    };
    confirmAction({
      message: t("Are you sure you want to delete this information?"),
      onConfirm,
    });
  };

  return (
    <div className={className} title={title} onDoubleClick={dbClickHandle} onClick={() => onClick(file)} key={id}>
      <span className="flex items-center justify-center h-12 relative">
        {isFolder ? <Folder /> : getFileDisplay()}
        {(isOwner || isAnonymous) && (
          <Menu>
            <Menu.Target>
              <ActionIcon className="absolute top-0 right-0">
                <Dots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {isFolder && (
                <Menu.Item icon={<Edit height={20} width={20} />} onClick={handleEditFolter}>
                  {t("Rename")}
                </Menu.Item>
              )}
              {isFolder && <Divider />}
              <Menu.Item color="red" onClick={handleDeleteFolder} icon={<Trash height={20} width={20} color="red" />}>
                {t("Delete")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </span>
      <div className={titleClass}>{name}</div>
    </div>
  );
};
