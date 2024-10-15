import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Badge, Button, Pagination, Select, Table, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Container } from "@src/components";
import UserRole from "@src/constants/roles";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { InternalService } from "@src/services/InternalService";
import { PaymentService } from "@src/services/PaymentService";
import styles from "@src/styles/Table.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useRef, useState, useCallback } from "react";
import { Download, Eye, Trash } from "tabler-icons-react";
import VoucherDetail from "./components/VoucherDetail";
import VoucherModalGenerate from "./components/VoucherModalGenerate";
import _ from "lodash";

const VoucherManagement = () => {
  const { t } = useTranslation();

  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openModalGenerate, setOpenModalGenerate] = useState(false);
  const [loading, setLoading] = useState(false);

  const refSelected = useRef<any>(null);

  const isCanCreateVoucher = useHasAnyRole([UserRole.ManagerContent, UserRole.ManageVoucher]);

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    status: "1",
    startDate: null,
    keyword: "",
    note: "",
  });

  const { data, refetch, status } = useQuery({
    queryKey: ["voucher-management", filter],
    queryFn: async () => {
      const params = { ...filter };
      const res = await PaymentService.voucher(params);
      if (res?.data?.success) {
        return res?.data?.data;
      }
      return null;
    },
  });

  const onRemove = (data: any) => {
    const onConfirm = async () => {
      try {
        const res = await PaymentService.voucherDelete({
          voucherIds: [data.id],
          contextType: data.contextType,
          contextId: data.contextId,
        });
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
    const res = await InternalService.voucher({
      code: data.code,
      maxMoney: data.maxMoney,
      money: data.money,
      minOrderValue: data.minOrderValue,
      percent: data.percent,
      validDateTo: formatDateGMT(data.validDateTo),
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

  const handleExport = async () => {
    setLoading(true);
    const res = await PaymentService.voucherExport(filter);
    setLoading(false);
    const data = res?.data?.data;
    if (res?.data?.success && data) {
      Notify.success(t("Export successfully!"));
      let contentType = "application/vnd.ms-excel";
      let excelFile = FunctionBase.b64toBlob(data?.contents, contentType);
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelFile);
      link.download = data?.filename;
      link.click();
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  const debounceFilterByCode = useCallback(
    _.debounce((value) => setFilter((prev) => ({ ...prev, pageIndex: 1, keyword: value })), 700),
    []
  );

  const debounceFilterByNote = useCallback(
    _.debounce((value) => setFilter((prev) => ({ ...prev, pageIndex: 1, note: value })), 700),
    []
  );

  return (
    <div>
      <Container size="xl">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("Voucher management"),
            },
          ]}
        />

        <div className="mb-10">
          <div className="flex items-end gap-4 justify-between flex-end mb-4">
            <div className="flex items-center flex-wrap w-fit gap-4">
              <TextInput
                label={`${t("Code name")}`}
                placeholder={t("Code name")}
                onChange={(e: any) => debounceFilterByCode(e.target.value)}
              />
              <Select
                data={[
                  { value: "0", label: t("All") },
                  { value: "1", label: t("Unused") },
                  { value: "2", label: t("Used") },
                  { value: "3", label: t("Expired") },
                ]}
                className="min-w-[160px] max-w-[190px]"
                clearable={false}
                allowDeselect={false}
                label={t("Status")}
                value={filter.status}
                onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, status: value }))}
              />
              <DatePickerInput
                valueFormat="DD/MM/YYYY"
                decadeLabelFormat="DD/MM/YYYY"
                label={`${t("Active date")} (>=)`}
                placeholder={t("DD/MM/YYYY")}
                clearable
                classNames={{ label: "whitespace-pre", input: "min-w-[190px]" }}
                value={filter.startDate}
                onChange={(value) => {
                  setFilter((prev) => ({ ...prev, pageIndex: 1, startDate: value }));
                }}
              />
              <TextInput
                label={`${t("Note")}`}
                placeholder={t("Note")}
                onChange={(e: any) => debounceFilterByNote(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-4 flex-wrap md:flex-nowrap">
              <Button loading={loading} variant="outline" leftIcon={<Download />} onClick={handleExport}>
                {t("Export file")}
              </Button>
              {isCanCreateVoucher && (
                <Button onClick={() => setOpenModalGenerate(true)}>{t("Generate Voucher")}</Button>
              )}
            </div>
          </div>

          <div className="overflow-auto">
            <Table className={styles.table} captionSide="bottom" striped withBorder>
              <thead>
                <tr>
                  <th className="!text-center">#</th>
                  <th>{t("Code name")}</th>
                  <th className="!text-right">{t("Discount")}</th>
                  {/* <th className="text-right">{t("Discounted amount")}</th> */}
                  <th className="text-right">{t("Maximum discount amount")}</th>
                  <th className="text-right">{t("Minimum order amount")}</th>
                  <th>{t("Created by")}</th>
                  <th>{t("Used by")}</th>
                  <th className="!text-center">{t("Status")}</th>
                  <th className="!text-center">{t("Active date")}</th>
                  <th className="!text-center">{t("Expired date")}</th>
                  <th className="!text-center">{t("Note")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.results.map((e: any, index: number) => {
                  return (
                    <tr key={e.id}>
                      <td className="text-center">{filter.pageSize * (filter.pageIndex - 1) + index + 1}</td>
                      <td>{e.code}</td>
                      <td className="text-right">
                        {e.percent ? `${e.percent}%` : `${FunctionBase.formatNumber(e.money)} đ`}
                      </td>
                      <td className="text-right">{e.maxMoney ? `${FunctionBase.formatNumber(e.maxMoney)} đ` : null}</td>
                      <td className="text-right">{FunctionBase.formatNumber(e.minOrderValue)} đ</td>
                      <td>{e.userName}</td>
                      <td>{e.usedUserName}</td>
                      <td className="text-center">
                        <>
                          {e.status == 1 && (
                            <Badge color="blue" variant="filled">
                              <span className="font-semibold ">{t("Unused")}</span>
                            </Badge>
                          )}
                          {e.status == 2 && (
                            <Badge color="orange" variant="filled">
                              <span className="font-semibold ">{t("Used")}</span>
                            </Badge>
                          )}
                          {e.status == 3 && (
                            <Badge color="red" variant="filled">
                              <span className="font-semibold ">{t("Expired")}</span>
                            </Badge>
                          )}
                        </>
                      </td>
                      <td className="text-center">{formatDateGMT(e.validDateFrom, "HH:mm DD/MM/YYYY")}</td>
                      <td className="text-center">{formatDateGMT(e.validDateTo, "HH:mm DD/MM/YYYY")}</td>
                      <td>{e?.note}</td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <ActionIcon
                            onClick={() => {
                              refSelected.current = e;
                              setOpenModalDetail(true);
                            }}
                            variant="transparent"
                            color="blue"
                          >
                            <Eye width={20} height={20} />
                          </ActionIcon>
                          <ActionIcon
                            disabled={e.status === 2}
                            onClick={() => onRemove(e)}
                            variant="transparent"
                            color="red"
                          >
                            <Trash width={20} height={20} />
                          </ActionIcon>
                          <ActionIcon
                            disabled={e.status === 3}
                            onClick={() => handleDownload(e)}
                            variant="transparent"
                            color="blue"
                          >
                            <Download width={16} height={16} />
                          </ActionIcon>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {!!data?.results?.length && (
            <div className="mt-8 pb-8 flex justify-center">
              <Pagination
                color="blue"
                withEdges
                value={filter.pageIndex}
                total={data?.pageCount}
                onChange={(page) => {
                  setFilter((prev) => ({
                    ...prev,
                    pageIndex: page,
                  }));
                }}
              />
            </div>
          )}
          {status === "success" && !data?.results?.length && (
            <div className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</div>
          )}
        </div>
      </Container>

      {openModalDetail && <VoucherDetail data={refSelected.current} onClose={() => setOpenModalDetail(false)} />}
      {openModalGenerate && (
        <VoucherModalGenerate onSuccess={() => refetch()} onClose={() => setOpenModalGenerate(false)} />
      )}
    </div>
  );
};

export default VoucherManagement;
