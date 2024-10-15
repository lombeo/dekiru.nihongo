import { Button, Modal, NumberInput } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Select } from "@mantine/core";
import { VoucherType } from "@src/constants/payments/payments.constant";
import CodingService from "@src/services/Coding/CodingService";
import { CommentContextType } from "@src/services/CommentService/types";
import { LearnPaymentService } from "@src/services/LearnPaymentServices";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface VoucherModalProps {
  onClose: any;
  contextType: number;
  contextId: number;
  onSuccess?: () => void;
}

const VoucherModalGenerate = (props: VoucherModalProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { onClose, contextId, contextType, onSuccess } = props;
  const [voucherGenerated, setVoucherGenerated] = useState<any>(null);

  let initialValues = {
    voucherCount: 1,
    toDateType: "1w",
    percent: undefined,
    voucherType: VoucherType.FOR_ACTIVE,
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        percent: yup.lazy((value) =>
          value === ""
            ? yup.string().nullable()
            : yup
                .number()
                .nullable()
                .min(
                  1,
                  t("{{from}} must be greater than {{to}}", {
                    from: t("Discount percent"),
                    to: 0,
                  })
                )
                .max(
                  99,
                  t("{{from}} must be less than {{to}}", {
                    from: t("Discount percent"),
                    to: 100,
                  })
                )
                .test(
                  "percentRequired1",
                  t("{{from}} must be greater than {{to}}", {
                    from: t("Discount percent"),
                    to: 0,
                  }),
                  (value, schema) => (schema.parent.type === "1" ? value && value > 0 : true)
                )
        ),
        voucherCount: yup.lazy((value) =>
          value === ""
            ? yup
                .string()
                .required(t("Number must greater than 0 and less than 10"))
                .trim(t("Number must greater than 0 and less than 10"))
            : yup
                .number()
                .required(t("Number must greater than 0 and less than 10"))
                .min(0, t("Number must greater than 0 and less than 10"))
                .max(10, t("Number must greater than 0 and less than 10"))
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
      let fromDate = moment().format("YYYY-MM-DD");
      let _startDate = new Date(fromDate);
      _startDate.setHours(_startDate.getHours() - 7);
      fromDate = moment(_startDate).utc().format("YYYY-MM-DDTHH:mm:ss");
      fromDate = fromDate + "Z";

      let toDate = null;
      switch (data.toDateType) {
        case "1w":
          toDate = moment(fromDate).add(1, "week");
          break;
        case "2w":
          toDate = moment(fromDate).add(2, "week");
          break;
        case "3w":
          toDate = moment(fromDate).add(3, "week");
          break;
        case "4w":
          toDate = moment(fromDate).add(4, "week");
          break;
        case "5w":
          toDate = moment(fromDate).add(5, "week");
          break;
        default:
          break;
      }
      if (!toDate) return;
      toDate.subtract(1, "day");
      toDate = toDate.format("YYYY-MM-DD");
      let _endDate = new Date(toDate);
      _endDate.setHours(_endDate.getHours() + 17);
      _endDate.setSeconds(_endDate.getSeconds() - 1);

      toDate = moment(_endDate).utc().format("YYYY-MM-DDTHH:mm:ss");
      toDate = toDate + "Z";

      setIsLoading(true);
      let res = null;
      const params = {
        validDateFrom: fromDate,
        validDateTo: toDate,
        contextType,
        contextId,
        voucherCount: data.voucherCount,
        percent: data.voucherType === VoucherType.FOR_ACTIVE ? 100 : data.percent,
        voucherType: data.voucherType,
      };

      switch (contextType) {
        case CommentContextType.Course:
          res = await LearnPaymentService.generateVoucher(params);
          break;
        case CommentContextType.Contest:
          res = await CodingService.generateVoucher(params);
          break;
      }

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
          <Alert className="" title={t("Generated Successfully")} color="green">
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
                  size="md"
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
                  formatter={(value: any) =>
                    !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : value
                  }
                  error={errors.voucherCount?.message as any}
                  label={t("Number of voucher")}
                  hideControls
                  withAsterisk
                />
              )}
            />
            <Controller
              name="voucherType"
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
                    field.onChange(+value || null);
                  }}
                  value={field.value ? _.toString(field.value) : null}
                  allowDeselect={false}
                  data={[
                    {
                      label: t("Discount"),
                      value: _.toString(VoucherType.FOR_PURCHASE),
                    },
                    {
                      label: t("Activation code"),
                      value: _.toString(VoucherType.FOR_ACTIVE),
                    },
                  ]}
                />
              )}
            />
            {watch("voucherType") === VoucherType.FOR_PURCHASE && (
              <Controller
                name="percent"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    size="md"
                    withAsterisk
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    hideControls
                    label={t("Discount percent")}
                    error={errors?.[field.name]?.message as any}
                  />
                )}
              />
            )}
            <Controller
              name="toDateType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="md"
                  label={t("Expired date")}
                  withAsterisk
                  withinPortal
                  allowDeselect={false}
                  data={[
                    {
                      label: `1 ${t("week")}`,
                      value: "1w",
                    },
                    {
                      label: `2 ${t("week")}`,
                      value: "2w",
                    },
                    {
                      label: `3 ${t("week")}`,
                      value: "3w",
                    },
                    {
                      label: `4 ${t("week")}`,
                      value: "4w",
                    },
                    {
                      label: `5 ${t("week")}`,
                      value: "5w",
                    },
                  ]}
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
