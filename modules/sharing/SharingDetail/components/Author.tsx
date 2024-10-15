import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Text } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import Link from "@src/components/Link";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import SharingService from "@src/services/Sharing/SharingService";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import { Rss } from "tabler-icons-react";

const Author = (props: any) => {
  const { ownerId, modalChangeAuthor, isPreview } = props;
  const { t } = useTranslation();
  const [data, setData] = useState({} as any);
  const { profile } = useProfileContext();
  const handleFollow = async (follow) => {
    const res = await SharingService.followUser({
      actionBy: profile?.userId,
      userFollowId: data.userId,
      actionEnum: follow,
    });
    if (res.data.success) {
      fetch();
    } else {
      Notify.error(t(res.data.message));
    }
  };
  const fetch = async () => {
    if (ownerId) {
      const res = await SharingService.getOwnerInfor({
        userId: ownerId,
        isPreview: isPreview,
      });
      if (res?.data?.success) {
        setData(res.data.data);
      }
    }
  };
  useEffect(() => {
    fetch();
  }, [modalChangeAuthor, ownerId]);
  return (
    <div className="bg-white p-5 rounded-md overflow-hidden shadow-md">
      <Text className="text-[#333] text-sm font-semibold uppercase">{t("Author")}</Text>
      <div className="flex flex-col justify-center items-center pb-5">
        <Avatar
          size={70}
          className="mb-5"
          userId={data?.userId}
          userExpLevel={data?.userExpLevel}
          src={data?.avatarUrl}
        />
        <ExternalLink href={`/profile/${data?.userId}`}>
          <Text className="text-[#2c31cf]">{data?.userName}</Text>
        </ExternalLink>
        <Text className="text-sm italic ">{data?.cityName ?? "-"}</Text>
      </div>
      <div className="flex justify-center gap-2">
        <Link className="text-[#2c31cf]" href={`/sharing/post/${data.userId}`}>
          {(data?.blogCount ?? "-") + " " + t("posts")}
        </Link>
        <Text>| {(data?.followerCount ?? "-") + " " + t("followers")} </Text>
      </div>
      {profile && (
        <div className="flex justify-center py-4">
          {data.isFollow ? (
            <Button variant="filled" onClick={() => handleFollow(-1)}>
              <Rss size={16} /> {t("Following")}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => handleFollow(1)}>
              <Rss size={16} /> {t("Follow")}
            </Button>
          )}
        </div>
      )}

      {data?.achievement && (
        <div className="flex items-center gap-2 pb-4">
          <Text className="text-xs whitespace-pre-line">{FunctionBase.htmlDecode(data?.achievement)}</Text>
        </div>
      )}

      {profile && (
        <div className="flex justify-center gap-3">
          {data?.facebook ? (
            <FacebookIcon
              size={30}
              className="rounded-sm cursor-pointer"
              onClick={() => {
                window.location.href = data?.facebook;
              }}
            />
          ) : (
            <FacebookIcon size={30} className="rounded-sm opacity-50" />
          )}
          {data?.twitter ? (
            <TwitterIcon
              size={30}
              className="rounded-sm cursor-pointer"
              onClick={() => {
                window.location.href = data?.twitter;
              }}
            />
          ) : (
            <TwitterIcon size={30} className="rounded-sm opacity-50 " />
          )}
          {data?.linkedIn ? (
            <LinkedinIcon
              size={30}
              className="rounded-sm cursor-pointer"
              onClick={() => {
                window.location.href = data?.linkedIn;
              }}
            />
          ) : (
            <LinkedinIcon size={30} className="rounded-sm opacity-50 " />
          )}
        </div>
      )}
    </div>
  );
};
export default Author;
