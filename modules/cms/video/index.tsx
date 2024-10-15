import { LoadingOverlay, Tabs } from "@mantine/core";
import { Container } from "@src/components";
import { NotFound } from "@src/components/NotFound/NotFound";
import { useProfileContext } from "@src/context/Can";
import CmsService from "@src/services/CmsService/CmsService";
import { AppPagination, Button, Modal, Notify, confirmAction } from "components/cms";
import Loading from "components/cms/core/Loading/Loading";
import { CreateFormModal } from "components/cms/widgets/file-management/createFolderForm";
import { VideoEnum, VideoType } from "constants/cms/video/video.constant";
import { CourseTabs } from "modules/cms/courses/components/CourseTab";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { VideoList } from "./components/VideoList";
import { VideoOptionBar } from "./components/VideoOptionBar";
import { VideoPreview } from "./components/VideoPreview";
import { VideoForm } from "./form/VideoForm";

const breadcrumbDefault: any = [{ folderName: "Root Folder", folderId: 0 }];

//let videoStatus: number = VideoEnum.Completed;

interface queryStringProps {
  folderId?: number;
  search: any;
  videoStatus: number;
  pageIndex?: number;
  openUpload?: any;
}

const queryStringDefault = {
  search: "",
  videoStatus: VideoEnum.Completed,
};

