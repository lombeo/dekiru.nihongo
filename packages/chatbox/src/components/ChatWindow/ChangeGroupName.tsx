import Icon from "@edn/font-icons/icon";
import { TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useState } from "react";
/**
 * List members of chat
 * @param props dataRoom, onCloseChangeGroupName
 * @returns list members of chat
 */
const ChangeGroupName = (props: any) => {
  const { onCloseChangeGroupName, roomId, onChangeGroupName } = props;
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(false);

  //On change
  const onChangeName = (value: any) => {
    setNewName(value.trim());
    if (value.trim().length == 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  let oldName = "";
  if (document.querySelector(`#group-chat-name-${roomId}`) != null) {
    oldName = document.querySelector(`#group-chat-name-${roomId}`).textContent;
  }
  const [newName, setNewName] = useState(oldName);

  return (
    <div className="absolute w-full h-full bg-black z-10 shadow-lg p-2 px-3">
      <div className="bg-white rounded-md p-4">
        <p className="font-semibold m-0 mb-4">{t("Change group name")}</p>
        <div className="flex items-center gap-2 justify-between">
          <TextInput defaultValue={oldName + ""} onChange={(e) => onChangeName(e.currentTarget.value)} />
          <span
            onClick={() => onCloseChangeGroupName()}
            className="bg-gray-lighter flex items-center justify-center h-10 w-10 rounded-md cursor-pointer"
          >
            <Icon size={18} name="close" />
          </span>
          <span className={`h-10 w-10 ${isDisabled ? "cursor-not-allowed" : ""}`}>
            <span
              onClick={() => onChangeGroupName(newName)}
              className={`bg-blue-primary text-white flex items-center justify-center h-10 w-10 rounded-md cursor-pointer ${
                isDisabled ? "cursor-not-allowed opacity-40 pointer-events-none" : ""
              }`}
            >
              <Icon size={18} name="done" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default ChangeGroupName;
