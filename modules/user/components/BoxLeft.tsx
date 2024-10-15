import Link from "@src/components/Link";
import { validateUsername } from "@src/helpers/fuction-base.helpers";
import { selectProfile } from "@src/store/slices/authSlice";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { AlertCircle } from "tabler-icons-react";

const BoxLeft = ({ activeIndex }: { activeIndex: number }) => {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);

  const isWarningInfo = validateUsername(profile?.userName);

  return (
    <div className="bg-white rounded-md shadow-md p-7 flex flex-col gap-4 max-h-[85vh] sm:sticky sm:top-20">
      {[
        {
          href: "/user/information/",
          label: t("Information & Contact"),
        },
        {
          href: "/user/information/changeusername",
          label: (
            <div className="flex items-center gap-1">
              {t("Change username")}{" "}
              {isWarningInfo && (
                <AlertCircle
                  width={20}
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={t(
                    "Your account has been limited in some features due to the lack of an updated account name. Update it now!"
                  )}
                  data-tooltip-place="top"
                  className="text-orange-500"
                />
              )}
            </div>
          ),
        },
        {
          href: "/user/information/changepassword",
          label: t("Change password"),
        },
        // {
        //   href: "/team",
        //   label: t("Team Management"),
        // },
        // {
        //   href: "/user/cv",
        //   label: t("My CV"),
        // },
      ].map((e, index) => (
        <Link
          className={clsx("text-sm hover:font-semibold hover:text-[#2c31cf] hover:opacity-100", {
            "text-[#2c31cf] font-semibold": index === activeIndex,
          })}
          href={e.href}
          key={e.href}
        >
          {e.label}
        </Link>
      ))}
    </div>
  );
};

export default BoxLeft;
