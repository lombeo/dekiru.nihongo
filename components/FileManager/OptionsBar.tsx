import { useTranslation } from "next-i18next";
import React from "react";
import { fileExtensionsObject } from "./constant/common.constant";
import { ArrowLeft, Plus, Upload } from "tabler-icons-react";
import { Select } from "@mantine/core";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Order } from "@src/constants/common.constant";

export const OptionsBar = (props: any) => {
  const { folderId, openPrevFolder, addFile, openCreateForm, fileExt, onSort, isOwnerFolder } = props;

  const getAcceptFileExtension = () => {
    const acceptEx = fileExtensionsObject.find((x: any) => x.type == fileExt);
    if (!acceptEx) {
      return "";
    }
    return acceptEx.accept;
  };

  const getAllowFileSize = () => {
    const acceptEx = fileExtensionsObject.find((x: any) => x.type == fileExt);
    if (!acceptEx) {
      return 0;
    }
    return acceptEx.maxSize;
  };

  const isValidFile = (fileType: any) => {
    const acceptedFileExt = getAcceptFileExtension();
    const maxSize = getAllowFileSize();
    const listAccept = acceptedFileExt.split(",");
    const fileTypeRaw = fileType.type.split("/");
    const fileSize = fileType.size;
    if (fileSize > maxSize * 1024 ** 2) {
      return {
        message: `Maximum file size is ${maxSize} MB`,
        isValid: false,
      };
    }
    const currentFileExtension = "." + fileTypeRaw[fileTypeRaw.length - 1];
    if (acceptedFileExt == "") {
      return true;
    }
    if (!listAccept.includes(fileType.type) && !listAccept.includes(currentFileExtension)) {
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

  const onSelectedFile = (ev: any) => {
    if (ev.target.files) {
      const currentFile = ev.target.files[0];
      const isValid: any = isValidFile(currentFile);
      if (!isValid.isValid) {
        Notify.error(isValid.message);
        return;
      }

      addFile(currentFile, folderId);
      ev.target.value = "";
    }
  };

  const onOpenPrevFolder = () => {
    if (folderId) {
      openPrevFolder();
    }
  };
  const openAddFolder = () => {
    openCreateForm();
  };
  const { t } = useTranslation();

  const optionClass =
    "fm-option rounded-sm px-4 py-2 cursor-pointer text-ink-primary flex items-center text-sm br-1 hover:bg-gray-light transition duration-300 gap-1";

  const isEditableAndDeletable = (() => {
    if (!folderId) {
      return true;
    }
    if (isOwnerFolder) {
      return true;
    }
    return false;
  })();

  return (
    <>
      <div className="fm-options-bar border-solid border-b border-gray bg-smoke flex p-1 justify-between">
        <div className="flex">
          <span
            className={optionClass + " fm-back" + (folderId ? " " : " cursor-not-allowed opacity-60")}
            onClick={onOpenPrevFolder}
            title={t("Previous")}
          >
            <ArrowLeft width={20} height={20} />
          </span>
          <span className="border-solid border-l mx-1 border-gray"></span>
          {isEditableAndDeletable && (
            <>
              <span className={optionClass} title={t("New folder")} onClick={openAddFolder}>
                <Plus width={20} height={20} />
                {t("New folder")}
              </span>
              <span className="border-solid border-l mx-1 border-gray"></span>
              <label className={optionClass} title={t("Upload")} htmlFor="fm-button-file">
                <Upload width={20} height={20} />
                {t("Upload")}
              </label>
              <input
                type="file"
                onChange={onSelectedFile}
                style={{ display: "none" }}
                id="fm-button-file"
                accept={getAcceptFileExtension()}
              />
            </>
          )}
        </div>

        <div className="flex items-center">
          {/* <div>dabc</div> */}
          <Select
            label={t("Sort by") + ": "}
            defaultValue={Order.createOn.toString()}
            className="contents"
            onChange={onSort}
            styles={{
              input: {
                width: "120px",
              },
              label: {
                fontSize: "0.875rem",
                marginBottom: 0,
                marginRight: "4px",
                fontWeight: "normal",
              },
            }}
            width={120}
            //label="Your favorite framework/library"
            size="xs"
            data={[
              { value: Order.createOn.toString(), label: t("Newest") },
              { value: Order.name.toString(), label: t("Name") },
            ]}
          />
        </div>
      </div>
    </>
  );
};
