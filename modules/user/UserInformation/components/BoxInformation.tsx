import { Tooltip } from "@edn/components";
import { Button } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import { PubsubTopic } from "@src/constants/common.constant";
import { formatDateGMT, FunctionBase } from "@src/helpers/fuction-base.helpers";
import useFetchProfile from "@src/hooks/useFetchProfile";
import EventUpdateProfileModal from "@src/modules/event/UpdateProfileModal";
import { IdentityService } from "@src/services/IdentityService";
import { selectProfile } from "@src/store/slices/authSlice";
import { getEventProfile, setEventProfile } from "@src/store/slices/eventSlice";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle, CircleCheck, Pencil } from "tabler-icons-react";

const BoxInformation = () => {
  const { t } = useTranslation();

  const profile = useSelector(selectProfile);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const eventProfile = useSelector(getEventProfile);
  const fetchProfile = useFetchProfile();

  useEffect(() => {
    handleGetUserProfileForContest(true);
  }, []);

  const handleGetUserProfileForContest = async (isInit: boolean = false) => {
    const res = await IdentityService.getUserProfileForContest({});
    fetchProfile();
    const data = res?.data?.data;
    if (data) {
      dispatch(setEventProfile(data));
    }
    !isInit && PubSub.publish(PubsubTopic.UPDATE_USER_PROFILE);
  };

  const InfoRow = (label: string, value: string, isRequired: boolean = true, isDateFormat: boolean = false) => {
    return (
      <div className="flex flex-col sm:flex-row">
        <span className="text-[#898989] min-w-[160px]">
          {label}
          {isRequired && <span className="text-[#fa5252]">*</span>}
        </span>
        <span className="font-bold">{isDateFormat ? formatDateGMT(value) : FunctionBase.htmlDecode(value)}</span>
      </div>
    );
  };

  const PhoneInfoRow = (label: string, value: string) => {
    return (
      <div className="flex flex-col sm:items-start sm:flex-row">
        <div className="text-[#898989] min-w-[160px]">
          {label}
          {<span className="text-[#fa5252]">*</span>}
        </div>
        {value && (
          <div className="font-bold space-y-1">
            <div className="flex items-center">
              {value}
              <span className="pl-2">
                {eventProfile?.isVerifiedPhoneNumber ? (
                  <span className="text-green-600 flex items-center gap-1 font-normal">
                    <Tooltip label={t("Authenticated")}>
                      <span className="flex items-center">
                        <CircleCheck size={16} />
                      </span>
                    </Tooltip>
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1 font-normal">
                    <Tooltip label={t("Unauthenticated")}>
                      <span className="flex items-center">
                        <AlertCircle size={16} />
                      </span>
                    </Tooltip>
                  </span>
                )}
              </span>
            </div>
            {!eventProfile?.isVerifiedPhoneNumber && (
              <div className="font-normal text-red-600">
                <Trans
                  i18nKey="Compose a message to activate your account"
                  t={t}
                  values={{
                    syntax: process.env.NEXT_PUBLIC_SMS_SYNTAX_VERIFY,
                    userName: profile?.userName?.toLowerCase(),
                    tel: process.env.NEXT_PUBLIC_TEL_VERIFY,
                  }}
                  components={{ strong: <span className="font-bold" /> }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden p-5">
      <div className="flex justify-between gap-4 items-center">
        <div className="font-bold text-lg uppercase">{t("Information")}</div>
        <Button variant="outline" rightIcon={<Pencil width={20} />} onClick={() => setIsEdit(true)}>
          {t("Update")}
        </Button>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[134px_auto] overflow-hidden">
        <div className="px-3.5 flex flex-col gap-1">
          <Avatar
            className="mb-6 mt-4"
            size={98}
            userId={0}
            userExpLevel={profile?.userExpLevel}
            src={profile?.avatarUrl}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="break-words items-center text-sm space-y-4">
            {InfoRow(t("Full name"), profile?.displayName)}
            {InfoRow(t("Birthday"), profile?.birthYear, false, true)}
            {PhoneInfoRow(t("Phone number"), profile?.phoneNumber)}
            {InfoRow(t("Email address"), profile?.email)}
            {InfoRow(t("Country/Region"), "Việt Nam")}
            {InfoRow(t("Province"), eventProfile?.province?.name)}
            {InfoRow(t("District"), eventProfile?.district?.name)}
            {InfoRow(t("School"), eventProfile?.school?.name)}
            {InfoRow(
              t("Grade/major"),
              eventProfile?.school?.major ? eventProfile?.school?.major : eventProfile?.school?.grade
            )}
            {InfoRow(t("Address"), eventProfile?.address, false)}
          </div>
        </div>
      </div>
      {isEdit && (
        <EventUpdateProfileModal
          onCloseUpdateProfileModal={() => setIsEdit(false)}
          onUpdateSuccess={handleGetUserProfileForContest}
        />
      )}
    </div>
  );
};

export default BoxInformation;
