import { Button } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { useTranslation } from "next-i18next";

const ExportArea = (props: any) => {
  const { data, onExport, isDisabled = false, date, courseId, courseTitle } = props;
  const { t } = useTranslation();

  const handleClickOldFilter = () => {
    onExport(data?.results[0]?.id, courseId, courseTitle, date);
  };

  return (
    <>
      <Button variant="light" onClick={handleClickOldFilter} size="md" className="w-full md:w-auto">
        <Icon name="cloud-download" size={18}></Icon> <span className="pl-2">{t("Export data")}</span>
      </Button>
    </>
  );
};

export default ExportArea;
