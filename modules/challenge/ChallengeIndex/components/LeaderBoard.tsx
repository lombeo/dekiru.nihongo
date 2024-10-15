import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, clsx, Group, Image, Pagination, Select, Tooltip } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import CodingService from "@src/services/Coding/CodingService";
import { isNil, toString } from "lodash";
import { Trans, useTranslation } from "next-i18next";
import { Minus, Plus, Refresh } from "tabler-icons-react";

export const useLanguageOptions = () => {
  const { t } = useTranslation();

  return [
    {
      label: t("All"),
      value: "0",
    },
    {
      label: "C++",
      value: "cplus",
    },
    {
      label: "C#",
      value: "csharp",
    },
    {
      label: "Java",
      value: "java",
    },

    {
      label: "Javascript",
      value: "js",
    },

    {
      label: "Python 2",
      value: "python2",
    },

    {
      label: "Python 3",
      value: "python3",
    },
    {
      label: "GO",
      value: "golang",
    },
    {
      label: "C",
      value: "c",
    },
    {
      label: "Postgresql",
      value: "Postgresql",
    },
    {
      label: "MySql",
      value: "MySql",
    },
  ];
};

const LeaderBoard = (props: any) => {
  const { filter, data, setFilter } = props;
  const { t } = useTranslation();

  const languageOptions = useLanguageOptions();

  const isContentManager = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent]);
  const getRank = (index: number) => {
    if (index > 2) return index + 1;
    return <Image width={35} height={35} fit="cover" alt="" src={`/images/top${index}.svg`} />;
  };

  const handleSync = () => {
    confirmAction({
      title: t("CONFIRMATION"),
      htmlContent: (
        <Trans i18nKey="ChallengePage.CONFIRM_SYNC_TASK" t={t}>
          Do you want to sync task to this challenge?{" "}
          <strong>This will affect the content of the task and the results of the challenge.</strong>
        </Trans>
      ),
      onConfirm: async () => {
        const res = await CodingService.challengeynchronizeTask({ challengeId: data?.id });
        if (res?.data?.success) {
          Notify.success(t("Sync task successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };

  return (
    <div className="bg-white p-5 rounded-b-xl overflow-hidden shadow-lg">
      {isContentManager && (
        <div className="flex justify-end bg-white">
          <Link href={`/challenge/create`}>
            <Button className="font-semibold h-[45px] text-base px-4" leftIcon={<Plus width={20} />}>
              {t("Create")}
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">
        <h1 className="text-[#1e266d] text-[26px]">{t("Ranking")}</h1>
        <Group>
          <Select
            data={languageOptions}
            className="lg:w-[160px] w-full"
            value={isNil(filter?.languageKey) ? "0" : toString(filter.languageKey)}
            onChange={(value) =>
              setFilter((prev) => ({ ...prev, pageIndex: 1, languageKey: value === "0" ? null : value }))
            }
          />
          {isContentManager && (
            <Tooltip label={t("Synchronize task")}>
              <ActionIcon h="36px" w="36px" onClick={handleSync} color="indigo" size="md" variant="outline">
                <Refresh width={20} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </div>

      <div className="mt-5">
        <div>
          <div className="hidden lg:grid lg:grid-cols-[70px_1fr_1fr_1fr_1fr] pt-2 pb-4 border-b border-b-[#d4d5dd]">
            <div className="w-[60px] !text-center !text-[#b3b4c9] !font-semibold">{t("No.")}</div>
            <div className="!text-[#b3b4c9] !font-semibold">{t("Username")}</div>
            <div className="px-4 !text-[#b3b4c9] !font-semibold">{t("Language")}</div>
            <div className="px-4 !text-[#b3b4c9] !font-semibold">{t("Point")}</div>
            <div className="px-4 !text-[#b3b4c9] !font-semibold">{t("Running time")} (ms)</div>
          </div>
        </div>
        <div>
          {new Array(10).fill(null).map((_, index) => {
            const stt = (filter.pageIndex - 1) * filter.pageSize + index;
            const item = data?.leaderBoard?.results?.[index];
            return (
              <div
                className={clsx("grid lg:grid-cols-[70px_1fr_1fr_1fr_1fr] ", {
                  "bg-[#F5F5F5]": index % 2 === 0,
                })}
                key={item?.id || index}
              >
                <div className="hidden lg:flex justify-center items-center text-base font-semibold border-b border-b-[#d4d5dd]">
                  {getRank(stt)}
                </div>
                <div className="grid gap-1 lg:grid-cols-[54px_auto] grid-cols-[92px_32px_auto] pb-4 pt-3 items-center border-b border-b-[#d4d5dd]">
                  <div className="lg:hidden flex justify-center items-center text-base font-semibold">
                    {getRank(stt)}
                  </div>
                  {item ? (
                    <>
                      <Avatar
                        userId={item.userId}
                        userExpLevel={item.userExpLevel}
                        size="lg"
                        src={item.userAvatarUrl}
                      />
                      <Link href={`/profile/${item.userId}`} className="pl-4 lg:pl-0">
                        <TextLineCamp className="hover:underline text-[#2c31cf] font-semibold text-base">
                          {item.userName}
                        </TextLineCamp>
                      </Link>
                    </>
                  ) : (
                    <Minus color="#b3b4c9" />
                  )}
                </div>
                <div className="py-2 px-4 border-b border-b-[#d4d5dd] flex items-center">
                  <div className="w-[80px] text-sm text-[#868686] inline lg:hidden">{t("Language")}</div>
                  {item ? (
                    <span className="font-semibold text-base">
                      {languageOptions?.find((e) => e.value === item.languageKey)?.label || item.languageKey}
                    </span>
                  ) : (
                    <Minus color="#b3b4c9" />
                  )}
                </div>
                <div className="py-2 px-4 flex items-center border-b border-b-[#d4d5dd]">
                  <div className="w-[80px] text-sm text-[#868686] inline lg:hidden">{t("Point")}</div>
                  {item ? (
                    <div>
                      <span className="font-semibold text-[#e8505b] text-base">{item.score}</span>&nbsp;
                      <span className="text-sm text-[#b3b4c9]">
                        ({item.tries} {item.tries > 1 ? t("tries") : t("try")})
                      </span>
                    </div>
                  ) : (
                    <Minus color="#b3b4c9" />
                  )}
                </div>
                <div className="py-2 px-4 flex items-center border-b border-b-[#d4d5dd]">
                  <div className="w-[80px] text-sm text-[#868686] inline lg:hidden">{t("Running time")} (ms)</div>
                  {item ? (
                    <span className="font-semibold text-base">{item.totalExcuteTime}</span>
                  ) : (
                    <Minus color="#b3b4c9" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {data?.leaderBoard && (
        <Group position="center" className="py-6">
          <Pagination
            withEdges
            value={filter.pageIndex}
            onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
            total={data.leaderBoard.pageCount}
          />
        </Group>
      )}
    </div>
  );
};

export default LeaderBoard;
