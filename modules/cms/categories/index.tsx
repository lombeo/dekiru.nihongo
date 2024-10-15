import { Notify } from "@edn/components/Notify/AppNotification";
import Table, { TableColumn } from "@edn/components/Table/Table";
import Icon from "@edn/font-icons/icon";
import { Button } from "@mantine/core";
import { Container } from "@src/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { ActionIcon, AppPagination, confirmAction } from "components/cms";
import { useRouter } from "hooks/useRouter";
import { CourseTabs } from "modules/cms/courses/components/CourseTab";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import ModalCategory from "./ModalCategory";

let selectedCategoryData: any = null;
let filter = { pageIndex: 1, PageSize: 10 };

export default function CategoryManage() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<any>([]);
  const [data, setData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const results = data ? data : [];
  const [isLoading, setIsLoading] = useState<boolean>();

  const router = useRouter();
  const locale = router.locale;
  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();

  const firstRowOnPage = (pagination.pageIndex - 1) * pagination.pageSize + 1;

  const isAdmin = true;

  useEffect(() => {
    filter = { pageIndex: 1, PageSize: 10 };
    fetchData();
  }, [locale]);

  const onSaveCategory = (category: any) => {
    category.name = FunctionBase.normalizeSpace(category.name);
    // save call api
    CmsService.saveOrUpdateCategory(category).then((x: any) => {
      if (!x) return;
      setIsOpen(false);
      fetchData();
    });
  };

  const fetchData = () => {
    setIsLoading(true);
    CmsService.getCategories(filter).then((returnData) => {
      setIsLoading(false);
      if (!returnData?.data) return;
      if (returnData.data.items.length > 0) {
        setData(returnData.data.items);
      }
      setPagination(returnData.data);

      if (returnData?.data?.items?.length == 0 && returnData?.data?.pageIndex > 1) refeshPage();
    });
  };

  const refeshPage = () => {
    filter = { pageIndex: filter.pageIndex - 1 || 1, PageSize: 10 };
    fetchData();
  };

  const openModal = () => {
    selectedCategoryData = null;
    setIsOpen(true);
  };

  //Remove function
  const onRemoveCategory = (id: number) => {
    const onConfirm = () => {
      CmsService.deleteCategory(id).then((response) => {
        console.log("response :>> ", response);
        if (response?.data) {
          Notify.success(t("Delete category successfully"));
          fetchData();
        } else if (response?.data?.message) {
          Notify.error(t(response?.data?.message));
        }
      });
    };

    confirmAction({
      message: t("Are you sure you want to delete this category") + "?",
      onConfirm,
    });
  };

  //Edit function
  const onEditCategory = (data: any) => {
    selectedCategoryData = data;
    setIsOpen(true);
  };

  const onCloseModel = () => {
    setIsOpen(false);
  };

  const columns: TableColumn[] = [
    {
      title: t("STT"),
      headClassName: "w-60 text-center",
      className: "w-60 text-center",
      isIndex: true,
    },
    {
      title: t("Category name"),
      dataIndex: "name",
      headClassName: "text-left",
      className: "text-left",
      render: (data: any) => resolveLanguage(data, locale)?.title,
    },
    {
      title: isAdmin ? t("Actions") : "",
      dataIndex: "",
      headClassName: "text-right",
      className: "text-right",
      render: (params: any) => (
        <div className="flex gap-2 justify-end">
          <ActionIcon variant="default" title={t("Edit")} onClick={() => onEditCategory(params)}>
            <Icon name="edit" />
          </ActionIcon>
          <ActionIcon variant="filled" color="red" onClick={() => onRemoveCategory(params.id)} title={t("Delete")}>
            <Icon name="delete" />
          </ActionIcon>
        </div>
      ),
    },
  ];

  //Handle paging
  const handleChangePage = (pageIndex: number) => {
    filter = {
      ...filter,
      pageIndex: pageIndex,
    };
    params.set("pageIndex", pageIndex.toString());
    router.push({ pathname: leftPart, search: params.toString() });
    fetchData();
  };

  return (
    <div>
      <Container size="xl">
        <CourseTabs className="mb-6" />
        <div className="flex items-center gap-5 justify-end mb-5">
          <Button onClick={openModal} size="lg" radius="md">
            {t("Add category")}
          </Button>
        </div>
        <Table
          className="table-auto w-full"
          wrapClassName="mb-6"
          data={results}
          columns={columns}
          startIndex={firstRowOnPage}
          isLoading={isLoading}
        />
        {pagination && (
          <div className="mt-5">
            <AppPagination
              onChange={handleChangePage}
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              currentPageSize={pagination.items?.length}
              totalItems={pagination.totalItems}
              totalPages={pagination.totalPages}
              label={pagination.totalItems > 1 ? t("categories") : t("category")}
            />
          </div>
        )}
        {isOpen && <ModalCategory data={selectedCategoryData} onClose={onCloseModel} onSave={onSaveCategory} />}
      </Container>
    </div>
  );
}
