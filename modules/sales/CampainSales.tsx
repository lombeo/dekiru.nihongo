import { useState, useMemo, useRef } from "react";
import {
  Button,
  Select,
  Table,
  Pagination,
  Flex,
  Loader,
  TextInput,
  Text,
  Menu,
  Group,
  ActionIcon,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@src/hooks/useDebounce";
import { DatePickerInput } from "@mantine/dates";
import { IdentityService } from "@src/services/IdentityService";
import { isEmpty, pick } from "lodash";
import { useTranslation } from "next-i18next";
import styles from "@src/styles/Table.module.scss";
import MenuBar from "@src/components/MenuBar/MenuBar";
import { Breadcrumbs } from "@edn/components";
import { Container } from "@src/components";
import { NotFound } from "@src/components/Svgr/components";
import { Download, Edit, Plus, Trash } from "tabler-icons-react";
import { useMenuBar } from "@src/hooks/useMenuBar";
import { TypeMenuBar } from "@src/config";
import { confirmAction } from "@edn/components/ModalConfirm";
import ModalCreateEditCampaign from "./ModalCreateEditCampaign";

const DEFAULT_FILTER = {
  pageIndex: 1,
  pageSize: 10,
  orgId: "",
  code: "",
  fromDate: null,
  toDate: null,
};

const ManageCampaigns = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [modalCreateEditCampaign, setCreateEditCampaign] = useState(false);
  const listItem = useMenuBar(TypeMenuBar.UserManagement);
  const [loading, setLoading] = useState(false);
  const filterDebounce = useDebounce(filter);
  const refSelected = useRef<any>(null);
  // Fetch data for campaigns
  //   const { data: dataCampaigns, isLoading: loadingCampaigns } = useQuery({
  //     queryKey: [
  //       "getListCampaigns",
  //       pick(filterDebounce, ["pageIndex", "pageSize", "orgId", "code", "fromDate", "toDate"]),
  //     ],
  //     queryFn: async () => {
  //       try {
  //         const tempFilter = pick(filterDebounce, ["pageIndex", "pageSize", "orgId", "code", "fromDate", "toDate"]);
  //         const res = await IdentityService.getListCampaigns(tempFilter);
  //         return res?.data;
  //       } catch (e) {}
  //       return null;
  //     },
  //   });

  const {
    data: dataCampaigns,
    refetch: rfCampaign,
    isLoading: loadingCampaigns,
  } = useQuery({
    queryKey: [
      "getListCampaign",
      pick(filterDebounce, ["pageIndex", "pageSize", "orgId", "code", "fromDate", "toDate"]),
    ],
    queryFn: async () => {
      try {
        const tempFilter = pick(filterDebounce, ["pageIndex", "pageSize", "orgId", "code", "fromDate", "toDate"]);
        if (!tempFilter.orgId) delete tempFilter.orgId;
        const mockData = {
          data: [
            {
              id: 1,
              code: "CAMP001",
              name: "Campaign 1",
              description: "Description 1",
              fromDate: "01/01/2023",
              toDate: "01/02/2023",
            },
            {
              id: 2,
              code: "CAMP002",
              name: "Campaign 2",
              description: "Description 2",
              fromDate: "01/03/2023",
              toDate: "01/04/2023",
            },
          ],
          metaData: { totalPages: 1 },
        };
        return mockData?.data;
      } catch (e) {}
      return null;
    },
  });

  // Fetch data for organizations
  const { data: dataOrgs } = useQuery({
    queryKey: ["getOrganizations"],
    queryFn: async () => {
      try {
        const res = await IdentityService.getOrganizationDetail({});
        return res?.data?.data?.listSubOrganization?.results;
      } catch (e) {}
      return null;
    },
  });

  // Create options for organization select dropdown
  const listOrgs = useMemo(() => {
    if (isEmpty(dataOrgs)) return [];
    return dataOrgs.map((item) => ({
      label: item?.name,
      value: item?.id,
    }));
  }, [dataOrgs]);

  const onRemove = (data: any) => {
    const onConfirm = async () => {
      //   try {
      //     const res = await PaymentService.voucherDelete({
      //       voucherIds: [data.id],
      //       contextType: data.contextType,
      //       contextId: data.contextId,
      //     });
      //     if (res.data.success) {
      //       Notify.success(t("Delete voucher successfully."));
      //       refetch();
      //     } else {
      //       Notify.error(t("Delete voucher failed"));
      //     }
      //   } catch (e) {
      //     Notify.error(t("Delete voucher failed"));
      //   }
    };
    confirmAction({
      message: t("Are you sure to remove this campaign?"),
      onConfirm,
    });
  };

  const handleClosePopup = () => {
    setFilter(DEFAULT_FILTER);
    setCreateEditCampaign(false);
    rfCampaign();
  };

  // Table columns and data
  const columns = ["#", t("Campaign code"), t("Campaign name"), t("Description"), t("From date"), t("To date"), t("Actions")];

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mx-4">
        <MenuBar title={t("User management")} listItem={listItem} />
      </div>
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("List sales"),
              },
              {
                title: t("List campaigns"),
              },
            ]}
          />
        </Flex>

        {/* Filter Section */}
        <div>
          <div>
            <div className="py-4 flex flex-col md:flex-row gap-2 justify-between items-center">
              {" "}
              {/* Giữ nguyên */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <TextInput
                  placeholder={t("Campaign code")}
                  value={filter.code}
                  onChange={(event) => setFilter((prev) => ({ ...prev, code: event.target.value }))}
                />
                <Select
                  classNames={{ input: "w-80" }}
                  data={listOrgs}
                  value={filter.orgId}
                  searchable
                  clearable
                  nothingFound={t("No result found")}
                  placeholder={t("Organization")}
                  onChange={(value) => setFilter((prev) => ({ ...prev, orgId: value }))}
                />
                <DatePickerInput
                  valueFormat="DD/MM/YYYY"
                  decadeLabelFormat="DD/MM/YYYY"
                  placeholder={t("From date")}
                  clearable
                  classNames={{ label: "whitespace-pre", input: "w-40" }}
                  value={filter.fromDate}
                  onChange={(value) => {
                    setFilter((prev) => ({ ...prev, pageIndex: 1, fromDate: value }));
                  }}
                />

                <DatePickerInput
                  valueFormat="DD/MM/YYYY"
                  decadeLabelFormat="DD/MM/YYYY"
                  placeholder={t("To date")}
                  clearable
                  classNames={{ label: "whitespace-pre", input: "w-40" }}
                  value={filter.toDate}
                  onChange={(value) => {
                    setFilter((prev) => ({ ...prev, pageIndex: 1, toDate: value }));
                  }}
                />
              </div>
              <div className="flex-grow" /> {/* Thêm div này để đẩy các nút sang bên phải */}
              <Button loading={loading} variant="outline" leftIcon={<Download />}>
                {t("Export file")}
              </Button>
              <Button
                leftIcon={<Plus />}
                onClick={() => {
                  setCreateEditCampaign(true);
                  setFilter(DEFAULT_FILTER);
                }}
              >
                {t("Add")}
              </Button>
            </div>
          </div>

          {/* Table Section */}
          {loadingCampaigns ? (
            <div className="flex justify-center py-10">
              <Loader color="blue" />
            </div>
          ) : (
            <>
              {/* {dataCampaigns?.data?.length > 0 ? ( */}
              {dataCampaigns?.length > 0 ? (
                <div className="overflow-auto">
                  <Table className={styles.table} striped withBorder>
                    <thead>
                      <tr>
                        {columns.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* {dataCampaigns.data.map((campaign, index) => ( */}
                      {dataCampaigns.map((campaign, index) => (
                        <tr key={campaign.id}>
                          <td>{index + 1}</td>
                          <td>{campaign.code}</td>
                          <td>{campaign.name}</td>
                          <td>{campaign.description}</td>
                          <td>{campaign.fromDate}</td>
                          <td>{campaign.toDate}</td>
                          <td>
                            <Group spacing="xs">
                              <ActionIcon
                                size="sm"
                                color="blue"
                                onClick={() => {
                                  setCreateEditCampaign(true);
                                  setFilter(DEFAULT_FILTER);
                                }}
                              >
                                <Edit />
                              </ActionIcon>
                              <ActionIcon size="sm" color="red" onClick={() => onRemove(campaign)}>
                                <Trash />
                              </ActionIcon>
                            </Group>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {/* Pagination Section */}
                  <div className="flex justify-center py-5">
                    <Pagination
                      withEdges
                      color="blue"
                      total={1} // {dataCampaigns.metaData.totalPages}
                      value={filter.pageIndex}
                      onChange={(page) => setFilter((prev) => ({ ...prev, pageIndex: page }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-[100%] items-center justify-center mb-10 bg-white py-10 mt-10">
                  <NotFound height={199} width={350} />
                  <Text mt="lg" size="lg" fw="bold">
                    {t("No Data Found !")}
                  </Text>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
      <ModalCreateEditCampaign onClose={handleClosePopup} isOpen={modalCreateEditCampaign} campaignData={filter}/>
    </div>
  );
};

export default ManageCampaigns;
