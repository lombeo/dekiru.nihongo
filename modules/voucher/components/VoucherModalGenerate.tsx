import { Button, Modal, NumberInput, TextInput } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Image, Select } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { PaymentService } from "@src/services/PaymentService";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { selectProfile } from "@src/store/slices/authSlice";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";

interface VoucherModalProps {
  onClose: any;
  onSuccess?: () => void;
}

const VoucherModalGenerate = (props: VoucherModalProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { onClose, onSuccess } = props;
  const [voucherGenerated, setVoucherGenerated] = useState<any>(null);
  const [voucherLimits, setVoucherLimits] = useState(null);

  const profile = useSelector(selectProfile);

  let initialValues = {
    voucherCount: 1,
    percent: undefined,
    type: "1",
    minOrderValue: 0,
    validDateFrom: moment().startOf("d").toDate(),
    validDateTo: moment().add(3, "months").endOf("d").toDate(),
  };

  useEffect(() => {
    if (profile) {
      PaymentService.getVoucherManagerInfo(profile.userId).then((res) => {
        if (res?.data?.data) setVoucherLimits(res?.data?.data);
      });
    }
  }, [profile]);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        maxMoney: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .test(
                  "maxMoneyRequired",
                  t("{{from}} must be greater than {{to}}", {
                    from: t("Maximum discount amount"),
                    to: 0,
                  }),
                  (value, schema) => (schema.parent.type === "1" ? value && +value > 0 : true)
                )
            : yup
                .number()
                .nullable()
                .min(
                  1,
                  t("{{from}} must be greater than {{to}}", {
                    from: t("Maximum discount amount"),
                    to: 0,
                  })
                )
                .max(
                  100000000,
                  t("{{from}} must be less than or equal to {{to}}", {
                    from: t("Maximum discount amount"),
                    to: 100000000,
                  })
                )
                .test(
                  "maxMoneyRequired2",
                  t("{{from}} must be greater than {{to}}", {
                    from: t("Maximum discount amount"),
                    to: 0,
                  }),
                  (value, schema) => (schema.parent.type === "1" ? value && value > 0 : true)
                )
        ),
        money: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .test(
                  "moneyRequired",
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discounted amount"),
                    from: 1,
                    to: voucherLimits?.maxDiscountMoney ? voucherLimits.maxDiscountMoney : 100000000,
                  }),
                  (value, schema) => (schema.parent.type === "2" ? value && +value > 0 : true)
                )
            : yup
                .number()
                .nullable()
                .min(
                  1,
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discounted amount"),
                    from: 1,
                    to: voucherLimits?.maxDiscountMoney ? voucherLimits.maxDiscountMoney : 100000000,
                  })
                )
                .max(
                  voucherLimits?.maxDiscountMoney ? voucherLimits.maxDiscountMoney : 100000000,
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discounted amount"),
                    from: 1,
                    to: voucherLimits?.maxDiscountMoney ? voucherLimits.maxDiscountMoney : 100000000,
                  })
                )
                .test(
                  "moneyRequired2",
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discounted amount"),
                    from: 1,
                    to: voucherLimits?.maxDiscountMoney ? voucherLimits.maxDiscountMoney : 100000000,
                  }),
                  (value, schema) => (schema.parent.type === "2" ? value && +value > 0 : true)
                )
        ),
        minOrderValue: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .required(
                  t("{{from}} must be greater than or equal to {{to}}", {
                    from: t("Minimum order amount"),
                    to: 0,
                  })
                )
                .trim(
                  t("{{from}} must be greater than or equal to {{to}}", {
                    from: t("Minimum order amount"),
                    to: 0,
                  })
                )
            : yup
                .number()
                .nullable()
                .required(
                  t("{{from}} must be greater than or equal to {{to}}", {
                    from: t("Minimum order amount"),
                    to: 0,
                  })
                )
                .min(
                  0,
                  t("{{from}} must be greater than or equal to {{to}}", {
                    from: t("Minimum order amount"),
                    to: 0,
                  })
                )
                .max(
                  100000000,
                  t("{{from}} must be less than or equal to {{to}}", {
                    from: t("Minimum order amount"),
                    to: 100000000,
                  })
                )
        ),
        percent: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .test(
                  "percentRequired",
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discount percent"),
                    from: 1,
                    to: voucherLimits?.maxDiscountPercent ? voucherLimits.maxDiscountPercent : 99,
                  }),
                  (value, schema) => (schema.parent.type === "1" ? value && +value > 0 : true)
                )
            : yup
                .number()
                .nullable()
                .min(
                  1,
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discount percent"),
                    from: 1,
                    to: voucherLimits?.maxDiscountPercent ? voucherLimits.maxDiscountPercent : 99,
                  })
                )
                .max(
                  voucherLimits?.maxDiscountPercent ? voucherLimits.maxDiscountPercent : 99,
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discount percent"),
                    from: 1,
                    to: voucherLimits?.maxDiscountPercent ? voucherLimits.maxDiscountPercent : 99,
                  })
                )
                .test(
                  "percentRequired1",
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Discount percent"),
                    from: 1,
                    to: voucherLimits?.maxDiscountPercent ? voucherLimits.maxDiscountPercent : 99,
                  }),
                  (value, schema) => (schema.parent.type === "1" ? value && value > 0 : true)
                )
        ),
        voucherCount: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .nullable()
                .required(
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Number of voucher"),
                    from: 0,
                    to: voucherLimits?.maxVoucherAmount ? voucherLimits?.maxVoucherAmount : 100000,
                  })
                )
            : yup
                .number()
                .nullable()
                .required(
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Number of voucher"),
                    from: 0,
                    to: voucherLimits?.maxVoucherAmount ? voucherLimits?.maxVoucherAmount : 100000,
                  })
                )
                .min(
                  0,
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Number of voucher"),
                    from: 0,
                    to: voucherLimits?.maxVoucherAmount ? voucherLimits?.maxVoucherAmount : 100000,
                  })
                )
                .max(
                  voucherLimits?.maxVoucherAmount ? voucherLimits.maxVoucherAmount : 100000,
                  t("{{title}} must be greater than {{from}} and less than {{to}}", {
                    title: t("Number of voucher"),
                    from: 0,
                    to: voucherLimits?.maxVoucherAmount,
                  })
                )
        ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = methodForm;

  const submit = (e: any) => {
    e.preventDefault();
    handleSubmit(async (data) => {
      setIsLoading(true);

      const res = await PaymentService.voucherGenerate({
        ...data,
        voucherCount: data.voucherCount,
        percent: data.type === "1" ? data.percent : 0,
        maxMoney: data.type === "1" ? data.maxMoney : 0,
        money: data.type === "2" ? data.money : 0,
      });

      setIsLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Generate voucher successfully."));
        onSuccess?.();
        onClose();
        setVoucherGenerated(res.data.data);
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      } else {
        Notify.error(t("Generate voucher failed"));
      }
    })();
  };

  return (
    <>
      <Modal
        opened
        size="lg"
        onClose={onClose}
        classNames={{ body: "p-6", header: "px-6" }}
        title={<span className="text-xl font-semibold">{t("Generate voucher")}</span>}
      >
        {voucherGenerated && (
          <Alert title={t("Generated Successfully")} color="green">
            {voucherGenerated.vouchersCode?.length === 1 && (
              <>
                <strong>{t("Voucher Code")}</strong>
                <div>
                  {voucherGenerated.vouchersCode[0]} <br />
                </div>
              </>
            )}
            {voucherGenerated.vouchersCode?.length > 1 && (
              <>
                <div>
                  <span className="font-semibold">{t("Generated")} </span>
                  <strong>{voucherGenerated.vouchersCode.length}</strong>
                  <span className="font-semibold"> {t("vouchers successfully.")}</span>
                </div>
              </>
            )}
          </Alert>
        )}
        {!voucherGenerated && (
          <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
            <Controller
              name="voucherCount"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  moneyFormat
                  size="md"
                  error={errors?.[field.name]?.message as any}
                  label={`${t("Number of voucher")} ${
                    voucherLimits?.maxVoucherAmount ? `(<= ${voucherLimits.maxVoucherAmount})` : ""
                  }`}
                  classNames={{ label: "text-sm" }}
                  hideControls
                  withAsterisk
                  min={1}
                  max={10000}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="md"
                  error={errors?.[field.name]?.message as any}
                  label={t("Type")}
                  classNames={{ label: "text-sm" }}
                  withAsterisk
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  allowDeselect={false}
                  data={[
                    {
                      label: t("Percentage discount"),
                      value: "1",
                    },
                    {
                      label: t("Discounted amount"),
                      value: "2",
                    },
                  ]}
                />
              )}
            />
            {watch("type") === "1" && (
              <>
                <Controller
                  name="percent"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      size="md"
                      max={100}
                      min={1}
                      withAsterisk
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      classNames={{ label: "text-sm" }}
                      hideControls
                      label={`${t("Discount percent")} ${
                        voucherLimits?.maxDiscountPercent ? `(<= ${voucherLimits.maxDiscountPercent}%)` : ""
                      }`}
                      error={errors?.[field.name]?.message as any}
                    />
                  )}
                />
                <Controller
                  name="maxMoney"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      size="md"
                      max={100000000}
                      min={0}
                      withAsterisk
                      moneyFormat
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      classNames={{ label: "text-sm" }}
                      hideControls
                      label={t("Maximum discount amount")}
                      error={errors?.[field.name]?.message as any}
                    />
                  )}
                />
              </>
            )}

            {watch("type") === "2" && (
              <>
                <Controller
                  name="money"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      size="md"
                      max={100000000}
                      min={0}
                      withAsterisk
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      moneyFormat
                      classNames={{ label: "text-sm" }}
                      hideControls
                      label={`${t("Discounted amount")} ${
                        voucherLimits?.maxDiscountMoney
                          ? `(<= ${FunctionBase.formatPrice(voucherLimits.maxDiscountMoney)})`
                          : ""
                      }`}
                      error={errors?.[field.name]?.message as any}
                    />
                  )}
                />
              </>
            )}

            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  size="md"
                  max={100000000}
                  min={0}
                  withAsterisk
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  moneyFormat
                  classNames={{ label: "text-sm" }}
                  hideControls
                  label={t("Minimum order amount")}
                  error={errors?.[field.name]?.message as any}
                />
              )}
            />

            <Controller
              name="validDateTo"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  rightSection={
                    <Image alt="calendar-star" src="/images/learning/calendar-star.png" height={14} width={14} />
                  }
                  withAsterisk
                  classNames={{ label: "text-sm" }}
                  size="md"
                  popoverProps={{ withinPortal: true }}
                  label={t("Expired date")}
                  minDate={new Date()}
                  valueFormat="DD/MM/YYYY"
                  clearable
                  error={errors[field.name]?.message as string}
                />
              )}
            />

            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  size="md"
                  classNames={{ label: "text-sm" }}
                  label={t("Note")}
                  error={errors?.[field.name]?.message as any}
                />
              )}
            />

            <div className="mt-2 flex justify-end items-center gap-4">
              <Button variant="outline" onClick={onClose}>
                {t("Close")}
              </Button>
              <Button type="submit" loading={isLoading}>
                {t("Generate voucher")}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default VoucherModalGenerate;
