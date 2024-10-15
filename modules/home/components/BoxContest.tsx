/* eslint-disable @next/next/no-img-element */
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { CDN_URL } from "@src/config";
import { PubsubTopic } from "@src/constants/common.constant";
import { convertDate, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { selectProfile } from "@src/store/slices/authSlice";
import moment from "moment";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BoxContest = () => {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const [contest, setContest] = useState(null);

  const fetchData = async () => {
    const res = await CodingService.contestGetContestForHome({
      userId: profile?.userId,
      progress: false,
    });
    const data = res?.data?.data;
    setContest(data);
    PubSub.publish(PubsubTopic.UPDATE_SUMMARY_HOME, {
      contest: data,
    });
  };

  useEffect(() => {
    fetchData();
  }, [profile?.userId]);

  return (
    <div className="mt-10">
      <Container size="xl">
        <div id="t7">
          <h3 className="my-0 font-bold text-[#2c31cf] text-[26px]">{t("Coding contest")}</h3>
          <div className="mt-4 lg:gap-7 gap-5 grid lg:grid-cols-2">
            {contest?.suggestedContests?.slice(0, 2)?.map((item) => (
              <ContestItem key={item.id} data={item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BoxContest;

const ContestItem = (props: any) => {
  const { t } = useTranslation();
  const { data } = props;

  const now = moment();

  const isInTimeRegister =
    (now.isSameOrAfter(convertDate(data?.registrationStartTime)) || !data?.isApplyRegisterStart) &&
    now.isBefore(convertDate(data?.registrationEndTime));

  const isToStartContest =
    now.isSameOrAfter(convertDate(data?.registrationEndTime)) && now.isBefore(convertDate(data?.registrationStartTime));

  const isToEndContest = now.isSameOrAfter(convertDate(data?.startTime)) && now.isBefore(convertDate(data?.endTime));

  const isEnded = now.isSameOrAfter(convertDate(data?.endTime));

  return (
    <Link
      href={`/fights/detail/${data.id}`}
      className="transition-all border hover:-translate-y-1.5 overflow-hidden hover:shadow-lg flex flex-col bg-white hover:opacity-100 rounded-md"
    >
      <img
        src={data?.imagePoster?.startsWith("http") ? data?.imagePoster : CDN_URL + data?.imagePoster}
        alt=""
        className="object-cover aspect-[1140/240] w-full"
      />
      <div className="flex flex-col p-5">
        <TextLineCamp>
          <h1 className="m-0 lg:text-[26px] text-[#3b3c54] font-bold text-xl">{data?.title}</h1>
        </TextLineCamp>
        <div className="mb-2 mt-1 min-h-[40px]">{data?.description}</div>
        <div className="mt-auto lg:flex-row flex-col">
          <div>
            {data?.userRegisted ? (
              <div>
                {t("Your ranking")}:&nbsp;
                <span className="text-[#e8505b] lg:text-[24px] text-xl">
                  {data?.position}/{data?.countRegister}
                </span>
              </div>
            ) : (
              <div>
                {t("Registered")}&nbsp;<span className="text-[#e8505b] text-[24px]">{data?.countRegister}</span>&nbsp;
                {data?.isTeam ? t("Team") : t("Individual")}
              </div>
            )}
          </div>
          {data?.userRegisted && !isEnded && (
            <div className="flex justify-between lg:gap-5 lg:flex-row flex-col">
              <div className="text-[#7bc043]">
                {t("Your ranking in the contest is quite high.")}
                <br />
                {t("Keep up the good work!")}
              </div>
              <Button color="red" className="bg-[#e8505b] font-semibold">
                {t("Code now")}
              </Button>
            </div>
          )}
          {!data?.userRegisted && (isInTimeRegister || (data?.isRegisterAnyTime && !isEnded)) && (
            <div className="flex lg:justify-end justify-between lg:gap-5 lg:flex-row flex-col">
              <Button color="orange" className="font-semibold">
                {t("Register now")}
              </Button>
            </div>
          )}
          {isEnded && (
            <div className="text-[#3b3c54] font-semibold flex justify-between">
              <div>
                {t("The contest ended on")}&nbsp;{formatDateGMT(data?.endTime)}
              </div>
              <div>{t("HomePage.Finish")}</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
