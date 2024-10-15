import { useTranslation } from "next-i18next";

const NoData = () => {
  const { t } = useTranslation();
  return <li>{t("No conversations yet")}</li>;
};
export default NoData;
