import { Select } from "@edn/components";
import { useClickOutside, useDebouncedValue } from "@mantine/hooks";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { CourseUserListItem } from "./CourseUserListItem";
import QueryUtils from "@src/helpers/query-utils";
import { FriendService } from "@src/services/FriendService/FriendService";
import { isEmpty } from "lodash";

const MultiSelectUser = (props: any) => {
  const { handelChangeSearchParent } = props;
  const [selected, setSelected] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [keyword, setKeyword] = useState<any>("");
  const [debouncedKeyword] = useDebouncedValue(keyword, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [blur, setBlur] = useState(false);
  const { t } = useTranslation();
  const ref = useClickOutside(() => setBlur(true), ["mouseup", "touchend"]);
  useEffect(() => {
    if (debouncedKeyword) {
      setKeyword(QueryUtils.sanitize(debouncedKeyword));
      if (isEmpty(debouncedKeyword) || debouncedKeyword.length <= 2) {
        setData([]);
        return;
      }
      setIsSearching(true);
      FriendService.searchUser({
        filter: debouncedKeyword,
      }).then((res) => {
        setData(res?.data?.data);
        setIsSearching(false);
      });
      // ProfileService.searchUser({
      //   Username: debouncedKeyword,
      //   Page: 1,
      //   PageSize: 20,
      //   CurrentUser: "",
      //   ExcludeUsernames: [],
      // }).then((x: any) => {
      //   const response: any = x?.data;
      //   setData(response?.data?.results);
      //   setIsSearching(false);
      // });
    }
  }, [debouncedKeyword]);

  const getUsers = () => {
    if (!data) return [];
    return data.map((x: any) => {
      return {
        value: x.userId,
        label: x.userName,
      };
    });
  };

  const onSelectAccount = (e: any) => {
    const userInfo = data?.find((x: any) => x.userId == e);
    setSelected(userInfo);
    if (userInfo) {
      handelChangeSearchParent([userInfo?.userId]);
    } else {
      handelChangeSearchParent([]);
    }
  };

  const onRemoveSelect = () => {
    setSelected(null);
    handelChangeSearchParent([]);
  };

  const onKeyWordChange = (keyWordChange: any) => {
    setBlur(false);
    if (keyWordChange) {
      const userInfo = data?.find((x: any) => x?.userName == keyWordChange);
      if (userInfo?.userName !== keyWordChange) {
        setKeyword(keyWordChange);
      }
    }
    if (!keyWordChange) {
      setKeyword("");
    }
  };

  const classNames = blur ? { dropdown: "hidden" } : { dropdown: "" };
  return (
    <div ref={ref}>
      {!selected && (
        <Select
          label={t("Email")}
          placeholder={t("Email")}
          data={getUsers()}
          searchable
          searchValue={keyword}
          onChange={onSelectAccount}
          onSearchChange={onKeyWordChange}
          disabled={isSearching}
          nothingFound={t("You have not entered a username or the username has been added to the list")}
          classNames={classNames}
        />
      )}
      {selected && (
        <>
          <CourseUserListItem data={selected} onRemove={onRemoveSelect} />
        </>
      )}
      {/* <Select
        data={tags ?? []}
        value={tagSelections}
        onChange={handelChangeValue}
        onSearchChange={handelCurrentTextSearch}
        placeholder={t("Username")}
        label={t("Username")}
        searchable
        clearable
        rightSection={!tags && <Loader size="xs" />}
        nothingFound={t(
          "You have not entered a username or the username has been added to the list"
        )}
        className="w-96 grow"
      /> */}
    </div>
  );
};

export default MultiSelectUser;
