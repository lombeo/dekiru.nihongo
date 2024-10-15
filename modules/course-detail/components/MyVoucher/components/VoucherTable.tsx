import { Table } from "@edn/components";
import { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { ActionIcon, Badge } from "@mantine/core";
import Link from "@src/components/Link";
import { COMMON_FORMAT } from "@src/config";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { InternalService } from "@src/services/InternalService";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Download, Eye } from "tabler-icons-react";
import VoucherDetail from "./VoucherDetail";

interface VoucherTableProps {
  data: any;
  onChangePage: (pageIndex: number, pageSize: number) => void;
  isLoading?: any;
  course: any;
}
const VoucherTable = (props: VoucherTableProps) => {
  const { data, isLoading, course, onChangePage } = props;
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { t } = useTranslation();

  const onOpenModalDetail = (x) => {
    setOpenModalDetails(true);
    setSelectedItem(x);
  };

  const onCloseModalDetail = () => {
    setOpenModalDetails(false);
    setSelectedItem(null);
  };

  const handleDownload = async (data: any) => {
    const res = await InternalService.activationCode({
      code: data?.code,
      title: course?.title,
      qr: process.env.NEXT_PUBLIC_BASE_URL + "/learning/" + course?.permalink,
      price: course?.price,
      startTime: formatDateGMT(data?.validDateFrom),
      endTime: formatDateGMT(data?.validDateTo),
    });
    if (res?.data) {
      const blob = new Blob([res.data], { type: "image/png" });
      const imageSrc = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = "voucher.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columns: TableColumn[] = [
    {
      title: t("#"),
      headClassName: "w-60 text-center",
      className: "w-60 text-center",
      isIndex: true,
    },
    {
      title: t("Code name"),
      dataIndex: "codeName",
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => (
        <span>
          {x.code.substring(0, 3)}****{x.code[x.code.length - 1]}
        </span>
      ),
    },
    {
      title: `${t("Active date")}`,
      dataIndex: "activeDate",
      headClassName: "text-center",
      className: "lowercase text-center",
      render: (x: any) => <span>{formatDateGMT(x?.validDateFrom, COMMON_FORMAT.TIME_DATE)}</span>,
    },
    {
      title: `${t("Expired date")}`,
      dataIndex: "inactiveDate",
      headClassName: "text-center",
      className: "lowercase text-center",
      render: (x: any) => <span>{formatDateGMT(x?.validDateTo, COMMON_FORMAT.TIME_DATE)}</span>,
    },
    {
      title: t("Used by"),
      dataIndex: "usedByUserId",
      headClassName: "text-left",
      render: (x: any) => (
        <Link className="text-navy-primary hover:underline" href={`/profile/${x?.usedByUserId}`}>
          <TextLineCamp>{x?.usedUserName}</TextLineCamp>
        </Link>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      headClassName: "text-left",
      className: "text-left",
      render: (x: any) => (
        <span className="flex items-center gap-3">
          {x.status == 1 && (
            <Badge className="p-2" color="blue" variant="filled">
              <span className="font-semibold ">{t("Unused")}</span>
            </Badge>
          )}
          {x.status == 2 && (
            <Badge className="p-2" color="orange" variant="filled">
              <span className="font-semibold ">{t("Used")}</span>
            </Badge>
          )}
          {x.status == 3 && (
            <Badge className="p-2" color="red" variant="filled">
              <span className="font-semibold ">{t("Expired")}</span>
            </Badge>
          )}
        </span>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      headClassName: "w-[120px] text-center",
      className: "w-[120px] lowercase text-center",
      render: (x: any) => (
        <div className="flex gap-2 justify-center">
          <ActionIcon onClick={() => onOpenModalDetail(x)} variant="outline" color="blue">
            <Eye width={16} height={16} />
          </ActionIcon>
          <ActionIcon onClick={() => handleDownload(x)} variant="filled" color="blue">
            <Download width={16} height={16} />
          </ActionIcon>
          {/* <ActionIcon onClick={() => onRemove(x)} variant="outline" className="p-0" color="red">
            <TextOverflow title={t("Delete")} className="py-2 px-1">
              <Icon name="delete" />
            </TextOverflow>
          </ActionIcon> */}
        </div>
      ),
    },
  ];

  const results = data?.results || [];

  return (
    <>
      <div className="mt-6">
        <Table
          className="table-auto bg-white w-full"
          wrapClassName="mb-6"
          data={results}
          wrapData={data}
          columns={columns}
          isLoading={isLoading}
          paginationLabel={results?.length > 1 ? t("records") : t("record")}
          onChangePage={(page) => onChangePage(page, 20)}
        />
      </div>
      {openModalDetails && <VoucherDetail data={selectedItem} onClose={onCloseModalDetail} />}
    </>
  );
};

export default VoucherTable;
