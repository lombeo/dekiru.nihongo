import { Container } from "@src/components"; // Import Button
import React, { useEffect, useState } from "react";
import CodingService from "@src/services/Coding/CodingService";
import { Select, Button, TextInput, Table } from "@mantine/core";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { TypeMenuBar } from "@src/config";
import { useMenuBar } from "@src/hooks/useMenuBar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { Breadcrumbs, Pagination } from "@edn/components";
import styles from "@src/styles/Table.module.scss";
import { IdentityService } from "@src/services/IdentityService";
import { Pencil, Trash } from "tabler-icons-react";
import useDebounce from "@src/hooks/useDebounce";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@src/components/cms";
import ModalAddEditSchool from "./components/ModalAddEditSchool";
import { useHasAnyRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";
import { useRouter } from "next/router";

export default function SchoolIndex() {
  const listItem = useMenuBar(TypeMenuBar.SystemManagement);
  const { t } = useTranslation();
  const router = useRouter();
  const isManager = useHasAnyRole([UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent]);

  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [school, setSchool] = useState({ schoolId: "", schoolName: "", keyword: "" });
  const [isShowAddEdit, setIsShowAddEdit] = useState(false);

  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data: provinceList = [] } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await CodingService.getAllCountry({ parentId: 238 });
      return res?.data?.data || [];
    },
  });

  const { data: districtList = [] } = useQuery({
    queryKey: ["districts", provinceId],
    queryFn: async () => {
      const res = await CodingService.getAllCountry({ parentId: provinceId });
      return res?.data?.data || [];
    },
    enabled: !!provinceId,
  });

  const debounceName = useDebounce(school.keyword);

  const { data: schoolList } = useQuery({
    queryKey: ["schools", districtId, debounceName, filter],
    queryFn: async () => {
      const params = {
        ...filter,
        districtId,
        keyword: debounceName,
      };
      const res = await IdentityService.getSchoolOrUniversity(params);
      return res?.data;
    },
    enabled: !!districtId || !!debounceName,
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return IdentityService.deleteSchool({ id });
    },
    onSuccess: (data) => {
      if (data?.data?.success) Notify.success(t("Delete successfully!"));
    },
  });

  useEffect(() => {
    if (!isManager) {
      router.push("/403");
    }
  }, [isManager]);

  const handleDelete = (data) => {
    confirmAction({
      message: t("Do you sure delete school"),
      onConfirm: () => {
        mutation.mutate(data.value);
      },
    });
  };

  const handleClose = () => {
    setIsShowAddEdit(false);
    setSchool({ ...school, schoolId: "", schoolName: "" });
  };

  if (!isManager) return null;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="pl-4 ">
        <MenuBar title="System management" listItem={listItem} />
      </div>
      <Container size="xl" className="">
        <div className="w-full space-y-6 ">
          <Breadcrumbs
            data={[
              {
                href: `/`,
                title: t("Home"),
              },
              {
                title: t("Setting school"),
              },
            ]}
          />
          <div className="flex justify-between items-end ">
            <div className="flex gap-6">
              <Select
                data={provinceList?.map((pr) => ({ value: pr?.id, label: pr?.name }))}
                onChange={(value) => {
                  setProvinceId(value);
                  setDistrictId("");
                }}
                value={provinceId}
                searchable
                placeholder={t("Select province")}
                label={t("Province")}
                size="md"
                className="w-full"
              />
              <Select
                data={districtList?.map((item) => ({ value: item?.id, label: item?.name }))}
                onChange={(value) => setDistrictId(value)}
                placeholder={t("Select district")}
                disabled={!provinceId}
                searchable
                label={t("District")}
                value={districtId}
                size="md"
                className="w-full"
              />
              <TextInput
                placeholder={t("Search school")}
                label={t("School")}
                value={school.keyword}
                onChange={(e) => setSchool({ ...school, keyword: e.target.value })}
                size="md"
                className="w-full"
              />
            </div>
            <Button size="md" onClick={() => setIsShowAddEdit(true)} disabled={!districtId}>
              {t("Add school")}
            </Button>
          </div>

          <Table className={styles.table}>
            <thead>
              <tr>
                <th className="text-base font-bold">{t("ID")}</th>
                <th className="text-base font-bold">{t("School name")}</th>
                <th className="text-base font-bold !text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {schoolList?.data &&
                Object.keys(schoolList?.data)
                  ?.map((key) => ({ label: schoolList?.data[key], value: key }))
                  ?.map((row) => (
                    <tr key={row?.value}>
                      <td>{row?.value}</td>
                      <td>{row?.label}</td>
                      <td className="flex flex-row space-x-2 justify-center items-center">
                        <Pencil
                          className="cursor-pointer text-yellow-500"
                          onClick={() => {
                            setSchool({ ...school, schoolName: row.label, schoolId: row.value });
                            setIsShowAddEdit(true);
                          }}
                        />
                        <Trash className="cursor-pointer text-red-500" onClick={() => handleDelete(row)} />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>

          {schoolList?.data && Object.keys(schoolList?.data).length > 0 ? (
            <div className="mt-8 pb-8">
              <Pagination
                pageIndex={filter.pageIndex}
                currentPageSize={schoolList?.metaData?.pageSize}
                totalItems={schoolList?.metaData?.total}
                totalPages={schoolList?.metaData?.pageTotal}
                label={" "}
                pageSize={filter.pageSize}
                onChange={(page) => setFilter((prev) => ({ ...prev, pageIndex: page }))}
              />
            </div>
          ) : (
            <div className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</div>
          )}
        </div>
      </Container>
      {isShowAddEdit && <ModalAddEditSchool onClose={handleClose} school={school} districtId={districtId} />}
    </div>
  );
}
