import Icon from "@edn/font-icons/icon";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import Topic from "./components/Topic";
import { Button, Flex, Group, Input, Pagination, Select, Skeleton, Text } from "@mantine/core";
import { Breadcrumbs } from "@edn/components";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import useDebounce from "@src/hooks/useDebounce";
import SharingService from "@src/services/Sharing/SharingService";
import { NotFound } from "@src/components/Svgr/components";
import { useHasAnyRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { getAccessToken } from "@src/api/axiosInstance";

const DiscussionIndex = () => {
  const { t } = useTranslation();

  const token = getAccessToken();

  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const dispatch = useDispatch();

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    searchValue: "",
    isPublic: true,
  });
  const filterDebounce = useDebounce(filter, 1000);
  const [data, setData] = useState<any>(null);

  const fetch = async () => {
    setLoading(true);
    const res = await SharingService.getTopicList({
      ...filter,
    });

    if (res?.data?.success) {
      const data = res.data;
      setData(data);
      setLoading(false);
    }
    setLoading(false);
  };
  const checkCreate = async () => {
    const res = await SharingService.checkCreateTopic();
    if (res?.data?.success) {
      setIsCreate(res?.data?.data);
    }
  };

  useEffect(() => {
    checkCreate();
  }, []);

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
                title: t("Discussion"),
              },
            ]}
          />
        </Flex>

        <div className="flex items-start justify-between flex-col md:flex-row">
          <div className="flex items-center w-[100%] md:w-[585px]">
            <Input
              placeholder={`${t("Search")}...`}
              className="w-[370px]"
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, pageIndex: 1, pageSize: 10, searchValue: e.target.value }))
              }
            />
            {isManagerContent && (
              <Select
                data={[
                  {
                    value: "true",
                    label: t("Public"),
                  },
                  {
                    value: "false",
                    label: t("Private"),
                  },
                ]}
                size="sm"
                defaultValue="true"
                className="w-40 h-[36px]"
                onChange={(value) =>
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: 1,
                    isPublic: value == "true",
                  }))
                }
              />
            )}
          </div>

          {token ? (
            isCreate == true ? (
              <Button className="w-[145px] h-[35px] mt-3 md:mt-0" onClick={() => router.push("/discussion/post")}>
                <div className="flex gap-3">
                  <Icon name={"plus"} size={16}></Icon>
                  <Text size={14} weight={400}>
                    {t("New Topic")}
                  </Text>
                </div>
              </Button>
            ) : (
              <></>
            )
          ) : (
            <Text
              c="red"
              className="hover:underline cursor-pointer"
              onClick={() => {
                dispatch(setOpenModalLogin(true));
              }}
            >
              {t("Please login to post a new topic")}
            </Text>
          )}
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-2 mt-9">
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
          </div>
        ) : (
          <>
            {data?.data?.length > 0 ? (
              <div>
                <div className="mt-5 bg-white ">
                  {data.data.map((topic) => {
                    return <Topic key={topic.id} topic={topic} filter={filter} setFilter={setFilter} fetch={fetch} />;
                  })}
                </div>
                <Group position="center" className="mt-6">
                  <Pagination
                    withEdges
                    value={filter.pageIndex}
                    total={data.meta?.totalPage}
                    onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
                  />
                </Group>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mb-10 mt-10 bg-white py-10">
                <NotFound height={199} width={350} />
                <Text mt="lg" size="lg" fw="bold">
                  {t("No Data Found !")}
                </Text>
                <Text fw="bold">{t("Your search did not return any content.")}</Text>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default DiscussionIndex;
