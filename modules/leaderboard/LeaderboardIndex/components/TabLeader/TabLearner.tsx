import React from "react";
import TopUser from "@src/modules/leaderboard/LeaderboardIndex/components/TabLeader/components/TopUser";
import { Group, Input, Loader, Pagination } from "@mantine/core";
import TableRank from "@src/modules/leaderboard/LeaderboardIndex/components/TabLeader/components/TableRank";
import { useTranslation } from "next-i18next";

const TabLearner = (props: any) => {
  const { top, filter, isLoading, handleSearch, data, setLoadTop, setFilter } = props;
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <TopUser users={top?.listUser?.results} />

      <div className="mt-10">
        <div className="flex flex-col sm:flex-row justify-between flex-wrap gap-3">
          <Input
            placeholder={t("Search") + "..."}
            className="w-[30%] min-w-[260px]"
            value={filter.searchText}
            onChange={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="mt-8 flex justify-center">
            <Loader color="blue" />
          </div>
        ) : (
          <div>
            <div className="bg-white">
              <TableRank listRank={data?.listUser?.results} userRank={data?.userRank} searchText={filter.searchText} />
            </div>
            <Group position="center" className="mt-10">
              <Pagination
                withEdges
                color="blue"
                value={data?.listUser?.currentPage}
                total={data?.listUser?.pageCount}
                onChange={(pageIndex) => {
                  setLoadTop(false);
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: pageIndex,
                  }));
                }}
              />
            </Group>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabLearner;
