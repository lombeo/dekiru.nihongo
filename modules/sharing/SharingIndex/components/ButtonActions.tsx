import React, { useState } from "react";
import { Button } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ModalRegisterBlogger from "@src/modules/sharing/SharingIndex/components/ModalRegisterBlogger/ModalRegisterBlogger";
import { useSelector } from "react-redux";
import { selectProfile } from "@src/store/slices/authSlice";
import { useHasAnyRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";

interface ButtonActionsProps {
  createBlogInfo: any;
  isLoading: boolean;
  refetch: () => void;
}

const ButtonActions = (props: ButtonActionsProps) => {
  const { createBlogInfo, isLoading, refetch } = props;

  const { t } = useTranslation();
  const router = useRouter();

  const profile = useSelector(selectProfile);

  const isManagerBlog = useHasAnyRole([UserRole.SiteOwner, UserRole.ManagerContent, UserRole.ManagerBlog]);

  const [openModalRegisterBlogger, setOpenModalRegisterBlogger] = useState(false);

  if (isLoading || !profile) return null;

  if (createBlogInfo?.isCreate || isManagerBlog) {
    return (
      <Button
        onClick={() => {
          router.push("/sharing/create");
        }}
        leftIcon={<Plus />}
      >
        {t("Create")}
      </Button>
    );
  }

  return (
    <>
      {openModalRegisterBlogger && (
        <ModalRegisterBlogger
          data={createBlogInfo?.user}
          onClose={() => setOpenModalRegisterBlogger(false)}
          onSuccess={refetch}
        />
      )}
      <Button onClick={() => setOpenModalRegisterBlogger(true)}>{t("Register as Sharer")}</Button>
    </>
  );
};

export default ButtonActions;
