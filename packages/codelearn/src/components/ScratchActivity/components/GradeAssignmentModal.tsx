import { Button, Group, Modal, NumberInput } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import CodingService from "@src/services/Coding/CodingService";
import { isNil, toString } from "lodash";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const GradeAssignmentModal = (props: any) => {
  const { onClose, onSuccess, selected, data: dataAssignment } = props;
  const { t } = useTranslation();
  const [loadingForm, setLoadingForm] = useState<any>(false);

  console.log("dataAssignment", selected, dataAssignment);

  const initialValues: any = {
    point: selected?.point ?? undefined,
  };

  const getSchemaValidate = () => {
    return yup.object().shape({
      point: yup
        .string()
        .required(t("Point must be a valid number and can not be blank"))
        .trim(t("Point must be a valid number and can not be blank")),
    });
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(getSchemaValidate()),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      // if (isNil(data.point) || data.point === "") {
      //   Notify.error(t("Point must be a valid number and can not be blank"));
      //   return;
      // }
      if (
        dataAssignment?.activityData?.metadata?.maxScore &&
        data.point > dataAssignment?.activityData?.metadata?.maxScore
      ) {
        Notify.error(t("The score cannot exceed the maximum score"));
        return;
      }
      setLoadingForm(true);
      const res = await CodingService.updateAssignmentPoint({
        contextId: selected.contextId,
        contextType: selected.contextType,
        submissionId: selected.id,
        point: toString(data.point ?? 0),
      });
      setLoadingForm(false);
      if (res?.data?.success) {
        onSuccess();
        onClose();
        Notify.success(t("The point on the assignment has been changed."));
      } else if (res.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  return (
    <>
      <Modal
        title={t("Grade")}
        size="xl"
        opened
        zIndex={300}
        onClose={onClose}
      >
        <div>
          <Controller
            name="point"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t("Point")}
                className="grow"
                onChange={field.onChange}
                hideControls
                error={errors["point"]?.message as any}
                required
                min={0}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                value={isNil(field.value) ? "" : field.value}
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

export default GradeAssignmentModal;
