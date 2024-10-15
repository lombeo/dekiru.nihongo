import { clsx } from "@mantine/core";
import { Container } from "@src/components";
import useIsLgScreen from "@src/hooks/useIsLgScreen";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

interface BoxTabProps {
  data: any;
  value: string;
  onChange: (value: string) => void;
}

const BoxTab = (props: BoxTabProps) => {
  const { data, value, onChange } = props;

  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const isLgScreen = useIsLgScreen();

  let tabs = [
    {
      key: "syllabus",
      label: t("Syllabus"),
      disabled: data?.isCombo || isLgScreen,
    },
    {
      key: "comment",
      label: `${t("Comments")} ${data?.totalComment > 0 ? `(${data?.totalComment})` : ""}`,
      disabled: !profile,
    },
  ];

  tabs = tabs.filter((x) => !x.disabled);

  return (
    <div id="tab-activity" className="min-h-[52px] border-y border-[#E5E7EB] bg-white px-6">
      <Container>
        <div className="flex flex-wrap md:flex-row flex-col gap-x-10 relative">
          {tabs?.map((tab) => (
            <div
              key={tab.key}
              className={clsx(
                "min-h-[52px] font-semibold justify-center flex items-center cursor-pointer border-b-2 border-t-2 border-transparent",
                {
                  "text-navy-primary border-b-[#506CF0]": tab.key === value,
                }
              )}
              onClick={() => onChange(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BoxTab;
