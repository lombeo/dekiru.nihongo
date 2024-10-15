import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Image, Skeleton, Tabs } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import RegisterMenteeActions from "@src/modules/mentor/MentorDetail/components/BoxTop/components/RegisterMenteeActions";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { AddressBook, Building, Edit, Star, Users } from "tabler-icons-react";

interface BoxTopProps {
  tab: string;
  data: any;
  onTabChange: (tab: string) => void;
  mentors: any;
  onClickEdit: () => void;
  fetchMentors: () => any;
}

const BoxTop = (props: BoxTopProps) => {
  const { onClickEdit, tab, data, mentors, fetchMentors, onTabChange } = props;
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);
  return (
    <div className="flex flex-col">
      <div className="relative h-[220px] mb-4">
        <Image src="/images/bg-mentor-detail.png" alt="background" height={220} width="100%" />
        <div className="absolute bottom-[-5%] lg:translate-x-0 -translate-x-1/2 translate-y-[52px] z-100 lg:left-20 left-1/2">
          {data && <Avatar size={142} src={data?.avatar} userExpLevel={data?.userExpLevel} userId={0} />}
        </div>
        {profile && data?.userId === profile?.userId ? (
          <div className="absolute top-5 right-5 z-10">
            <ActionIcon variant="transparent" onClick={onClickEdit}>
              <Edit color="#fff" />
            </ActionIcon>
          </div>
        ) : null}
      </div>

      <div className="flex lg:justify-between justify-center mt-20 items-center">
        <div>
          {data ? (
            <TextLineCamp className="font-semibold text-[28px]">{data?.userName}</TextLineCamp>
          ) : (
            <Skeleton className="my-2" height={26} width={200} />
          )}
          <div className="flex gap-8 mt-1 font-semibold text-sm text-[#2C31CF]">
            <div className="flex gap-2 items-center min-w-[60px]">
              <Users width={20} />
              {data ? <span>{data?.menteeCount}</span> : <Skeleton width={24} height={18} />}
            </div>
            <div className="flex gap-2 items-center">
              <Star width={20} />
              {data ? (
                <span>{data.avgRate > 0 ? data.avgRate.toFixed(1) : 0}</span>
              ) : (
                <Skeleton width={24} height={18} />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {data ? (
            <RegisterMenteeActions
              mentor={mentors?.find((e) => e.mentorId === data.userId)}
              refetchMentors={fetchMentors}
              mentorId={data.userId}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2 text-sm">
        <div className="grid gap-2 items-center grid-cols-[20px_1fr_24px]">
          <AddressBook color="#2C31CF" width={20} />
          <span>{data?.contactInfo}</span>
        </div>
        <div className="grid gap-2 items-center grid-cols-[20px_1fr_24px]">
          <Building color="#2C31CF" width={20} />
          <span>{data?.workExperience}</span>
        </div>
      </div>

      <div className="mt-3 mx-auto lg:mx-0 w-fit">
        <Tabs
          classNames={{
            tabLabel: "font-semibold text-base",
            tabsList: "border-none pb-[2px]",
            tab: "border-b-[3px] hover:border-b-[#2C31CF] aria-selected:hover:border-b-[#2C31CF] aria-selected:text-[#2C31CF] aria-selected:border-b-[#2C31CF]",
          }}
          value={tab}
          onTabChange={onTabChange}
        >
          <Tabs.List>
            <Tabs.Tab value="introduce">{t("Introduce")}</Tabs.Tab>
            {profile && profile?.userId === data?.userId ? <Tabs.Tab value="mentees">{t("Mentees")}</Tabs.Tab> : null}
            <Tabs.Tab value="evaluate">{t("Evaluate")}</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  );
};

export default BoxTop;
