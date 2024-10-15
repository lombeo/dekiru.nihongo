import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox, Modal, Textarea } from "@mantine/core";
import Link from "@src/components/Link";
import { IdentityService } from "@src/services/IdentityService";
import { isNil } from "lodash";
import { Trans, useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface ModalUpdateAchievementProps {
  onClose: () => void;
  onSuccess: () => void;
  data?: any;
}

const ModalUpdateAchievement = (props: ModalUpdateAchievementProps) => {
  const { onClose, data, onSuccess } = props;
  const { t } = useTranslation();

  const initialValues: any = {
    achievement: isNil(data?.achievement) ? "" : data.achievement,
  };

  const [loading, setLoading] = useState(false);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        achievement: yup
          .string()
          .nullable()
          .max(
            500,
            t("{{name}} must be less than {{count}} characters", {
              count: 501,
              name: t("Achievement"),
            })
          ),
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
    formState: { errors },
    handleSubmit,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await IdentityService.saveUserAchievement({
        ...data,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Update successfully!"));
        setTimeout(() => {
          onSuccess?.();
        }, 500);
        onClose();
      } else if (res?.data?.message) {
        Notify.error(t(res?.data?.message));
      }
    })();
  };

  return (
    <Modal
      classNames={{ title: "font-semibold uppercase text-lg" }}
      title={t("Achievement")}
      size="lg"
      centered
      onClose={onClose}
      opened
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="achievement"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              rows={8}
              minRows={8}
              error={errors[field.name]?.message as string}
              classNames={{ label: "font-semibold" }}
              label={t("Achievement")}
            />
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
      </div>
      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={() => handleClickSubmit()}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalUpdateAchievement;
