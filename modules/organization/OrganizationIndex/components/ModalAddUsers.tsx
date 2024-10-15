import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, FileInput, LoadingOverlay, Modal, MultiSelect, Text } from "@mantine/core";
import { FriendService } from "@src/services/FriendService/FriendService";
import { IdentityService } from "@src/services/IdentityService";
import { selectProfile } from "@src/store/slices/authSlice";
import { uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";

export const ModalAddUsers = (props: any) => {
  const { onClose, fetch, organizationId, organization } = props;

  const profile = useSelector(selectProfile);

  const [users, setUsers] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [listUsers, setListUsers] = useState<any[]>([]);
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [listManagers, setListManagers] = useState<any[]>([]);
  const [file, setFile] = useState<any>();
  const onSubmit = async () => {
    if (file) {
      onSubmitFile(file);
    } else {
      if (listUsers.length === 0 && listManagers.length === 0) {
        Notify.error(t("Can't empty"));
      } else {
        const res = await IdentityService.addUserOrganization({
          organizationId: organizationId,
          listMembers: listUsers,
          listManagers: listManagers,
        });
        if (res?.data?.success) {
          Notify.success(t("Add successfully!"));
          onClose();
          fetch();
        } else {
          Notify.error(t(res?.data?.message));
        }
      }
    }
  };
  const { t } = useTranslation();

  const isOwner = profile?.userId === organization?.ownerId;

  const validation = (data: any) => {
    let isValid = true;
    const file = data;
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 25) {
      Notify.error(t("Attachment file size cannot exceed 25MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  const onSubmitFile = async (data: any) => {
    setLoadingAddUser(true);
    const isValid = validation(data);
    if (!isValid) {
      return;
    }
    const formData = new FormData();
    formData.append("file", data);
    formData.append("organizationId", organizationId.toString());
    const res = await IdentityService.importMember(formData);
    if (res?.data?.success) {
      Notify.success(t("Add successfully!"));
      onClose();
      fetch();
    } else {
      Notify.error(t(res?.data?.message));
    }
    setLoadingAddUser(false);
  };

  return (
    <Modal opened={true} onClose={onClose}>
      <div className="border-b-2 pb-2 flex justify-center">
        <Text className="uppercase font-semibold text-lg text-blue-500">{t("Add user")}</Text>
      </div>
      <div className="flex flex-col gap-4 py-4 px-4">
        {isOwner && (
          <MultiSelect
            placeholder={t("Select user")}
            data={managers}
            clearable
            searchable
            onChange={(listManagers) => {
              setListManagers(listManagers);
            }}
            onSearchChange={(query) => {
              if (!query || query.trim().length < 2) return;
              FriendService.searchUser({
                filter: query,
              }).then((res) => {
                const data = res?.data?.data;
                if (data) {
                  setManagers((prev) =>
                    uniqBy(
                      [
                        ...prev,
                        ...data.map((user) => ({
                          label: user.userName,
                          value: `${user.userId}`,
                        })),
                      ],
                      "value"
                    )
                  );
                }
              });
            }}
            label={t("Organization management")}
          />
        )}
        <MultiSelect
          placeholder={t("Select user")}
          data={users}
          clearable
          searchable
          onChange={(listUsers) => {
            setListUsers(listUsers);
          }}
          onSearchChange={(query) => {
            if (!query || query.trim().length < 2) return;
            FriendService.searchUser({
              filter: query,
            }).then((res) => {
              const data = res?.data?.data;
              if (data) {
                setUsers((prev) =>
                  uniqBy(
                    [
                      ...prev,
                      ...data.map((user) => ({
                        label: user.userName,
                        value: `${user.userId}`,
                      })),
                    ],
                    "value"
                  )
                );
              }
            });
          }}
          label={t("Organization user")}
        />
      </div>
      <div className="flex flex-col justify-end border-t-2 py-12 gap-2">
        <div className="grid grid-cols-[300px_auto] gap-2">
          <FileInput
            placeholder={t("Select file")}
            clearable
            onChange={(files) => {
              setFile(files);
            }}
          />
          <Button className="bg-blue-600">
            <a href="/files/template_add_member_organization.xlsx" className="text-white">
              {t("Template")}
            </a>
          </Button>
        </div>
        <Button onClick={onSubmit}>{t("Add")}</Button>
      </div>
      <LoadingOverlay visible={loadingAddUser} zIndex={1000} />
    </Modal>
  );
};
