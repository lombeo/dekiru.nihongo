import { useEffect, useState } from "react";
import { FileManagementService } from "services/file-management/file-management.services";
import { Order } from "../constant/common.constant";
// import { UploadService } from "services/upload/upload.services";

const filter = {
  id: 0,
  fileExt: "",
  pageIndex: 0,
  pageSize: 40,
  orderByFile: Order.createOn,
};
// let nextPage = 0;
let oldId = 0;
export const useFileManagementData = (FilterItem: {}): any => {
  const { id, fileExt, pageIndex, pageSize, orderByFile } = {
    ...filter,
    ...FilterItem,
  };
  const [files, setFiles] = useState<any>([]);
  const [folderId, setFolderId] = useState<number>(id);
  const [orderBy, setOrderBy] = useState<number>(orderByFile);
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [removeId, setRemoveId] = useState<number>(0);
  const [reload, setReload] = useState(false);
  const [data, setData] = useState({});
  const updateFiles = (file: any) => {
    const index = files.findIndex((item: any) => item.id === file.id);
    if (index >= 0) {
      files[index] = file;
      if (files.length > 0)
        files.sort((a: any, b: any) => a.name.localeCompare(b.name));
      setFiles([...files]);
    } else {
      const orderedFiles = [...files, ...[file]];
      if (orderedFiles.length > 0)
        orderedFiles.sort((a: any, b: any) => a.name.localeCompare(b.name));
      setFiles(orderedFiles);
      setReload(!reload);
    }
  };

  const remove = (id: number) => {
    setRemoveId(id);
  };
  useEffect(() => {
    let currentPageIndex = 0;
    let filesData = files;
    if (oldId == folderId) {
      currentPageIndex = pageIndexState;
    } else {
      if (pageIndexState != 0) {
        setPageIndexState(0);
        return;
      }
    }
    if (removeId != 0 && oldId != folderId) {
      const currentRemoveId = removeId;
      setRemoveId(0);
      if (currentPageIndex == 0 && filesData) {
        return setFiles(
          filesData.filter((item: any) => currentRemoveId != item.id)
        );
      } else {
        filesData = filesData.filter((item: any) => currentRemoveId != item.id);
      }
    }
    FileManagementService.getFiles(
      folderId,
      fileExt,
      currentPageIndex,
      pageSize,
      orderBy
    )
      .then((res: any) => {
        oldId = folderId;
        if (res.data) {
          const data = res.data;
          setData(data);
          setFiles(data.items);
        } else {
          // nextPage = 0;
          return setFiles([]);
        }
      })
      .catch(() => {
        oldId = folderId;
        return setFiles([]);
      });
  }, [folderId, fileExt, pageIndexState, pageSize, removeId, orderBy, reload]);
  return {
    files,
    data,
    updateFiles,
    setFolderId,
    remove,
    setOrderBy,
    setPageIndexState,
    setReload,
  };
};
