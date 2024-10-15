import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { PropsWithChildren } from "react";

interface BadgeProps {
  isHot?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isBest?: boolean;
  isTrending?: boolean;
  isFree?: boolean;
  className?: string;
}

const LabelBadge = (props: PropsWithChildren<BadgeProps>) => {
  const { children, className, isFree, isHot, isTrending, isBest, isPopular, isNew } = props;
  const { t } = useTranslation();

  let label = null;

  if (isHot) {
    label = t("Hot");
  }

  if (isTrending) {
    label = t("Trending");
  }

  if (isBest) {
    label = t("Best");
  }

  if (isPopular) {
    label = t("Popular");
  }

  if (isNew) {
    label = t("New");
  }

  if (isFree) {
    label = t("Free");
  }

  if (!label) return null;

  return (
    <div
      className={clsx(
        "text-sm h-[21px] font-semibold w-fit rounded-[5px] flex justify-center items-center px-3",
        className,
        {
          "bg-[#BCE2A4]": isNew,
          "bg-[#FDC7C7] text-[#FF0000]": isHot,
          "bg-[#FFF177]": isFree,
          "bg-[#FCC99F]": isPopular,
          "bg-[#9BE7FF]": isBest,
          "bg-[#CBB5FF]": isTrending,
        }
      )}
    >
      {children || label}
    </div>
  );
};

export default LabelBadge;
