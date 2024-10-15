import { Button, Group, NumberInput, Select, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import UserRole from "@src/constants/roles";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { LearnCourseService } from "@src/services";
import _ from "lodash";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "tabler-icons-react";
import * as yup from "yup";

interface ModalCourseLimitProviderProps {
  onClose: () => void;
  onSuccess: () => void;
  courseId: any;
  courseViewLimit: any;
  courseEnrollLimit: any;
  hasPrice: boolean;
  startTime: any;
  endTime: any;
  discount: number;
  isOwner: boolean;
  priceAfterDiscount: number;
  price: number;
}

const ModalCourseLimit = (props: ModalCourseLimitProviderProps) => {
  const {
    onClose,
    onSuccess,
    isOwner,
    courseId,
    courseViewLimit,
    courseEnrollLimit,
    hasPrice,
    startTime,
    endTime,
    discount,
    priceAfterDiscount,
    price,
  } = props;
  const { t } = useTranslation();
  const [enrollLimit, setEnrollLimit] = useState<number>(courseEnrollLimit);
  const [loading, setLoading] = useState(false);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      courseId,
      courseViewLimit: courseViewLimit || 0,
      courseEnrollLimit: courseEnrollLimit || 0,
      startTime: convertDate(startTime),
      endTime: convertDate(endTime),
      price: price || 0,
      priceAfterDiscount: priceAfterDiscount || 0,
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        startTime: yup
          .date()
          .nullable()
          .test("checkEndTime", t("Start time must be less than end time"), (value, context) => {
            if (!value) return true;
            return moment(value).isBefore(context.parent.endTime);
          }),
        priceAfterDiscount: yup.lazy((value) =>
          _.isString(value)
            ? yup
                .string()
                .nullable()
                .test(
                  "checkPrice",
                  t("The new price must be lower than or equal to the original price"),
                  (value, context) => {
                    if (!value) return true;
                    return Number(value) <= context.parent.price;
                  }
                )
            : yup
                .number()
                .nullable()
                .test(
                  "checkPrice",
                  t("The new price must be lower than or equal to the original price"),
                  (value, context) => {
                    if (!value) return true;
                    return Number(value) <= context.parent.price;
                  }
                )
        ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    trigger,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const params = { ...data, price: data.price || 0, priceAfterDiscount: data.priceAfterDiscount || 0 };
      if (data.courseEnrollLimit === 1) {
        delete params.price;
        delete params.priceAfterDiscount;
      }
      try {
        const res = await LearnCourseService.setPersonalCourseLimit(params);
        if (res.data.message) {
          Notify.error(t(res.data.message));
        } else {
          Notify.success(t("Update successfully!"));
          onSuccess();
          onClose();
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <Modal
      size="xl"
      title={<Text className="font-semibold">{t("Setting")}</Text>}
      centered
      onClose={onClose}
      opened={true}
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="courseViewLimit"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              size="md"
              disabled={!isManagerContent}
              label={t("Who can view this learn?")}
              value={field.value.toString()}
              onChange={(val) => field.onChange(+val)}
              data={[
                {
                  value: "0",
                  label: t("Private"),
                },
                {
                  value: "1",
                  label: t("Public"),
                },
              ]}
            />
          )}
        />

        <Controller
          name="courseEnrollLimit"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              size="md"
              disabled={!isManagerContent && !isOwner}
              label={t("Who can enroll this course?")}
              value={field.value.toString()}
              onChange={(val) => {
                field.onChange(+val);
                setEnrollLimit(+val);
              }}
              data={[
                {
                  value: "0",
                  label: t("Private"),
                },
                {
                  value: "1",
                  label: t("Public"),
                },
              ]}
            />
          )}
        />

        {enrollLimit === 0 && (
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={`${t("Original price")}`}
                size="md"
                disabled={!isManagerContent}
                onChange={(value) => {
                  field.onChange(value), trigger("priceAfterDiscount");
                }}
                hideControls
                error={errors["price"]?.message as any}
                required
                min={0}
                max={9999999999999}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                moneyFormat
                value={field.value}
              />
            )}
          />
        )}

        {enrollLimit === 0 && (
          <Controller
            name="priceAfterDiscount"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={`${t("New price")}`}
                size="md"
                disabled={!isManagerContent}
                onChange={(value) => {
                  field.onChange(value), trigger("price");
                }}
                hideControls
                error={errors["priceAfterDiscount"]?.message as any}
                required
                min={0}
                max={9999999999999}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                moneyFormat
                value={field.value}
              />
            )}
          />
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  trigger("endTime");
                }}
                popoverProps={{
                  withinPortal: true,
                }}
                size="md"
                icon={<Calendar size={16} />}
                clearable
                withAsterisk
                error={errors[field.name]?.message as string}
                label={t("Start time")}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                onChange={(value) => {
                  field.onChange(value);
                  trigger("startTime");
                }}
                popoverProps={{
                  withinPortal: true,
                }}
                size="md"
                icon={<Calendar size={16} />}
                clearable
                withAsterisk
                error={errors[field.name]?.message as string}
                label={t("End time")}
              />
            )}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Group>
          <Button onClick={() => onClose()} variant="outline">
            {t("Cancel")}
          </Button>
          <Button loading={loading} onClick={handleClickSubmit}>
            {t("Save")}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default ModalCourseLimit;
