import { Breadcrumbs } from "@edn/components";
import { Flex, Tabs } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Container } from "@src/components";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import useDebounce from "@src/hooks/useDebounce";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import TabLearner from "./components/TabLeader/TabLearner";

enum TopRankPeriod {
  Day = "0",
  Week = "1",
  Month = "2",
  Year = "3",
  AllTime = "4",
  Range = "5",
  LastWeek = "100",
}

const LeaderboardIndex = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [top, setTop] = useState([] as any);
  const [data, setData] = useState({} as any);
  const [isRange, setIsRange] = useState(false);
  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const [loadTop, setLoadTop] = useState(true);
  const [filter, setFilter] = useState<any>({
    isContributor: false,
    pageIndex: 1,
    itemsPerPage: 20,
    period: TopRankPeriod.AllTime,
    searchText: "",
    fromDate: null,
    toDate: null,
  });
  const filterDebounce = useDebounce(filter);
  const handleTabTimeChange = (value) => {
    setLoadTop(true);
    setFilter((prev) => ({
      ...prev,
      pageIndex: 1,
      period: value,
      fromDate: null,
      toDate: null,
    }));
    if (value != TopRankPeriod.Range) {
      setIsRange(false);
    } else {
      setIsRange(true);
    }
  };

  const handleSearch = (value) => {
    setFilter((pre) => ({
      ...pre,
      pageIndex: 1,
      searchText: value.target.value,
    }));
  };

  const fetch = async () => {
    const res = await CodingService.leaderboardList({
      ...filter,
      period: parseInt(filter.period),
    });
    if (res?.data?.success) {
      if (loadTop) {
        setTop(res.data.data);
        setLoadTop(false);
      }
      setData(res.data.data);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce]);

  return (
    <div className="pb-20">
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Leaders"),
              },
            ]}
          />
        </Flex>
        <div className="border-b-2 flex justify-between items-center flex-wrap md:flex-row flex-col gap-4">
          <Tabs
            color="indigo"
            variant="pills"
            defaultValue={filter.period}
            value={filter.period}
            className="inline-block bg-white h-full w-full sm:w-max"
            onTabChange={handleTabTimeChange}
          >
            <Tabs.List className="flex flex-col sm:flex-row">
              <Tabs.Tab value={TopRankPeriod.AllTime} className="px-5">
                {t("All time")}
              </Tabs.Tab>
              <Tabs.Tab value={TopRankPeriod.Day} className="px-5">
                {t("Day")}
              </Tabs.Tab>
              <Tabs.Tab value={TopRankPeriod.Week} className="px-5">
                {t("Week")}
              </Tabs.Tab>
              <Tabs.Tab value={TopRankPeriod.Month} className="px-5">
                {t("Month")}
              </Tabs.Tab>
              <Tabs.Tab value={TopRankPeriod.Year} className="px-5">
                {t("Year")}
              </Tabs.Tab>
              {isManagerContent && (
                <Tabs.Tab value={TopRankPeriod.Range} className="px-5">
                  {t("Range")}
                </Tabs.Tab>
              )}
            </Tabs.List>
          </Tabs>

          {isRange == true ? (
            <div className="w-[21%] min-w-[220px] flex gap-3">
              <DateTimePicker
                onChange={(value) => {
                  setFilter({
                    ...filter,
                    fromDate: value,
                  });
                }}
                valueFormat={t("MM/DD/YYYY")}
                placeholder={t("MM/DD/YYYY")}
              />
              <DateTimePicker
                onChange={(value) => {
                  setFilter({
                    ...filter,
                    toDate: value,
                  });
                }}
                valueFormat={t("MM/DD/YYYY")}
                placeholder={t("MM/DD/YYYY")}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <TabLearner
          top={top}
          filter={filter}
          isLoading={isLoading}
          handleSearch={handleSearch}
          data={data}
          setLoadTop={setLoadTop}
          setFilter={setFilter}
        />
      </Container>
    </div>
  );
};

export default LeaderboardIndex;
