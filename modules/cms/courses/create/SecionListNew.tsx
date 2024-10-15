import { NotFound } from "@src/components/NotFound/NotFound";
import { Button } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { InputSection } from "./InputSection";

interface SecionListNewProps {
  data: any;
  onRemove: any;
  onNewSession: any;
  onUpdateSectionList: any;
}
export const SecionListNew = ({ data, onRemove, onNewSession, onUpdateSectionList }: SecionListNewProps) => {
  const { t } = useTranslation();
  if (!data) {
    return <>SectionList Error</>;
  }

  const onChangeTitleSession = (id: number, val: string) => {
    let newArr = [...data];
    newArr[id] = val;
    onUpdateSectionList(newArr);
  };

  return (
    <>
      {data.length > 0 ? (
        <>
          {data.map((section: any, index: number) => {
            return (
              <div key={index} className="bg-smoke p-6 mb-5 rounded relative">
                <InputSection
                  data={section}
                  onUpdateTitle={onChangeTitleSession}
                  onRemove={() => onRemove(index)}
                  key={index}
                  index={index}
                />
              </div>
            );
          })}
        </>
      ) : (
        <NotFound size="section">
          <div className="font-normal">{t("No session in this course")}</div>
        </NotFound>
      )}
      <div className="w-full mx-auto text-center mt-6">
        <Button variant="light" onClick={onNewSession} fullWidth size="md">
          {t(LocaleKeys["Add session"])}
        </Button>
      </div>
    </>
  );
};
