import Icon from "@edn/font-icons/icon";
import { useMediaQuery } from "@mantine/hooks";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import SearchUsers from "../SearchUsers/SearchUsers";

/**
 * Add member to chat
 * @param props dataRoom, onAddMember, onCloseAddMember
 * @returns Add member
 */
const AddMember = (props: any) => {
  const { dataRoom, onAddMember, onCloseAddMember } = props;
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const matches = useMediaQuery("(min-width: 768px)");

  const isDisabled = users.length <= 0;

  return (
    <div className="absolute w-full h-full bg-[#646464cc] z-10 shadow-lg p-2 px-2">
      <div className="bg-white rounded-md p-2">
        <p className="font-semibold m-0 mb-4">{t("Add member")}</p>
        <div className="flex flex-col">
          <SearchUsers
            maxHeightPopper={matches ? 90 : 300}
            placement="top-start"
            excludeUsernames={dataRoom?.members?.map((item) => item.username)?.filter((e) => !isNil(e))}
            value={users}
            onChange={setUsers}
          />
          <div className="flex items-center mt-3 gap-2 justify-end">
            <span
              onClick={() => onCloseAddMember()}
              className="bg-gray-lighter flex items-center justify-center h-10 w-10 rounded-md cursor-pointer"
              style={{ minWidth: "40px" }}
            >
              <Icon size={18} name="close" />
            </span>
            <span
              onClick={() => onAddMember(users.map((e) => e.id))}
              className={`bg-blue-secondary text-white flex items-center justify-center h-10 w-10 rounded-md cursor-pointer ${
                isDisabled ? "cursor-not-allowed opacity-40 pointer-events-none" : ""
              }`}
              style={{ minWidth: "40px" }}
            >
              <Icon size={18} name="done" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddMember;
