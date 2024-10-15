import { Label, Skeleton } from "@edn/components";
import { Select, Text } from "@mantine/core";
import { useActivityContext } from "@src/components/Activity/context";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import RawText from "@src/components/RawText/RawText";
import { TaskPoint } from "@src/components/Svgr/components";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { ActivityContextType } from "@src/services/Coding/types";
import clsx from "clsx";
import Cookies from "js-cookie";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Help } from "tabler-icons-react";
import styles from "./Description.module.scss";

const Description = (props: any) => {
  const { t } = useTranslation();
  const { activityType, contextId, contextType, permalink, activityId, activityDetails, activity, isFetched } =
    useActivityContext();
  const router = useRouter();
  const { asPath, query, locale } = router;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const multiLangData = activityDetails?.multiLangData;
  const currentLanguage = multiLangData?.find((e) => e.key === keyLocale);
  let description = currentLanguage ? currentLanguage.description : activityDetails?.description;

  let pathname = `/fights/detail/${contextId}`;
  if (contextType === ActivityContextType.Training) {
    pathname = `/training/${contextId}`;
  } else if (contextType === ActivityContextType.Challenge) {
    pathname = `/challenge/${permalink}`;
  } else if (contextType === ActivityContextType.Evaluating) {
    pathname = `/evaluating/detail/${contextId}/${activityId}`;
  }

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
    router.push({ pathname: router.pathname, query }, asPath, { locale: nextLocale });
    Cookies.set("locale", nextLocale);
  };

  return (
    <div className="divide-y-1">
      <div className="flex flex-wrap gap-4 items-center text-sm px-4 min-h-[52px]">
        {isFetched ? (
          <>
            {activityDetails?.owner && (
              <Link className="flex items-center gap-3" href={`/profile/${activityDetails.owner.userId}`}>
                <Avatar
                  userExpLevel={activityDetails?.owner?.userExpLevel}
                  src={activityDetails?.owner?.avatarUrl}
                  userId={activityDetails?.owner?.userId}
                  size="md"
                />
                <Label className="text-primary" text={activityDetails.owner.userName} />
              </Link>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 pl-1">
            <Skeleton width={52} radius="xl" height={52} />
            <Skeleton width={80} radius="xl" height={20} />
            <Skeleton width={120} radius="xl" height={20} />
          </div>
        )}
        {activity?.level ? <Label className={clsx(styles.level, activity?.level)} text={t(activity?.level)} /> : null}
        {activity?.point ? <Label text={`${activity?.point} ${t("Points")}`} icon={<TaskPoint />} /> : null}

        <>
          {isFetched ? (
            <>
              {activityType === ActivityTypeEnum.Code && (
                <div className="ml-auto">
                  <span className="text-[#898989]">{t("Character limit")}:</span>{" "}
                  <span className="text-red-500 font-semibold">
                    {activity?.limitCodeCharacter === 0 ? t("Unlimited") : activity?.limitCodeCharacter}
                  </span>
                </div>
              )}
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
            </>
          ) : (
            <div className="flex items-center gap-3 ml-auto">
              <Skeleton width={80} radius="xl" height={20} />
              <Skeleton width={80} radius="xl" height={20} />
            </div>
          )}
        </>
      </div>
      <div className={clsx("py-5 px-4 border-t mt-2", styles.content)}>
        {isFetched ? (
          <>
            <RawText content={description} className="break-words" />
            {activityType === ActivityTypeEnum.Quiz ? (
              ""
            ) : (
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    {
                      pathname,
                      query: {
                        activityId,
                        activityType,
                        tab: "help",
                      },
                    },
                    null,
                    {
                      shallow: true,
                    }
                  );
                }}
                href={`${pathname}?activityId=${activityId}&activityType=${activityType}&tab=help`}
              >
                <div className="text-primary flex items-start gap-2">
                  <Help width={16} className="py-1" height={24} />
                  <Text c="inherit">{t("If you don't know how to submit your code, see FAQ here.")}</Text>
                </div>
              </Link>
            )}
          </>
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
