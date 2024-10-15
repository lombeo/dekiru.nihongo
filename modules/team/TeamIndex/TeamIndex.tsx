import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Button, Group, Text } from "@mantine/core";
import { Container } from "@src/components";
import AddMemberModal from "@src/modules/team/TeamIndex/components/AddMemberModal";
import AddUpdateTeamModal from "@src/modules/team/TeamIndex/components/AddUpdateTeamModal";
import BoxLeft from "@src/modules/user/components/BoxLeft";
import CodingService from "@src/services/Coding/CodingService";
import { MemberRole } from "@src/services/Coding/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Check, DoorExit, Pencil, Plus, Trash, X } from "tabler-icons-react";

const TeamIndex = () => {
  const { t } = useTranslation();

  const arr5 = useMemo(() => new Array(5).fill(null), []);
  const refSelected = useRef<any>(null);
  const profile = useSelector(selectProfile);
  const [openAddUpdateTeamModal, setOpenAddUpdateTeamModal] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["CodingService.codingTeam"],
    queryFn: async () => {
      const res = await CodingService.team({ pageIndex: 1, pageSize: 100 });
      return res?.data?.data;
    },
  });

  const handleDeleteMember = (team: any, memberId: number) => {
    confirmAction({
      message: t("Are you sure you want to remove this member?"),
      title: t("CONFIRMATION"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        const res = await CodingService.teamRemoveMember({
          teamId: team.id,
          userId: memberId,
        });
        if (res?.data?.success) {
          refetch();
          Notify.success(t("Member removed successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  const handleAddMember = (team: any) => {
    refSelected.current = team;
    setOpenAddMemberModal(true);
  };

  const handleUpdateTeam = (team: any) => {
    refSelected.current = team;
    setOpenAddUpdateTeamModal(true);
  };

  const handleDeleteTeam = (team: any) => {
    confirmAction({
      message: t("Are you sure you want to remove this team?"),
      title: t("DELETE TEAM"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        const res = await CodingService.teamDeleteTeam(team.id);
        if (res?.data?.success) {
          Notify.success(t("The team has been deleted successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
        refetch();
      },
    });
  };

  const handleAccept = async (teamId: number) => {
    const res = await CodingService.teamResponseTeamRequest({
      teamId,
      isAccept: true,
    });
    if (res?.data?.success) {
      Notify.success(t("Join the team successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    refetch();
  };

  const handleReject = async (teamId: number) => {
    const res = await CodingService.teamResponseTeamRequest({
      teamId,
      isAccept: false,
    });
    if (res?.data?.success) {
      // Notify.success(t("The team has been deleted successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    refetch();
  };

  const handleOutTeam = async (teamId: number) => {
    confirmAction({
      message: t("Are you sure you want to leave this team?"),
      title: t("LEAVE TEAM"),
      labelConfirm: t("Yes"),
      onConfirm: async () => {
        const res = await CodingService.teamResponseTeamRequest({
          teamId,
          isAccept: false,
        });
        if (res?.data?.success) {
          Notify.success(t("Leave this team successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
        refetch();
      },
    });
  };

  return (
    <div>
      {openAddUpdateTeamModal && (
        <AddUpdateTeamModal
          isCreate={!refSelected.current}
          initialValue={refSelected.current}
          onSuccess={refetch}
          onClose={() => setOpenAddUpdateTeamModal(false)}
        />
      )}
      {openAddMemberModal && (
        <AddMemberModal
          teamId={refSelected.current?.id}
          onSuccess={refetch}
          onClose={() => setOpenAddMemberModal(false)}
        />
      )}
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              href: `/user/information`,
              title: t("My information"),
            },
            {
              title: t("Team"),
            },
          ]}
        />
        <div className="grid sm:grid-cols-[277px_auto] gap-5 mb-20">
          <BoxLeft activeIndex={3} />
          <div className="flex flex-col bg-white rounded-md shadow-md overflow-hidden p-5">
            <div className="flex gap-4 justify-between items-center">
              <div className="font-semibold text-lg uppercase">{t("My Team")}</div>
              <Button
                onClick={() => {
                  refSelected.current = null;
                  setOpenAddUpdateTeamModal(true);
                }}
                color="blue"
                leftIcon={<Plus width={20} />}
              >
                {t("Create team")}
              </Button>
            </div>
            <div className="mt-6 grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5">
              {data?.results?.map((team) => {
                const isLeader = team?.members?.some(
                  (e) => e.role === MemberRole.Leader && e.userId === profile?.userId
                );
                const isMember = team?.members?.some(
                  (e) => e.role === MemberRole.Member && e.isAccepted && e.userId === profile?.userId
                );

                return (
                  <div
                    key={team.id}
                    className="border flex flex-col orverflow-hidden bg-white rounded-lg pb-4 relative shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)]"
                  >
                    <div className="flex gap-4 px-4 py-3 justify-between bg-[#EFF5FF]">
                      <TextLineCamp className="text-blue-500" fw="bold">
                        {team.title}
                      </TextLineCamp>
                      {isLeader && (
                        <Group spacing="6px">
                          <ActionIcon onClick={() => handleUpdateTeam(team)} size="sm" color="gray">
                            <Pencil width={20} />
                          </ActionIcon>
                          <ActionIcon onClick={() => handleDeleteTeam(team)} size="sm" color="red">
                            <Trash width={20} />
                          </ActionIcon>
                        </Group>
                      )}
                      {isMember && (
                        <ActionIcon onClick={() => handleOutTeam(team.id)} size="sm" color="red">
                          <DoorExit width={20} />
                        </ActionIcon>
                      )}
                    </div>
                    <Text className="whitespace-pre-line max-h-[150px] overflow-y-auto m-4">{team.description}</Text>
                    <div className="grid grid-cols-1 gap-[1px] bg-[#ddd] mx-4">
                      {arr5?.map((_: any, index: number) => {
                        const member = team?.members?.[index];
                        const isCurrentUser = member?.userId === profile?.userId;
                        if (!member) {
                          return (
                            <div
                              key={`create-${index}`}
                              className="bg-white min-h-[40px] py-2 flex justify-between gap-4 items-center"
                            >
                              {isLeader && (
                                <Button
                                  size="xs"
                                  color="dark"
                                  leftIcon={
                                    <Plus
                                      className="bg-[#7BC043] p-[2px] rounded-full"
                                      color="#fff"
                                      height={20}
                                      width={20}
                                    />
                                  }
                                  className="text-sm px-0"
                                  variant="white"
                                  onClick={() => handleAddMember(team)}
                                >
                                  {t("Add a new member")}
                                </Button>
                              )}
                            </div>
                          );
                        }
                        return (
                          <div key={member.id} className="bg-white py-2 flex justify-between gap-4 items-center">
                            <TextLineCamp>{member.userName}</TextLineCamp>
                            {member.role === MemberRole.Leader ? (
                              <Text c="blue" size="sm">
                                {t("Owner")}
                              </Text>
                            ) : (
                              <div className="flex gap-2 items-center">
                                {member.isAccepted ? (
                                  <Text size="sm" c="gray">
                                    {t("Member")}
                                  </Text>
                                ) : (
                                  <Text size="sm" c="yellow">
                                    {t("Waiting")}
                                  </Text>
                                )}
                                {isCurrentUser && !isLeader && !member.isAccepted ? (
                                  <Group spacing="xs">
                                    <ActionIcon
                                      onClick={() => handleAccept(team.id)}
                                      color="green"
                                      variant="filled"
                                      size="sm"
                                    >
                                      <Check width={20} />
                                    </ActionIcon>
                                    <ActionIcon
                                      onClick={() => handleReject(team.id)}
                                      color="red"
                                      variant="outline"
                                      size="sm"
                                    >
                                      <X width={20} />
                                    </ActionIcon>
                                  </Group>
                                ) : null}
                                {isLeader && (
                                  <ActionIcon
                                    onClick={() => handleDeleteMember(team, member.userId)}
                                    size="sm"
                                    color="red"
                                  >
                                    <Trash width={20} />
                                  </ActionIcon>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TeamIndex;
