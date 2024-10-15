import { AppIcon } from "@src/components/cms/core/Icons";
import { useTranslation } from "next-i18next";

export const VideoFolder = (props: any) => {
  const { t } = useTranslation();
  const { name, getFolderSelected } = props;

  const onFolderDoubleClick = (name: any) => {
    getFolderSelected && getFolderSelected(name);
  };

  return (
    <div className="p-2 flex flex-nowrap">
      <div
        onDoubleClick={() => onFolderDoubleClick(name)}
        className="fm-file p-2 m-1 cursor-pointer rounded-sm duration-300 hover:bg-blue-light text-center folder order-first"
      >
        <div className="flex items-center justify-center h-12 relative px-10">
          <AppIcon name="folder" size="lg" />
        </div>
        <div>{name}</div>
      </div>
    </div>
  );
};
