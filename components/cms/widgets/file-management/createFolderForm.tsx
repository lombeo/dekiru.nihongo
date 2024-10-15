import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, TextInput } from "components/cms/core";
import { LIMIT_VIDEO_TITLE_LENGTH } from "constants/cms/video/video.constant";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FolderFileManager } from "validations/cms/folderFileManager.schemal";

export const CreateFormModal = (props: any) => {
  const { onSubmit, onClose, onOpened, folderName, videoType } = props;

  const folderLabel = videoType ? videoType : "Folder";

  const { t } = useTranslation();
  //Init form data
  let defaultFormValue = {
    folderName: "",
  } as any;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(FolderFileManager),
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
    if (form?.folderName?.length > LIMIT_VIDEO_TITLE_LENGTH) {
      Notify.error(
        t(`Title cannot exceed the limit of {{limit}} characters`, {
          limit: LIMIT_VIDEO_TITLE_LENGTH,
        })
      );
      return;
    }
    if (isSubmitting) return;
    onSubmit(form);
  };
  return (
    <Modal
      title={folderName ? t(`Update ${folderLabel.toLowerCase()}`) : t("Add new folder")}
      modalSize="sm"
      opened={onOpened}
      onClose={onClose}
      zIndex={300}
    >
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(createFolder)} noValidate>
        <TextInput
          size="md"
          type="text"
          label={folderName ? t(`${folderLabel} name`) : t(`Folder name`)}
          // maxLength={128}
          classNames={{
            root: "",
          }}
          {...register("folderName")}
          error={t(errors?.folderName?.message as any) as any}
        />
        <div className="flex justify-end gap-3">
          <Button preset="secondary" onClick={onClose}>
            {t("Discard")}
          </Button>
          <Button preset="primary" type="submit">
            {folderName ? t("Update") : t("Add")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
