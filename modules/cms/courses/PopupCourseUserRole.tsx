import { Checkbox } from "@mantine/core";
import { CourseHelper } from "@src/helpers/course.helper";
import { Button, Modal } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CourseUserListItem } from "./CourseUserListItem";

export const PopupCourseUserRole = (props: any) => {
  const { isOpen, onClose, selectedUser, onSubmit } = props;
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: selectedUser?.id,
      roles: {
        Owner: false,
        Manager: false,
        Member: false,
      },
    },
  });

  const ownerRole = watch("roles.Owner") ? true : false;
  const formState = getValues();
  useEffect(() => {
    if (ownerRole) {
      reset({
        ...formState,
        roles: {
          Owner: true,
          Manager: false,
          Member: false,
        },
      });
    }
  }, [ownerRole]);

  useEffect(() => {
    if (selectedUser) {
      const requestParams = {
        id: selectedUser?.userCourseId,
        roles: CourseHelper.convertUserRoleArrayToObject(selectedUser?.roles),
      };
      reset(requestParams);
    }
  }, [selectedUser]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      title={t(LocaleKeys["Set user's course role"])}
      size="xs"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="border  rounded p-4 mb-4">
          <CourseUserListItem data={selectedUser} />
        </div>
        <div className="mb-4">
          <div className="flex flex-col gap-4">
            <Checkbox size="sm" label="Owner" {...register(`roles.Owner`)} />
            <Checkbox size="sm" label="Manager" disabled={ownerRole} {...register(`roles.Manager`)} />
            <Checkbox size="sm" label="Member" disabled={ownerRole} {...register(`roles.Member`)} />
          </div>
        </div>
        <Button
          type="submit"
          // disabled={!selected}
          preset="primary"
          fullWidth
        >
          {t(LocaleKeys["Confirm"])}
        </Button>
      </form>
    </Modal>
  );
};
