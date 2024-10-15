import { Center, Divider, Select, Space } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { Button, Modal } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { CourseUserListItem } from "./CourseUserListItem";

export const PopupCourseUser = (props: any) => {
  const { isOpen, onClose, onAddUser, selectedUser } = props;
  const [data, setData] = useState<any>([]);
  const [keyword, setKeyword] = useState<any>("");
  const [debouncedKeyword] = useDebouncedValue(keyword, 1500);
  const [selected, setSelected] = useState<any>();
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      setSelected(null);
      setKeyword("");
      setData([]);
    };
  }, [isOpen]);

  useEffect(() => {
    if (debouncedKeyword) {
      setIsSearching(true);
      const selectedUserName = selectedUser.map((x: any) => x.userName);
      // AccountService.searchUserByUsername({
      //   Username: debouncedKeyword,
      //   Page: 1,
      //   PageSize: 20,
      //   CurrentUser: "",
      //   ExcludeUsernames: selectedUserName,
      // }).then((x: any) => {
      //   const response: any = x?.data;
      //   setData(
      //     response?.data?.results?.map((e: any) => ({
      //       value: e.id.toString(),
      //       label: e.email || e.userName,
      //       data: e,
      //     }))
      //   );
      //   setIsSearching(false);
      // });
    }
  }, [debouncedKeyword]);

  const onSelectAccount = (e: any) => {
    const userInfo = data.find((x: any) => x.value == e);
    setSelected(userInfo?.data);
  };

  const onRemoveSelect = () => {
    setSelected(null);
  };

  const handleAddUser = () => {
    onAddUser && onAddUser(selected);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      title={t(LocaleKeys["Add user to course"])}
      size="xs"
    >
      <form noValidate>
        {!selected && (
          <Select
            placeholder={t(LocaleKeys.D_SEARCH_BY_SPECIFIC, {
              name: t(LocaleKeys.Username).toLowerCase(),
            })}
            searchable
            onChange={onSelectAccount}
            disabled={isSearching}
            onSearchChange={(x: any) => setKeyword(x)}
            nothingFound={t(LocaleKeys["No result found"])}
            data={data}
          />
        )}
        {selected && (
          <>
            <CourseUserListItem data={selected} onRemove={onRemoveSelect} />
            <Divider />
          </>
        )}
        <Space h="sm" />
        <Center>
          <Button disabled={!selected} fullWidth onClick={handleAddUser} preset="primary">
            {t(LocaleKeys["Confirm"])}
          </Button>
        </Center>
      </form>
    </Modal>
  );
};
