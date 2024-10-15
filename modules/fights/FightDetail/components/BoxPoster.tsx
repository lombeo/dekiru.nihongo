import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Group, Image, Skeleton, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "@src/components/Link";
import PinBadge from "@src/components/PinBadge";
import { CDN_URL } from "@src/config";
import { convertDate, FunctionBase } from "@src/helpers/fuction-base.helpers";
import RegisterContestTeamModal from "@src/modules/fights/FightDetail/components/RegisterContestTeamModal";
import useRegisterContest from "@src/modules/fights/FightDetail/hooks/useRegisterContest";
import CountDownContest from "@src/modules/fights/FightIndex/components/CountDownContest";
import CodingService from "@src/services/Coding/CodingService";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { Pencil } from "tabler-icons-react";
import { useHasEveryRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";

interface BoxPosterProps {
  data: any;
  onRegisterSuccess: () => void;
  diffTime: number;
  countRegister: number;
  context: "list" | "detail";
}

const BoxPoster = (props: BoxPosterProps) => {
  const { data, diffTime, countRegister, context, onRegisterSuccess } = props;
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const [isLoadingUnRegister, setIsLoadingUnRegisterUnRegister] = useState(false);
  const [openRegisterTeamModal, setOpenRegisterTeamModal] = useState(false);
  const [directUrl, setDirectUrl] = useState("");

  const isManagerContent = useHasEveryRole([UserRole.ManagerContent]);

  const listActiveActivity = data?.contestActivityDTOs?.filter((activity) => activity.isDeleted == false);

  const activity = listActiveActivity?.length > 0 ? listActiveActivity[0] : null;
  const activityId = activity?.activityId;
  const activityType = activity?.activityType;

  const now = moment().subtract(diffTime);

  useEffect(() => {
    let url = "";
    if (data?.isNewQuizContest) {
      const slug = FunctionBase.slugify(data?.title);
      url = `/event/${slug}`;
    } else {
      url = `/fights/detail/${data?.id}`;
      if (data?.shareKey) {
        url += `?shareKey=${data?.shareKey}`;
      }
    }
    setDirectUrl(url);
  }, [data]);

  const isToStartRegister = now.isBefore(convertDate(data?.registerStart));

  const isInTimeRegister =
    now.isSameOrAfter(convertDate(data?.registerStart)) && now.isBefore(convertDate(data?.registerDeadline));

  const isBeforeDeadlineRegister = now.isBefore(convertDate(data?.registerDeadline));

  const isToEndContest =
    now.isSameOrAfter(convertDate(data?.startDate)) && now.isBefore(convertDate(data?.endTimeCode));

  const isEnded = now.isSameOrAfter(convertDate(data?.endTimeCode));

  const isBeforeStartContest = now.isBefore(convertDate(data?.startDate));

  const isBeforeEndedContest = now.isBefore(convertDate(data?.endTimeCode));

  const { onRegister, isLoading } = useRegisterContest(
    data?.isTeam,
    data?.id,
    () => setOpenRegisterTeamModal(true),
    onRegisterSuccess,
    data?.title
  );

  const isRegistered = !!data && data.registerId > 0;

  const handleClickUnRegister = () => {
    confirmAction({
      message: t("Are you sure you want to cancel this batch registration?"),
      title: t("CONFIRMATION"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        setIsLoadingUnRegisterUnRegister(true);
        const res = await CodingService.contestRegisterCancelRegisted({
          contestId: data.id,
        });
        if (res?.data?.success) {
          onRegisterSuccess();
          Notify.success(t("You have deregistered successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
        setIsLoadingUnRegisterUnRegister(false);
      },
    });
  };

  const numberFormat = new Intl.NumberFormat("vi-VN");

  let isCanRegister = isInTimeRegister;

  if (data) {
    if (!data.isApplyRegisterStart && isBeforeDeadlineRegister) {
      isCanRegister = true;
    }
    if (
      data.isRegisterAnyTime &&
      isBeforeEndedContest &&
      (!data.isApplyRegisterStart || now.isSameOrAfter(convertDate(data?.registerStart)))
    ) {
      isCanRegister = true;
    }
  }

  return (
    <>
      {openRegisterTeamModal && (
        <RegisterContestTeamModal
          contestId={data?.id}
          onSuccess={() => onRegisterSuccess()}
          onClose={() => setOpenRegisterTeamModal(false)}
        />
      )}
      <div className="bg-white text-base">
        <BoxPosterWrap context={context} url={directUrl}>
          <div className="relative">
            {data ? (
              <>
                <Image
                  height="auto"
                  width="100%"
                  alt=""
                  classNames={{ image: "aspect-[1140/240]" }}
                  src={data?.imagePoster?.startsWith("http") ? data?.imagePoster : CDN_URL + data?.imagePoster}
                />
                {data?.isNewQuizContest && isManagerContent && (
                  <Link href={`/fights/edit/${data?.id}`}>
                    <div className="absolute right-[10px] bottom-[10px] rounded-[4px] bg-white w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
                      <Pencil width={18} height={18} color="green" />
                    </div>
                  </Link>
                )}
              </>
            ) : (
              <Skeleton radius={0} height={240} />
            )}
            {data?.isHot && (
              <PinBadge className="right-[24px] left-auto md:top-[-8px]" isHot size={isDesktop ? 130 : 94} />
            )}
          </div>
        </BoxPosterWrap>
        <div className="flex flex-wrap min-h-[61px] px-4 md:py-1 py-2 justify-between gap-5 items-center">
          {data ? (
            <>
              {data?.isNewQuizContest ? (
                <div className="flex justify-between items-center gap-2 w-full">
                  <div className="max-w-[80%] flex flex-col gap-1 sm:flex-row sm:gap-5 text-xs xs:text-sm">
                    <div className="flex items-center flex-wrap ">
                      <span className="mr-1">{t("Start time")}:</span>
                      <span className="font-semibold text-[red]">
                        {formatDateGMT(data?.startDate, "HH:mm DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap">
                      <span className="mr-1">{t("End time")}:</span>
                      <span className="font-semibold text-[red]">
                        {formatDateGMT(data?.endTimeCode, "HH:mm DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/event/${FunctionBase.slugify(data?.title)}`}
                    className="rounded-md bg-[#506CF0] py-2 px-3 xs:px-6 text-xs xs:text-sm text-white whitespace-nowrap"
                  >
                    {t("View detail")}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-start">
                  <Text>
                    {data?.limitRegister > 0 ? t("Limit register") : t("Register")}:{" "}
                    <b className="text-[#f00] font-semibold">
                      {data?.limitRegister > 0 ? `${countRegister}/${data?.limitRegister}` : countRegister}
                    </b>{" "}
                    &nbsp;&nbsp;
                    {data?.isRequireApproval ? (
                      <>
                        {" "}
                        | &nbsp; {t("Waiting for approval")}:{" "}
                        <b className="text-[#faa05e] font-semibold">{data?.countWaiting || 0}</b>{" "}
                      </>
                    ) : null}
                  </Text>
                  {data && (
                    <div className="mx-auto">
                      <CountDownContest diffTime={diffTime} data={data} />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Skeleton height={22} width={200} />
          )}

          {!data?.isNewQuizContest && (
            <>
              {isToStartRegister && data && data.isApplyRegisterStart && !isRegistered ? (
                <Text color="#f69046">{t("Waiting Register")}</Text>
              ) : null}
              {data && data.price > 0 && (
                <div className="mr-auto">
                  <div className="gap-1 inline-flex h-[56px] w-[162px] items-center justify-center bg-contain bg-no-repeat bg-[url('/images/price-contest.png')]">
                    <Image src={`/images/coin.png`} fit="contain" width={26} height={26} alt="coin" />
                    <div
                      className={clsx("text-xl font-[900] text-[#DBFF00]", {
                        "text-lg": data.price > 999999,
                      })}
                    >
                      {numberFormat.format(data.price)}
                    </div>
                  </div>
                </div>
              )}
              {isCanRegister ? (
                <>
                  {profile ? (
                    <>
                      {isRegistered && (!data?.isTeam || data?.isRegisterLead) && isBeforeStartContest ? (
                        <Group spacing="xs">
                          {data?.isWaitingApprove && <Text color="yellow">{t("Waiting for approval")}</Text>}
                          <Button
                            loading={isLoadingUnRegister}
                            uppercase
                            onClick={handleClickUnRegister}
                            color="red"
                            variant="outline"
                          >
                            {t("Cancel")}
                          </Button>
                        </Group>
                      ) : null}
                      {!isRegistered && (
                        <Button
                          uppercase
                          loading={isLoading}
                          color="orange"
                          onClick={onRegister}
                          className="mx-auto screen1024:mx-0"
                        >
                          {t("Register now")}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Text
                      c="red"
                      className="hover:underline cursor-pointer"
                      onClick={() => dispatch(setOpenModalLogin(true))}
                    >
                      {t("Please login to continue")}
                    </Text>
                  )}
                </>
              ) : null}
              {isToEndContest && isRegistered && activity ? (
                <Button
                  onClick={() => {
                    router.push(`/fights/detail/${data?.id}?activityId=${activityId}&activityType=${activityType}`);
                  }}
                  color="green"
                  className="mx-auto lg:mx-0"
                >
                  {t("Start Now")}
                </Button>
              ) : null}
              {isEnded && activity ? (
                <Button
                  onClick={() => {
                    router.push(`/fights/detail/${data?.id}?activityId=${activityId}&activityType=${activityType}`);
                  }}
                  disabled={!isRegistered && data && data.isRegisterViewActivity && !data.isAdmin}
                  color="blue"
                  className="mx-auto lg:mx-0"
                  variant="outline"
                >
                  {t("View detail")}
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BoxPoster;

const BoxPosterWrap = ({ context, children, url }: PropsWithChildren<{ context: "list" | "detail"; url: string }>) => {
  if (context === "detail") {
    return <>{children}</>;
  }

  return (
    <Link href={url}>
      <div className="cursor-pointer">{children}</div>
    </Link>
  );
};
