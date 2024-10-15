import { Grid } from "@mantine/core";
import { useProfileContext } from "@src/context/Can";
import { useState } from "react";
import { VideoItem } from "./VideoItem";

interface VideoListProps {
  data: any;
  onOpenPopup: Function;
  onDeleteItem: Function;
  onChangeCheckboxItem: Function;
  visibleCheckbox: boolean;
  visibleDeleteBtn: boolean;
  uploadStatus?: number;
  onFolderChange: Function;
  getVodId?: Function;
  onEditItem?: Function;
  getItemOwnerId?: Function;
}

export const VideoList = (props: VideoListProps) => {
  const { profile } = useProfileContext();
  const {
    data,
    onOpenPopup,
    onDeleteItem,
    visibleCheckbox,
    onChangeCheckboxItem,
    onEditItem,
    uploadStatus,
    getVodId,
    onFolderChange,
    visibleDeleteBtn,
    getItemOwnerId,
  } = props;
  const [idChecked, setIdChecked] = useState(null);

  const onChangeCheckbox = (value: any) => {
    setIdChecked(value);
    onChangeCheckboxItem && onChangeCheckboxItem(value);
  };
  const getVodIdChange = (vodId: any) => {
    getVodId && getVodId(vodId);
  };

  return (
    <Grid columns={12}>
      {data &&
        data.map((item: any) => (
          <Grid.Col span={12} lg={6} xl={4} key={item.id}>
            <VideoItem
              data={item}
              uploadStatus={uploadStatus}
              checked={idChecked == item.id ?? false}
              onIconClick={onOpenPopup}
              onDelete={onDeleteItem}
              visibleCheckbox={visibleCheckbox ?? false}
              onChangeCheckbox={onChangeCheckbox}
              onFolderChange={onFolderChange}
              visibleDeleteBtn={(visibleDeleteBtn && profile?.userId == item?.ownerId) ?? false}
              getVodId={getVodIdChange}
              onEdit={onEditItem}
              getOwnerId={getItemOwnerId}
            />
          </Grid.Col>
        ))}
    </Grid>
  );
};
