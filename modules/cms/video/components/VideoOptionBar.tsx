import { Tooltip } from "@mantine/core";
import { Breadcrumbs } from "components/cms";
import { useTranslation } from "next-i18next";
import { FolderPlus, Upload } from "tabler-icons-react";
import style from "./video.module.scss";

const breadcrumbsFormat = (items: any, onClick: Function, t: any) => {
  return items.map((item: any, index: any) => (
    <div onClick={() => onClick(item)} key={index.toString()}>
      <Tooltip
        // placement="start"
        position="bottom"
        label={<span className="whitespace-pre-wrap">{t(item.folderName)}</span>}
        // styles={(theme) => ({
        //   body: {
        //     color: theme.colors.dark[4],
        //     background: theme.colors.gray[0],
        //   },
        // })}
      >
        <div className={style["ellipsis-breadcrumb"] + " cursor-pointer whitespace-pre"}>{t(item.folderName)}</div>
      </Tooltip>
    </div>
  ));
};
export const VideoOptionBar = (props: any) => {
  const { t } = useTranslation();
  const {
    breadcrumbs,
    uploadClick,
    visibleUpload = true,
    visibleNewFolder = true,
    breadcrumbsOnclick,
    onAddNewFolder,
  } = props;
  const breadcrumbsData = breadcrumbsFormat(breadcrumbs, breadcrumbsOnclick, t);

  const onUpload = () => {
    uploadClick && uploadClick();
  };
  const optionClass =
    "fm-option rounded-sm px-4 py-2 cursor-pointer text-black flex items-center  text-sm br-1 hover:bg-gray-500  transition duration-300 gap-1";
  return (
    <>
      <div
        style={{ minHeight: "45px" }}
        className="fm-options-bar border-solid border-b   bg-smoke flex p-1 justify-between"
      >
        <div className={style["video-breadcrumbs"] + " flex items-center px-4 text-sm overflow-x-scroll "}>
          <Breadcrumbs>{breadcrumbsData}</Breadcrumbs>
        </div>

        <div className="flex whitespace-nowrap">
          {visibleNewFolder && (
            <span className={optionClass} title={t("New folder")} onClick={onAddNewFolder}>
              <FolderPlus width={20} height={20} />
              <div>{t("New folder")}</div>
            </span>
          )}

          {visibleUpload && (
            <>
              <span className="border-solid border-l mx-1  "></span>
              <label className={optionClass + " text-blue-500"} title={t("Upload")} onClick={onUpload}>
                <Upload width={20} height={20} />
                {t("Upload")}
              </label>
            </>
          )}
        </div>
      </div>
    </>
  );
};
