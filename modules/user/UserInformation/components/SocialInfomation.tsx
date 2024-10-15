import { Button, Checkbox, Group, Modal, TextInput } from "@mantine/core";
import { Trans, useTranslation } from "next-i18next";
import { Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { Pencil } from "tabler-icons-react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { IdentityService } from "@src/services/IdentityService";
import { Notify } from "@src/components/cms";
import useFetchProfile from "@src/hooks/useFetchProfile";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "@src/validations/yupGlobal";
import Link from "@src/components/Link";

interface IProps {
  isCurrentUser: boolean;
  isFromLeftBox?: boolean;
  userProfile: any;
}

const SocialInfomation = (props: IProps) => {
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
    setValue("facebook", userProfile?.facebook ?? "");
    setValue("linkedIn", userProfile?.linkedIn ?? "");
    setValue("twitter", userProfile?.twitter ?? "");
  }, [userProfile]);

  const mutation = useMutation({
    mutationFn: (data) => {
      return IdentityService.updateUserSocial(data);
    },
    onSuccess: (data) => {
      if (data?.data?.success) {
        Notify.success(t("Update successfully!"));
        setIsEdit(false);
        fetchProfile();
      }
    },
  });

  const renderRow = (img: string, bgColor: string, value: string) => {
    return (
      <div className="flex gap-4 items-center px-2">
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Image src={img} alt={img} width={14} height={14} />
        </div>
        <Link className="text-blue-600 hover:underline truncate" target="_blank" href={value}>
          {value}
        </Link>
      </div>
    );
  };

  const handleClose = () => {
    setIsEdit(false);
    reset();
  };

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden p-5 space-y-6">
      <div className="flex justify-between gap-4 items-center">
        <div className="font-bold text-lg uppercase">{t("Socials")}</div>
        {isCurrentUser &&
          (!isFromLeftBox ? (
            <Button variant="outline" rightIcon={<Pencil width={20} />} onClick={() => setIsEdit(true)}>
              {t("Update")}
            </Button>
          ) : (
            <Pencil width={20} onClick={() => setIsEdit(true)} className="text-blue-600 cursor-pointer" />
          ))}
      </div>
      {renderRow("/images/facebook-icon.svg", " bg-[#37599E] ", userProfile?.facebook ?? "")}
      {renderRow("/images/linkedin-icon.svg", " bg-[#0077B5] ", userProfile?.linkedIn ?? "")}
      {renderRow("/images/twitter-icon.svg", " bg-[#00A2F9] ", userProfile?.twitter ?? "")}
      {isEdit && (
        <Modal
          opened
          onClose={handleClose}
          size="lg"
          title={<span className="font-bold text-xl">{t("Update social")}</span>}
        >
          <div className="space-y-6 px-2">
            <Controller
              name="facebook"
              control={control}
              render={({ field }) => <TextInput {...field} label={t("Facebook")} placeholder="Facebook" size="md" />}
            />
            <Controller
              name="linkedIn"
              control={control}
              render={({ field }) => <TextInput {...field} label={t("Linked-In")} placeholder="Linked-In" size="md" />}
            />
            <Controller
              name="twitter"
              control={control}
              render={({ field }) => <TextInput {...field} label={t("Twitter")} placeholder="Twitter" size="md" />}
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

export default SocialInfomation;
