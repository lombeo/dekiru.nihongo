import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Flex, Image, Pagination, Rating, Text } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { CDN_URL } from "@src/config";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import SharingService from "@src/services/Sharing/SharingService";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import { Eye, Point, Rss, Share } from "tabler-icons-react";
import TagSharing from "../SharingIndex/components/TagSharing";

const SharingByUserIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({} as any);
  const [dataBloger, setDataBloger] = useState({} as any);
  const { profile } = useProfileContext();
  const id = router.query.id;
  const handleFollow = async (follow) => {
    const res = await SharingService.followUser({
      actionBy: profile?.userId,
      userFollowId: dataBloger.userId,
      actionEnum: follow,
    });
    if (res.data.success) {
      fetch();
    } else {
      Notify.error(t(res.data.message));
    }
  };
  const fetch = async () => {
    const res = await SharingService.getBlogList({
      pageIndex: page,
      pageSize: 10,
      ownerId: id,
      isPublic: true,
    });
    if (res?.data?.success) {
      setData(res?.data);
      const resGetInfor = await SharingService.getOwnerInfor({
        userId: id,
      });
      if (resGetInfor?.data?.success) {
        setDataBloger(resGetInfor?.data?.data);
      }
    } else {
      Notify.error(res?.data?.message);
    }
  };

  useEffect(() => {
    fetch();
  }, [id, page]);

  return (
    <div>
      <Container>
        <Flex className="justify-between" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/sharing",
                title: t("Sharing"),
              },
              {
                title: t("Post"),
              },
            ]}
          />
        </Flex>
        <div className="bg-white p-8">
          <div className="flex justify-between flex-col md:flex-row">
            <div className="flex gap-10">
              <div>
                <div className="flex flex-col justify-center items-center pb-5">
                  <Avatar
                    size={70}
                    className="mb-5"
                    userId={dataBloger?.userId}
                    userExpLevel={dataBloger?.userExpLevel}
                    src={dataBloger?.avatarUrl}
                  />
                </div>
                <div className="flex justify-center gap-3">
                  {dataBloger?.facebook ? (
                    <FacebookIcon
                      size={30}
                      className="rounded-sm cursor-pointer"
                      onClick={() => {
                        window.location.href = dataBloger?.facebook;
                      }}
                    />
                  ) : (
                    <FacebookIcon size={30} className="rounded-sm opacity-50" />
                  )}
                  {dataBloger?.twitter ? (
                    <TwitterIcon
                      size={30}
                      className="rounded-sm cursor-pointer"
                      onClick={() => {
                        window.location.href = dataBloger?.twitter;
                      }}
                    />
                  ) : (
                    <TwitterIcon size={30} className="rounded-sm opacity-50 " />
                  )}
                  {dataBloger?.linkedIn ? (
                    <LinkedinIcon
                      size={30}
                      className="rounded-sm cursor-pointer"
                      onClick={() => {
                        window.location.href = dataBloger?.linkedIn;
                      }}
                    />
                  ) : (
                    <LinkedinIcon size={30} className="rounded-sm opacity-50 " />
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                <Link className="text-[#2c31cf]" href={`/sharing/post/${id}`}>
                  {(dataBloger?.blogCount ?? "-") + " " + t("posts")}
                </Link>
                <Text>| {(dataBloger?.followerCount ?? "-") + " " + t("followers")} </Text>
              </div>
            </div>
            <div className="flex justify-center py-4">
              {dataBloger.isFollow ? (
                <Button variant="filled" onClick={() => handleFollow(-1)}>
                  <Rss size={16} /> {t("Following")}
                </Button>
              ) : (
                <Button variant="outline" onClick={() => handleFollow(1)}>
                  <Rss size={16} /> {t("Follow")}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 mt-5 mb-32">
          <Text className="font-semibold text-2xl">{t("Related posts")}</Text>
          <div>
            {data?.data?.map((value) => {
              return (
                <div key={value.id} className="flex lg:flex-row flex-col gap-4 border-b-2 items-center py-2">
                  <div className="lg:w-[165px] w-[100%]">
                    <Image
                      src={
                        value && isEmpty(value.imageUrl)
                          ? "/default-image.png"
                          : value?.imageUrl?.startsWith("http")
                          ? value?.imageUrl
                          : CDN_URL + value?.imageUrl
                      }
                      fit="fill"
                      height={150}
                      miw={165}
                    />
                  </div>
                  <div className="w-[100%]">
                    <Link href={`/sharing/${value.permalink}`}>
                      <Text className="font-semibold text-lg">{value.title}</Text>
                    </Link>
                    <Rating value={value?.rateSummary?.avgRate} fractions={4} size="xs" readOnly className=" mt-2" />
                    <TextLineCamp className="text-[#898989] text-sm mt-2]" line={2}>
                      {FunctionBase.htmlDecode(value?.description)}
                    </TextLineCamp>
                    <div className="flex flex-wrap gap-3 py-4">
                      {value?.tags?.map((tag) => {
                        return <TagSharing key={tag} tag={tag} />;
                      })}
                    </div>
                    <div className="flex items-center flex-wrap justify-between ">
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
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                          <Eye size={14} color="#898989" />
                          <Text size={12} color="#898989">
                            {value.finalTotalViews}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share size={14} color="#898989" />
                          <Text size={12} color="#898989">
                            {value.finalTotalShares}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-10">
            <Pagination
              withEdges
              value={page}
              total={data?.meta?.totalPage ?? 0}
              onChange={(pageIndex) => setPage(pageIndex)}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default SharingByUserIndex;
