import { Breadcrumbs, Button, Text } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Group, Pagination, Progress, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import Link from "@src/components/Link";
import Banner from "@src/modules/mentor/MentorIndex/components/Banner";
import ModalRegisterMentor from "@src/modules/mentor/MentorIndex/components/ModalRegisterMentor/ModalRegisterMentor";
import { LearnMentorService } from "@src/services/LearnMentor";
import { MentorState } from "@src/services/LearnMentor/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Search, Star, Users } from "tabler-icons-react";

const numberFormat = new Intl.NumberFormat();
const MentorIndex = () => {
  const { t } = useTranslation();
  const profile = useSelector(selectProfile);

  const [myRequest, setMyRequest] = useState<any>(null);

  const [openModalRegister, setOpenModalRegister] = useState(false);

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    state: MentorState.Approved,
  });
  const [keyword, setKeyWord] = useState("");

  const { data, status } = useQuery({
    queryKey: ["LearnMentorService.searchMentors", keyword, filter],
    queryFn: async () => {
      const res = await LearnMentorService.searchMentors(filter);
      return res?.data?.data;
    },
  });

  const getMyRequest = async () => {
    const res = await LearnMentorService.getMyMentorRequest();
    setMyRequest(res?.data?.data);
  };

  useEffect(() => {
    getMyRequest();
  }, []);

  const handleCancelRegister = () => {
    confirmAction({
      message: t("Are you sure you want to cancel register mentor?"),
      onConfirm: async () => {
        const res = await LearnMentorService.cancelMentorRequest();
        if (res?.data?.success) {
          getMyRequest();
          Notify.success(t("Cancel register mentor successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  return (
    <div className="mb-20">
      {openModalRegister && (
        <ModalRegisterMentor onSuccess={getMyRequest} onClose={() => setOpenModalRegister(false)} />
      )}
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Mentor"),
            },
          ]}
        />
        <Banner />
        <div className="mt-4 flex lg:flex-nowrap flex-wrap justify-between gap-5">
          <TextInput
            className="w-full"
            placeholder={t("Search tags,...")}
            onKeyDown={(event: any) => {
              if (event && event.key === "Enter") {
                setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: event.target.value }));
              }
            }}
            onBlur={(event) =>
              setFilter((prev) => ({
                ...prev,
                pageIndex: 1,
                keyword: (document.getElementById("filter-mentor") as any).value,
              }))
            }
            id="filter-mentor"
            rightSection={
              <Search
                color="#ccc"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: 1,
                    keyword: (document.getElementById("filter-mentor") as any).value,
                  }))
                }
              />
            }
          />
          {profile && !myRequest ? (
            <Button
              onClick={async () => {
                setOpenModalRegister(true);
              }}
              size="sm"
              className="font-semibold bg-[#2C8EA4] hover:opacity-80 hover:bg-[#2C8EA4]"
            >
              {t("Register mentor")}
            </Button>
          ) : null}
          {profile && myRequest && myRequest.state === MentorState.Pending ? (
            <Button
              className="font-semibold bg-white hover:opacity-80 hover:bg-white"
              onClick={handleCancelRegister}
              size="sm"
              variant="outline"
              color="yellow"
            >
              {t("Cancel register mentor")}
            </Button>
          ) : null}
          {profile && myRequest && myRequest.state === MentorState.Approved ? (
            <Link href={`/mentor/${myRequest.userId}`}>
              <Button
                size="sm"
                color="green"
                className="font-semibold bg-[#0AAD9C] hover:opacity-80 hover:bg-[#0AAD9C]"
              >
                {t("View profile")}
              </Button>
            </Link>
          ) : null}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-4 md:grid-cols-2">
          {data?.results?.map((item) => (
            <Link
              className="cursor-pointer border border-[#ccc] shadow-md rounded-md overflow-hidden"
              key={item.id}
              href={`/mentor/${item.userId}`}
            >
              <div className="bg-white flex flex-col h-full">
                <div className="bg-[#E6E9EA] p-5 flex flex-col items-center">
                  <Avatar
                    className="mx-auto my-3"
                    size={120}
                    src={item.avatar}
                    userExpLevel={item.userExpLevel}
                    userId={0}
                  />
                  <div className="relative mt-6 w-full">
                    <Progress
                      classNames={{
                        bar: "bg-[linear-gradient(176.76deg,#00FF38_-42.05%,#05561B_98.31%)]",
                        root: "bg-[#E0E0E5] border border-[#D1D1D1]",
                      }}
                      value={
                        item.userExpLevel?.nextLevelExp
                          ? (item.userExpLevel?.currentUserExperiencePoint * 100) / item?.userExpLevel?.nextLevelExp
                          : 0
                      }
                      radius="md"
                      color="#079cd0"
                      size="26px"
                    />
                    <div
                      style={{
                        textShadow: `-1px -1px 0 #187E16, 1px -1px 0 #187E16, -1px 1px 0 #0757CE, 1px 1px 0 #187E16`,
                      }}
                      className="absolute top-1/2 left-1/2 z-10 text-white -translate-y-1/2 text-lg font-semibold -translate-x-1/2"
                    >
                      {numberFormat.format(item.userExpLevel?.currentUserExperiencePoint || 0)}/
                      {numberFormat.format(item.userExpLevel?.nextLevelExp || 0)}
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 flex flex-col gap-2">
                  <TextLineCamp className="text-center font-semibold text-xl">{item.userName}</TextLineCamp>
                  <TextLineCamp className="text-base" line={2}>
                    {item.workExperience}
                  </TextLineCamp>
                  {/*{item.tags?.length > 0 && (*/}
                  {/*  <div className="flex gap-3 flex-wrap">*/}
                  {/*    {item.tags?.map((tag) => (*/}
                  {/*      <Badge color="gray" variant="dot" radius="sm" key={tag}>*/}
                  {/*        {tag}*/}
                  {/*      </Badge>*/}
                  {/*    ))}*/}
                  {/*  </div>*/}
                  {/*)}*/}
                  <div className="flex mt-auto justify-between gap-5 font-semibold text-sm text-[#2C8EA4]">
                    <div className="flex gap-2 items-center ">
                      <Users width={20} />
                      <span>{item.menteeCount}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Star width={20} />
                      <span>{item.avgRate > 0 ? item.avgRate.toFixed(1) : 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {data?.results?.length > 0 && (
          <Group position="center" className="py-6">
            <Pagination
              withEdges
              value={filter.pageIndex}
              onChange={(pageIndex) => setFilter((prev) => ({ ...prev, pageIndex }))}
              total={data?.pageCount}
            />
          </Group>
        )}
        {status === "success" && data?.results?.length <= 0 ? (
          <Text className="p-12 shadow-md rounded-md bg-white text-center text-gray-secondary">
            {t("No results found")}
          </Text>
        ) : null}
      </Container>
    </div>
  );
};

export default MentorIndex;
