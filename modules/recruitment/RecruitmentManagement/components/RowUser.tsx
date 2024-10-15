import React from "react";
import { confirmAction } from "@edn/components/ModalConfirm";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useTranslation } from "next-i18next";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { ActionIcon } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import Link from "@src/components/Link";

const RowUser = (props: any) => {
  const { data, index, refetch } = props;
  const { t } = useTranslation();

  const handleDelete = () => {
    confirmAction({
      message: t("Are you sure you want to delete?"),
      onConfirm: async () => {
        const res = await RecruitmentService.recruitmentManagerDelete(data.id);
        if (res.data?.success) {
          Notify.success(t("Delete successfully!"));
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  return (
    <tr>
      <td className="text-center">{index}</td>
      <td>
        {" "}
        <Link href={`/profile/${data.userId}`}>{data.userName}</Link>
      </td>
      <td className="text-center">{formatDateGMT(data.createdOn, "HH:mm DD/MM/YYYY")}</td>
      <td>
        <ActionIcon onClick={() => handleDelete()} color="red" variant="filled">
          <Trash width={20} />
        </ActionIcon>
      </td>
    </tr>
  );
};

export default RowUser;
