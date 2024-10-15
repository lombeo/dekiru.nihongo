import React from "react";
import Link from "@src/components/Link";
import { ActionIcon, Menu, Select } from "@mantine/core";
import { Dots, InfoCircle, Pencil, Trash } from "tabler-icons-react";
import { useRouter } from "next/router";
import { confirmAction } from "@edn/components/ModalConfirm";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { Notify } from "@edn/components/Notify/AppNotification";
import { JobStatus } from "@src/services/RecruitmentService/types";
import { useTranslation } from "next-i18next";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import _ from "lodash";

const numberFormat = new Intl.NumberFormat();

const RowJob = (props: any) => {
  const { data, index, refetch } = props;
  const router = useRouter();

  const { t } = useTranslation();

  const handleUpdateStatus = (status: any) => {
    let message = t("Are you sure you want to publish?");
    if (status == JobStatus.Draft) {
      message = t("Are you sure you want to update status to draft?");
    } else if (status == JobStatus.Closed) {
      message = t("Are you sure you want to update status to close?");
    }

    confirmAction({
      message,
      onConfirm: async () => {
        const res = await RecruitmentService.jobUpdateStatus(data.id, +status);
        if (res.data?.success) {
          Notify.success(t("Update successfully!"));
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  const handleDelete = (id: any) => {
    confirmAction({
      message: t("Are you sure you want to delete?"),
      onConfirm: async () => {
        const res = await RecruitmentService.jobDelete(id);
        if (res.data?.success) {
          Notify.success(t("Delete successfully!"));
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  const optionsStatus = [
    { label: t("Draft"), value: `${JobStatus.Draft}` },
    { label: t("Publish"), value: `${JobStatus.Published}` },
    { label: t("Close"), value: `${JobStatus.Closed}` },
  ];

  return (
    <tr>
      <td className="text-center">{index}</td>
      <td>
        <Link className="text-blue-primary hover:underline" href={`/job/management/${data.id}`}>
          {data.title}
        </Link>
      </td>
      <td className="text-center">{formatDateGMT(data.publishedDate)}</td>
      <td className="text-center">{formatDateGMT(data.submissionDeadline)}</td>
      <td className="text-center">{numberFormat.format(data.totalApply)}</td>
      <td className="text-center">{numberFormat.format(data.totalView)}</td>
      <td className="text-center">
        <Select
          className="w-[106px]"
          classNames={{ input: "pr-6" }}
          value={data.status ? _.toString(data.status) : null}
          data={optionsStatus}
          onChange={(value) => handleUpdateStatus(value)}
        />
      </td>
      <td>
        <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md">
          <Menu.Target>
            <ActionIcon size="md" color="gray">
              <Dots width={24} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => router.push(`/job/management/${data.id}/applied`)}
              icon={<InfoCircle color="gray" size={14} />}
            >
              {t("List applied")}
            </Menu.Item>
            <Menu.Item
              onClick={() => router.push(`/job/management/${data.id}`)}
              icon={<Pencil color="blue" size={14} />}
            >
              {t("Edit")}
            </Menu.Item>
            <Menu.Item onClick={() => handleDelete(data.id)} icon={<Trash color="red" size={14} />}>
              {t("Delete")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  );
};

export default RowJob;
