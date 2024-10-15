import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Image, Table } from "@mantine/core";
import { Container } from "@src/components";
import Avatar from "@src/components/Avatar";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { TypeMenuBar } from "@src/config";
import { UserLevelSettingType } from "@src/constants/avatar.constant";
import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { useMenuBar } from "@src/hooks/useMenuBar";
import ModalUploadAvatar from "@src/modules/setting/avatar/components/ModalUploadAvatar";
import { IdentityService } from "@src/services/IdentityService";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Trash } from "tabler-icons-react";

const AvatarSetting = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const listItem = useMenuBar(TypeMenuBar.SystemManagement);
  const isManager = useHasAnyRole([UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent]);

  const [openModalAvatar, setOpenModalAvatar] = useState(false);
  const refAvatarSelected = useRef<any>(null);

  const { data, refetch, status } = useQuery({
    queryKey: ["userLevelSettingGetSettings"],
    queryFn: async () => {
      try {
        const res = await IdentityService.userLevelSettingGetSettings();
        return res?.data?.data;
      } catch (e) {}
      return null;
    },
  });

  const handleDelete = (id: number, type: number) => {
    confirmAction({
      message: t("Are you sure?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      allowCancel: false,
      onConfirm: async () => {
        let newSetting = _.cloneDeep(data);

        if (type === UserLevelSettingType.UserLevel) {
          newSetting.userLevelSettings = newSetting.userLevelSettings.filter((item) => item.id !== id);
        } else if (type === UserLevelSettingType.ContributorLevel) {
          newSetting.contributorLevelSettings = newSetting.contributorLevelSettings.filter((item) => item.id !== id);
        }

        const res = await IdentityService.userLevelSettingUpdateSettings(newSetting);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          refetch();
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
      withCloseButton: false,
    });
  };

  useEffect(() => {
    if (!isManager) {
      router.push("/403");
    }
  }, [isManager]);

  if (!isManager) return null;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="px-4">
        <MenuBar title="System management" listItem={listItem} />
      </div>
      {openModalAvatar && (
        <ModalUploadAvatar
          onClose={() => setOpenModalAvatar(false)}
          onSuccess={() => refetch()}
          initialValue={refAvatarSelected.current}
          setting={data}
        />
      )}
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Setting avatar"),
            },
          ]}
        />
        <div className="flex flex-wrap justify-between gap-5">
          <div className="flex gap-2 flex-col">
            <div className="flex items-center font-semibold gap-2">
              {t("Avatar default")}
              <ActionIcon
                onClick={() => {
                  refAvatarSelected.current = {
                    type: UserLevelSettingType.DefaultUserAvatar,
                    file: data?.defaultUserAvatarUrl,
                  };
                  setOpenModalAvatar(true);
                }}
                variant="transparent"
              >
                <Pencil width={20} />
              </ActionIcon>
            </div>
            <Avatar src={data?.defaultUserAvatarUrl} />
          </div>

          <div className="flex gap-2 flex-col">
            <div className="flex items-center font-semibold gap-2">
              {t("Frame avatar manager content")}
              <ActionIcon
                onClick={() => {
                  refAvatarSelected.current = {
                    type: UserLevelSettingType.ManagerFrame,
                    file: data?.managerFrameUrl,
                  };
                  setOpenModalAvatar(true);
                }}
                variant="transparent"
              >
                <Pencil width={20} />
              </ActionIcon>
            </div>
            <Avatar
              userExpLevel={{
                iconUrl: data?.managerFrameUrl,
              }}
              src="/images/white.jpeg"
              userId={0}
            />
          </div>

          <div className="flex gap-2 flex-col">
            <div className="flex items-center font-semibold gap-2">
              {t("Default avatar contributor")}
              <ActionIcon
                onClick={() => {
                  refAvatarSelected.current = {
                    type: UserLevelSettingType.DefaultContributorAvatar,
                    file: data?.defaultContributorAvatarUrl,
                  };
                  setOpenModalAvatar(true);
                }}
                variant="transparent"
              >
                <Pencil width={20} />
              </ActionIcon>
            </div>
            <Image width={50} src={data?.defaultContributorAvatarUrl} />
          </div>
        </div>

        <div className="mt-5 mb-10 grid lg:grid-cols-2 gap-5">
          <div>
            <div className="font-semibold flex items-center gap-2 mb-2">
              {t("Frame avatar user")}
              <ActionIcon
                onClick={() => {
                  refAvatarSelected.current = {
                    type: UserLevelSettingType.UserLevel,
                    file: "",
                    isCreate: true,
                  };
                  setOpenModalAvatar(true);
                }}
                variant="transparent"
              >
                <Plus width={20} />
              </ActionIcon>
            </div>
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="!text-center w-[100px]">{t("Level")}</th>
                  <th>{t("Name")}</th>
                  <th className="w-[140px]">{t("Experience")}</th>
                  <th className="w-[72px]">{t("Image")}</th>
                  <th className="w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {data?.userLevelSettings?.map((e: any, index) => {
                  return (
                    <tr key={e.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        <TextLineCamp
                          data-tooltip-id="global-tooltip"
                          data-tooltip-content={e.name}
                          data-tooltip-place="top"
                          className="w-fit"
                        >
                          {e.name}
                        </TextLineCamp>
                      </td>
                      <td>{FunctionBase.formatNumber(e.requiredExperiencePoint)}</td>
                      <td>
                        <Avatar
                          userExpLevel={{
                            iconUrl: e.iconUrl,
                          }}
                          src="/images/white.jpeg"
                        />
                      </td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <ActionIcon
                            onClick={() => {
                              refAvatarSelected.current = {
                                type: UserLevelSettingType.UserLevel,
                                file: e?.iconUrl,
                                requiredExperiencePoint: e?.requiredExperiencePoint,
                                name: e?.name,
                                id: e.id,
                              };
                              setOpenModalAvatar(true);
                            }}
                            variant="transparent"
                          >
                            <Pencil width={20} />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => handleDelete(e.id, UserLevelSettingType.UserLevel)}
                            color="red"
                            variant="transparent"
                          >
                            <Trash width={20} />
                          </ActionIcon>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          <div>
            <div className="font-semibold flex items-center gap-2 mb-2">
              {t("Frame avatar contributor")}
              <ActionIcon
                onClick={() => {
                  refAvatarSelected.current = {
                    type: UserLevelSettingType.ContributorLevel,
                    file: "",
                    isCreate: true,
                  };
                  setOpenModalAvatar(true);
                }}
                variant="transparent"
              >
                <Plus width={20} />
              </ActionIcon>
            </div>
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="!text-center w-[100px]">{t("Level")}</th>
                  <th>{t("Name")}</th>
                  <th className="w-[140px]">{t("Experience")}</th>
                  <th className="w-[72px]">{t("Image")}</th>
                  <th className="w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {data?.contributorLevelSettings?.map((e: any, index) => {
                  return (
                    <tr key={e.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        <TextLineCamp
                          data-tooltip-id="global-tooltip"
                          data-tooltip-content={e.name}
                          data-tooltip-place="top"
                          className="w-fit"
                        >
                          {e.name}
                        </TextLineCamp>
                      </td>
                      <td>{FunctionBase.formatNumber(e.requiredExperiencePoint)}</td>
                      <td>
                        <Avatar
                          userExpLevel={{
                            iconUrl: e.iconUrl,
                          }}
                          src="/images/white.jpeg"
                        />
                      </td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <ActionIcon
                            onClick={() => {
                              refAvatarSelected.current = {
                                type: UserLevelSettingType.ContributorLevel,
                                file: e?.iconUrl,
                                requiredExperiencePoint: e?.requiredExperiencePoint,
                                name: e?.name,
                                id: e.id,
                              };
                              setOpenModalAvatar(true);
                            }}
                            variant="transparent"
                          >
                            <Pencil width={20} />
                          </ActionIcon>
                          <ActionIcon
                            onClick={() => handleDelete(e.id, UserLevelSettingType.ContributorLevel)}
                            color="red"
                            variant="transparent"
                          >
                            <Trash width={20} />
                          </ActionIcon>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AvatarSetting;
