import { ChatChanelEnum } from "@chatbox/constants";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Collapse, Divider, Group, HoverCard, Image, Progress, Text, Tooltip, clsx } from "@mantine/core";
import { getAccessToken } from "@src/api/axiosInstance";
import Avatar from "@src/components/Avatar";
import CertificateImage from "@src/components/Certificate/CertificateImage";
import Link from "@src/components/Link";
import StarRatings from "@src/components/StarRatings";
import { ADMIN_ID } from "@src/config";
import UserRole from "@src/constants/roles";
import { FunctionBase, convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import FriendButton from "@src/modules/profile/components/BoxLeft/FriendButton";
import BoxAchievement from "@src/modules/profile/components/BoxLeft/components/BoxAchievement";
import BoxEducation from "@src/modules/profile/components/BoxLeft/components/BoxEducation";
import BoxExperience from "@src/modules/profile/components/BoxLeft/components/BoxExperience";
import SocialInfomation from "@src/modules/user/UserInformation/components/SocialInfomation";
import SummaryInfomation from "@src/modules/user/UserInformation/components/SummaryInfomation";
import CodingService from "@src/services/Coding/CodingService";
import { IdentityService } from "@src/services/IdentityService";
import { selectProfile } from "@src/store/slices/authSlice";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AlertCircle, Calendar, CircleCheck, Mail, MapPin, Phone } from "tabler-icons-react";

