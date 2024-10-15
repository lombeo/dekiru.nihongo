import { LoadingOverlay, Tooltip } from "@mantine/core";
import { AppPagination, Breadcrumbs } from "components/cms/core";
// import { useTranslation } from "next-i18next";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { ListFile } from "./ListFile";
import { OptionsBar } from "./OptionsBar";
import { PubsubTopic } from "./constant/common.constant";
import { CreateFormModal } from "./createFolderForm";
import style from "./fileManagement.module.scss";
interface FileManagementProps {
  data: any;
  response: any;
  addFile: any;
  addFolder: any;
  openFolder: any;
  onDelete: any;
  getFiles: any;
  multiable: boolean;
  fileExtension: string;
  onSort?: Function;
  cancelLoading?: boolean;
  onSelectPageIndex: any;
}
let folderId = 0;
let prevFolderId = [0];
let folderName = "";
let targetId = 0;

interface FolderData {
  folderName: string;
  id: number;
}

const breadcrumbDefault: any = [{ folderName: "Root Folder", folderId: 0 }];

export const FileManagement = (props: FileManagementProps) => {
  const {
    data,
    response,
    addFile,
    addFolder,
    openFolder,
    onDelete,
    getFiles,
    multiable,
    fileExtension,
    onSort,
    cancelLoading,
    onSelectPageIndex,
  } = props;

  const [onLoading, setOnLoading] = useState<boolean>(true);
  const [isOwnerFolder, setOwnerFolder] = useState<boolean>(false);
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const [breadcrumbs, setBreadCrumbs] = useState(breadcrumbDefault);

  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    setOnLoading(false);
  }, [cancelLoading]);

  useEffect(() => {
    setOnLoading(false);
    PubSub.subscribe(PubsubTopic.UPDATE_FOLDER, (message, data: FolderData) => {
      folderName = data.folderName;
      targetId = data.id;
      setOpenCreateForm(true);
    });
    PubSub.subscribe(PubsubTopic.DELETE, (message, data: FolderData) => {
      folderName = data.folderName;
      targetId = data.id;
      onDelete(targetId);
    });
    return () => {
      PubSub.unsubscribe(PubsubTopic.UPDATE_FOLDER);
      PubSub.unsubscribe(PubsubTopic.DELETE);
    };
  }, [data]);

  useEffect(() => {
    if (response?.breadcrumbs?.length) {
      setBreadCrumbs([...breadcrumbDefault, ...response?.breadcrumbs]);
    } else {
      setBreadCrumbs(breadcrumbDefault);
    }
  }, [response]);

  const setLoading = () => {
    setOnLoading(true);
  };

  const onAddFile = (file: any, parentId: any) => {
    setLoading();
    addFile(file, parentId);
  };

  const reset = () => {
    folderId = 0;
    prevFolderId = [0];
    folderName = "";
    targetId = 0;
    openFolder(0);
  };

  const openFolderById = (id: number, isOwner: boolean) => {
    setLoading();
    prevFolderId.push(id);
    folderId = id;
    openFolder(id);
    setOwnerFolder(isOwner);
  };

  const goBack = () => {
    setLoading();
    prevFolderId.pop();
    folderId = prevFolderId.at(-1) || 0;
    openFolder(folderId);
  };

  const createFolder = (form: any) => {
    setLoading();
    addFolder(FunctionBase.normalizeSpace(form.folderName), targetId, folderId, closeAddFolder);
  };
  const closeAddFolder = () => {
    folderName = "";
    setOnLoading(false);
    setOpenCreateForm(false);
  };

  const onChangePage = (page: number) => {
    onSelectPageIndex(page);
  };

  const breadcrumbsFormat = (items: any, onClick: Function) => {
    return items.map((item: any, index: any) => (
      <div onClick={() => onClick(item)} key={index.toString()}>
        <Tooltip
          // placement="start"
          position="top"
          label={<span className="whitespace-pre-wrap">{t(item.folderName)}</span>}
          // styles={(theme) => ({
          //   body: {
          //     color: theme.colors.dark[4],
          //     background: theme.colors.gray[0],
          //   },
          // })}
        >
          <div className={style["ellipsis-breadcrumb"] + " cursor-pointer whitespace-pre hover:underline"}>
            {t(item.folderName)}
          </div>
        </Tooltip>
      </div>
    ));
  };

  const breadcrumbsOnclick = (item: any) => {
    if (item?.folderId != folderId) {
      openFolderById(item?.folderId, item.ownerId !== null);
    }
  };

  const breadcrumbsData = breadcrumbsFormat(breadcrumbs, breadcrumbsOnclick);

  return (
    <>
      <Breadcrumbs>{breadcrumbsData}</Breadcrumbs>
      <div className="file-management relative border rounded-sm bg-white">
        <OptionsBar
          folderId={folderId}
          addFile={onAddFile}
          openCreateForm={() => {
            targetId = 0;
            folderName = "";
            setOpenCreateForm(true);
          }}
          openPrevFolder={goBack}
          fileExt={fileExtension}
          onSort={onSort}
          isOwnerFolder={isOwnerFolder}
        />

        <ListFile listFile={data} onOpenFolder={openFolderById} getFiles={getFiles} multiable={multiable} />
        {<LoadingOverlay visible={onLoading} />}

        {data && data.length > 0 && (
          <div className="mt-4 p-3">
            <AppPagination
              onChange={onChangePage}
              pageIndex={response?.pageIndex}
              pageSize={response?.pageSize}
              currentPageSize={data.length < response?.pageSize ? data.length : response?.pageSize}
              totalItems={response?.totalItems}
              totalPages={response?.totalPages}
              label={response?.totalItems > 1 ? t("items") : t("item")}
            />
          </div>
        )}
        <CreateFormModal
          onOpened={openCreateForm}
          onClose={closeAddFolder}
          onSubmit={createFolder}
          folderName={folderName}
        />
      </div>
    </>
  );
};
