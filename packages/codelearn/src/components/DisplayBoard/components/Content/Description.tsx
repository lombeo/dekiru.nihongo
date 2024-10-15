import { Label, Skeleton } from "@edn/components";
import { Select } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import RawText from "@src/components/RawText/RawText";
import { TaskPoint } from "@src/components/Svgr/components";
import clsx from "clsx";
import Cookies from "js-cookie";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useIdeContext } from "../../../CodelearnIDE/IdeContext";
import styles from "./description.module.scss";

const Description = (props: any) => {
  const { t } = useTranslation();
  const { codeActivity = {} } = useIdeContext();
  const { activity = {}, point, level, limitCodeCharacter } = codeActivity;
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const multiLangData = activity?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  let description = currentLanguage ? currentLanguage.description : activity?.description;

  const localeNames = {
    vi: "Vietnamese",
    en: "English",
    // ja: "Japanese",
  };

  const localeOptions = Object.keys(localeNames)
    .filter(
      (key) =>
        !isEmpty(
          multiLangData?.find((e) => {
            const keyMapLang = key === "vi" ? "vn" : "en";
            return e.key === keyMapLang;
          })?.description
        )
    )
    .map((key) => ({ label: t(localeNames[key]), value: key }));

  if (!description) {
    description = multiLangData?.find((e) => !isEmpty(e.description))?.description;
  }

  const onChangeLanguage = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    Cookies.set("locale", nextLocale);
  };

  return (
    <div className="divide-y-1 space-y-3 pt-3">
      <div className="flex flex-wrap gap-4 items-center text-sm pl-2 pr-3">
        {codeActivity.activity ? (
          <>
            {activity?.owner && (
              <ExternalLink className="pl-2 flex items-center gap-3" href={`/profile/${activity.owner.userId}`}>
                <Avatar
                  userId={activity?.owner?.userId}
                  src={activity?.owner?.avatarUrl}
                  userExpLevel={activity?.owner?.userExpLevel}
                  size="md"
                />
                <Label className="text-primary" text={activity.owner.userName} />
              </ExternalLink>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 pl-1">
            <Skeleton width={52} radius="xl" height={52} />
            <Skeleton width={80} radius="xl" height={20} />
            <Skeleton width={120} radius="xl" height={20} />
          </div>
        )}
        {level && <Label className={clsx(styles.level, level)} text={t(level)} />}
        {point && <Label text={`${point} ${t("Points")}`} icon={<TaskPoint />} />}
        {codeActivity.activity ? (
          <>
            <div className="ml-auto">
              <span className="text-[#898989]">{t("Character limit")}:</span>{" "}
              <span className="text-red-500 font-semibold">
                {limitCodeCharacter == 0 ? t("Unlimited") : limitCodeCharacter}
              </span>
            </div>
            {localeOptions.length > 1 ? (
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
            ) : null}
          </>
        ) : (
          <div className="flex items-center gap-3 ml-auto">
            <Skeleton width={80} radius="xl" height={20} />
            <Skeleton width={80} radius="xl" height={20} />
          </div>
        )}
      </div>
      <div className={clsx("py-5 px-2 border-t", styles.content)}>
        {codeActivity.activity ? (
          <RawText content={description} className="break-words" />
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton height={100} />
            <Skeleton height={200} />
            <Skeleton height={200} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Description;
