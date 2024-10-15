import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Image } from "@mantine/core";
import Link from "@src/components/Link";
import PinBadge from "@src/components/PinBadge";
import StarRatings from "@src/components/StarRatings";
import { CDN_URL } from "@src/config";
import { PubsubTopic } from "@src/constants/common.constant";
import { useRouter } from "@src/hooks/useRouter";
import SharingService from "@src/services/Sharing/SharingService";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BoxSharing = () => {
  const profile = useSelector(selectProfile);
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  const [sharing, setSharing] = useState(null);

  useEffect(() => {
    refetch();
  }, [profile?.userId]);

  const refetch = async () => {
    const res = await SharingService.blogGetHomeBlogs({
      userId: profile?.userId,
      progress: false,
    });
    const data = res?.data?.data;
    setSharing(data);
    PubSub.publish(PubsubTopic.UPDATE_SUMMARY_HOME, {
      sharing: data,
    });
  };

  return (
    <>
      {locale === "en" && (
        <div className="bg-white rounded-md">
          <img alt="" src="/images/empower-yourself.jpg" className="!w-full !aspect-[583/323]" />
          <div className="flex flex-col gap-4 p-5">
            <h3 className="my-0 text-xl lg:text-[36px] font-semibold">{t("Empower Yourself")}</h3>
            <div className="text-lg">
              {t("Free courses from leading tech experts. Join our learning community all around the world.")}
            </div>
            <Link href="/learning">
              <Button color="red" className="hover:bg-[#3b3c54] bg-[#e8505b] font-semibold w-fit">
                {t("Start Learning Now!")}
              </Button>
            </Link>
          </div>
        </div>
      )}
      {locale === "vi" && (
        <div id="t71" className="flex flex-col h-full">
          <div className="flex gap-5 flex-wrap justify-between items-center">
            <h3 className="my-0 font-bold text-[#2c31cf] text-[26px]">{t("Sharing")}</h3>
            <Link href="/sharing">{t("See all")}</Link>
          </div>
          <div className="mt-5 flex flex-col gap-3 bg-white px-5 pt-5 rounded-md flex-auto border">
            {sharing?.blogs?.map((item, index) => (
              <Link href={`/sharing/${item.permalink}`} key={item.id}>
                <div
                  className={clsx(
                    "hover:-translate-y-1.5 duration-200 hover:opacity-100 pb-2 mb-3 grid lg:grid-cols-[160px_auto] gap-4 relative",
                    {
                      "border-b": index !== sharing.blogs.length - 1,
                    }
                  )}
                >
                  <PinBadge isTrending={item.isTopTrending} isNew={item.isLatest} isHot={item.isHot} />
                  <Image
                    withPlaceholder
                    alt=""
                    src={
                      isEmpty(item.imageUrl)
                        ? "/default-image.png"
                        : item.imageUrl?.startsWith("http")
                        ? item.imageUrl
                        : CDN_URL + item.imageUrl
                    }
                    fit="fill"
                    radius={4}
                    classNames={{
                      image: "w-full aspect-[160/108]",
                    }}
                    className=""
                  />
                  <div className="flex flex-col">
                    <TextLineCamp line={2} className="font-semibold">
                      {item.title}
                    </TextLineCamp>
                    <StarRatings rating={item?.rateSummary?.avgRate} size="sm" />
                    <TextLineCamp line={2} className="">
                      {item.description}
                    </TextLineCamp>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BoxSharing;
