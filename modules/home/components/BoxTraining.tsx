import { Label } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Link from "@src/components/Link";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { getLevelLabel } from "@src/services/Coding/types";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BoxTraining = () => {
  const profile = useSelector(selectProfile);
  const { t } = useTranslation();

  const [training, setTraining] = useState(null);

  useEffect(() => {
    refetchTraining();
  }, [profile?.userId]);

  const refetchTraining = async () => {
    const res = await CodingService.trainingGetTrainingBlock({
      userId: profile?.userId,
      progress: false,
    });
    const data = res?.data?.data;
    setTraining(data);
    PubSub.publish(PubsubTopic.UPDATE_SUMMARY_HOME, {
      training: data,
    });
  };

  return (
    <div className="flex flex-col h-full" id="t6">
      <div className="flex gap-5 flex-wrap justify-between items-center">
        <h3 className="my-0 font-bold text-[#2c31cf] text-[26px]">{t("Daily Challenge")}</h3>
        <Link href="/training">{t("See all")}</Link>
      </div>

      <div className="mt-5 bg-white p-5 rounded-md flex-auto border">
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="lg:text-[24px] border border-dashed p-4 flex flex-col rounded-md">
            <div className="font-semibold text-[#7bc043]">
              {training?.numOfEasySolved}/{training?.numOfEasyTask}
            </div>
            <div>{t("Easy")}</div>
          </div>
          <div className="lg:text-[24px] border border-dashed p-4 flex flex-col rounded-md">
            <div className="font-semibold text-[#faa05e]">
              {training?.numOfMediumSolved}/{training?.numOfMediumTask}
            </div>
            <div>{t("Medium")}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 lg:mt-7 mt-5 lg:gap-7 gap-5">
          {training?.listSuggestTraining?.map((item) => (
            <TrainingItem key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoxTraining;

const numberFormat = new Intl.NumberFormat("vi-VN", { maximumSignificantDigits: 3 });

const TrainingItem = (props: any) => {
  const { data } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const currentMultiLang = data?.multiLangData?.find((e) => e.key === keyLocale) || data?.multiLangData?.[0];
  const tags = data?.tags?.split(",")?.filter((e) => !isEmpty(e));

  const percent = data?.totalSubmit ? (data.totalCompleted / data.totalSubmit) * 100 : 0;

  let iconPercent = "/images/training/user_progress_0.png";
  if (percent >= 70 && percent < 90) {
    iconPercent = "/images/training/user_progress_70.png";
  } else if (percent >= 90) {
    iconPercent = "/images/training/user_progress_100.png";
  }

  return (
    <Link
      href={`/training/${data?.id}`}
      className="hover:opacity-100 h-full flex flex-col justify-between bg-white shadow-md border rounded-xl flex-auto transition-all hover:-translate-y-1.5  hover:shadow-lg"
    >
      <div className="p-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-center justify-center">
          <TextLineCamp className="font-semibold text-center lg:text-xl text-base text-[#1E266D]">
            {currentMultiLang?.title}
          </TextLineCamp>
          {data && (
            <Label
              className={clsx(
                "text-sm h-[24px] font-semibold flex-none px-3 rounded-xl text-white flex items-center justify-center capitalize",
                {
                  "bg-[#77C148]": data.levelId === 1,
                  "bg-[#faa05e]": data.levelId === 2,
                  "bg-[#ee4035]": data.levelId === 3,
                }
              )}
              text={t(getLevelLabel(data.levelId))}
            />
          )}
        </div>

        {!!tags && tags.length > 0 && (
          <div className="flex-wrap h-[25px] overflow-hidden justify-center flex gap-2 text-xs text-[#333] mt-3">
            {tags.map((item) => (
              <div key={item} className="bg-[#F5F6F7] px-[10px] h-[25px] flex items-center rounded-md">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-b-xl mt-auto h-[42px] font-semibold text-sm text-[#65656D] bg-[#F5F6F7] px-4 flex items-center justify-between">
        <div className="flex gap-[6px] items-center">
          <Image alt="user-percent" src={iconPercent} height={24} width={24} />
          <span>{FunctionBase.formatNumber(percent, { maximumSignificantDigits: 3 })}%</span>
        </div>
        <div className="flex gap-[6px] items-center">
          <Image alt="heart" src="/images/training/heart.png" width={20} height={20} />
          <span>{data?.point}</span>
        </div>
      </div>
    </Link>
  );
};
