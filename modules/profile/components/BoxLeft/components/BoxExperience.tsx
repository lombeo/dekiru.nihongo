import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Menu, Timeline } from "@mantine/core";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import ModalExperience from "@src/modules/profile/components/BoxLeft/components/ModalExperience";
import { IdentityService } from "@src/services/IdentityService";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Dots, Plus } from "tabler-icons-react";

const BoxExperience = (props: any) => {
  const { t } = useTranslation();
  const { userId, isCurrentUser } = props;

  const profile = useSelector(selectProfile);

  const [userExperience, setUserExperience] = useState(null);
  const [openModalExp, setOpenModalExp] = useState(false);

  const refItemExpSelected = useRef<any>(null);

  useEffect(() => {
    if (!userId || !profile) return;
    refetchUserExperience();
  }, [userId, profile?.userId]);

  const refetchUserExperience = async () => {
    const res = await IdentityService.userGetUserExperience({
      userId,
      progress: false,
    });
    setUserExperience(res?.data?.data);
  };

  const handleDeleteExp = async (item: any) => {
    confirmAction({
      message: t("Are you sure you want to delete this information?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      allowCancel: false,
      onConfirm: async () => {
        const res = await IdentityService.userDeleteUserExperience(item.id);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          setTimeout(() => refetchUserExperience(), 500);
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
      withCloseButton: false,
    });
  };

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden p-5">
      {openModalExp && (
        <ModalExperience
          data={refItemExpSelected.current}
          onClose={() => setOpenModalExp(false)}
          onSuccess={() => refetchUserExperience()}
        />
      )}
      <div className="flex justify-between gap-4 mt-5 items-center">
        <div className="font-bold text-lg uppercase">{t("Experience")}</div>
        {isCurrentUser && (
          <ActionIcon
            onClick={() => {
              refItemExpSelected.current = null;
              setOpenModalExp(true);
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
        {!!userExperience && userExperience.length > 0 && (
          <Timeline
            classNames={{ item: "!mt-1 mb-3", root: "overflow-hidden", itemTitle: "mb-0" }}
            active={-1}
            bulletSize={10}
            lineWidth={2}
          >
            {userExperience.map((item: any) => (
              <Timeline.Item
                key={item.id}
                title={
                  <div className="flex justify-between items-center gap-4">
                    <div className="text-[#5E5A5A] text-[12px]">
                      {formatDateGMT(item.fromDate)} - {item.isCurrentJob ? t("Present") : formatDateGMT(item.toDate)}
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
                              refItemExpSelected.current = item;
                              setOpenModalExp(true);
                            }}
                          >
                            {t("Edit")}
                          </Menu.Item>
                          <Menu.Item onClick={() => handleDeleteExp(item)}>{t("Delete")}</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </div>
                }
              >
                <TextLineCamp
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={FunctionBase.htmlDecode(item.position)}
                  data-tooltip-place="top"
                  className="text-[#2c31cf] font-semibold"
                >
                  {FunctionBase.htmlDecode(item.position)}
                </TextLineCamp>
                <TextLineCamp
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content={FunctionBase.htmlDecode(item.company)}
                  data-tooltip-place="top"
                  line={2}
                  className="text-[13px] text-[#333]"
                >
                  {FunctionBase.htmlDecode(item.company)}
                </TextLineCamp>
              </Timeline.Item>
            ))}
            <Timeline.Item />
          </Timeline>
        )}
      </div>
    </div>
  );
};

export default BoxExperience;
