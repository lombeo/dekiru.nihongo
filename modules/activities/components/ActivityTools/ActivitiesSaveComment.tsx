import { Button } from "@edn/components";
import { useTranslation } from "next-i18next";
import { FileDownloadIcon, StickyNotesIcon } from "@src/components/Svgr/components";
import { Flex } from "@mantine/core";

const ActivitiesSaveComment = (props: any) => {
  const { t } = useTranslation();

  return (
    <Flex className="items-center gap-[12px]">
      <Button
        variant="white"
        size="sm"
        leftIcon={<StickyNotesIcon size="xl" />}
        className="text-gray-secondary font-normal px-0"
      >
        {t("Save comments")}
      </Button>
      <Button
        variant="white"
        size="sm"
        leftIcon={<FileDownloadIcon size="xl" />}
        className="text-gray-secondary font-normal px-0"
      >
        {t("Download")}
      </Button>
      {props.children && props.children}
    </Flex>
  );
};

export default ActivitiesSaveComment;
