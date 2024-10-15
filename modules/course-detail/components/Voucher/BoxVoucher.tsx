import { Button, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import CodingService from "@src/services/Coding/CodingService";
import { CommentContextType } from "@src/services/CommentService/types";
import { LearnPaymentService } from "@src/services/LearnPaymentServices";
import { useQuery } from "@tanstack/react-query";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import VoucherModalGenerate from "./components/VoucherModalGenerate";
import VoucherTable from "./components/VoucherTable";
import useDebounce from "@src/hooks/useDebounce";

interface BoxVoucherProps {
  contextId: number;
  contextType: number;
  course: any;
}
const BoxVoucher = (props: BoxVoucherProps) => {
  const { contextId, contextType, course } = props;
  const { t } = useTranslation();
  const [openModalGenerate, setOpenModalGenerate] = useState(false);
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    status: "0",
    startDate: null,
    createType: "-1",
  });

  const filterDebound = useDebounce(filter);

  const { data, refetch } = useQuery({
    queryKey: ["getListVoucher", contextType, contextId, filterDebound],
    queryFn: async () => {
      let data: any;
      try {
        const startDate = filter.startDate ? moment(filter.startDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null;

        let params = {
          ...filterDebound,
          contextId,
          contextType,
          startDate,
        };

        if (filterDebound.createType === "-1") {
          delete params.createType;
        }

        let res = null;

        switch (contextType) {
          case CommentContextType.Course:
            res = await LearnPaymentService.getListVoucher(params);
            break;
          case CommentContextType.Contest:
            res = await CodingService.getListVoucher(params);
            break;
        }

        data = res.data?.data;
      } catch (e) {}
      return data;
    },
  });

  return (
    <>
      {openModalGenerate && (
        <VoucherModalGenerate
          contextId={contextId}
          contextType={contextType}
          onSuccess={() => refetch()}
          onClose={() => setOpenModalGenerate(false)}
        />
      )}
      <div className="flex flex-col pt-4 pb-10">
        <div className="block md:flex items-end gap-2">
          <div className="grid lg:grid-cols-4 items-end gap-3">
            <Select
              label={t("Status")}
              data={[
                { value: "0", label: t("All") },
                { value: "1", label: t("Unused") },
                { value: "2", label: t("Used") },
                { value: "3", label: t("Expired") },
              ]}
              value={filter.status}
              onChange={(value) => setFilter((prev) => ({ ...prev, status: value, pageIndex: 1 }))}
            />
            <TextInput
              label={t("Vouchers")}
              placeholder={t("Vouchers")}
              value={filter.keyword}
              onChange={(value) => setFilter({ ...filter, keyword: value.target.value })}
            />
            <DatePickerInput
              valueFormat="DD/MM/YYYY"
              decadeLabelFormat="DD/MM/YYYY"
              label={`${t("Active date")} (>=)`}
              placeholder={t("DD/MM/YYYY")}
              clearable
              classNames={{ label: "whitespace-pre" }}
              value={filter.startDate}
              onChange={(value) => setFilter((prev) => ({ ...prev, startDate: value, pageIndex: 1 }))}
            />
            <Select
              label={t("Created by")}
              data={[
                { value: "-1", label: t("All") },
                { value: "0", label: t("System") },
                { value: "1", label: t("Buyer") },
              ]}
              value={filter.createType}
              onChange={(value) => setFilter((prev) => ({ ...prev, createType: value, pageIndex: 1 }))}
            />
          </div>
          <Button
            className="ml-auto w-full md:w-auto mt-3 md:mt-0"
            onClick={() => setOpenModalGenerate(true)}
            leftIcon={<Plus width={20} height={20} />}
          >
            {t("Generate Voucher")}
          </Button>
        </div>
        <VoucherTable
          data={data}
          course={course}
          contextType={contextType}
          contextId={contextId}
          refetch={refetch}
          onChangePage={(pageIndex, pageSize) => setFilter((prev) => ({ ...prev, pageIndex, pageSize }))}
        />
      </div>
    </>
  );
};

export default BoxVoucher;
