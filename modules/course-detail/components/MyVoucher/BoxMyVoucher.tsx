import { CommentContextType } from "@src/services/CommentService/types";
import { PaymentService } from "@src/services/PaymentService";
import { useQuery } from "@tanstack/react-query";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import VoucherFilter from "./components/VoucherFilter";
import VoucherTable from "./components/VoucherTable";

interface BoxMyVoucherProps {
  contextId: number;
  course: any;
}
const BoxMyVoucher = (props: BoxMyVoucherProps) => {
  const { course, contextId } = props;
  const { t } = useTranslation();
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    status: "0",
    startDate: null,
  });

  const { data } = useQuery({
    queryKey: ["getMyVoucher", contextId, filter],
    queryFn: async () => {
      let data: any;
      try {
        const startDate = filter.startDate ? moment(filter.startDate).utc().format("YYYY-MM-DDTHH:mm:ss") : null;

        const params = {
          ...filter,
          contextId,
          contextType: CommentContextType.Course,
          startDate,
        };

        const res = await PaymentService.myVoucher(params);
        data = res.data?.data;
      } catch (e) {}
      return data;
    },
  });

  return (
    <>
      <div className="flex flex-col pt-4 pb-10">
        <div className="block md:flex items-end gap-2">
          <VoucherFilter value={filter} onChange={setFilter} />
        </div>
        <VoucherTable
          course={course}
          data={data}
          onChangePage={(pageIndex, pageSize) => setFilter((prev) => ({ ...prev, pageIndex, pageSize }))}
        />
      </div>
    </>
  );
};

export default BoxMyVoucher;
