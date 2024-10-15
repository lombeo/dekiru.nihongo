import { Image } from "@mantine/core";
import { useTranslation } from "next-i18next";

const BoxDiscussion = (props: any) => {
  const { userDiscussionStatistic } = props;
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-md shadow-md p-5 relative">
      <div className="flex justify-between gap-4 items-center ">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg uppercase">{t("Discussion")}</span>
          {/*<span className="text-sm">(38)</span>*/}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        {[
          {
            label: t("Topic"),
            value: userDiscussionStatistic?.totalDiscussion,
            image: "/images/cv/topic.png",
          },
          {
            label: t("Vote"),
            value: userDiscussionStatistic?.totalUserVote,
            image: "/images/cv/vote.png",
          },
          {
            label: t("ProfilePage.Like"),
            value: userDiscussionStatistic?.totalUserLike,
            image: "/images/cv/like.png",
          },
          {
            label: t("Comment"),
            value: userDiscussionStatistic?.totalUserComment,
            image: "/images/cv/comment.png",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl shadow-lg border border-[#C2C3C5] p-5"
            style={{ backgroundImage: "linear-gradient(180deg, #F0F3F5 0%, #FFFFFF 100%)" }}
          >
            <div className="text-lg font-semibold">{item.label}</div>
            <div className="flex items-center gap-5">
              <Image alt={item.label} src={item.image} width={49} height={49} />
              <div className="text-[#575656] font-[900] text-[32px]">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxDiscussion;
