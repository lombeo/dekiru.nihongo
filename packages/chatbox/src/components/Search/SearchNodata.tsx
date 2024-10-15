import Icon from "@edn/font-icons/icon";
import { useTranslation } from "next-i18next";

const SearchNodata = () => {
  const { t } = useTranslation();

  return (
    <div className="text-gray text-center pt-4">
      <span className="text-gray-light">
        <Icon name="search" size={56} />
      </span>
      <p className="text-md">{t("Type the name of users you are searching for!")}</p>
    </div>
  );
};

export default SearchNodata;
