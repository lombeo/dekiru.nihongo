/* eslint-disable @next/next/no-img-element */
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { clsx, HoverCard, Image, Text } from "@mantine/core";
import Link from "@src/components/Link";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { IdentityService } from "@src/services/IdentityService";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { Fragment, useState } from "react";

interface ContributorItemProps {
  data: any;
  avatar: string;
  bloggerInfo: any;
}

const ContributorItem = (props: ContributorItemProps) => {
  const { data, avatar, bloggerInfo } = props;
  const { t } = useTranslation();

  const [cpStatistic, setCpStatistic] = useState<any>(null);

  const getCp = (data) => {
    const totalExp = Math.floor(data.totalExp);
    if (totalExp < 1000) {
      return totalExp;
    } else if (totalExp >= 1000000) {
      return Math.floor(totalExp / 1000000) + "M";
    } else {
      return Math.floor(totalExp / 1000) + "K";
    }
  };

  const getIcon = (key: string) => {
    let imgSrc = "";
    switch (key) {
      case "HadBlogPublished":
        break;
      case "HadBlogUnPublished":
        break;
      case "HadTaskAddedToCourse":
        break;
      case "CreatedCourse":
        break;
      case "CreatedContest":
        break;
      case "CreatedTask":
        break;
      case "HadTaskRejected":
        break;
      case "CreatedChallenge":
        break;
      case "HadTaskSubmitted":
        break;
      case "HadCourseCompleted":
        break;
      case "HadTaskAddedToContest":
        break;
      case "HadContestCompleted":
        break;
      case "HadTaskAddedToChallenge":
        break;
      case "HadChallengeCompleted":
        break;
      case "HadBlogRatedUp":
        break;
      case "HadBlogRatedDown":
        break;
      case "CreatedForumTopic":
        break;
      case "HadForumTopicVotedUp":
        break;
      case "HadForumTopicVotedDown":
        break;
      case "HadForumTopicUndoneUp":
        break;
      case "HadForumTopicUndoneDown":
        break;
      default:
        break;
    }

    if (imgSrc) {
      return <Image src={imgSrc} width={24} height={24} alt={key} />;
    }

    return null;
  };

  const groupCP = (data: any) => {
    const cpStatistic = [];
    Object.keys(data).forEach((key) => {
      let cpRow: any = {
        value: data[key],
        key: key,
      };
      switch (key) {
        case "CreatedCourse":
        case "HadTaskAddedToCourse":
        case "HadCourseCompleted":
          cpRow.type = "learn";
          break;
        case "CreatedContest":
        case "HadTaskAddedToContest":
        case "HadContestCompleted":
          cpRow.type = "fight";
          break;
        case "CreatedTask":
        case "HadTaskSubmitted":
        case "HadTaskRejected":
          cpRow.type = "train";
          break;
        case "CreatedChallenge":
        case "HadTaskAddedToChallenge":
        case "HadChallengeCompleted":
          cpRow.type = "challenge";
          break;
        default:
          cpRow.type = "share";
          break;
      }
      cpStatistic.push(cpRow);
    });
    return _.groupBy(cpStatistic, "type");
  };

  const fetchCp = async () => {
    if (cpStatistic) return;
    const res = await IdentityService.userGetCpStatistic({
      userId: data.userId,
    });
    if (res?.data?.success) {
      setCpStatistic(groupCP(res.data.data));
    }
  };

  return (
    <Link href={`/profile/${data.userId}`}>
      <div className="rounded-[8px] overflow-hidden shadow-md">
        <div className="aspect-[252/360] relative flex items-end p-3 bg-gray-500">
          <img
            src={avatar}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "/images/leaderboard/default-bg.png";
            }}
            alt="avatar"
            className="top-0 left-0 w-full h-full object-cover absolute"
          />
          <div
            className="top-0 left-0 w-full h-full object-cover absolute z-10"
            style={{
              background: "linear-gradient(180deg, rgba(0, 0, 0, 0.0001) 26.65%, rgba(0, 0, 0, 0.495438) 100%)",
            }}
          ></div>
          <div
            className="bottom-0 h-[92px] left-0 w-full object-cover absolute z-20"
            style={{
              background:
                "linear-gradient(179.35deg, rgba(0, 0, 0, 0) 0.17%, rgba(0, 0, 0, 0.808593) 39.83%, #000000 99.44%)",
            }}
          ></div>
          <div className="relative text-white z-20 w-full">
            <TextLineCamp
              data-tooltip-id="global-tooltip"
              data-tooltip-content={FunctionBase.htmlDecode(data.position)}
              data-tooltip-place="top"
              className="text-xs uppercase"
            >
              {FunctionBase.htmlDecode(data.position)}
            </TextLineCamp>
            <TextLineCamp
              data-tooltip-id="global-tooltip"
              data-tooltip-content={FunctionBase.htmlDecode(data.company)}
              data-tooltip-place="top"
              className="text-xs italic pt-0.5"
            >
              {FunctionBase.htmlDecode(data.company)}
            </TextLineCamp>
            <TextLineCamp
              data-tooltip-id="global-tooltip"
              data-tooltip-content={data.userName}
              data-tooltip-place="top"
              className="text-[#fff] text-xl font-[800] pr-[48px]"
            >
              {data.userName}
            </TextLineCamp>
          </div>
        </div>
        <div
          style={{ background: "linear-gradient(90deg, #D9D9D9 0%, #EFEFEF 100%)" }}
          className="relative min-h-[34px] text-[#65656D] rounded-b-[8px] border-[#C9C9C9] border pl-3 py-1 pr-[68px] flex items-center gap-4 justify-between"
        >
          <div className="absolute right-0 bottom-0 z-30">
            <HoverCard
              zIndex={180}
              withinPortal
              arrowSize={16}
              withArrow
              position="left"
              onOpen={() => {
                fetchCp();
              }}
              shadow="lg"
              transitionProps={{ transition: "pop" }}
              classNames={{ arrow: "bg-[#2327A6] border-[#2327A6] -z-10" }}
            >
              <HoverCard.Target>
                <div className="relative">
                  <img src="/images/leaderboard/cp.png" alt="contributor-poin" width={62} height={65} />
                  <div className="absolute top-[28px] font-[900] text-sm z-10 left-0 w-full right-0 text-center text-[#AE7013]">
                    {getCp(data)}
                  </div>
                </div>
              </HoverCard.Target>
              <HoverCard.Dropdown
                className={clsx(
                  "hidden lg:block rounded-md text-[#111] p-0 border-2 border-[#2327A6] shadow-[5px_10px_15px_0px_#00000040]",
                  {
                    "!hidden": !cpStatistic || cpStatistic.length === 0,
                  }
                )}
              >
                <div className="w-[400px] gap-x-4 gap-y-2 shadow-[0_2px_10px_0_#00000026_inset] min-w-[200px] transition-all rounded-md bg-white  flex-col  px-5 py-3 overflow-auto">
                  {cpStatistic?.learn?.length > 0 && (
                    <>
                      <div className="pb-2 flex gap-2">
                        <Image src="/images/contributor/local_library.png" width={24} height={24} />
                        <Text className="font-black">{t("Learning")}</Text>
                      </div>
                    </>
                  )}

                  <div className="grid items-center grid-cols-[1fr_60px] w-full">
                    {cpStatistic?.learn?.map((data) => {
                      return (
                        <Fragment key={data.key}>
                          <div className="grid gap-2 grid-cols-[24px_1fr] items-center">
                            <div>{getIcon(data.key)}</div>
                            <div>{t(`CP_Statistic.${data.key}`)}</div>
                          </div>
                          <div className="font-semibold">{FunctionBase.formatNumber(Math.floor(data.value))}</div>
                        </Fragment>
                      );
                    })}
                  </div>
                  {cpStatistic?.fight?.length > 0 && cpStatistic?.learn?.length > 0 && (
                    <div className="border-t-[1px] border-dashed border-black my-2" />
                  )}
                  {cpStatistic?.fight?.length > 0 && (
                    <div className="pb-2 flex gap-2">
                      <Image src="/images/contributor/post_add.png" width={24} height={24} />
                      <Text className="font-black text-[#AE7013]">{t("Contest")}</Text>
                    </div>
                  )}

                  <div className="grid items-center grid-cols-[1fr_60px] w-full">
                    {cpStatistic?.fight?.map((data) => {
                      return (
                        <Fragment key={data.key}>
                          <div className="grid gap-2 grid-cols-[24px_1fr] items-center">
                            <div>{getIcon(data.key)}</div>
                            <div>{t(`CP_Statistic.${data.key}`)}</div>
                          </div>
                          <div className="font-semibold">{FunctionBase.formatNumber(Math.floor(data.value))}</div>
                        </Fragment>
                      );
                    })}
                  </div>
                  {cpStatistic?.train?.length > 0 &&
                    (cpStatistic?.fight?.length > 0 || cpStatistic?.learn?.length > 0) && (
                      <div className="border-t-[1px] border-dashed border-black my-2" />
                    )}
                  {cpStatistic?.train?.length > 0 && (
                    <div className="pb-2 flex gap-2">
                      <Image src="/images/contributor/checkbook.png" width={24} height={24} />
                      <Text className="text-[#087E0D] font-black">{t("Training")}</Text>
                    </div>
                  )}
                  <div className="grid items-center grid-cols-[1fr_60px] w-full">
                    {cpStatistic?.train?.map((data) => {
                      return (
                        <Fragment key={data.key}>
                          <div className="grid gap-2 grid-cols-[24px_1fr] items-center">
                            <div>{getIcon(data.key)}</div>
                            <div>{t(`CP_Statistic.${data.key}`)}</div>
                          </div>
                          <div className="font-semibold">{FunctionBase.formatNumber(Math.floor(data.value))}</div>
                        </Fragment>
                      );
                    })}
                  </div>
                  {cpStatistic?.challenge?.length > 0 &&
                    (cpStatistic?.fight?.length > 0 ||
                      cpStatistic?.learn?.length > 0 ||
                      cpStatistic?.train?.length > 0) && (
                      <div className="border-t-[1px] border-dashed border-black my-2" />
                    )}
                  {cpStatistic?.challenge?.length > 0 && (
                    <div className="pb-2 flex gap-2">
                      <Image src="/images/contributor/mountain_flag_create.png" width={24} height={24} />
                      <Text className="font-black text-[#F3650A]">{t("Challenge")}</Text>
                    </div>
                  )}
                  <div className="grid items-center grid-cols-[1fr_60px] w-full">
                    {cpStatistic?.challenge?.map((data) => {
                      return (
                        <Fragment key={data.key}>
                          <div className="grid gap-2 grid-cols-[24px_1fr] items-center">
                            <div>{getIcon(data.key)}</div>
                            <div>{t(`CP_Statistic.${data.key}`)}</div>
                          </div>
                          <div className="font-semibold">{FunctionBase.formatNumber(Math.floor(data.value))}</div>
                        </Fragment>
                      );
                    })}
                  </div>
                  {cpStatistic?.share?.length > 0 &&
                    (cpStatistic?.fight?.length > 0 ||
                      cpStatistic?.learn?.length > 0 ||
                      cpStatistic?.train?.length > 0 ||
                      cpStatistic?.challenge?.length > 0) && (
                      <div className="border-t-[1px] border-dashed border-black my-2" />
                    )}
                  {cpStatistic?.share?.length > 0 && (
                    <div className="pb-2 flex gap-2">
                      <Image src="/images/contributor/share_reviews.png" width={24} height={24} />
                      <Text className="font-black text-[#385ab7]">{t("Sharing")}</Text>
                    </div>
                  )}
                  <div className="grid items-center grid-cols-[1fr_60px] w-full">
                    {cpStatistic?.share?.map((data) => {
                      return (
                        <Fragment key={data.key}>
                          <div className="grid gap-2 grid-cols-[24px_1fr] items-center">
                            <div>{getIcon(data.key)}</div>
                            <div>{t(`CP_Statistic.${data.key}`)}</div>
                          </div>
                          <div className="font-semibold">{FunctionBase.formatNumber(Math.floor(data.value))}</div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </div>
          <div
            data-tooltip-id="global-tooltip"
            data-tooltip-content={t("Total blog created")}
            data-tooltip-place="top"
            className="flex items-center gap-1"
          >
            <img src="/images/leaderboard/blog-count.svg" alt="blog-count" width={18} />
            {bloggerInfo?.blogCount}
          </div>
          <div
            data-tooltip-id="global-tooltip"
            data-tooltip-content={t("Total follower")}
            data-tooltip-place="top"
            className="flex items-center gap-1"
          >
            <img src="/images/leaderboard/follow-user.svg" alt="follow-user" width={18} />
            {bloggerInfo?.followerCount}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContributorItem;
