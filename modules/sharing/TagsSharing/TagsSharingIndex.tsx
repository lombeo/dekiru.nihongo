import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Flex, Image, Pagination, Rating, Text } from "@mantine/core";
import { Container } from "@src/components";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { CDN_URL } from "@src/config";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import SharingService from "@src/services/Sharing/SharingService";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Eye, Point, Share } from "tabler-icons-react";
import TagSharing from "../SharingIndex/components/TagSharing";

const TagsSharingIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({} as any);
  const tag = router.query.tag;

  const fetch = async () => {
    const res = await SharingService.getBlogList({
      pageIndex: page,
      pageSize: 10,
      tag: tag,
    });
    if (res?.data?.success) {
      setData(res?.data);
    } else {
      Notify.error(res?.data?.message);
    }
  };
  useEffect(() => {
    fetch();
  }, [tag, page]);
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
                title: t("Tags"),
              },
            ]}
          />
        </Flex>
        <div className="bg-white p-6 mt-5 mb-32">
          <Text className="font-semibold text-2xl">Tags: {tag}</Text>
          <div>
            {data?.data?.map((value) => {
              return (
                <div key={value.id} className="flex lg:flex-row flex-col gap-4 border-b-2 items-center py-2">
                  <div className="lg:w-[160px] w-[100%]">
                    <Image
                      src={
                        value && isEmpty(value.imageUrl)
                          ? "/default-image.png"
                          : value?.imageUrl?.startsWith("http")
                          ? value?.imageUrl
                          : CDN_URL + value?.imageUrl
                      }
                      height={150}
                      miw={160}
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
                    <div className="flex items-center flex-wrap justify-between w-[100%]">
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
                      <div className="flex gap-2 ">
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
export default TagsSharingIndex;
