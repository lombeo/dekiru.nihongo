import { Breadcrumbs } from "@edn/components";
import { Flex, Group, Input, Loader, Pagination, Text } from "@mantine/core";
import { Container } from "@src/components";
import ContributorItem from "@src/modules/leaderboard/LeaderboardIndex/components/TabContributor/components/ContributorItem";
import CodingService from "@src/services/Coding/CodingService";
import SharingService from "@src/services/Sharing/SharingService";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Search } from "tabler-icons-react";

const ContributorIndex = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({
    pageIndex: 1,
    itemsPerPage: 20,
    searchText: "",
    fromDate: null,
    toDate: null,
    isContributor: true,
  });
  const [bloggerInfos, setBloggerInfos] = useState([]);

  const fetchBloggerInfo = async (userId) => {
    const res = await SharingService.blogGetBloggerInfo(userId);
    if (res?.data.success) {
      const data = res?.data?.data;
      setBloggerInfos(data);
    }
  };

  const { data, status } = useQuery({
    queryKey: ["leaderboardList", filter],
    queryFn: async () => {
      try {
        const res = await CodingService.leaderboardList(filter);
        const data = res?.data?.data;
        const userIds = data?.listUser?.results?.map((e) => e.userId);
        fetchBloggerInfo(userIds);
        return data;
      } catch (e) {}
      return null;
    },
  });

  if (status !== "success") {
    return (
      <div className="mt-8 flex justify-center">
        <Loader color="blue" />
      </div>
    );
  }

  const getAvatar = (data) => {
    let avatarUrl = data.avatarUrl;
    if (avatarUrl?.endsWith("/images/user-default.svg")) {
      avatarUrl = "/images/leaderboard/default-bg.png";
    }
    return avatarUrl;
  };

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
                title: t("Contributors"),
              },
            ]}
          />
        </Flex>
        <div className="mt-2 flex justify-between pb-6 flex-col md:flex-row">
          <div className="flex gap-1">
            <Text className="text-[18px] font-semibold">{t("List contributors")}</Text>
            <Text className="text-[18px] font-semibold text-orange-500">({data?.listUser?.rowCount})</Text>
          </div>
          <div>
            <Input
              className="md:w-[300px]"
              placeholder={t("Content search")}
              onKeyDown={(event: any) => {
                if (event.key === "Enter") {
                  setFilter((pre) => ({
                    ...pre,
                    searchText: event.target.value,
                  }));
                }
              }}
              onBlur={(event: any) => {
                setFilter((pre) => ({
                  ...pre,
                  searchText: event.target.value,
                }));
              }}
              icon={<Search size={20} />}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:gap-8 lg:grid-cols-5 md:grid-cols-2">
          {data?.listUser?.results?.map((data) => {
            const bloggerInfo = bloggerInfos.find((e) => e.userId === data.userId);
            return <ContributorItem key={data.userId} bloggerInfo={bloggerInfo} avatar={getAvatar(data)} data={data} />;
          })}
        </div>

        <Group position="center" className="mt-10">
          <Pagination
            withEdges
            color="blue"
            value={filter.pageIndex}
            total={data?.listUser?.pageCount}
            onChange={(pageIndex) => {
              setFilter((prev) => ({
                ...prev,
                pageIndex: pageIndex,
              }));
            }}
          />
        </Group>
      </Container>
    </div>
  );
};

export default ContributorIndex;
