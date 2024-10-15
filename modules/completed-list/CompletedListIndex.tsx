import { Breadcrumbs } from "@edn/components";
import { Flex, Tabs } from "@mantine/core";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import LearningCompleted from "./components/LearningCompleted/LearningCompleted";
import TrainingCompleted from "@src/modules/completed-list/components/TrainingCompleted";
import FightsCompleted from "./components/FightsCompleted/FightCompleted";
import ChallengeCompleted from "./components/ChallengeCompleted/ChallengeCompleted";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectProfile } from "@src/store/slices/authSlice";
import { useNextQueryParam } from "@src/helpers/query-utils";

export default function CompletedListIndex() {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;

  const profile = useSelector(selectProfile);

  const [searchText, setSearchText] = useState("");
  const activeTabKey = useNextQueryParam("tab") || "learning";
  const handleChangeTab = (tabKey) => {
    router.push(
      {
        pathname: `/completed/${id ?? ""}`,
        query: {
          tab: tabKey,
        },
      },
      null,
      {
        shallow: true,
      }
    );
    setSearchText("");
  };
  return (
    <div className="pb-20">
      <Container size="lg">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Joined task"),
              },
            ]}
          />
        </Flex>
        <div className="h-[70px] bg-white pt-3">
          <Tabs value={activeTabKey} onTabChange={handleChangeTab}>
            <Tabs.List>
              <Tabs.Tab value="learning">{t("Learning")}</Tabs.Tab>
              <Tabs.Tab value="training">{t("Training")}</Tabs.Tab>
              <Tabs.Tab value="fights">{t("Fights")}</Tabs.Tab>
              <Tabs.Tab value="challenge">{t("Challenge")}</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          {/* <div className="mt-8 ml-3 px-2">
            <Input
              placeholder={`${t("Search")}...`}
              rightSection={<Search color="#65656D" className="w-5 h-5" />}
              radius="xl"
              className="lg:w-[440px]"
              value={searchText}
              onChange={(value) => {
                setSearchText(value.target.value);
              }}
            />
          </div> */}
        </div>
        {profile?.userId && (
          <>
            {activeTabKey == "learning" && <LearningCompleted searchText={searchText} id={id ?? profile.userId} />}
            {activeTabKey == "training" && <TrainingCompleted searchText={searchText} id={id ?? profile.userId} />}
            {activeTabKey == "fights" && <FightsCompleted searchText={searchText} id={id ?? profile.userId} />}
            {activeTabKey == "challenge" && <ChallengeCompleted searchText={searchText} id={id ?? profile.userId} />}
          </>
        )}
      </Container>
    </div>
  );
}
