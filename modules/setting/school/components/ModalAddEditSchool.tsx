import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { IdentityService } from "@src/services/IdentityService";
import { Notify } from "@src/components/cms";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "@src/validations/yupGlobal";

interface IProps {
  school: { schoolId: string; schoolName: string };
  districtId?: string;
  onClose: () => void;
}

const ModalAddEditSchool = (props: IProps) => {
  const { school, districtId, onClose } = props;

  const { t } = useTranslation();

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: { schoolName: school.schoolName },
    resolver: yupResolver(
      yup.object().shape({
        schoolName: yup.string().nullable().required(t("This field is required, do not be left blank")),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methodForm;

  const mutation = useMutation({
    mutationFn: (schoolName: string) => {
      const params = {
        districtId: !school.schoolId ? districtId : 0,
        schoolId: school.schoolId ? school.schoolId : 0,
        schoolName,
      };
      return IdentityService.addUpdateSchoolOrUniversity(params);
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        Notify.success(!school.schoolId ? t("Add successfully!") : t("Update successfully!"));
        onClose();
      }
    },
  });

  return (
    <Modal
      opened
      onClose={onClose}
      size="lg"
      title={<span className="font-bold text-xl">{!school.schoolId ? t("Add school") : t("Update school")}</span>}
    >
      <div className="space-y-6 px-2">
        <Controller
          name="schoolName"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={t("School")}
              required
              placeholder={t("School")}
              size="md"
              error={errors[field.name]?.message as string}
            />
          )}
        />
        <Group position="right" mt="lg">
          <Button onClick={onClose} variant="outline">
            {t("Close")}
          </Button>
          <Button loading={mutation.isPending} onClick={handleSubmit((data) => mutation.mutateAsync(data.schoolName))}>
            {!school.schoolId ? t("Add") : t("Save")}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default ModalAddEditSchool;
