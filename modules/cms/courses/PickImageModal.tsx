import { UploadService } from "@src/services/UploadService/UploadService";
import { Button, Modal, Notify } from "components/cms";
import { FileManagement } from "components/cms/widgets/file-management/FileManagement";
import {
  fileExtension,
  fileExtensionsObject,
  fileType as fileManagementType,
} from "components/cms/widgets/file-management/constant/common.constant";
import { fileExtensionType } from "components/cms/widgets/file-management/helper/helper";
import { useFileManagementData } from "components/cms/widgets/file-management/hook/fileManagement";
import { fileType } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { FileManagementService } from "services/file-management/file-management.services";
import styles from "./PickImageModal.module.scss"

export type ActivityModalProps = {};

export function PickImageModal(props: any) {
  const { t } = useTranslation();
  const { onOpen, onClose, onSelected } = props;
  const extImage = fileExtension.Image;
  const { files, data, updateFiles, setFolderId, remove, setOrderBy, setPageIndexState, setReload } =
    useFileManagementData({ fileExt: extImage });
  //const [dataFiles, setDataFiles] = useState(files);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<Array<any>>([]);

  const getAcceptFileExtension = () => {
    const acceptEx = fileExtensionsObject.find((x: any) => x.type == extImage);
    if (!acceptEx) {
      return "";
    }
    return acceptEx.accept;
  };

  const getAllowFileSize = () => {
    const acceptEx = fileExtensionsObject.find((x: any) => x.type == extImage);
    if (!acceptEx) {
      return 0;
    }
    return acceptEx.maxSize;
  };
  const isValidFile = (file: any) => {
    const acceptedFileExt = getAcceptFileExtension();
    const maxSize = getAllowFileSize();
    const listAccept = acceptedFileExt.split(",");
    const fileTypeRaw = file.type.split("/");
    const fileSize = file.size;
    if (fileSize > maxSize * 1024 ** 2) {
      return {
        message: `Maximum file size is ${maxSize} MB`,
        isValid: false,
      };
    }
    const currentFileExtension = "." + fileTypeRaw[fileTypeRaw.length - 1];
    if (acceptedFileExt == "") {
      return {
        message: "",
        isValid: true,
      };
    }
    if (!listAccept.includes(file.type) && !listAccept.includes(currentFileExtension)) {
      return {
        message: `You are only allowed to upload files with the extension ${acceptedFileExt}`,
        isValid: false,
      };
    }
    return {
      message: "",
      isValid: true,
    };
  };

  const addFile = (file: any, parentId: any) => {
    if (file != null) {
      const isValid = isValidFile(file);
      if (!isValid.isValid) {
        setCancelLoading(!cancelLoading);
        Notify.error(isValid.message);
        return;
      }
      UploadService.upload(file, fileType.thumbnailContent)
        .then((uploadRes: any) => {
          if (uploadRes?.data?.success) {
            const FileModel = fileExtensionType(uploadRes.data.data.url);
            const fileExt = FileModel ? FileModel.ext : fileExtension.Other;
            const fileData = {
              parentId: parentId ? parentId : null,
              name: file.name,
              url: uploadRes.data.data.url,
              type: 2,
              ExtensionType: fileExt,
            };
            FileManagementService.addFile(fileData).then((res: any) => {
              if (res && res.data) {
                setPageIndexState(1);
                updateFiles(res.data);
              }
            });
          }
        })
        .finally(() => {
          setCancelLoading(!cancelLoading);
        });
    }
  };
  const addFolder = (folderName: string, folderId: number, parentId: any, closeAddFolder: any) => {
    if (folderName) {
      const fileData = {
        id: folderId ? folderId : null,
        parentId: parentId ? parentId : null,
        name: folderName,
        url: "",
        type: 1,
      };
      FileManagementService.addFile(fileData).then((res: any) => {
        if (res && res.data) {
          if (fileData.id) {
            setReload(true);
            Notify.success(t("Update folder successfully"));
            setReload(false);
          } else {
            updateFiles(res.data);
            Notify.success(t("Add folder successfully"));
          }
          closeAddFolder();
        }
      });
    }
  };
  const openFolder = (folderId: number) => {
    setFolderId(folderId);
  };
  const getFiles = (listFiles: any) => {
    setSelectedFiles(listFiles);
  };

  const deleteFolder = (id: number) => {
    FileManagementService.deleteFile(id)
      .then((data) => {
        remove(id);
        return data;
      })
      .then((data) => {
        data?.data?.type == fileManagementType.File
          ? Notify.success("Delete image successfully")
          : Notify.success("Delete folder successfully");
      });
  };

  const onSort = (value: any) => {
    setOrderBy(value);
  };
  return (
    <Modal opened={onOpen} onClose={onClose} zIndex={201} title={t(LocaleKeys["Select Image"])} className={styles["modal-container"]}>
      <FileManagement
        data={files}
        response={data}
        addFile={addFile}
        addFolder={addFolder}
        onDelete={deleteFolder}
        openFolder={openFolder}
        getFiles={getFiles}
        multiable={false}
        fileExtension={extImage}
        onSort={onSort}
        cancelLoading={cancelLoading}
        onSelectPageIndex={setPageIndexState}
      />

      <div className="flex justify-end pt-3 gap-4">
        <Button preset="secondary" onClick={onClose}>
          {t("Discard")}
        </Button>
        <Button
          type="submit"
          preset="primary"
          onClick={() => onSelected(selectedFiles)}
          disabled={selectedFiles.length === 0}
        >
          {t("Select")}
        </Button>
      </div>
    </Modal>
  );
}
