import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Modal, Text, TextInput } from "@mantine/core";
import { IdentityService } from "@src/services/IdentityService";
import { useTranslation } from "next-i18next";
import { useState } from "react";

interface ModalAddOrganizationProps {
  onClose: () => void;
  initData: any;
  onSuccess: (data: any) => void;
}

export const ModalAddOrganization = (props: ModalAddOrganizationProps) => {
  const { onClose, initData, onSuccess } = props;
  const { t } = useTranslation();
  const isEdit = initData?.isEdit;
  const parentId = initData?.parentId;

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    shortName: "",
  });

  const [dataOrganization, setDataOrganization] = useState(
    isEdit
      ? {
          name: initData?.name || "",
          shortName: initData?.shortName || "",
        }
      : {
          name: "",
          shortName: "",
        }
  );

  const onSubmit = async () => {
    const res = await IdentityService.saveOrganization({
      name: dataOrganization.name.trim(),
      shortName: dataOrganization.shortName.trim(),
      id: isEdit ? initData?.id : undefined,
      parentId: parentId,
    });

    if (res?.data?.success) {
      Notify.success(t(isEdit ? "Update successfully!" : "Add successfully!"));
      onSuccess(res?.data?.data);
      onClose();
    } else {
      Notify.error(t(res?.data?.message));
    }
  };

  return (
    <Modal opened={true} onClose={onClose}>
      <div className="border-b-2 pb-2 flex justify-center">
        <Text className="uppercase font-semibold text-lg text-blue-500">
          {isEdit ? t("Update Organization") : t("Create Organization")}
        </Text>
      </div>
      <div className="flex flex-col gap-4 py-4 px-4">
        <TextInput
          value={dataOrganization.name}
          onChange={(event) => {
            if (event.target.value.length > 256) {
              setErrorMessage((pre) => {
                return {
                  ...pre,
                  name: t("The field can not over 256 character"),
                };
              });
            } else {
              setErrorMessage((pre) => {
                return {
                  ...pre,
                  name: "",
                };
              });
              setDataOrganization((pre) => ({
                ...pre,
                name: event.target.value,
              }));
            }
          }}
          placeholder={t("Name")}
          error={errorMessage.name}
        />
        <TextInput
          value={dataOrganization.shortName}
          onChange={(event) => {
            if (event.target.value.length > 50) {
              setErrorMessage((pre) => {
                return {
                  ...pre,
                  shortName: t("The field can not over 50 character"),
                };
              });
            } else {
              setErrorMessage((pre) => {
                return {
                  ...pre,
                  shortName: "",
                };
              });
              setDataOrganization((pre) => ({
                ...pre,
                shortName: event.target.value,
              }));
            }
          }}
          error={errorMessage.shortName}
          placeholder={t("Short name")}
        />
      </div>
      <div className="flex justify-end px-4 py-6">
        <Button onClick={onSubmit}>{isEdit ? t("Save") : t("Create")}</Button>
      </div>
    </Modal>
  );
};
