/* eslint-disable @next/next/no-img-element */
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { clsx, HoverCard, Image, Text } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";
import { NotFound } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";

interface TableRankProps {
  listRank: any;
  userRank: any;
  searchText: any;
}
const TableRank = (props: TableRankProps) => {
  const { t } = useTranslation();
  const { listRank, userRank, searchText } = props;
  const numberFormat = new Intl.NumberFormat();

  return (
    <>
      {listRank?.length > 0 ? (
        <div className="mt-4">
          <div className="border-b-2">
            <div className="grid grid-cols-[40px_1fr_68px_60px] gap-2 md:grid-cols-[1fr_10fr_4fr_3fr] md:justify-between h-[57px] items-center px-4 text-[#898989] italic font-semibold">
              <div className="">#</div>
              <div className="">{t("Username")}</div>
              <div className="">{t("Country")}</div>
              <div className="">EXP</div>
            </div>
          </div>
          <div>
            {userRank && !searchText && !listRank?.find((value) => value.userId == userRank?.userId) && (
              <div
                key={`${userRank?.userId} - ${userRank?.rank}`}
                className="grid grid-cols-[40px_1fr_68px_60px] gap-2 md:grid-cols-[1fr_10fr_4fr_3fr] md:justify-between h-[70px] items-center px-4 border-2 shadow-md border-yellow-300"
              >
                <div className="">{FunctionBase.formatNumber(userRank?.rank)}</div>
                <div className="flex items-start md:gap-5 gap-3">
                  <Avatar
                    size="lg"
                    src={userRank?.avatarUrl}
                    userExpLevel={userRank?.userExpLevel}
                    userId={userRank?.userId}
                  />
                  <TextLineCamp>
                    <ExternalLink
                      className="text-[#337ab7] text-base mt-2 overflow-hidden text-ellipsis"
                      href={`/profile/${userRank?.userId}`}
                    >
                      {userRank.userName}
                    </ExternalLink>
                  </TextLineCamp>
                </div>
                <div className="">
                  <div className="ml-2">
                    <HoverCard width={100} withArrow arrowSize={10} shadow="md" position="top">
                      <HoverCard.Target>
                        <Image
                          width={32}
                          height={32}
                          src={userRank?.countryIconUrl}
                          alt=""
                          withPlaceholder
                          placeholder={
                            <img className="bg-white" src="/images/flag-default.png" alt="flag-default" width={32} />
                          }
                        />
                      </HoverCard.Target>
                      <HoverCard.Dropdown
                        className="p-2 flex justify-center"
                        classNames={{
                          label: "text-red",
                        }}
                      >
                        <Text size="sm">{userRank?.countryName}</Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </div>
                </div>
                <div className="">{numberFormat.format(Math.floor(userRank?.totalExp))}</div>
              </div>
            )}

            {listRank?.map((user) => (
              <div
                key={`${user.userId} - ${user.rank}`}
                className={clsx(
                  "grid grid-cols-[40px_1fr_68px_60px] gap-2 md:grid-cols-[1fr_10fr_4fr_3fr] md:justify-between h-[70px] items-center px-4",
                  user.userId == userRank?.userId ? "border-yellow-200 border-2 shadow-md" : "border-b-2"
                )}
              >
                <div className="">{user.rank}</div>
                <div className="flex items-start md:gap-5 gap-3">
                  <Avatar size="lg" src={user.avatarUrl} userExpLevel={user.userExpLevel} userId={user.userId} />
                  <TextLineCamp>
                    <ExternalLink
                      className="text-[#337ab7] text-base mt-2 overflow-hidden text-ellipsis"
                      href={`/profile/${user.userId}`}
                    >
                      {user.userName}
                    </ExternalLink>
                  </TextLineCamp>
                </div>
                <div className="">
                  <div className="ml-2">
                    <HoverCard width={100} withArrow arrowSize={10} shadow="md" position="top">
                      <HoverCard.Target>
                        <Image
                          width={32}
                          height={32}
                          src={user.countryIconUrl}
                          alt=""
                          withPlaceholder
                          placeholder={
                            <img className="bg-white" src="/images/flag-default.png" alt="flag-default" width={32} />
                          }
                        />
                      </HoverCard.Target>
                      <HoverCard.Dropdown
                        className="p-2 flex justify-center"
                        classNames={{
                          label: "text-red",
                        }}
                      >
                        <Text size="sm">{user.countryName}</Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </div>
                </div>
                <div className="">{numberFormat.format(Math.floor(user.totalExp))}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-10 bg-white py-10 mt-10">
          <NotFound height={199} width={350} />
          <Text mt="lg" size="lg" fw="bold">
            {t("No Data Found !")}
          </Text>
          <Text fw="bold">{t("Your search did not return any content.")}</Text>
        </div>
      )}
    </>
  );
};

export default TableRank;
