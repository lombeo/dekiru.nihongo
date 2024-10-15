import { ActionIcon, Divider, Menu, Overlay, Tooltip } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { Checkbox } from "components/cms";
import { VideoEnum, VideoType } from "constants/cms/video/video.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { ChangeEvent } from "react";
import { Dots, Folder, Video } from "tabler-icons-react";
import style from "./video.module.scss";

interface VideoItemProps {
  data: any;
  onIconClick: Function;
  onDelete: Function;
  onChangeCheckbox: Function;
  visibleCheckbox: boolean;
  visibleDeleteBtn: boolean;
  checked: boolean;
  uploadStatus?: any;
  onFolderChange: Function;
  getVodId?: Function;
  onEdit?: Function;
  getOwnerId?: Function;
}

export const VideoItem = (props: VideoItemProps) => {
  const {
    onIconClick,
    visibleCheckbox,
    data,
    onChangeCheckbox,
    checked,
    onDelete,
    onEdit,
    uploadStatus,
    getVodId,
    onFolderChange,
    visibleDeleteBtn,
    getOwnerId,
  } = props;

  const { id, name, duration, vodId, createdOn, videoStatus, type, ownerId, ownerName } = data;
  // const [isCheckboxClick, setIsCheckboxClick] = useState(false);
  const { t } = useTranslation();

  let processing = uploadStatus == VideoEnum.Inprogress;
  if (!processing) processing = videoStatus == VideoEnum.Inprogress;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      getVodId && getVodId(vodId);
      onChangeCheckbox && onChangeCheckbox(e.target.value);
    } else {
      onChangeCheckbox && onChangeCheckbox(null);
      getVodId && getVodId(null);
    }
  };

  const onFolderClick = () => {
    onFolderChange && onFolderChange(id);
    getOwnerId && getOwnerId(ownerId);
  };

  return (
    <div className=" p-2 pl-0 ">
      <div
        id="myAnchor"
        className="flex p-2 items-center border rounded h-32 w-full relative"
        style={{ cursor: "pointer" }}
        onDoubleClick={type == VideoType.Folder ? onFolderClick : undefined}
        onClick={type == VideoType.Video ? () => onIconClick(id) : undefined}
      >
        <div className="flex justify-center w-1/5">
          {type == VideoType.Video && (
            <div className="border-0">
              <Video />
            </div>
          )}

          {type == VideoType.Folder && (
            <div className="border-0">
              <Folder />
            </div>
          )}
        </div>
        <div className="border-l pl-5 pr-5 w-4/5 items-center " style={{ minWidth: "60px" }}>
          <Tooltip
            // placement="start"
            position="bottom-start"
            className={style["video-folder-name"] + " whitespace-pre-wrap"}
            label={<span className="whitespace-pre-wrap">{name}</span>}
            // styles={(theme) => ({
            //   body: {
            //     color: theme.colors.dark[4],
            //     background: theme.colors.gray[0],
            //   },
            // })}
          >
            <div>
              <span className={style["ellipsis"] + " whitespace-pre-wrap"}>{name}</span>
            </div>
          </Tooltip>
          {!processing && (
            <>
              {type === VideoType.Video && (
                <div className="text-xs">
                  <span className="font-bold">{t("duration")}: </span> {FunctionBase.convertMsToTime(duration)}
                </div>
              )}
              <div className="text-xs">
                <span className="font-bold">{t("date")}: </span> {FunctionBase.getFormattedDate(new Date(createdOn))}
              </div>

              {ownerName && (
                <div title={ownerName} className={`text-xs ${style["ownerName"]}`}>
                  <span className="font-bold">{t("Owner")}: </span> {ownerName}
                </div>
              )}
            </>
          )}
          {processing && (
            <div className="pt-2 pb-2">
              {/* open later */}
              {/* <Progress color="green" radius="sm" size="sm" value={50} striped animate /> */}
              <span className="italic text-sm" style={{ color: "orange" }}>
                {t("Processing")}...
              </span>
              {type != VideoType.Folder && <Overlay className="rounded" opacity={0.2} color="gray" zIndex={5} />}
            </div>
          )}
        </div>
        <div className="flex flex-col h-full justify-start items-end gap-3" style={{ minWidth: "30px" }}>
          {visibleCheckbox && type != VideoType.Folder && (
            <div className="mr-1">
              <Checkbox
                checked={checked}
                disabled={false}
                value={id}
                onChange={onChange}
                onClick={(e: any) => e.stopPropagation()}
              />
            </div>
          )}
          {visibleDeleteBtn && (
            <div className="flex">
              <Menu>
                <Menu.Target>
                  <ActionIcon>
                    <Dots width={20} height={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<AppIcon name="edit" />} onClick={() => onEdit && onEdit(id, name, type)}>
                    {t(LocaleKeys["Edit"])}
                  </Menu.Item>
                  {type == VideoType.Folder && <Divider />}
                  {type == VideoType.Folder && (
                    <Menu.Item
                      color="red"
                      onClick={() => onDelete && onDelete(id)}
                      icon={<AppIcon name="delete" className="text-red-500" />}
                    >
                      {t(LocaleKeys["Delete"])}
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
