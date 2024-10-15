import { Text } from "@edn/components";
import { useTranslation } from "next-i18next";

const SyllabusHead = (props: any) => {
  const { t } = useTranslation();
  return (
    <div className="py-3 px-4">
      <Text className="text-base font-semibold">{t("Schedule")}</Text>
    </div>
  );
};

export default SyllabusHead;
