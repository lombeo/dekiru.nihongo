import { clsx } from "@mantine/core";
import moment from "moment";
import "moment/locale/vi";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const BoxActivity = (props: any) => {
  const { userActivities } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  moment.locale(locale);

  return (
    <div className="bg-white rounded-md shadow-md p-5 relative">
      <div className="flex justify-between gap-4 items-center ">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-lg uppercase">{t("ProfilePage.Activity")}</span>
          {/*<span className="text-sm">(38)</span>*/}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 text-[13px] gap-[10px]">
        {new Array(7).fill(null).map((_, index) => (
          <div key={index} className="text-[#5E5A5A] flex items-center justify-center">
            {moment().startOf("isoWeek").add(index, "day").format("ddd")}
          </div>
        ))}
        {userActivities?.map((item) => (
          <div key={item.label} className={clsx("flex items-center justify-center")}>
            {!item.isPadding && (
              <div
                className={clsx(
                  "bg-[#e9eafa] text-[9px] w-[32px] h-[22px] rounded-sm flex items-center justify-center",
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
      <div className="flex items-center gap-2 border-t pt-4 mt-5">
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
  );
};

export default BoxActivity;
