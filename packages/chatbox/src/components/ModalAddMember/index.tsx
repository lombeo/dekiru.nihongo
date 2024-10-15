import { Modal } from "@edn/components/Modal";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import SearchUsers from "../SearchUsers/SearchUsers";
import Icon from "@edn/font-icons/icon";
import { isNil } from "lodash";

const ModalAddMember = ({ open, onClose, dataRoom, onSubmit }: any) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const isDisabled = users.length <= 0;

  return (
    <Modal
      centered
      opened={open}
      onClose={onClose}
      title={<strong className="text-xl">{t("Add member")}</strong>}
      size="lg"
    >
      <label className="text-sm">
        {t("Friends")} <span className="text-red-500">*</span>
      </label>
      <SearchUsers
        excludeUsernames={dataRoom?.members?.map((item) => item.username)?.filter((e) => !isNil(e))}
        value={users}
        onChange={setUsers}
      />
      <div className="flex items-center mt-3 gap-2 justify-end">
        <span
          onClick={() => onClose()}
          className="bg-gray-lighter flex items-center justify-center h-10 w-10 rounded-md cursor-pointer"
          style={{ minWidth: "40px" }}
        >
          <Icon size={18} name="close" />
        </span>
        <span
          onClick={() => onSubmit(users.map((e) => e.id))}
          className={`bg-blue-secondary text-white flex items-center justify-center h-10 w-10 rounded-md cursor-pointer ${
            isDisabled ? "cursor-not-allowed opacity-40 pointer-events-none" : ""
          }`}
          style={{ minWidth: "40px" }}
        >
          <Icon size={18} name="done" />
        </span>
      </div>
    </Modal>
  );
};
export default ModalAddMember;
