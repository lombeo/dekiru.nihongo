import { Button, Modal } from "@mantine/core";
import { FriendService } from "@src/services/FriendService/FriendService";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import AsyncSelect from "react-select/async";

interface ModalAddUserProps {
  onClose: () => void;
  onSuccess: (course: any) => void;
}

const ModalAddUser = (props: ModalAddUserProps) => {
  const { onClose, onSuccess } = props;
  const { t } = useTranslation();

  const [selectedItems, setSelectedItems] = useState<any>([]);

  return (
    <Modal opened onClose={onClose} title={t("Add users")} closeOnClickOutside zIndex={201} size="md">
      <div>
        <AsyncSelect
          onChange={setSelectedItems}
          value={selectedItems}
          isMulti
          placeholder={t("Select") + "..."}
          classNames={{
            control: () => "!min-h-[42px] hover:shadow-none hover:!border-[#2C31CF]",
            placeholder: () => "text-sm !text-[#AEB7BF]",
            noOptionsMessage: () => "text-sm",
          }}
          loadingMessage={() => t("Loading")}
          noOptionsMessage={(obj) =>
            !_.isNil(obj.inputValue) && obj.inputValue.length >= 2
              ? t("No result found")
              : t("Enter 2 or more characters")
          }
          loadOptions={(query: string, callback: (options: any[]) => void) => {
            if (!query || query.trim().length < 2) {
              callback([]);
              return;
            }
            FriendService.searchUser({
              filter: query,
            }).then((res: any) => {
              const data = res?.data?.data;
              callback(
                data?.map((user: any) => ({
                  label: user.userName,
                  value: `${user.userId}`,
                })) || []
              );
            });
          }}
        />
        <div className="flex justify-end gap-5 mt-5">
          <Button size="md" onClick={onClose} variant="outline">
            {t("Close")}
          </Button>
          <Button
            onClick={() => {
              onSuccess(selectedItems.map((e: any) => ({ userId: +e.value, userName: e.label })));
              onClose();
            }}
            size="md"
          >
            {t("Save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddUser;
