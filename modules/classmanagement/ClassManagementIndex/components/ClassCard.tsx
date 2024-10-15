import { FriendService } from "@src/services/FriendService/FriendService";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import {
  ActionIcon,
  Avatar as AvatarMantine,
  Button,
  Card,
  FileInput,
  LoadingOverlay,
  Modal,
  Popover,
  Select,
  Text,
  Tooltip,
} from "@mantine/core";
import Avatar from "@src/components/Avatar";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { LearnClassesService } from "@src/services";
import { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { DotsVertical, Pencil, Plus, Trash } from "tabler-icons-react";
import Link from "@src/components/Link";

export default function ClassCard(props: any) {
  const { dataClass, userRole, fetch } = props;
  const { t } = useTranslation();
  const [modalJoinClass, setModalJoinClass] = useState(false);
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [userId, setUserId] = useState<any>();
  const router = useRouter();
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [modalAddUser, setModalAddUser] = useState(false);
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
  const onChangeFiles = async (data: any) => {
    setLoadingAddUser(true);
    const isValid = validation(data);
    if (!isValid) {
      return;
    }
    const formData = new FormData();
    formData.append("file", data);
    formData.append("classId", dataClass.id);
    const res = await LearnClassesService.importMember(formData);
    if (res?.data?.success) {
      Notify.success(t("Add successfully!"));
    } else {
      Notify.error(t(res?.data?.message));
    }
    setLoadingAddUser(false);
    setModalAddUser(false);
    fetch();
  };

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

  const handleAddUser = async () => {
    setLoadingAddUser(true);
    if (!userId) {
      Notify.error(t("User cannot empty"));
    } else {
      const res = await LearnClassesService.addMember({
        classId: parseInt(dataClass.id),
        userId: userId,
      });
      if (res?.data?.success) {
        Notify.success(t("Add successfully!"));
        fetch();
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
      setModalAddUser(false);
    }
    setLoadingAddUser(false);
  };
  const handleDelete = async () => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await LearnClassesService.deleteClass(dataClass.id);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
        fetch();
      },
    });
  };
  const handleJoinClass = async (status: boolean) => {
    const res = await LearnClassesService.responseClassInvite({
      classId: dataClass.id,
      isAccept: status,
    });
    if (res?.data?.success) {
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    setModalJoinClass(false);
    fetch();
  };
  return (
    <>
      <Card shadow="xl" className="sm:min-w-[360px] lg:max-w-[360px] pb-14 relative">
        <div className="flex justify-between items-center">
          <div>
            {dataClass.isShowDuration && dataClass.classStatus == 3 ? (
              <Text className="text-xs text-gray-500">{t("Closed")}</Text>
            ) : (
              <div />
            )}
            {dataClass.isShowDuration && dataClass.classStatus == 2 ? (
              <Text className="text-xs text-green-500">{t("In process")}</Text>
            ) : (
              <div />
            )}
          </div>

          {(dataClass.classSummary.isAddMember || dataClass.classSummary.isEdit || dataClass.classSummary.isDelete) && (
            <Popover width={100} position="bottom-end" shadow="md">
              <Popover.Target>
                <ActionIcon className="min-w-[30px]">
                  <DotsVertical size={24} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown className="p-0">
                <div>
                  {dataClass.classSummary.isAddMember && (
                    <div className="flex gap-2 items-center border-b-2 p-2 cursor-pointer hover:text-gray-500">
                      <Plus size={16} />
                      <Text className="text-sm" onClick={() => setModalAddUser(true)}>
                        {t("Add")}
                      </Text>
                    </div>
                  )}
                  {dataClass.classSummary.isEdit && (
                    <div className="flex gap-2 items-center border-b-2 p-2 cursor-pointer hover:text-gray-500">
                      <Pencil size={16} />
                      <Text className="text-sm" onClick={() => router.push(`/classmanagement/edit/${dataClass.id}`)}>
                        {t("Edit")}
                      </Text>
                    </div>
                  )}
                  {dataClass.classSummary.isDelete && (
                    <div className="flex gap-2 items-center border-b-2 p-2 cursor-pointer hover:text-gray-500">
                      <Trash size={16} />
                      <Text className="text-sm" onClick={handleDelete}>
                        {t("Delete")}
                      </Text>
                    </div>
                  )}
                </div>
              </Popover.Dropdown>
            </Popover>
          )}
        </div>

        <div className="flex justify-between border-b-2">
          <Text className="text-base color-[#333]" lineClamp={1}>
            {FunctionBase.htmlDecode(dataClass.className)}
          </Text>
        </div>
        <div className="flex gap-5 border-b-2 py-5">
          <Avatar src={dataClass?.owner?.avatarUrl} size="sm" userExpLevel={3} userId={dataClass.ownerId} />
          <div>
            <Link className="text-[#337ab7] text-sm" href={`/profile/${dataClass.ownerId}`}>
              {dataClass.owner.userName}
            </Link>
            <Text className="text-sm text-[#898989]">{FunctionBase.htmlDecode(dataClass.position)}</Text>
          </div>
        </div>
        <div className="py-2">
          <div className="flex justify-between">
            <Text className="text-sm">
              {dataClass.classSummary.totalAccepted + "/" + dataClass.classSummary.total + " " + t("Students")}
            </Text>
            {dataClass.classSummary.totalInviting > 0 && (
              <Text className="text-[#faa05e] text-sm">
                {dataClass.classSummary.totalInviting + " " + t("Not accepted yet")}
              </Text>
            )}
          </div>
          <div className="flex justify-center py-6">
            <Tooltip.Group openDelay={300} closeDelay={100}>
              <AvatarMantine.Group spacing="sm">
                {dataClass?.listMember.map((value, index) => {
                  return (
                    <Tooltip key={value.id} label={<Text>{value.userName}</Text>} withArrow>
                      <AvatarMantine
                        className="shadow-sm cursor-pointer"
                        variant="outline"
                        src={value.avatarUrl}
                        radius="xl"
                        onClick={() => router.push(`/profile/${value.userId}`)}
                      />
                    </Tooltip>
                  );
                })}
                {dataClass.classSummary.total > 7 && (
                  <AvatarMantine
                    className="shadow-sm cursor-pointer"
                    variant="outline"
                    radius="xl"
                    onClick={() => router.push(`/classmanagement/allclassmember/${dataClass.id}`)}
                  >
                    {"+" + (dataClass.classSummary.total - 7)}
                  </AvatarMantine>
                )}
              </AvatarMantine.Group>
            </Tooltip.Group>
          </div>
        </div>
        <Card.Section>
          {!dataClass.classSummary.isAccept &&
          !dataClass.classSummary.isOther &&
          !dataClass.classSummary.isNotMember ? (
            <Button
              className="w-full absolute bottom-0 bg-orange-300"
              variant="light"
              onClick={() => setModalJoinClass(true)}
            >
              {t("Confirm to join class")}
            </Button>
          ) : (
            <Button
              className="w-full absolute bottom-0"
              variant="light"
              onClick={() => router.push(`/classmanagement/classdetails/${dataClass.id}`)}
            >
              {t("View Detail")}
            </Button>
          )}
        </Card.Section>
      </Card>
      <Modal opened={modalJoinClass} onClose={() => setModalJoinClass(false)}>
        <div className="flex justify-center">
          <Text className="text-xl">{t("Are you sure you want to join this class?")}</Text>
        </div>
        <div className="flex gap-8 justify-center py-6">
          <Button variant="filled" color="red" onClick={() => handleJoinClass(false)}>
            {t("Reject")}
          </Button>
          <Button variant="filled" color="green" onClick={() => handleJoinClass(true)}>
            {t("Accept")}
          </Button>
        </div>
      </Modal>
      <Modal
        size={650}
        opened={modalAddUser}
        onClose={() => setModalAddUser(false)}
        title={t("ADD USER")}
        className="relative"
      >
        <div className="flex border-t-2 py-12 gap-2">
          <Select
            nothingFound={t("No result found")}
            data={userOptions}
            clearable
            searchable
            onSearchChange={handleSearchUsers}
            onChange={(value) => setUserId(value)}
            placeholder={t("Username")}
          />
          <Button onClick={handleAddUser}>{t("Add user")}</Button>
          <FileInput placeholder={t("Select file")} onChange={(files) => onChangeFiles(files)} />
          <Button className="bg-blue-600">
            <a href="/files/template_add_member_class.xlsx" className="text-white">
              {t("Template")}
            </a>
          </Button>
        </div>
        <LoadingOverlay visible={loadingAddUser} zIndex={1000} />
      </Modal>
    </>
  );
}
