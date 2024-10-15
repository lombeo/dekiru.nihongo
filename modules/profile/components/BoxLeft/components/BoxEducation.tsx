import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Menu, Timeline } from "@mantine/core";
import { PubsubTopic } from "@src/constants/common.constant";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import useFetchProfile from "@src/hooks/useFetchProfile";
import ModalEducation from "@src/modules/profile/components/BoxLeft/components/ModalEducation";
import { IdentityService } from "@src/services/IdentityService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Dots, Plus } from "tabler-icons-react";

const BoxEducation = (props: any) => {
  const { t } = useTranslation();
  const { userId, isCurrentUser } = props;
  const [openModalEducation, setOpenModalEducation] = useState(false);
  const profile = useSelector(selectProfile);
  const fetchProfile = useFetchProfile();

  const [userEducation, setUserEducation] = useState(null);

  const refItemEducationSelected = useRef<any>([]);

  const refetchUserEducation = async () => {
    const res = await IdentityService.userGetUserEducation({
      userId,
      progress: false,
    });
    setUserEducation(res?.data?.data);
  };

  const handleDeleteEducation = async (item: any) => {
    confirmAction({
      message: t("Are you sure you want to delete this information?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      allowCancel: false,
      onConfirm: async () => {
        const res = await IdentityService.userDeleteUserEducation(item.id);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          setTimeout(() => {
            refetchUserEducation();
            fetchProfile();
          }, 500);
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
      withCloseButton: false,
    });
  };

  useEffect(() => {
    if (!userId || !profile) return;
    let refetchEdu = PubSub.subscribe(PubsubTopic.UPDATE_USER_PROFILE, () => {
      refetchUserEducation();
    });

    return () => {
      PubSub.unsubscribe(refetchEdu);
    };
  }, []);

  useEffect(() => {
    if (!userId || !profile) return;
    refetchUserEducation();
  }, [userId, profile?.userId]);

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden p-5">
      {openModalEducation && (
        <ModalEducation
          data={refItemEducationSelected.current}
          onClose={() => setOpenModalEducation(false)}
          onSuccess={() => {
            refetchUserEducation();
            fetchProfile();
          }}
        />
      )}
      <div className="flex justify-between gap-4 mt-5 items-center">
        <div className="font-bold text-lg uppercase">{t("Education")}</div>
        {isCurrentUser && userEducation && (
          <ActionIcon
            onClick={() => {
              refItemEducationSelected.current = null;
              setOpenModalEducation(true);
            }}
            color="#2C31CF"
            variant="filled"
            radius="xl"
            size={24}
          >
            <Plus width={20} />
          </ActionIcon>
        )}
      </div>

      <div className="mt-4">
        {!!userEducation && userEducation.length > 0 && (
          <Timeline
            active={-1}
            classNames={{ item: "!mt-1 mb-3", root: "overflow-hidden", itemTitle: "mb-0" }}
            bulletSize={10}
            lineWidth={2}
            color="blue"
          >
            {userEducation.map((item, index) => {
              const college = item.college;
              return (
                <Timeline.Item
                  key={item.id}
                  title={
                    <div className="flex justify-between items-center gap-4">
                      <div className="text-[#5E5A5A] text-[12px]">
                        {formatDateGMT(item.fromDate)} - {formatDateGMT(item.toDate)}
                      </div>
                      {isCurrentUser && (
                        <Menu withArrow withinPortal offset={0} classNames={{ item: "px-5" }} shadow="md">
                          <Menu.Target>
                            <ActionIcon variant="transparent">
                              <Dots width={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              onClick={() => {
                                refItemEducationSelected.current = item;
                                setOpenModalEducation(true);
                              }}
                            >
                              {t("Edit")}
                            </Menu.Item>
                            <Menu.Item onClick={() => handleDeleteEducation(item)}>{t("Delete")}</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      )}
                    </div>
                  }
                >
                  <TextLineCamp
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={college}
                    data-tooltip-place="top"
                    className="text-[#2c31cf] font-semibold"
                  >
                    {FunctionBase.htmlDecode(college)}
                  </TextLineCamp>
                  <TextLineCamp
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content={FunctionBase.htmlDecode(item.title)}
                    data-tooltip-place="top"
                    line={2}
                    className="text-[13px] text-[#333]"
                  >
                    {FunctionBase.htmlDecode(item.major ? item.major : item.grade)}
                  </TextLineCamp>
                </Timeline.Item>
              );
            })}
            <Timeline.Item />
          </Timeline>
        )}
      </div>
    </div>
  );
};

export default BoxEducation;
