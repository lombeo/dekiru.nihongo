import { useTranslation } from "next-i18next";
import Link from "@src/components/Link";
import styles from "./styles.module.scss";

function EventBoxBadge({ label, bgColor, textColor }) {
  return (
    <div
      className="w-fit rounded-lg px-4 py-1.5 text-xs font-semibold"
      style={{ background: `${bgColor}`, color: `${textColor}` }}
    >
      {label}
    </div>
  );
}

export default function EventBox({ data }) {
  const { t } = useTranslation();

  return (
    <Link href={data?.href}>
      <div className="rounded-[6px] overflow-hidden cursor-pointer" style={{ boxShadow: "0 4px 12px 0 #0D0A2C0F" }}>
        <div className="h-[230px] border-b-[1px]">
          <img src={data?.image} className="w-full h-full" />
        </div>
        <div className="p-4 text-[#111928] bg-white">
          <EventBoxBadge label={t("Finished")} bgColor="#EDF0FD" textColor="#637381" />
          <div className={`${styles["event-box__title"]} text-[18px] mt-3  font-bold min-h-[54px]`}>{data?.title}</div>
          <div className={`${styles["event-box__description"]} text-sm mt-1 min-h-[40px]`}>{data?.description}</div>
        </div>
      </div>
    </Link>
  );
}
