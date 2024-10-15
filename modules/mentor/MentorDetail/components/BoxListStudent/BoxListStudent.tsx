import { useTranslation } from "next-i18next";

const BoxListStudent = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-md shadow-md p-5 flex flex-col">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg">{t("FEEDBACK")}</span>
        </div>
      </div>
    </div>
  );
};

export default BoxListStudent;
