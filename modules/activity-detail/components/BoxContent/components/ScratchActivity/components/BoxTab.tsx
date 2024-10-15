import { Tabs } from "@mantine/core";
import { NewFile } from "@src/components/Svgr/components";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

interface BoxTabProps {
  permalink: string;
  activityId: number;
}

const BoxTab = (props: BoxTabProps) => {
  const { permalink, activityId } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const activeTab = useNextQueryParam("tab");

  const handleTabChange = (tabKey: string) => {
    router.push(
      {
        pathname: `/learning/${permalink}`,
        query: {
          tab: tabKey,
          activityId: activityId,
          activityType: ActivityTypeEnum.Scratch,
        },
      },
      null,
      {
        shallow: true,
      }
    );
  };

  return (
    <div>
      <Tabs
        classNames={{
          tab: "w-[46px] h-[60px] flex items-center justify-center",
          tabsList: "bg-navy-light5 border-r w-[46px]",
          root: "md:h-[calc(100vh_-_128px)]", // header: 68px + 60px
        }}
        value={activeTab}
        onTabChange={handleTabChange}
        orientation="vertical"
      >
        <Tabs.List>
          <Tabs.Tab
            data-tooltip-id="global-tooltip"
            data-tooltip-place="right"
            data-tooltip-content={t("Description")}
            className={activeTab === "description" ? "!bg-primary !text-[#fff] rounded-none" : ""}
            icon={<NewFile height={18} width={18} className="text-inherit" />}
            value="description"
          />
        </Tabs.List>
      </Tabs>
    </div>
  );
};

export default BoxTab;
