import { CloseButton } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { ActionIcon, Card, Group, Image } from "components/cms";
import { useState } from "react";

interface CourseSidebarProps {
  data: any;
  src: string;
  onChangeThumbnail: any;
  onSaveThumbnail?: () => void;
  onCancelThumbnail?: () => void;
  onPublish?: () => void;
}

export const CourseSidebar = ({
  data = {},
  src,
  onChangeThumbnail: onChange,
  onSaveThumbnail,
  onCancelThumbnail,
  onPublish,
}: CourseSidebarProps) => {
  const [isEditThumbnail, setIsEditThumbnail] = useState(false);

  const onSelectImage = (e: any) => {
    setIsEditThumbnail(true);
    onChange && onChange(e);
  };

  const onClickOk = () => {
    onSaveThumbnail && onSaveThumbnail();
    setIsEditThumbnail(false);
  };

  const onClickCancel = () => {
    onCancelThumbnail && onCancelThumbnail();
    setIsEditThumbnail(false);
  };

  const defaultImg =
    "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80";

  return (
    <div className="relative md:absolute">
      <label className="text-white">Thumbnail</label>
      <Card shadow="md" padding={0} component="a" target="_blank" className="mt-2">
        <Card.Section>
          <div className="relative">
            <Image
              src={src.length > 0 ? src : defaultImg}
              height={228}
              classNames={{
                figure: "h-full",
              }}
              alt=""
            />
            <div className="absolute right-3 top-3 z-auto">
              <Group>
                {isEditThumbnail && data.id !== 0 && (
                  <>
                    <ActionIcon variant="filled" color="blue" onClick={onClickOk}>
                      <AppIcon name="checkmark" size="md" />
                    </ActionIcon>
                    <CloseButton variant="light" color="red" onClick={onClickCancel} className="ml-2"></CloseButton>
                  </>
                )}
                <label htmlFor="contained-button-file">
                  <ActionIcon component="span" variant="filled">
                    <AppIcon name="camera" />
                  </ActionIcon>
                </label>
              </Group>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={onSelectImage}
              style={{ display: "none" }}
              id="contained-button-file"
            />
          </div>
        </Card.Section>
      </Card>
    </div>
  );
};
