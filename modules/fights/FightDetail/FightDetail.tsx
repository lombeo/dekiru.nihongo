import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Button, Flex, Group, Select, Tabs } from "@mantine/core";
import { Container } from "@src/components";
import Comment from "@src/components/Comment/Comment";
import RawText from "@src/components/RawText/RawText";
import UserRole from "@src/constants/roles";
import { FunctionBase, convertDate } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { useNextQueryParam } from "@src/helpers/query-utils";
import BoxFAQ from "@src/modules/fights/FightDetail/components/BoxFAQ";
import BoxPoster from "@src/modules/fights/FightDetail/components/BoxPoster";
import BoxVoucher from "@src/modules/fights/FightDetail/components/BoxVoucher";
import ImportUserModal from "@src/modules/fights/FightDetail/components/ImportUserModal";
import LeaderBoard, { LeaderBoardRef } from "@src/modules/fights/FightDetail/components/LeaderBoard/LeaderBoard";
import CodingService from "@src/services/Coding/CodingService";
import { CommentContextType } from "@src/services/CommentService/types";
import { FriendService } from "@src/services/FriendService/FriendService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { debounce, uniqBy } from "lodash";
import moment from "moment/moment";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CommentService } from "services/CommentService";
import { Download, Edit, Refresh, Trash } from "tabler-icons-react";

const FightDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const parts = router.asPath.split("?");
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();
  const activeTabKey = params.get("tab") || "leaderboard";

  const id = router.query.id;
  const shareKey = useNextQueryParam("shareKey");

  const profile = useSelector(selectProfile);

  const [userOptions, setUserOptions] = useState([]);
  const [userId, setUserId] = useState(null);

  const [teamOptions, setTeamOptions] = useState([]);
  const [teamId, setTeamId] = useState(null);

  const [totalComment, setTotalComment] = useState(0);

  const [openImportUserModal, setOpenImportUserModal] = useState(false);

  const [diffTime, setDiffTime] = useState(0);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const refLeaderBoard = useRef<LeaderBoardRef>(null);

  const hasProfile = !!profile;

  const [countRegister, setCountRegister] = useState(0);

  useEffect(() => {
    hasProfile && fetchComments();
  }, [hasProfile]);

  const onChangeTab = (tabKey: string) => {
    router.push(
      {
        pathname: `/fights/detail/${id}`,
        query: {
          tab: tabKey,
        },
      },
      null,
      {
        shallow: true,
      }
    );
  };

  const fetchComments = async () => {
    const res = await CommentService.filter({
      contextId: +id,
      contextType: CommentContextType.Contest,
      pageSize: 10,
      pageIndex: 1,
      parentId: null,
    });
    if (res?.data?.data) {
      setTotalComment(res.data.data.total);
    }
  };

  const { data, refetch } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      let data: any;
      try {
        const res = await CodingService.contestDetail({
          contestId: id,
          shareKey,
        });
        const message = res?.data?.message;
        if (res?.data?.success) {
          data = res.data?.data;
          if (data) {
            setCountRegister(data.countRegister);

            if (data.utcNow) {
              const diffTime = moment().diff(convertDate(data.utcNow));
              setDiffTime(diffTime);
            }
          }
        } else if (message) {
          Notify.error(t(message));
          if (message === "Common_403") {
            router.push("/fights");
          }
        }
      } catch (e) {}
      return data;
    },
  });

  const getBreadcrumbs = () => {
    return [
      {
        href: "/",
        title: t("Home"),
      },
      {
        href: "/fights",
        title: t("Fights"),
      },
      {
        title: data?.title || t("Detail"),
      },
    ];
  };

  const handleDelete = () => {
    confirmAction({
      title: t("CONFIRMATION"),
      htmlContent: t("Are you sure to delete this contest?"),
      onConfirm: async () => {
        const res = await CodingService.contestDelete(+id);
        const data = res?.data?.data;
        if (res?.data?.success && data) {
          Notify.success(t("Delete contest successfully!"));
          router.push("/fights");
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };

  const handleSync = () => {
    confirmAction({
      title: t("CONFIRMATION"),
      htmlContent: (
        <Trans i18nKey="CONFIRM_SYNC_TASK" t={t}>
          Do you want to sync task to this contest?{" "}
          <strong>This will affect the content of the task and the results of the contest.</strong>
        </Trans>
      ),
      onConfirm: async () => {
        const res = await CodingService.contestSynchronizeTask({ contestId: +id });
        const data = res?.data?.data;
        if (res?.data?.success && data) {
          Notify.success(t("Sync task successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };

  const handleExport = async () => {
    const res = await CodingService.contestRegisterExportRegisters({
      contestId: +id,
    });
    const data = res?.data?.data;
    if (res?.data?.success && data) {
      Notify.success(t("Export successfully!"));
      let contentType = "application/vnd.ms-excel";
      let excelFile = FunctionBase.b64toBlob(data?.contents, contentType);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelFile);
      link.download = data?.filename;
      link.click();
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  const handleAddUserOrTeam = async () => {
    if (data?.isTeam) {
      if (!teamId) return;
      const res = await CodingService.contestRegisterInertRegister({
        contestId: data?.id,
        userIdOrTeamId: teamId,
      });
      setTeamId(null);
      if (res?.data?.success) {
        refLeaderBoard.current?.refetch();
        refetch();
        Notify.success(t("Registered team successfully."));
      } else if (res?.data?.message) {
        Notify.error(t(res?.data?.message));
      }
      return;
    }

    if (!userId) return;

    const res = await CodingService.contestRegisterCheckUserLevel({
      contestId: data?.id,
      userIdOrTeamId: userId,
    });

    if (res?.data?.message) {
      confirmAction({
        message: t(
          "This user's level does not meet criteria to join in this contest. Are you sure you want to add this user?"
        ),
        title: t("CONFIRMATION"),
        labelConfirm: t("Yes"),
        onConfirm: async () => {
          handleInsertUser();
        },
      });
      return;
    }

    handleInsertUser();
  };

  const handleInsertUser = async () => {
    const res = await CodingService.contestRegisterInertRegister({
      contestId: data?.id,
      userIdOrTeamId: userId,
    });
    setUserId(null);
    if (res?.data?.success) {
      refLeaderBoard.current?.refetch();
      refetch();
      Notify.success(t("The user has successfully registered for the contest."));
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  const handleRegisterSuccess = () => {
    refetch();
    refLeaderBoard.current?.refetch();
  };

  const handleSearchTeams = useCallback(
    debounce((query: string) => {
      CodingService.team({
        textSearch: query,
        pageIndex: 1,
        pageSize: 100,
        getAllTeam: true,
      }).then((res) => {
        let data = res?.data?.data?.results;
        if (data) {
          data = data.map((item) => ({
            label: item.title,
            value: item.id,
          }));
          setTeamOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  const handleSearchUsers = useCallback(
    debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user.userName,
            value: user.userId,
          }));
          setUserOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  useEffect(() => {
    if (!hasProfile && "comment" === activeTabKey) {
      router.push(
        {
          pathname: `/fights/detail/${id}`,
          query: {
            tab: "leaderboard",
          },
        },
        null,
        {
          shallow: true,
        }
      );
    }
  }, [activeTabKey, hasProfile]);

  return (
    <div>
      {openImportUserModal && (
        <ImportUserModal
          contestId={data?.id}
          onSuccess={handleRegisterSuccess}
          onClose={() => setOpenImportUserModal(false)}
        />
      )}
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs data={getBreadcrumbs()} />
        </Flex>

        <BoxPoster
          diffTime={diffTime}
          countRegister={countRegister}
          data={data}
          onRegisterSuccess={handleRegisterSuccess}
          context="detail"
        />

        <div className="mt-4 bg-white">
          <div className="flex lg:flex-row flex-col flex-wrap justify-between gap-4 items-center shadow-[0_-0.125rem_#dee2e6_inset] md:pr-4">
            <Tabs
              // classNames={{
              //   tabLabel: "uppercase text-[15px]",
              //   tab: "py-4 w-full md:w-auto",
              // }}
              classNames={{
                tabsList: "border-b gap-y-2",
                tab: "border-b-4 w-full md:w-auto",
                tabLabel: "text-base font-medium",
              }}
              value={activeTabKey}
              onTabChange={onChangeTab}
            >
              <Tabs.List>
                {[
                  {
                    label: t("Leaderboard"),
                    value: "leaderboard",
                  },
                  {
                    label: t("Introduction"),
                    value: "information",
                  },
                  {
                    label: `${t("Comment")} (${totalComment})`,
                    value: "comment",
                    isHidden: !profile,
                  },
                  {
                    label: t("FAQ"),
                    value: "faq",
                  },
                  {
                    label: t("Voucher"),
                    value: "voucher",
                    isHidden: !data || !data.isAdmin || data.price <= 0,
                  },
                ]
                  .filter((e) => !e.isHidden)
                  .map((tab) => (
                    <Tabs.Tab value={tab.value} key={tab.value}>
                      {tab.label}
                    </Tabs.Tab>
                  ))}
              </Tabs.List>
            </Tabs>

            {data?.isAdmin && (
              <Group spacing="4px" className="lg:p-0 pb-4 px-4 justify-center">
                {data?.isTeam ? (
                  <Select
                    placeholder={t("Select team")}
                    data={teamOptions}
                    value={teamId}
                    onChange={setTeamId}
                    size="xs"
                    className="w-[160px]"
                    nothingFound={t("No result found")}
                    searchable
                    onSearchChange={handleSearchTeams}
                  />
                ) : (
                  <Select
                    placeholder={t("Select user")}
                    data={userOptions}
                    value={userId}
                    onChange={setUserId}
                    size="xs"
                    className="w-[160px]"
                    nothingFound={t("No result found")}
                    searchable
                    onSearchChange={handleSearchUsers}
                  />
                )}

                <Button className="px-2" color="indigo" onClick={handleAddUserOrTeam} size="xs" variant="outline">
                  {t("Add")}
                </Button>
                {data && !data.isTeam ? (
                  <Button
                    className="px-2"
                    color="indigo"
                    onClick={() => setOpenImportUserModal(true)}
                    size="xs"
                    variant="outline"
                  >
                    {t("Import")}
                  </Button>
                ) : null}
                <ActionIcon
                  h="30px"
                  w="30px"
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={t("Export")}
                  data-tooltip-place="top"
                  onClick={handleExport}
                  color="blue"
                  size="md"
                  variant="outline"
                >
                  <Download width={16} />
                </ActionIcon>
                <ActionIcon
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={t("Edit")}
                  data-tooltip-place="top"
                  h="30px"
                  w="30px"
                  onClick={() => {
                    router.push(`/fights/edit/${id}`);
                  }}
                  color="indigo"
                  size="md"
                  variant="outline"
                >
                  <Edit width={16} />
                </ActionIcon>
                <ActionIcon
                  h="30px"
                  w="30px"
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={t("Synchronize task")}
                  data-tooltip-place="top"
                  onClick={handleSync}
                  color="indigo"
                  size="md"
                  variant="outline"
                >
                  <Refresh width={16} />
                </ActionIcon>
                {isManagerContent && (
                  <ActionIcon
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={t("Delete contest")}
                    data-tooltip-place="top"
                    h="30px"
                    w="30px"
                    onClick={handleDelete}
                    color="red"
                    size="md"
                    variant="outline"
                  >
                    <Trash width={16} />
                  </ActionIcon>
                )}
              </Group>
            )}
          </div>
        </div>

        {activeTabKey == "leaderboard" && (
          <LeaderBoard
            onUpdateCountRegister={setCountRegister}
            diffTime={diffTime}
            refetch={refetch}
            activities={data?.contestActivityDTOs}
            isTeam={data?.isTeam}
            isApplyTotalTime={data?.isApplyTotalTime}
            contest={data}
            contestId={+id}
            ref={refLeaderBoard}
          />
        )}

        {activeTabKey == "information" && (
          <div className="bg-white px-4 pt-4 pb-10 mb-20">
            <RawText>{FunctionBase.htmlDecode(data?.posterDescription)}</RawText>
          </div>
        )}

        {activeTabKey == "comment" && (
          <div className="bg-white px-4 pt-4 pb-10 mb-20">
            <Comment
              title={data?.title}
              detailedLink={router.asPath}
              fetchedCallback={(data) => setTotalComment(data?.total || 0)}
              isManager={data?.isAdmin}
              contextId={data?.id}
              contextType={CommentContextType.Contest}
            />
          </div>
        )}

        {activeTabKey == "faq" && <BoxFAQ />}
        {activeTabKey == "voucher" && <BoxVoucher contextId={data?.id} contextType={CommentContextType.Contest} />}
      </Container>
    </div>
  );
};

export default FightDetail;
