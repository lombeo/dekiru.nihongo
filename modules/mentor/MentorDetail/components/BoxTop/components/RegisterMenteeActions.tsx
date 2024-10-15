import { Notify } from "@edn/components/Notify/AppNotification";
import { Button } from "@mantine/core";
import ModalRegisterMentee from "@src/modules/mentor/MentorDetail/components/BoxTop/components/ModalRegisterMentee";
import { LearnMentorService } from "@src/services/LearnMentor";
import { MentorState } from "@src/services/LearnMentor/types";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";

interface RegisterMenteeActionsProps {
  mentorId: number;
  mentor: any;
  refetchMentors: () => any;
}

const RegisterMenteeActions = (props: RegisterMenteeActionsProps) => {
  const { mentorId, mentor, refetchMentors } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const profile = useSelector(selectProfile);
  const [openRegister, setOpenRegister] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    const res = await LearnMentorService.cancelMentee(mentor?.id);
    refetchMentors();
    refetchMentors().finally(() => {
      setLoading(false);
    });
    if (res?.data?.success) {
      Notify.success(t("Register successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  const isPending = mentor && mentor.state === MentorState.Pending;

  const isRegistered = mentor && (mentor.state === MentorState.Blocked || mentor.state === MentorState.Approved);
  if (isRegistered || !profile || profile?.userId == mentorId) return null;

  if (isPending) {
    return (
      <Button loading={loading} onClick={() => handleCancel()} variant="outline" color="yellow" className="rounded-lg">
        {t("Cancel register")}
      </Button>
    );
  }

  return (
    <>
      {openRegister && (
        <ModalRegisterMentee onSuccess={refetchMentors} onClose={() => setOpenRegister(false)} mentorId={mentorId} />
      )}
      <Button
        onClick={() => setOpenRegister(true)}
        loading={loading}
        className="hover:bg-[#2C31CF] hover:opacity-80 rounded-lg bg-[#2C31CF] font-semibold"
      >
        {t("Register")}
      </Button>
    </>
  );
};

export default RegisterMenteeActions;
