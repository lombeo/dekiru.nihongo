import { Table, TextOverflow } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TableColumn } from "@edn/components/Table/Table";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Badge } from "@mantine/core";
import Link from "@src/components/Link";
import { COMMON_FORMAT } from "@src/config";
import { VoucherType } from "@src/constants/payments/payments.constant";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import { CommentContextType } from "@src/services/CommentService/types";
import { InternalService } from "@src/services/InternalService";
import { LearnPaymentService } from "@src/services/LearnPaymentServices";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Download } from "tabler-icons-react";
import VoucherDetail from "./VoucherDetail";
import { useHasAnyRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";

interface VoucherTableProps {
  data: any;
  course?: any;
  contextType: number;
  contextId: number;
  refetch: any;
  onChangePage: (pageIndex: number, pageSize: number) => void;
  isLoading?: any;
}
const VoucherTable = (props: VoucherTableProps) => {
  const { data, course, isLoading, contextType, contextId, refetch, onChangePage } = props;
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { t } = useTranslation();

  const isContentManager = useHasAnyRole([UserRole.ManagerContent]);

  const onRemove = (x) => {
    const onConfirm = async () => {
      try {
        let res = null;

        const req = {
          voucherIds: [x.id],
          contextType,
          contextId,
        };

        switch (contextType) {
          case CommentContextType.Course:
            res = await LearnPaymentService.deleteVoucher(req);
            break;
          case CommentContextType.Contest:
            res = await CodingService.deleteVoucher(req);
            break;
        }

        if (res.data.success) {
          Notify.success(t("Delete voucher successfully."));
          refetch();
        } else {
          Notify.error(t("Delete voucher failed"));
        }
      } catch (e) {
        Notify.error(t("Delete voucher failed"));
      }
    };
    confirmAction({
      message: t("Are you sure to remove this voucher?"),
      onConfirm,
    });
  };

  const handleDownload = async (data: any) => {
    let voucherImage = null;
    if (data.voucherType === VoucherType.FOR_ACTIVE) {
      const res = await InternalService.activationCode({
        code: data?.code,
        title: course?.title,
        qr: process.env.NEXT_PUBLIC_BASE_URL + "/learning/" + course?.permalink,
        price: course?.price,
        startTime: formatDateGMT(data?.validDateFrom),
        endTime: formatDateGMT(data?.validDateTo),
      });
      voucherImage = res?.data;
    } else {
      const res = await InternalService.voucher({
        code: data?.code,
        maxMoney: data.maxMoney,
        money: data.money,
        minOrderValue: data.minOrderValue,
        percent: data?.percent,
        validDateTo: formatDateGMT(data?.validDateTo),
      });
      voucherImage = res?.data;
    }
    if (voucherImage) {
      const blob = new Blob([voucherImage], { type: "image/png" });
      const imageSrc = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = "voucher.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const onOpenModalDetail = (x) => {
    setOpenModalDetails(true);
    setSelectedItem(x);
  };

  const onCloseModalDetail = () => {
    setOpenModalDetails(false);
    setSelectedItem(null);
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
      title: t("Discount"),
      dataIndex: "percent",
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) =>
        x.voucherType === VoucherType.FOR_ACTIVE ? (
          <Badge className="p-2" color="green" variant="filled">
            <span className="font-semibold ">{t("Active")}</span>
          </Badge>
        ) : x.percent ? (
          `${x.percent}%`
        ) : null,
    },
    {
      title: t("Used by"),
      dataIndex: "usedByUserId",
      headClassName: "text-center min-w-[200px]",
      className: "text-center",
      render: (x: any) => (
        <Link className="text-navy-primary hover:underline" href={`/profile/${x?.usedByUserId}`}>
          <TextLineCamp>{x?.usedUserName}</TextLineCamp>
        </Link>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      headClassName: "text-center",
      className: "text-center",
      render: (x: any) => (
        <>
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
        </>
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
      title: t("Type"),
      dataIndex: "createType",
      headClassName: "text-center",
      render: (x: any) => (
        <div className="flex justify-center items-center">
          {x.createType == 0 && (
            <Badge className="p-2" color="gray" variant="light">
              <span className="font-semibold ">{t("Create")}</span>
            </Badge>
          )}
          {x.createType == 1 && (
            <Badge className="p-2" color="blue" variant="outline">
              <span className="font-semibold ">{t("Buy")}</span>
            </Badge>
          )}
        </div>
      ),
    },
    {
      title: t("Created by"),
      dataIndex: "userName",
      headClassName: "text-center min-w-[200px]",
      className: "text-center",
      render: (x: any) => (
        <Link className="text-navy-primary hover:underline" href={`/profile/${x?.userId}`}>
          <TextLineCamp>{x?.userName}</TextLineCamp>
        </Link>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      headClassName: "w-[120px] text-center",
      className: "w-[120px] lowercase text-center",
      render: (x: any) =>
        x.createType === 0 || isContentManager ? (
          <div className="flex gap-2 justify-center">
            <ActionIcon onClick={() => onOpenModalDetail(x)} variant="outline" className="p-0" color="blue">
              <TextOverflow title={t("View")} className="py-2 px-1">
                <Icon name="eye" />
              </TextOverflow>
            </ActionIcon>
            <ActionIcon
              disabled={x.status === 2}
              onClick={() => onRemove(x)}
              variant="outline"
              className="p-0"
              color="red"
            >
              <TextOverflow title={t("Delete")} className="py-2 px-1">
                <Icon name="delete" />
              </TextOverflow>
            </ActionIcon>
            {contextType === CommentContextType.Course && (
              <ActionIcon disabled={x.status === 2} onClick={() => handleDownload(x)} variant="filled" color="blue">
                <Download width={16} height={16} />
              </ActionIcon>
            )}
          </div>
        ) : null,
    },
  ];

  const results = data?.results ? data.results : [];

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
