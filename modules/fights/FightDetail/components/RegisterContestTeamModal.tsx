import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Group, Modal, Text } from "@mantine/core";
import Link from "@src/components/Link";
import CodingService from "@src/services/Coding/CodingService";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Select } from "@edn/components";
import { useSelector } from "react-redux";
import { selectProfile } from "@src/store/slices/authSlice";
import { MemberRole } from "@src/services/Coding/types";
import { CommentContextType } from "@src/services/CommentService/types";
import { useRouter } from "next/router";

interface RegisterContestTeamModalProps {
  onClose: () => void;
  onSuccess: () => void;
  contestId: number;
}

const RegisterContestTeamModal = (props: RegisterContestTeamModalProps) => {
  const { onClose, contestId, onSuccess } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [teamOptions, setTeamOptions] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const profile = useSelector(selectProfile);

  const fetchTeams = async () => {
    const res = await CodingService.team({
      pageIndex: 1,
      pageSize: 100,
    });
    let data = res?.data?.data?.results;
    if (data) {
      setTeamOptions(
        data
          .filter((e) => e.members?.some((e) => e.role === MemberRole.Leader && e.userId === profile?.userId))
          .map((item) => ({
            label: item.title,
            value: `${item.id}`,
          }))
      );
    } else {
      setTeamOptions([]);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const resRegister = await CodingService.contestRegisterRegister({
      contestId: contestId,
      userIdOrTeamId: teamId,
    });
    setIsLoading(false);
    if (resRegister?.data?.success) {
      const orderId = resRegister.data.data.orderId;
      if (orderId) {
        router.push(`/payment/orders/checkout?orderId=${orderId}&contextType=${CommentContextType.Contest}`);
      } else {
        Notify.success(t("You/Your team have/has registered this batch successfully."));
        onSuccess();
        onClose();
      }
    } else if (resRegister?.data?.message) {
      Notify.error(t(resRegister.data.message));
    }
  };

  if (!teamOptions) return null;

  return (
    <Modal
      classNames={{ content: "overflow-visible" }}
      title={t("THIS IS TEAM CONTEST. CHOOSE YOUR TEAM")}
      size={540}
      opened
      onClose={onClose}
    >
      <Group className="border-t pt-4">
        <Select
          placeholder={t("Select team")}
          data={teamOptions}
          value={teamId}
          onChange={setTeamId}
          classNames={{ dropdown: "!z-[1500]" }}
          size="sm"
          className="w-[240px]"
          nothingFound={t("No result found")}
        />
        <Button size="sm" loading={isLoading} color="green" onClick={handleSubmit}>
          {t("Register team")}
        </Button>
      </Group>
      <div className="flex gap-[4px] mt-4">
        <Text>{t("Don't have a team?")}</Text>
        <Link href="/team" className="text-blue-primary">
          {t("Create now")}
        </Link>
      </div>
    </Modal>
  );
};

export default RegisterContestTeamModal;
