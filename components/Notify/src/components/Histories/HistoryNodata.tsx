import { useTranslation } from "next-i18next";

/**
 * Case no notify
 * @returns No data text
 */
const HistoryNodata = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-full px-4">
      <h4 className="text-orange-500 font-medium mt-auto mb-auto">{t("You have no notification")}</h4>
    </div>
  );
};

export default HistoryNodata;
