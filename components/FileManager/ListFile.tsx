import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { FileItem } from "./FileItem";
import styles from "./FileManager.module.scss";

export const ListFile = (props: any) => {
  const { listFile, onOpenFolder, getFiles, multiple } = props;
  const { t } = useTranslation();

  const [selectedFiles, setSelectedFiles] = useState<Array<any>>();

  useEffect(() => {
    setSelectedFiles([]);
  }, [listFile]);

  const onSelect = (file: any) => {
    let files = new Set(selectedFiles);

    if (files?.has(file)) {
      files.delete(file);
    } else {
      if (!multiple) files.clear();
      files?.add(file);
    }

    setSelectedFiles(Array.from(files));

    getFiles && getFiles(Array.from(files));
  };

  const HasData = listFile && listFile.length > 0;
  const wrapperClass = HasData ? styles.wrapper : "flex flex-wrap no-file";

  return (
    <div className={wrapperClass}>
      {HasData ? (
        listFile.map((item: any) => {
          const selected = selectedFiles?.map((x) => x.id)?.includes(item.id);
          return (
            <FileItem
              file={item}
              key={item.id}
              onOpenFolder={onOpenFolder}
              onSelect={onSelect}
              fileSelected={selected}
            />
          );
        })
      ) : (
        <div className="p-2 w-full">{t("No file yet")}</div>
      )}
    </div>
  );
};