const BoxLeft = (props: any) => {
  const { userProfile, userId, refetchUserProfile, userCertificates } = props;

  const { t } = useTranslation();

  const token = getAccessToken();
  const profile = useSelector(selectProfile);

  const isManager = useHasAnyRole([UserRole.SiteOwner, UserRole.Administrator, UserRole.ManagerContent]);

  const [userSkill, setUserSkill] = useState(null);
  const [cpStatistic, setCpStatistic] = useState<any>(null);

  const [collapseCert, setCollapseCert] = useState(true);

  const fetchCp = async () => {
    if (cpStatistic || !userProfile?.userId) return;
    const res = await IdentityService.userGetCpStatistic({
      userId: userProfile.userId,
    });
    if (res?.data?.success) {
      setCpStatistic(groupCP(res?.data?.data));
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

  const refetchUserSkill = async () => {
    const res = await CodingService.userGetUserSkillStatitics({
      userId,
      progress: false,
    });
    setUserSkill(res?.data?.data);
  };

  const fetchData = () => {
    if (!userId) return;
    refetchUserSkill();
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const isCurrentUser = profile && profile?.userId === userProfile?.userId;

  const userExpLevel = userProfile?.isContributor ? userProfile?.lpInfo : userProfile?.userExpLevel;

  const handleChatSupport = () => {
    const userId = ADMIN_ID;
    const dataChatBox = {
      id: userId > userProfile?.userId ? `${userProfile?.userId}_${userId}` : `${userId}_${userProfile?.userId}`,
      lastMessageTimestamp: new Date(),
      friend: {
        id: userProfile.userId,
        username: userProfile?.userName,
        fullName: userProfile?.displayName,
        avatarUrl: userProfile?.avatarUrl,
      },
      ownerId: -1,
      notifyCount: 0,
    };
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data: dataChatBox });
  };

  return (
    <div className="bg-white bg-contain bg-[url('/images/bg-profile.png?v=1')] bg-top bg-no-repeat rounded-md shadow-md p-5 flex flex-col">
      <div>
        <Group position="center" pb="sm" pt="xl">
          <Avatar size={168} userExpLevel={userProfile?.userExpLevel} src={userProfile?.avatarUrl} />
        </Group>
        <TextLineCamp className="font-semibold mt-4 text-[24px] text-center">{userProfile?.userName}</TextLineCamp>
        {userProfile?.isContributor && (
          <HoverCard
            zIndex={180}
            withinPortal
            arrowSize={16}
            withArrow
            position="right"
            onOpen={() => {
              fetchCp();
            }}
            shadow="lg"
            transitionProps={{ transition: "pop" }}
            classNames={{ arrow: "bg-[#2327A6] border-[#2327A6] -z-10" }}
          >
            <HoverCard.Target>
              <div className="relative mb-4 mt-4 cursor-pointer">
                <Link href={`/userlevel/cphistory/${userId}`}>
                  <Progress
                    classNames={{
                      bar: "bg-[linear-gradient(176.76deg,#D889FD_24.62%,#481162_98.31%)]",
                      root: "bg-[#E0E0E5] border border-[#D1D1D1]",
                    }}
                    value={
                      userProfile?.userExpLevel?.nextLevelExp
                        ? (userProfile?.userExpLevel?.currentUserExperiencePoint * 100) /
                          userProfile?.userExpLevel?.nextLevelExp
                        : 0
                    }
                    radius="xl"
                    color="#079cd0"
                    size="21px"
                  />
                  <img src={"/images/cp.png"} className="absolute top-0 left-[1px]" height={19} width={19} />
                  <div
                    style={{
                      textShadow: `-1px -1px 0 #5A0092, 1px -1px 0 #5A0092, -1px 1px 0 #5A0092, 1px 1px 0 #5A0092`,
                    }}
                    className="absolute top-1/2 left-1/2 z-10 text-white -translate-y-1/2 text-[14px] font-semibold -translate-x-1/2"
                  >
                    {FunctionBase.formatNumber(userProfile?.userExpLevel?.currentUserExperiencePoint)}/
                    {FunctionBase.formatNumber(userProfile?.userExpLevel?.nextLevelExp)}
                  </div>
                </Link>
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown
              className={clsx(
                "hidden lg:block rounded-md text-[#111] p-0 border-2 border-[#2327A6] shadow-[5px_10px_15px_0px_#00000040]",
                {
                  "!hidden": !cpStatistic || Object.keys(cpStatistic).length === 0,
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
        )}
        <Link href={`/userlevel/exphistory/${userId}`}>
          <div className="relative mb-4 mt-4 cursor-pointer">
            <Progress
              classNames={{
                bar: "bg-[linear-gradient(176.76deg,#00FF38_-42.05%,#05561B_98.31%)]",
                root: "bg-[#E0E0E5] border border-[#D1D1D1]",
              }}
              value={
                userExpLevel?.nextLevelExp
                  ? (userExpLevel?.currentUserExperiencePoint * 100) / userExpLevel?.nextLevelExp
                  : 0
              }
              radius="xl"
              color="#079cd0"
              size="20px"
            />
            <img src={"/images/lp.png"} className="absolute top-0 left-[1px]" height={19} width={19} />
            <div
              style={{
                textShadow: `-1px -1px 0 #187E16, 1px -1px 0 #187E16, -1px 1px 0 #0757CE, 1px 1px 0 #187E16`,
              }}
              className="absolute top-1/2 left-1/2 z-10 text-white -translate-y-1/2 text-[14px] font-semibold -translate-x-1/2"
            >
              {FunctionBase.formatNumber(userExpLevel?.currentUserExperiencePoint)}/
              {FunctionBase.formatNumber(userExpLevel?.nextLevelExp)}
            </div>
          </div>
        </Link>

        {token && !isCurrentUser && userId ? <FriendButton userId={userId} userProfile={userProfile} /> : null}
        {profile?.userId === ADMIN_ID && (
          <Button onClick={handleChatSupport} variant="outline" className="rounded-lg mx-auto mt-4" size="sm" fullWidth>
            {t("Chat")}
          </Button>
        )}

        <Divider className="mt-5" size={1} />

        <div className="flex justify-between gap-4 mt-5 items-center">
          <div className="font-semibold text-lg uppercase">{t("Information")}</div>
        </div>

        <div className="flex flex-col gap-3 mt-2 text-[15px]">
          {(isCurrentUser || isManager) && (
            <div className="grid gap-2 items-center grid-cols-[24px_1fr_24px]">
              <Mail width={24} />
              <TextLineCamp
                data-tooltip-id="global-tooltip"
                data-tooltip-content={userProfile?.email}
                data-tooltip-place="top"
              >
                {userProfile?.email}
              </TextLineCamp>
              {userProfile?.approvedEmail ? (
                <span className="text-green-600 flex items-center gap-1 font-normal">
                  <Tooltip label={t("Authenticated")}>
                    <span className="flex items-center">
                      <CircleCheck size={16} className="text-green-600" />
                    </span>
                  </Tooltip>
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1 font-normal">
                  <Tooltip label={t("Unauthenticated")}>
                    <span className="flex items-center">
                      <AlertCircle size={16} className="text-red-600" />
                    </span>
                  </Tooltip>
                </span>
              )}
            </div>
          )}
          {(isCurrentUser || isManager) && (
            <div className="grid gap-2 items-center grid-cols-[24px_1fr_24px]">
              <Phone width={24} />
              <span>{userProfile?.phoneNumber}</span>
              {userProfile?.isVerifiedPhoneNumber ? (
                <span className="text-green-600 flex items-center gap-1 font-normal">
                  <Tooltip label={t("Authenticated")}>
                    <span className="flex items-center">
                      <CircleCheck size={20} className="text-green-600" />
                    </span>
                  </Tooltip>
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1 font-normal">
                  <Tooltip label={t("Unauthenticated")}>
                    <span className="flex items-center">
                      <AlertCircle size={20} className="text-red-600" />
                    </span>
                  </Tooltip>
                </span>
              )}
            </div>
          )}
          <div className="grid gap-2 items-center grid-cols-[24px_1fr_24px]">
            <MapPin width={24} />
            <span>
              {userProfile?.cityName} - {userProfile?.countryName}
            </span>
          </div>
          <div className="grid gap-2 items-center grid-cols-[24px_1fr_24px]">
            <Calendar width={24} />
            <span>{formatDateGMT(userProfile?.createdUtc)}</span>
          </div>
        </div>

        {/* <Divider className="mt-5" size={1} /> */}

        {/* <BoxAchievement
          refetchUserProfile={refetchUserProfile}
          isCurrentUser={isCurrentUser}
          userProfile={userProfile}
        /> */}

        <Divider className="mt-5" size={0} />

        <BoxExperience isCurrentUser={isCurrentUser} userId={userId} />

        <Divider className="mt-5" size={0} />

        <BoxEducation isCurrentUser={isCurrentUser} userId={userId} />

        <Divider className="mt-5" size={0} />

        <SocialInfomation isCurrentUser={isCurrentUser} userProfile={userProfile} isFromLeftBox />

        <Divider className="mt-5" size={0} />

        <SummaryInfomation isCurrentUser={isCurrentUser} userProfile={userProfile} isFromLeftBox />

        <Divider className="mt-5" size={0} />

        <div className="flex justify-between gap-4 mt-5 items-center">
          <div className="font-semibold text-lg uppercase">{t("Skills")}</div>
        </div>

        <div className="flex flex-col gap-3 mt-2 text-[15px]">
          {userSkill?.map((item) => (
            <div key={item.langId} className="grid gap-2 grid-cols-[25px_auto_110px] items-center">
              <Image src={item.logoUrl} height={25} width={25} alt={item.name} />
              <span>{item.name}</span>
              <StarRatings size="md" rating={item.level} />
            </div>
          ))}
        </div>

        <Divider className="mt-5" size={1} />

        <div className="flex justify-between gap-4 mt-5 items-center">
          <div className="font-semibold text-lg uppercase">{t("Certificate")}</div>
        </div>

        <div className="flex flex-col gap-3 mt-2 text-[15px]">
          {_.cloneDeep(userCertificates || [])
            .slice(0, 3)
            .map((item) => {
              const titleVN = item?.multiLangData.find((item) => item?.key === "vn");
              const titleEN = item?.multiLangData.find((item) => item?.key === "en");

              let courseTitleVN, courseTitleEN;

              if (titleVN) {
                courseTitleVN = titleVN?.title;
              } else {
                courseTitleVN = item?.multiLangData[0]?.title;
              }
              if (titleEN) {
                courseTitleEN = titleEN?.title;
              } else {
                courseTitleEN = item?.multiLangData[0]?.title;
              }

              return (
                <Link href={`/share/${item.userEnrollUniqueId}`} target="_blank" key={item.id}>
                  <CertificateImage
                    isDone
                    enrolmentUniqueId={item.userEnrollUniqueId}
                    courseTitleVN={courseTitleVN}
                    courseTitleEN={courseTitleEN}
                    finishedTime={convertDate(item.finishedTime)}
                    userName={item.userName}
                  />
                </Link>
              );
            })}
          <Collapse in={!collapseCert}>
            {!!userCertificates &&
              _.cloneDeep(userCertificates || [])
                .slice(3, userCertificates.length)
                .map((item) => {
                  const titleVN = item?.multiLangData.find((item) => item?.key === "vn");
                  const titleEN = item?.multiLangData.find((item) => item?.key === "en");

                  let courseTitleVN, courseTitleEN;

                  if (titleVN) {
                    courseTitleVN = titleVN?.title;
                  } else {
                    courseTitleVN = item?.multiLangData[0]?.title;
                  }
                  if (titleEN) {
                    courseTitleEN = titleEN?.title;
                  } else {
                    courseTitleEN = item?.multiLangData[0]?.title;
                  }

                  return (
                    <Link href={`/share/${item.userEnrollUniqueId}`} target="_blank" key={item.id}>
                      <CertificateImage
                        isDone
                        enrolmentUniqueId={item.userEnrollUniqueId}
                        courseTitleVN={courseTitleVN}
                        courseTitleEN={courseTitleEN}
                        finishedTime={convertDate(item.finishedTime)}
                        userName={item.userName}
                      />
                    </Link>
                  );
                })}
          </Collapse>
          {userCertificates?.length > 3 && (
            <Button variant="white" className="mx-auto" onClick={() => setCollapseCert((prev) => !prev)}>
              {t(collapseCert ? "See more" : "See less")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxLeft;
