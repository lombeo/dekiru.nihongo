import React, { useCallback } from "react";
import TagField, { DataSource } from "@src/components/TagField/TagField";
import { isEmpty } from "lodash";
import { useTranslation } from "next-i18next";
import { FriendService } from "@src/services/FriendService/FriendService";

/**
 * Search users
 * @returns Array<number> of user ids
 */

interface SearchUsersProps {
  value: any[];
  onChange: (value: any[]) => void;
  excludeUsernames?: string[] | null;
  maxHeightPopper?: React.CSSProperties["maxHeight"];
  placement?: any;
  minHeight?: React.CSSProperties["minHeight"];
  multiple?: boolean;
  disabled?: boolean;
  placeholder?: string;
  currentUser?: string;
}

const SearchUsers = (props: SearchUsersProps) => {
  const {
    value,
    onChange,
    excludeUsernames = [],
    disabled,
    minHeight,
    maxHeightPopper,
    placement,
    multiple = true,
    placeholder,
  } = props;
  const { t } = useTranslation();

  const handleFetchOptions = useCallback(
    async (query: string, page: number) => {
      try {
        let data: any[] = [];
        let total = 0;
        let limit = 10;
        if (!isEmpty(query) && query.length > 2) {
          const response = await FriendService.searchUser({
            filter: query,
          });
          data = response?.data?.data?.map((e) => ({ ...e, id: e.userId }));
          total = data?.length | 0;
        }
        if (!data) return;
        return Promise.resolve({
          data,
          total,
          limit,
        } as DataSource);
      } catch (e) {}
    },
    [excludeUsernames]
  );

  return (
    <>
      <TagField
        fetchOptions={handleFetchOptions}
        value={value}
        placeholder={placeholder || t("Search users")}
        getOptionLabel={(item) => item?.userName}
        maxHeightPopper={maxHeightPopper}
        onChange={onChange}
        placement={placement}
        minHeight={minHeight}
        multiple={multiple}
        disabled={disabled}
      />
    </>
  );
};
export default SearchUsers;
