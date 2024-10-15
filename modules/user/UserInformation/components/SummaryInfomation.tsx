import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Group, Modal, Textarea } from "@mantine/core";
import { Notify } from "@src/components/cms";
import Link from "@src/components/Link";
import useFetchProfile from "@src/hooks/useFetchProfile";
import { IdentityService } from "@src/services/IdentityService";
import yup from "@src/validations/yupGlobal";
import { useMutation } from "@tanstack/react-query";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pencil } from "tabler-icons-react";

interface IProps {
  isCurrentUser: boolean;
  isFromLeftBox?: boolean;
  userProfile: any;
}

const SummaryInfomation = (props: IProps) => {
  const { isCurrentUser, userProfile, isFromLeftBox = false } = props;
  const fetchProfile = useFetchProfile();

  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: { agree: false },
    resolver: yupResolver(
      yup.object().shape({
        agree: yup
          .boolean()
          .nullable()
          .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
          .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methodForm;

  useEffect(() => {
    if (!userProfile) return;
    setValue("summary", userProfile?.summary ?? "");
  }, [userProfile]);

  const mutation = useMutation({
    mutationFn: (data) => {
      return IdentityService.updateUserSummary(data);
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        Notify.success(t("Update successfully!"));
        setIsEdit(false);
        fetchProfile();
      }
    },
  });

  const handleClose = () => {
    setIsEdit(false);
    reset();
  };
  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden p-5 space-y-6">
      <div className="flex justify-between gap-4 items-center">
        <div className="font-bold text-lg uppercase">{t("Introduction")}</div>
        {isCurrentUser &&
          (!isFromLeftBox ? (
            <Button variant="outline" rightIcon={<Pencil width={20} />} onClick={() => setIsEdit(true)}>
              {t("Update")}
            </Button>
          ) : (
            <Pencil width={20} onClick={() => setIsEdit(true)} className="text-blue-600 cursor-pointer" />
          ))}
      </div>

      <Textarea
        value={userProfile?.summary ?? ""}
        placeholder={t("Introduction")}
        size="lg"
        maxRows={6}
        autosize
        readOnly
      />

      {isEdit && (
        <Modal
          opened
          onClose={handleClose}
          size="lg"
          title={<span className="font-bold text-xl">{t("Update summary")}</span>}
        >
          <div className="space-y-6 px-2">
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <Textarea {...field} label={t("Introduction")} placeholder={t("Introduction")} size="lg" />
              )}
            />
            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  label={
                    <Trans i18nKey="AGREE_PRIVACY_POLICY" t={t}>
                      I agree to
                      <Link target="_blank" href={`/terms`} className="text-[#337ab7] hover:underline">
                        Terms of Service and Privacy Policy
                      </Link>
                    </Trans>
                  }
                  error={errors[field.name]?.message as string}
                />
              )}
            />
            <Group position="right" mt="lg">
              <Button onClick={handleClose} variant="outline">
                {t("Close")}
              </Button>
              <Button loading={mutation.isPending} onClick={handleSubmit((data) => mutation.mutateAsync(data))}>
                {t("Save")}
              </Button>
            </Group>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SummaryInfomation;
