import { UsersGroup } from "@src/components/Svgr/components";
import { getCurrentLang } from "@src/helpers/helper";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Briefcase, Clock, HourglassEmpty, MilitaryAward, School, User, Users } from "tabler-icons-react";

const BoxGeneralInfo = (props: any) => {
  const { data, status } = props;
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;

  return (
    <div className="rounded-md shadow-md bg-white p-5">
      <div className="font-semibold text-xl text-[#FF4D00]">{t("General information")}</div>
      <div className="flex flex-col gap-5 mt-4 text-sm">
        <div className="grid gap-4 grid-cols-[44px_auto] items-center">
          <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
            <MilitaryAward width={20} height={20} color="#9E9E9E" />
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <div>{t("Job level")}</div>
            <div className="font-semibold">{getCurrentLang(data?.jobLevel, locale)?.name}</div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[44px_auto] items-center">
          <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
            <HourglassEmpty width={20} height={20} color="#9E9E9E" />
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <div>{t("Experience")}</div>
            <div className="font-semibold">{getCurrentLang(data?.experience, locale)?.name}</div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[44px_auto] items-center">
          <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
            <Users width={20} height={20} color="#9E9E9E" />
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <div>{t("Number of recruitment")}</div>
            <div className="font-semibold">{data?.numberOfRecruitment}</div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[44px_auto] items-center">
          <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
            <Briefcase width={20} height={20} color="#9E9E9E" />
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <div>{t("Type of employment")}</div>
            <div className="font-semibold">{getCurrentLang(data?.workingType, locale)?.name}</div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[44px_auto] items-center">
          <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
            <User width={20} height={20} color="#9E9E9E" />
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <div>{t("Gender requirement")}</div>
            <div className="font-semibold">{getCurrentLang(data?.gender, locale)?.name}</div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-[44px_auto] items-center">
          <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
            <School width={20} height={20} color="#9E9E9E" />
          </div>
          <div className="flex flex-col gap-1 justify-between">
            <div>{t("Degree")}</div>
            <div className="font-semibold">{getCurrentLang(data?.literacy, locale)?.name}</div>
          </div>
        </div>

        {data?.probationDuration && (
          <div className="grid gap-4 grid-cols-[44px_auto] items-center">
            <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
              <Clock width={20} height={20} color="#9E9E9E" />
            </div>
            <div className="flex flex-col gap-1 justify-between">
              <div>{t("Probation duration")}</div>
              <div className="font-semibold">
                {data.probationDuration} {t(data.probationDuration > 1 ? "months" : "month")}
              </div>
            </div>
          </div>
        )}

        {data?.minAge || data?.maxAge ? (
          <div className="grid gap-4 grid-cols-[44px_auto] items-center">
            <div className="bg-[#F3F3F3] flex items-center justify-center h-[44px] w-[44px] rounded-full">
              <UsersGroup width={20} height={20} color="#9E9E9E" />
            </div>
            <div className="flex flex-col gap-1 justify-between">
              <div>{t("Age range")}</div>
              <div className="font-semibold">
                {isNil(data?.minAge) && `${t("Maximum age")} ${data?.maxAge}`}
                {isNil(data?.maxAge) && `${t("Minimum age")} ${data?.minAge}`}
                {!isNil(data?.minAge) && !isNil(data?.maxAge)
                  ? `${data?.minAge} - ${data?.maxAge} ${t("years old")}`
                  : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BoxGeneralInfo;
