import { Image, clsx } from "@mantine/core";
import { Container } from "@src/components";
import StarRatings from "@src/components/StarRatings";
import CodingService from "@src/services/Coding/CodingService";
import { selectProfile } from "@src/store/slices/authSlice";
import "moment/locale/vi";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BoxActivity = () => {
  const profile = useSelector(selectProfile);
  const { t } = useTranslation();
  const [userActivities, setUserActivities] = useState(null);
  const [userSkill, setUserSkill] = useState(null);

  const router = useRouter();
  const locale = router.locale;
  moment.locale(locale);

  useEffect(() => {
    if (!profile?.userId) return;
    refetchUserActivity();
    refetchUserSkill();
  }, [profile?.userId]);

  const refetchUserActivity = async () => {
    const res = await CodingService.getUserActivityStatistics({
      userId: profile?.userId,
      progress: false,
    });
    setUserActivities(res?.data?.data);
  };

  const refetchUserSkill = async () => {
    const res = await CodingService.userGetUserSkillStatitics({
      userId: profile?.userId,
      progress: false,
      isHomePage: true,
    });
    setUserSkill(res?.data?.data);
  };

  return (
    <div className="mt-10">
      <Container size="xl">
        <div className="grid lg:grid-cols-[8fr_4fr] lg:gap-8 gap-5">
          <div id="t9">
            <h3 className="my-0 font-bold text-[#2c31cf] text-[26px]">{t("Your Activity")}</h3>
            <div className="mt-4 bg-white rounded-md border p-5 relative">
              <div className="grid grid-cols-7 text-[13px] gap-2">
                {new Array(7).fill(null).map((_, index) => (
                  <div key={index} className="text-[#898989] flex items-center justify-center">
                    {moment().startOf("isoWeek").add(index, "day").format("ddd")}
                  </div>
                ))}
                {userActivities?.map((item) => (
                  <div key={item.label} className={clsx("flex items-center justify-center")}>
                    {!item.isPadding && (
                      <div
                        className={clsx(
                          "bg-[#e9eafa] text-[9px] lg:w-[38px] lg:text-[13px] w-[32px] h-[22px] rounded-sm flex items-center justify-center",
                          {
                            "bg-[#aaaceb]": item.activityLevel === 2,
                            "bg-[#6b6edd] text-white": item.activityLevel === 3,
                            "bg-[#2c31cf] text-white": item.activityLevel === 4,
                          }
                        )}
                      >
                        {item.isLabelVisible ? item.label : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 border-t pt-4 mt-5">
                {t("ProfilePage.Activity")}
                {new Array(4).fill(null).map((_, index) => (
                  <div
                    key={index}
                    className={clsx("bg-[#e9eafa] w-[20px] h-[20px] rounded-sm", {
                      "bg-[#aaaceb]": index === 1,
                      "bg-[#6b6edd]": index === 2,
                      "bg-[#2c31cf]": index === 3,
                    })}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BoxActivity;
