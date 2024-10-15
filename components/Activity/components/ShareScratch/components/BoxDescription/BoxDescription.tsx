import { Label } from "@edn/components";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { clsx, Select } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import RawText from "@src/components/RawText/RawText";
import { TaskPoint } from "@src/components/Svgr/components";
import Cookies from "js-cookie";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "./BoxDescription.module.scss";

interface BoxDescriptionProps {
  activity: any;
}

const BoxDescription = (props: BoxDescriptionProps) => {
  const { activity } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const { asPath, query, locale } = router;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const multiLangData = activity?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  const title = currentLanguage ? currentLanguage.title : activity?.title;
  const description = currentLanguage ? currentLanguage.description : activity?.description;

  const onChangeLanguage = (nextLocale: string) => {
    router.push({ pathname: router.pathname, query }, asPath, { locale: nextLocale });
    Cookies.set("locale", nextLocale);
  };

  const localeNames = {
    vi: "Vietnamese",
    en: "English",
  };

  const localeOptions = Object.keys(localeNames)
    .filter(
      (key) =>
        !_.isEmpty(
          multiLangData?.find((e) => {
            const keyMapLang = key === "vi" ? "vn" : "en";
            return e.key === keyMapLang;
          })?.description
        )
    )
    .map((key) => ({ label: t(localeNames[key]), value: key }));

  return (
    <div className="relative w-full border-r p-4 shadow-[0px_5px_12px_0px_#0000001A]">
      <div className="divide-y-1">
        <div className="flex flex-wrap gap-4 items-center justify-between text-sm min-h-[52px]">
          {activity?.owner && (
            <Link className="flex items-center gap-3" href={`/profile/${activity.owner.userId}`}>
              <Avatar
                userExpLevel={activity?.owner?.userExpLevel}
                src={activity?.owner?.avatarUrl}
                userId={activity?.owner?.userId}
                size="md"
              />
              <TextLineCamp className="text-primary max-w-[100px]">{activity.owner.userName}</TextLineCamp>
            </Link>
          )}
          {activity?.level ? <Label className={clsx(styles.level, activity?.level)} text={t(activity?.level)} /> : null}
          {activity?.point ? <Label text={`${activity?.point} ${t("Points")}`} icon={<TaskPoint />} /> : null}
          {multiLangData && multiLangData.length > 1 && (
            <div>
              <Select
                size="xs"
                radius={0}
                classNames={{ input: styles["select-language"] }}
                onChange={onChangeLanguage}
                value={locale}
                data={localeOptions}
              />
            </div>
          )}
        </div>
        <RawText content={description} className="overflow-auto break-words max-w-full" />
      </div>
    </div>
  );
};

export default BoxDescription;
