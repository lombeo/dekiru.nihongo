import { Modal, TextInput } from "@edn/components";
import { Button } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const CreateFormModal = (props: any) => {
  const { onSubmit, onClose, onOpened, folderName } = props;

  const { t } = useTranslation();
  let defaultFormValue = {
    folderName: "",
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    // resolver: yupResolver(FolderFileManager),
    defaultValues: defaultFormValue,
  });
  useEffect(() => {
    let folderValue = {
      folderName: folderName,
    };
    reset(folderValue);
  }, [onOpened, reset, folderName]);
  const createFolder = (form: any, ev: any) => {
    ev.preventDefault();
    if (isSubmitting) return;
    onSubmit(form);
  };
  return (
    <Modal
      title={folderName ? t("Update folder") : t("Add new folder")}
      size="sm"
      opened={onOpened}
      onClose={onClose}
      zIndex={300}
    >
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(createFolder)} noValidate>
        <Controller
          name="folderName"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              size="md"
              type="text"
              label={t("Folder name")}
              maxLength={128}
              classNames={{
                root: "",
              }}
            />
          )}
        />
        {/* <ValidationNotification
          message={errors.folderName?.message}
          type={NotificationLevel.ERROR}
        /> */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{folderName ? t("Save") : t("Add")}</Button>
        </div>
      </form>
    </Modal>
  );
};
