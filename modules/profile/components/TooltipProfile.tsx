import { Trans, useTranslation } from "next-i18next";
import Image from "next/image";
import { User } from "tabler-icons-react";

const BoxActivity = (props: any) => {
  const { userProfile } = props;

  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-md shadow-md p-5 relative">
      <div className="flex justify-between gap-4 items-center ">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg uppercase">{t("ProfilePage.Activity")}</span>
          {/*<span className="text-sm">(38)</span>*/}
        </div>
      </div>
      <div className="flex gap-1 items-center mt-3">
        <User width={20} height={20} />
        {userProfile?.displayName || userProfile?.userName}
      </div>

      <div className="grid gap-8 grid-cols-3 mt-5">
        {new Array(3).fill(null).map((item, index) => (
          <div key={index} className="flex items-center flex-col justify-center gap-2">
            <Image
              src={index > 0 ? "/images/level-activity-lock.png" : "/images/level-activity.png"}
              width={86}
              height={95}
              className="max-w-full"
              alt=""
            />
            <div className="font-semibold text-[#2C31CF]">
              {t("Level")} {(userProfile?.userExpLevel?.levelNo || 0) + index}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Image src={"/images/progress-level.png"} className="max-w-full" width={382} height={12} alt="" />
      </div>

      {userProfile?.userExpLevel && (
        <div className="text-[#F36A04] mt-4">
          <Trans
            i18nKey="MISSING_EXP"
            t={t}
            values={{
              count: userProfile.userExpLevel.nextLevelExp - userProfile.userExpLevel.currentUserExperiencePoint,
            }}
          >
            Missing <strong className="font-[900]">1</strong> <strong className="font-[900] text-[#18880E]">XP</strong>{" "}
            to get to the next level!
          </Trans>
        </div>
      )}
    </div>
  );
};

export default BoxActivity;
