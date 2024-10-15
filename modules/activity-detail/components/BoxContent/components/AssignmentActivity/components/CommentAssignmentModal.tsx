import { Button, Group, Modal, Textarea } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { LearnActivityService } from "@src/services/LearnActivityService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const CommentAssignmentModal = (props: any) => {
  const { onClose, onSuccess, activityId, selected } = props;
  const { t } = useTranslation();
  const [loadingForm, setLoadingForm] = useState<any>(false);

  const getSchemaValidate = () => {
    return yup.object().shape({
      comment: yup
        .string()
        .required(t("Your comment must not be blank"))
        .trim(t("Your comment must not be blank"))
        .max(
          512,
          t("Please enter no more than {{count}} characters.", {
            count: 512,
          })
        ),
    });
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      comment: selected?.comment ?? "",
    },
    shouldUnregister: false,
    resolver: yupResolver(getSchemaValidate()),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      setLoadingForm(true);
      const res = await LearnActivityService.commentAssignment({
        activityId,
        comment: data.comment,
        courseId: props.data.courseId,
        studentId: selected?.userId,
      });
      setLoadingForm(false);
      if (res?.data?.success) {
        Notify.success(t("Comment successfully!"));
        onSuccess();
        onClose();
      } else if (res.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  return (
    <>
      <Modal title={t("Comment assignment")} size="xl" opened zIndex={300} onClose={onClose}>
        <div>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <Textarea
                error={errors["comment"]?.message as any}
                label={t("TEACHER_COMMENT")}
                required
                size="md"
                {...field}
                minRows={3}
              />
            )}
          />
        </div>
        <div className="flex justify-end mt-5">
          <Group>
            <Button onClick={() => onClose()} variant="outline">
              {t("Cancel")}
            </Button>
            <Button loading={loadingForm} onClick={() => submit()}>
              {t("Save")}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};

export default CommentAssignmentModal;
