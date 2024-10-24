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
        <div className="bg-white rounded-md">
          <img alt="" src="/images/empower-yourself.jpg" className="!w-full !aspect-[583/323]" />
          <div className="flex flex-col gap-4 p-5">
            <h3 className="my-0 text-xl lg:text-[36px] font-semibold">{t("Empower Yourself")}</h3>
            <div className="text-lg">
              {t("Các khóa học miễn phí từ các chuyên gia hàng đầu Nhật Bản. Tham gia cộng đồng học tập của chúng tôi trên toàn thế giới.")}
            </div>
            <Link href="/learning">
              <Button color="red" className="hover:bg-[#3b3c54] bg-[#e8505b] font-semibold w-fit">
                {t("Bắt đầu học tập ngay!")}
              </Button>
            </Link>
          </div>
        </div>
    </>
  );
};

export default BoxSharing;
