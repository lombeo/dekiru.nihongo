import { AppIcon } from "@src/components/cms/core/Icons";
import { ActionIcon, Image } from "components/cms";

interface CourseThumbnailProps {
  src: string;
  onChange: any;
}

export const CourseThumbnail = ({ src, onChange }: CourseThumbnailProps) => {
  return (
    <>
      <Image src={src} height={241} className="rounded" alt="Tesst" withPlaceholder />
      <div className="absolute bottom-3 right-6">
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          style={{ display: "none" }}
          id="contained-button-file"
        />
        <label htmlFor="contained-button-file">
          <ActionIcon component="span" variant="filled" className="bg-white text-black w-10 h-10 rounded">
            <AppIcon name="camera" />
          </ActionIcon>
        </label>
      </div>
    </>
  );
};
