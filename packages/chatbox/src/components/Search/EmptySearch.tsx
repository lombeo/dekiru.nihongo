import Icon from "@edn/font-icons/icon";
import React from "react";
import { useTranslation } from "next-i18next";

/**
 * Empty search template
 * @param isPresearch
 * @returns no result search or presearch layout.
 */
const EmptySearch = (props: any) => {
  const { isPresearch } = props;
  const { t } = useTranslation();
  return (
    <div className="text-gray text-center pt-4 ">
      <span className="text-gray-light">
        <Icon name="search" size={56} />
      </span>
      <p className="text-md">
        {isPresearch ? t("Type the name of users you are searching for!") : t("No results found") + "!"}
      </p>
    </div>
  );
};
export default EmptySearch;
