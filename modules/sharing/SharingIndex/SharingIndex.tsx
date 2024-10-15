import { Breadcrumbs } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Card, CardSection, Flex, Image, Input, Loader, Pagination, Text } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { NotFound, UserUp } from "@src/components/Svgr/components";
import { CDN_URL } from "@src/config";
import { useProfileContext } from "@src/context/Can";
import useDebounce from "@src/hooks/useDebounce";
import SharingService from "@src/services/Sharing/SharingService";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Eye, Share } from "tabler-icons-react";
import styles from "./SharingIndex.module.scss";
import ButtonActions from "./components/ButtonActions";
import DateTag from "./components/DateTag";
import PostCard from "./components/PostCard";
import TagSharing from "./components/TagSharing";

const SharingIndex = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfileContext();
  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 10,
    searchValue: "",
    isPublish: true,
    startDate: "",
    endDate: "",
  });
  const [createBlogInfo, setCreateBlogInfo] = useState(false);
  const [isLoadingCheckCreate, setIsLoadingCheckCreate] = useState(true);
  const numberFormat = new Intl.NumberFormat();
  const checkCreate = async () => {
    const res = await SharingService.blogCheckCreateBlog();
    setIsLoadingCheckCreate(false);
    if (res?.data?.success) {
      setCreateBlogInfo(res?.data?.data);
    }
  };

  useEffect(() => {
    if (!profile) return;
    checkCreate();
  }, [profile?.userId]);

  const filterDebounce = useDebounce(filter, 1000);
  const fetch = async () => {
    const res = await SharingService.getBlogList(filter);
    if (res?.data?.success) {
      setData(res.data);
    }
    setLoading(false);
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
                title: t("Sharing"),
              },
            ]}
          />
        </Flex>
        <div className="flex justify-between flex-wrap gap-2">
          <div className="flex gap-2 items-center flex-wrap">
            <Input
              className="w-[100%] md:w-[510px]"
              placeholder={t("Search title, hashtag")}
              classNames={{ input: styles.input }}
              onKeyDown={(event: any) => {
                if (event.key === "Enter") {
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: 1,
                    searchValue: event.target.value,
                  }));
                }
              }}
            />
          </div>
          {profile && (
            <ButtonActions refetch={fetch} isLoading={isLoadingCheckCreate} createBlogInfo={createBlogInfo} />
          )}
        </div>
        <div className="mt-5">
          {filter.searchValue == "" &&
          filter.pageIndex == 1 &&
          filter.startDate == "" &&
          filter.endDate == "" &&
          data?.data?.length > 0 ? (
            <div>
              <div className="py-4 flex flex-col lg:flex-row">
                <div className="lg:w-[548px] w-[100%] relative border-solid shadow-xl rounded-lg">
                  <Image
                    alt=""
                    src={
                      data && isEmpty(data.data[0].imageUrl)
                        ? "/default-image.png"
                        : data.data[0]?.imageUrl?.startsWith("http")
                        ? data.data[0]?.imageUrl
                        : CDN_URL + data.data[0]?.imageUrl
                    }
                    height={367}
                    fit="fill"
                    radius={8}
                  />
                  <DateTag dateTime={data.data[0]?.publishTime} className="w-14 h-14 left-3 bottom-3" />
                </div>
                <div className="lg:w-[59%] flex flex-col justify-between">
                  <div className="lg:pl-4 pt-2 h-[85%]">
                    <div className="pl-4">
                      <Link href={`/sharing/${data.data[0].permalink}`}>
                        <Text className="font-semibold text-2xl">{data.data[0].title}</Text>
                      </Link>
                      <div className="flex items-center py-2 gap-2">
                        <Text className="text-sm text-[#5F5D5D]"> {t("Rating")}: </Text>
                        <div className="flex flex-none items-center gap-1">
                          <StarRatings rating={data?.data[0]?.rateSummary?.avgRate} />
                          <span className="text-xs pt-[4px]">
                            {(data?.data[0]?.rateSummary?.avgRate || 0).toFixed(1)}{" "}
                            <span className="text-[#a5adba]">({data?.data[0]?.rateSummary?.totalUser || 0})</span>
                          </span>
                        </div>
                      </div>
                      <TextLineCamp className="text-base mt-2]" line={2}>
                        {data.data[0].description}
                      </TextLineCamp>
                    </div>
                    <div className="flex items-center h-[15%]  gap-12 px-4">
                      <div className="flex gap-2 items-center">
                        <UserUp width={25} height={25} />
                        <ExternalLink href={`/profile/${data.data[0].ownerId}`}>
                          <Text size={14} color="#2B31CF" className="font-semibold">
                            {data.data[0].ownerName}
                          </Text>
                        </ExternalLink>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Eye size={14} color="#898989" />
                          <Text size={14} color="#898989">
                            {numberFormat.format(data.data[0].finalTotalViews)}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share size={14} color="#898989" />
                          <Text size={14} color="#898989">
                            {numberFormat.format(data.data[0].finalTotalShares)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 lg:px-8 px-4 pt-4 lg:pt-0">
                    {data.data[0].tags.map((tag) => {
                      return <TagSharing key={tag} tag={tag} />;
                    })}
                  </div>
                </div>
              </div>
              <div className="my-4">
                <Text className="text-2xl font-semibold">{t("Trend")}</Text>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mt-2">
                  {data.data.slice(1, 4).map((value) => {
                    return (
                      <Card key={value.id} shadow="xl" className="lg:w-[33%] rounded-lg">
                        <CardSection>
                          <div className="relative">
                            <Image
                              src={
                                value && isEmpty(value.imageUrl)
                                  ? "/default-image.png"
                                  : value.imageUrl?.startsWith("http")
                                  ? value.imageUrl
                                  : CDN_URL + value.imageUrl
                              }
                              height={284}
                              alt="img"
                              fit="fill"
                            />
                            <DateTag dateTime={value?.publishTime} className="w-12 h-12 left-2 bottom-2" />
                          </div>
                        </CardSection>
                        <div className="mt-4">
                          <Link href={`/sharing/${value.permalink}`}>
                            <TextLineCamp line={2} className="text-lg font-semibold min-h-[56px]">
                              {value.title}
                            </TextLineCamp>
                          </Link>
                          <div className="flex flex-none items-center gap-1 mt-1">
                            <StarRatings rating={value?.rateSummary?.avgRate} />
                            <span className="text-xs pt-[4px]">
                              {(value?.rateSummary?.avgRate || 0).toFixed(1)}{" "}
                              <span className="text-[#a5adba]">({value?.rateSummary?.totalUser || 0})</span>
                            </span>
                          </div>
                          <TextLineCamp className="mt-1 text-[#111111] text-base" line={2}>
                            {value.description}
                          </TextLineCamp>
                          <div className="flex gap-2 flex-wrap mt-4 ">
                            {value.tags.map((tag) => {
                              return <TagSharing key={tag} tag={tag} />;
                            })}
                          </div>
                        </div>
                        <Card.Section>
                          <div className="flex items-center gap-6 px-2 mt-2 pt-2 pb-4">
                            <div className="flex gap-2 items-center">
                              <UserUp width={25} height={25} />
                              <ExternalLink href={`/profile/${value.ownerId}`}>
                                <Text
                                  size={14}
                                  color="#2B31CF"
                                  className="overflow-hidden font-semibold text-ellipsis"
                                  maw={100}
                                >
                                  {value.ownerName}
                                </Text>
                              </ExternalLink>
                            </div>
                            <div className="flex gap-6">
                              <div className="flex items-center gap-2">
                                <Eye size={14} color="#898989" />
                                <Text size={14} color="#898989">
                                  {numberFormat.format(value.finalTotalViews)}
                                </Text>
                              </div>
                              <div className="flex items-center gap-2">
                                <Share size={14} color="#898989" />
                                <Text size={14} color="#898989">
                                  {numberFormat.format(value.finalTotalShares)}
                                </Text>
                              </div>
                            </div>
                          </div>
                        </Card.Section>
                      </Card>
                    );
                  })}
                </div>
              </div>
              <div>
                <Text className="text-2xl font-semibold">{t("New posts")}</Text>
                <div className="flex flex-col pt-3 gap-5">
                  {data.data.slice(4).map((blog: any) => {
                    return <PostCard key={blog.id} blog={blog} />;
                  })}
                  <div className="flex justify-center">
                    <Pagination
                      withEdges
                      value={filter.pageIndex}
                      total={data?.meta?.totalPage}
                      onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            data?.data?.length > 0 && (
              <div className="flex flex-col gap-5">
                {data.data.map((blog: any) => {
                  return <PostCard key={blog.id} blog={blog} />;
                })}
                <div className="flex justify-center">
                  <Pagination
                    withEdges
                    value={filter.pageIndex}
                    total={data?.meta?.totalPage}
                    onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
                  />
                </div>
              </div>
            )
          )}

          {data?.data?.length == 0 && !loading && (
            <div className="flex flex-col items-center justify-center mb-10 mt-10 bg-white py-10">
              <NotFound height={199} width={350} />
              <Text mt="lg" size="lg" fw="bold">
                {t("No Data Found !")}
              </Text>
              <Text fw="bold">{t("Your search did not return any content.")}</Text>
            </div>
          )}
          {loading && (
            <div className="flex justify-center mt-16">
              <Loader size={30} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
export default SharingIndex;