export const Video = (props: any) => {
  const { visibleCheckbox, onChangeCheckbox, visibleDeleteBtn, pickStatus = false, getVodId } = props;
  const { t } = useTranslation();

  const router = useRouter();

  const { profile } = useProfileContext();

  const [openPreview, setOpenPreview] = useState(false);
  const [openVideoForm, setOpenVideoForm] = useState<boolean>(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [openFolderPopup, setOpenFolderPopup] = useState(false);
  const [folderNameEdit, setFolderNameEdit] = useState("");
  const [folderIdEdit, setFolderIdEdit] = useState(0);
  const [breadcrumbs, setBreadCrumbs] = useState(breadcrumbDefault);
  const [visibleUpload, setVisibleUpload] = useState(true);
  const [visibleNewFolder, setVisibleNewFolder] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [tabActive, setTabActive] = useState("0");
  const [videoType, setVideoType] = useState(1);

  const [queryString, setQueryString] = useState<queryStringProps>(queryStringDefault);

  useEffect(() => {
    if (router.isReady) {
      setIsReady(true);
      setQueryString({ ...queryStringDefault, ...router.query });
    }
  }, [router.isReady]);

  useEffect(() => {
    // handle back button in brower
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        if (as.indexOf("?") == -1) setQueryString(queryStringDefault);
        else {
          let param = as.substring(as.indexOf("?") + 1);
          let objQuery = paramsToObject(new URLSearchParams(param));
          setQueryString({ ...objQuery });
        }
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]); // Add any state variables to dependencies array if needed.

  useEffect(() => {
    if (isReady) {
      setOpenVideoForm(queryString?.openUpload === "true");
      if (!pickStatus) {
        const params = convertQueryStringToParams(queryString);
        router.push("/cms/video", { pathname: "/cms/video", query: params }, { shallow: true });
      }
      const query = convertQueryStringToPushApi(queryString);

      setTabActive(queryString?.videoStatus == 0 ? "0" : "1");
      fetchData(query);
    }
  }, [queryString]);

  const fetchData = (params?: any) => {
    setLoading(true);
    CmsService.antVideo(params)
      .then((data) => data?.data)
      .then((res) => {
        setData(res);
        if (res?.breadcrumbs?.length > 0) {
          setBreadCrumbs([...breadcrumbDefault, ...res?.breadcrumbs]);
          let lastItemBreadCrumb = res?.breadcrumbs.slice(-1).pop();
          setVisibleUpload(profile?.userId == lastItemBreadCrumb?.ownerId ?? false);
          setVisibleNewFolder(profile?.userId == lastItemBreadCrumb?.ownerId ?? false);
        } else {
          setBreadCrumbs(breadcrumbDefault);
          setVisibleUpload(true);
          setVisibleNewFolder(true);
        }
        setLoading(false);
      });
  };

  // Handle Search
  const onFilter = (values: any) => {
    const { filter } = values;
    setQueryString({
      ...queryString,
      search: filter?.trim() || "",
      pageIndex: 1,
    });
  };

  const tabOnchange = (value: any) => {
    const videoStatus = value == "1" ? 1 : 0;
    setQueryString({ ...queryString, videoStatus, search: "" });
  };

  const setQueryStringOnUploadClose = () => {
    setQueryString({
      ...queryString,
      pageIndex: 0,
      search: "",
      openUpload: false,
    });
  };

  // Handle form
  const saveUploadVideo = (values: any) => {
    setUploading(true);
    let form = new FormData();
    form.append("file", values.file);
    form.append("filename", values.name);
    if (queryString?.folderId) form.append("folderId", queryString?.folderId.toString());
    CmsService.uploadAntVideo(form).then((response) => {
      if (response) {
        setQueryStringOnUploadClose();
        setOpenVideoForm(false);
        setUploading(false);
      } else setUploading(false);
    });
  };

  const onDeleteItem = (id: any) => {
    const onConfirm = () =>
      CmsService.deleteFolder(id).then((data) => {
        if (data) {
          setQueryString({ ...queryString });
          Notify.success("Delete folder successfully");
        }
      });
    confirmAction({
      message: t("Are you sure to delete this item?"),
      onConfirm,
    });
  };

  // Handle video preview
  const onOpenPreview = (id: any) => {
    setOpenPreview(true);
    id &&
      CmsService.antVideoById(id)
        .then((data: any) => data?.data)
        .then((res: any) => {
          const url = res?.previewFilePath;
          url && setVideoPreviewUrl(url);
        });
  };

  const goToUpload = () => {
    const url = queryString?.folderId
      ? `/cms/video?openUpload=true&folderId=${queryString?.folderId}`
      : `/cms/video?openUpload=true`;
    window.open(url, "_blank");
  };

  const closeVideoForm = () => {
    setOpenVideoForm(false);
    setQueryString({ ...queryString, openUpload: false });
  };

  // Handle page
  const onChangePage = (page: number) => {
    setQueryString({ ...queryString, pageIndex: page });
  };

  const onFolderChange = (folderId: any) => {
    setQueryString({
      ...queryString,
      folderId,
      pageIndex: 0,
      videoStatus: VideoEnum.Completed,
      search: "",
    });
  };

  const onbreadcrumbsOnclick = (item: any) => {
    if (item?.folderId != 0) {
      onFolderChange(item?.folderId);
    } else setQueryString(queryStringDefault);
  };

  const createFolder = (value: any) => {
    if (folderIdEdit > 0) {
      // Case edit
      let data = {
        FileOrFolderId: folderIdEdit,
        name: value?.folderName,
        Type: videoType,
      };
      CmsService.editFolder(data).then((response) => {
        if (response) {
          resetCloseFolderPopup();
          resetDefault();
          Notify.success(`Update ${videoType == VideoType.Video ? "video" : "folder"} successfully`);
        }
      });
    } // Case add new
    else {
      let data = queryString?.folderId
        ? { FolderId: queryString?.folderId, name: value?.folderName }
        : { name: value?.folderName };
      CmsService.createFolder(data).then((response) => {
        if (response) {
          resetCloseFolderPopup();
          resetPage();
          Notify.success("Add folder successfully");
        }
      });
    }
  };

  const resetCloseFolderPopup = () => {
    setOpenFolderPopup(false);
    setFolderIdEdit(0);
    setFolderNameEdit("");
    // resetDefault();
  };

  const resetPage = () => {
    setQueryString({ ...queryString, pageIndex: 1 });
  };

  const resetDefault = () => {
    setQueryString({ ...queryString, search: "" });
  };

  const onAddNewFolder = () => {
    setOpenFolderPopup(true);
  };

  const onEditNewFolder = (id: any, folderName: any, type: any) => {
    setFolderNameEdit(folderName);
    setFolderIdEdit(id);
    setVideoType(type);
    setOpenFolderPopup(true);
  };

  const getVodIdChange = (vodId: any) => {
    getVodId && getVodId(vodId);
  };

  const renderVideoList = (data: any, videoStatus?: number) => {
    return (
      <>
        <FilterBar data={{ filter: queryString?.search?.trim() }} onFilter={onFilter} onReset={resetDefault} />
        {data && data.listData.length > 0 ? (
          <VideoList
            data={data?.listData}
            onOpenPopup={onOpenPreview}
            onDeleteItem={onDeleteItem}
            visibleCheckbox={visibleCheckbox}
            onChangeCheckboxItem={onChangeCheckbox}
            uploadStatus={videoStatus}
            onFolderChange={onFolderChange}
            visibleDeleteBtn={visibleDeleteBtn}
            getVodId={getVodIdChange}
            onEditItem={onEditNewFolder}
          />
        ) : (
          <NotFound size="page" className="mt-10">
            {t("No Video")}
          </NotFound>
        )}

        {data && data.listData.length > 0 && (
          <div className="mt-4">
            <AppPagination
              onChange={onChangePage}
              pageIndex={data.pageIndex}
              pageSize={data.pageSize}
              currentPageSize={data.listData.length < data.pageSize ? data.listData.length : data.pageSize}
              totalItems={data.totalItems}
              totalPages={data.totalPages}
              label={data.totalItems > 1 ? t("items") : t("item")}
            />
          </div>
        )}
        {!pickStatus && (
          <Modal title={t("Upload video")} size="lg" opened={openVideoForm} onClose={closeVideoForm}>
            <VideoForm saveUploadVideo={saveUploadVideo} onDiscard={closeVideoForm} />
            <Loading visible={uploading}></Loading>
          </Modal>
        )}

        <Modal title={t("Video preview")} size="xl" opened={openPreview} onClose={() => setOpenPreview(false)}>
          <VideoPreview url={videoPreviewUrl} />
        </Modal>
      </>
    );
  };

  const renderContent = (pickStatus: any, data: any) => {
    return (
      <div className="p-4" style={{ position: "relative" }}>
        <LoadingOverlay visible={loading} />
        {data && (
          <div className="flex gap-1 mb-4 font-semibold">
            {t("Video library")}
            <span className="text-blue-500">({data?.totalItems ? data?.totalItems : 0})</span>
          </div>
        )}

        {!pickStatus ? (
          <>
            <Tabs onTabChange={tabOnchange} value={tabActive}>
              <Tabs.List>
                <Tabs.Tab value={VideoEnum.Completed + ""}>{t("Completed")}</Tabs.Tab>
                <Tabs.Tab value={VideoEnum.Inprogress + ""}>{t("Inprogress")}</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value={VideoEnum.Completed + ""}>{renderVideoList(data, queryString.videoStatus)}</Tabs.Panel>
              <Tabs.Panel value={VideoEnum.Inprogress + ""}>
                {renderVideoList(data, queryString.videoStatus)}
              </Tabs.Panel>
            </Tabs>
          </>
        ) : (
          renderVideoList(data)
        )}
      </div>
    );
  };
  return (
    <Container size="xl">
      <div className="block md:flex gap-3 items-center">
        {pickStatus && (
          <div className="ml-auto mt-2 mb-4">
            <Button disabled={!visibleUpload} preset="primary" size="lg" onClick={goToUpload}>
              {t("Go to upload")}{" "}
            </Button>
          </div>
        )}
      </div>
      <div>
        {!pickStatus && <CourseTabs className="mb-6" />}
        <div className="relative border rounded-sm bg-white">
          <VideoOptionBar
            onAddNewFolder={onAddNewFolder}
            breadcrumbsOnclick={onbreadcrumbsOnclick}
            breadcrumbs={breadcrumbs}
            uploadClick={() => setOpenVideoForm(true)}
            visibleUpload={!pickStatus && visibleUpload}
            visibleNewFolder={!pickStatus && visibleNewFolder}
          />

          {renderContent(pickStatus, data)}
        </div>
      </div>

      <CreateFormModal
        onOpened={openFolderPopup}
        onClose={() => {
          setFolderNameEdit("");
          setOpenFolderPopup(false);
        }}
        onSubmit={createFolder}
        folderName={folderNameEdit}
        videoType={videoType == VideoType.Video ? "Video" : "Folder"}
      />
    </Container>
  );
};

const convertQueryStringToPushApi = (rootQuery: any) => {
  const query = removeEmptyParams(rootQuery);
  if (query?.pageIndex < 1) delete query.pageIndex;

  return query;
};

const convertQueryStringToParams = (rootQuery: any) => {
  const query = removeEmptyParams(rootQuery);
  if (query?.pageIndex < 1) delete query.pageIndex;

  return query;
};

const removeEmptyParams = (queryString: any) => {
  const params: any = new URLSearchParams(queryString);
  [...params.entries()].forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
    }
  });
  return paramsToObject(params);
};

const paramsToObject = (entries: any) => {
  const result: any = {};
  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
};
