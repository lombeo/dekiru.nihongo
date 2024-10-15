import { LoadingOverlay, Pagination, Tooltip } from "@mantine/core";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { PubsubTopic } from "./constant/common.constant";
import { CreateFormModal } from "./createFolderForm";
import { ListFile } from "./ListFile";
import { OptionsBar } from "./OptionsBar";
import style from "./FileManager.module.scss";
import { useTranslation } from "next-i18next";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";

interface FileManagerProps {
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

export const FileManager = (props: FileManagerProps) => {
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
    const onUpdateFolder = PubSub.subscribe(PubsubTopic.UPDATE_FOLDER, (message, data: FolderData) => {
      folderName = data.folderName;
      targetId = data.id;
      setOpenCreateForm(true);
    });
    const onDeleteFolder = PubSub.subscribe(PubsubTopic.DELETE, (message, data: FolderData) => {
      folderName = data.folderName;
      targetId = data.id;
      onDelete(targetId);
    });
    return () => {
      PubSub.unsubscribe(onUpdateFolder);
      PubSub.unsubscribe(onDeleteFolder);
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
        <Tooltip position="top" label={<span className="whitespace-pre-wrap">{t(item.folderName)}</span>}>
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
      {/*<Breadcrumbs>{breadcrumbsData}</Breadcrumbs>*/}
      <div className="file-management relative border-1 border-solid border-gray rounded-sm bg-white">
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
            <Pagination onChange={onChangePage} value={response?.pageIndex} total={response?.totalPages} />
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
