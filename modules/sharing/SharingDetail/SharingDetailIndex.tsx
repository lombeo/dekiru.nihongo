import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Flex, Image, Modal, Select, Skeleton, Text } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Comment from "@src/components/Comment/Comment";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import RawText from "@src/components/RawText/RawText";
import HeadSEO from "@src/components/SEO/HeadSEO";
import StarRatings from "@src/components/StarRatings";
import { CDN_URL } from "@src/config";
import UserRole from "@src/constants/roles";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { CommentService } from "@src/services/CommentService";
import { FriendService } from "@src/services/FriendService/FriendService";
import SharingService from "@src/services/Sharing/SharingService";
import { selectProfile } from "@src/store/slices/authSlice";
import { debounce, isEmpty, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FacebookShareButton } from "react-share";
import { BrandFacebook, Eye, Pencil, Point, Share } from "tabler-icons-react";
import TagSharing from "../SharingIndex/components/TagSharing";
import Author from "./components/Author";

const SharingDetailIndex = (props: any) => {
  const { isPreview, data, refetch } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const permalink = router.query.permalink;

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const [loading, setLoading] = useState(true);
  const profile = useSelector(selectProfile);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [modalChangeAuthor, setModalChangeAuthor] = useState(false);
  const [topBloggers, setTopBloggers] = useState([]);
  const [idAuthorChange, setIdAuthorChange] = useState("");
  const skeletons = Array.from({ length: 5 }).map((_, i) => <Skeleton height={30} key={i} />);
  const handleChangeAuthor = async () => {
    const res = await SharingService.updateAuthor({
      actionBy: profile?.userId,
      blogId: data?.id,
      userId: idAuthorChange,
    });
    if (res?.data?.success) {
      setModalChangeAuthor(false);
      refetch();
    } else {
      Notify.error(t(res.data.message));
    }
  };

  const handleHide = async (value: number) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await SharingService.unOrPublishBlog({
          permalink: permalink,
          actionBy: profile?.userId,
        });
        if (res?.data?.success) {
          refetch();
        } else {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleChangeRate = async (value) => {
    const res = await CommentService.vote({
      contextId: data?.contextId,
      contextType: data?.contextType,
      point: value,
    });
    if (res?.data?.success) {
      refetch();
    } else {
      Notify.error(res?.data?.message);
    }
  };

  const handleSearchUsers = useCallback(
    debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user.userName,
            value: user.userId,
          }));
          setUserOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  const fetch = async () => {
    setLoading(true);
    const dataTopBlogger = await SharingService.getTopBloggers({ limit: 5 });
    if (dataTopBlogger?.data?.success) {
      setTopBloggers(dataTopBlogger.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [permalink]);

  return (
    <div className="pb-20">
      <HeadSEO
        title={data?.title}
        description={data?.description}
        ogImage={
          data && isEmpty(data.imageUrl)
            ? "/default-image.png"
            : data?.imageUrl?.startsWith("http")
            ? data?.imageUrl
            : CDN_URL + data?.imageUrl
        }
      />

      <Modal opened={modalChangeAuthor} onClose={() => setModalChangeAuthor(false)} title={t("Change author")} centered>
        <div className="h-36">
          <Select
            nothingFound={t("No result found")}
            data={userOptions}
            clearable
            searchable
            onSearchChange={handleSearchUsers}
            onChange={(value) => setIdAuthorChange(value)}
            label={t("Name")}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button onClick={handleChangeAuthor}>OK</Button>
          <Button variant="outline" onClick={() => setModalChangeAuthor(false)}>
            {t("Cancel")}
          </Button>
        </div>
      </Modal>
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
        <div className="flex justify-between lg:flex-row flex-col lg:gap-0 gap-10">
          <div className="lg:w-[70%]">
            <div className="bg-white rounded-md shadow-md">
              <div className="flex items-center flex-wrap gap-2 justify-between py-5 px-5 border-b-2">
                <div className="flex gap-2">
                  <Text size={12} color="#898989">
                    {t("Author")}:
                  </Text>
                  <ExternalLink href={`/profile/${data?.ownerId}`}>
                    <Text size={12} color="indigo" className="font-semibold">
                      {data?.ownerName}
                    </Text>
                  </ExternalLink>
                  <div className="flex items-center gap-1">
                    <Point color="#898989" size={14} />
                    <Text size={12} color="#898989" className="font-semibold">
                      {formatDateGMT(data?.publishTime)}
                    </Text>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <Eye size={14} color="#898989" />
                    <Text size={12} color="#898989" className="font-semibold">
                      {FunctionBase.formatNumber(data?.finalTotalViews)}
                    </Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share size={14} color="#898989" />
                    <Text size={12} color="#898989" className="font-semibold">
                      {FunctionBase.formatNumber(data?.finalTotalShares)}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-6 px-5">
                {loading ? (
                  <Skeleton height={500} />
                ) : (
                  <Image
                    src={
                      data && isEmpty(data.imageUrl)
                        ? "/default-image.png"
                        : data?.imageUrl?.startsWith("http")
                        ? data?.imageUrl
                        : CDN_URL + data?.imageUrl
                    }
                  />
                )}
                <Text className="font-semibold text-3xl my-6">{data?.title}</Text>
                <RawText className="break-words max-w-full">{data.content}</RawText>
              </div>
              <div className="flex justify-between px-5 items-center flex-col gap-2 sm:flex-row border-b-2 py-5">
                {!isPreview && (
                  <div className="flex gap-3 flex-wrap">
                    {data?.tags?.map((tag) => {
                      return <TagSharing key={tag} tag={tag} />;
                    })}
                  </div>
                )}

                {data?.isPublish && (
                  <FacebookShareButton url={`${window.location.origin}/sharing/${permalink}`}>
                    <div className="flex bg-[#1877f2] p-1 rounded-sm">
                      <BrandFacebook size={15} color="white" />
                      <Text className="text-xs text-white">{t("Share")}</Text>
                    </div>
                  </FacebookShareButton>
                )}
              </div>

              {/* <AdBanner data-ad-slot="8216056812" data-ad-format="fluid" data-ad-layout="in-article" /> */}

              {profile && (
                <div className="flex gap-2 items-center p-5">
                  {isPreview ? (
                    <StarRatings rating={data?.rateSummary?.avgRate} />
                  ) : (
                    <StarRatings rating={data?.rateSummary?.avgRate} changeRating={handleChangeRate} />
                  )}
                  <Text className="text-gray-500">{parseFloat(data?.rateSummary?.avgRate ?? 0).toFixed(1)}</Text>
                  <Text className="text-gray-500">
                    ({FunctionBase.formatNumber(data?.rateSummary?.totalUser || 0)} {t("Rating")})
                  </Text>
                </div>
              )}

              <div className="p-5">
                <Comment
                  isManager={isManagerContent}
                  contextId={data?.id}
                  contextType={data?.contextType}
                  detailedLink={router.asPath}
                  title={data?.title}
                />
              </div>
            </div>
            {data?.relatedPosts?.length > 0 && (
              <div className="bg-white rounded-md shadow-md mt-8">
                <div className="py-5 px-5">
                  <Text className="text-base text-[#333] font-semibold">{t("Related posts")}</Text>
                  {data?.relatedPosts?.map((value) => {
                    return (
                      <div key={value.id} className="flex lg:flex-row flex-col gap-4 border-b items-center py-2">
                        <div className="border">
                          <img
                            src={
                              value && isEmpty(value.imageUrl)
                                ? "/default-image.png"
                                : value?.imageUrl?.startsWith("http")
                                ? value?.imageUrl
                                : CDN_URL + value?.imageUrl
                            }
                            className="aspect-[65/45] lg:w-[160px] w-full overflow-hidden"
                          />
                        </div>
                        <div>
                          <Link href={`/sharing/${value.permalink}`}>
                            <Text className="font-semibold text-lg">{value.title}</Text>
                          </Link>
                          <StarRatings rating={value?.rateSummary?.avgRate} />
                          <TextLineCamp className="text-[#898989] text-sm mt-2]" line={2}>
                            {FunctionBase.htmlDecode(value?.content)}
                          </TextLineCamp>
                          <div className="flex flex-wrap gap-3 py-4">
                            {value?.tags?.map((tag) => {
                              return <TagSharing key={tag} tag={tag} />;
                            })}
                          </div>
                          <div className="flex items-center flex-wrap gap-4">
                            <div className="flex gap-2">
                              <Text size={12} color="#898989">
                                {t("Author")}:
                              </Text>
                              <ExternalLink href={`/profile/${value?.ownerId}`}>
                                <Text size={12} color="blue">
                                  {value?.ownerName}
                                </Text>
                              </ExternalLink>
                              <div className="flex items-center gap-1">
                                <Point color="#898989" size={14} />
                                <Text size={12} color="#898989">
                                  {formatDateGMT(value?.publishTime)}
                                </Text>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex items-center gap-1">
                                <Eye size={14} color="#898989" />
                                <Text size={12} color="#898989">
                                  {FunctionBase.formatNumber(value.finalTotalViews)}
                                </Text>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share size={14} color="#898989" />
                                <Text size={12} color="#898989">
                                  {FunctionBase.formatNumber(value.finalTotalShares)}
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-[28%] flex flex-col gap-7">
            {(data?.isEdit || data?.isReview) && (
              <div className="bg-white p-4 rounded-md shadow-md">
                <div className="flex gap-2 justify-center">
                  {(data?.isReview || data?.isEdit) && (
                    <Button
                      leftIcon={<Pencil size={17} />}
                      color="indigo"
                      size="xs"
                      onClick={() => router.push(`/sharing/edit/${data.id}`)}
                    >
                      {t("Edit")}
                    </Button>
                  )}
                  {data?.isReview &&
                    (data?.isPublish ? (
                      <Button color="red" size="xs" onClick={() => handleHide(-1)}>
                        {t("Unpublish")}
                      </Button>
                    ) : (
                      <Button color="red" size="xs" onClick={() => handleHide(1)}>
                        {t("Publish")}
                      </Button>
                    ))}
                </div>
                {data?.isReview && (
                  <div className="flex justify-center pt-2">
                    <Button color="cyan" size="xs" onClick={() => setModalChangeAuthor(true)}>
                      {t("Change author")}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Author
              permalink={permalink}
              ownerId={data?.ownerId}
              modalChangeAuthor={modalChangeAuthor}
              isPreview={isPreview}
            />

            <div className="bg-white p-5 rounded-md overflow-hidden shadow-md">
              <Text className="text-[#333] text-sm font-semibold uppercase">{t("Written by same author")}</Text>
              <div className="mt-4">
                {loading ? (
                  <div className="flex flex-col gap-2">{skeletons}</div>
                ) : (
                  data?.sameOwnerBlogs?.map((blog: any) => {
                    return (
                      <div key={blog.id} className="py-3 flex gap-4 items-center border-b">
                        <div className="border">
                          <Image
                            src={
                              data && isEmpty(data.imageUrl)
                                ? "/default-image.png"
                                : blog?.imageUrl?.startsWith("http")
                                ? blog?.imageUrl
                                : CDN_URL + blog?.imageUrl
                            }
                            width={65}
                            height={45}
                            fit="fill"
                          />
                        </div>
                        <Link href={`/sharing/${blog.permalink}`}>
                          <Text lineClamp={2} className="text-sm">
                            {blog.title}
                          </Text>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-md overflow-hidden shadow-md">
              <Text className="text-[#333] text-sm font-semibold uppercase">{t("Top reads")}</Text>
              <div>
                {loading ? (
                  <div className="flex flex-col gap-2">{skeletons}</div>
                ) : (
                  data?.topReadBlogs?.map((post: any) => {
                    return (
                      <div key={post.id} className="border-b py-3">
                        <Link href={`/sharing/${post.permalink}`}>
                          <Text className="text-[#333] text-sm">{post.title}</Text>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* <AdBanner data-ad-slot="8216056812" data-ad-format="fluid" data-ad-layout="in-article" /> */}

            <div className="bg-white p-5 rounded-md overflow-hidden shadow-md">
              <Text className="text-[#333] text-sm font-semibold uppercase">{t("Top authors")}</Text>
              <div className="mt-4">
                {loading ? (
                  <div className="flex flex-col gap-2">{skeletons}</div>
                ) : (
                  topBloggers?.map((bloger: any) => {
                    return (
                      <div key={bloger.id} className="py-2 flex gap-4 items-center">
                        <Avatar
                          className="mb-5"
                          userId={bloger?.userId}
                          userExpLevel={bloger?.userExpLevel}
                          src={bloger?.avatarUrl}
                        />
                        <ExternalLink href={`/profile/${bloger.userId}`}>{bloger.userName}</ExternalLink>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {isPreview && (
              <div className="bg-white p-5 rounded-md overflow-hidden shadow-md">
                <Text className="text-[#333] text-sm font-semibold">HASHTAG</Text>
                <div className="flex gap-3 py-4 flex-wrap">
                  {data?.tags?.map((tag) => {
                    return <TagSharing key={tag} tag={tag} />;
                  })}
                </div>
              </div>
            )}

            <div className="bg-white p-2 flex items-center justify-center rounded-md overflow-hidden shadow-md">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FDekiruFanpage&tabs=timeline&width=300&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="300"
                height="500"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default SharingDetailIndex;
