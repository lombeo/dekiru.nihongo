import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Button, Card, clsx, Flex, Input, ScrollArea, Select, Text } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { useNextQueryParam } from "@src/helpers/query-utils";
import useDebounce from "@src/hooks/useDebounce";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Files, Pencil, Plus, Search, Trash, Triangle } from "tabler-icons-react";
import ModalAddSkill from "./components/ModalAddSkill";
import ModalAddWarehouse from "./components/ModalAddWarehouse";

const WarehouseIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;
  const wareid = +useNextQueryParam("wareid");
  const [data, setData] = useState({} as any);
  const [openModalWarehouseCreate, setOpenModalWarehouseCreate] = useState(false);
  const [modalAddSkill, setMoadlAddSkill] = useState(false);
  const [openEditWarehouse, setOpenEditWarehouse] = useState(false);
  const [openEditSkill, setOpenEditSkill] = useState(null);
  const [filter, setFilter] = useState({
    warehouseId: wareid,
    keyword: "",
    pageIndex: 1,
    pageSize: 1000,
  });
  const filterDebounce = useDebounce(filter);
  const fetch = async () => {
    const res = await CodingService.getWarehouse({
      ...filter,
    });
    if (res?.data?.success) {
      setData(res?.data?.data);
    }
  };
  const handleChangeWarehousePublic = async (value, warehouse) => {
    const res = await CodingService.saveWarehouse({
      id: warehouse?.id ?? data?.warehouseSummary?.id,
      isPublic: value == "1" ? true : false,
      multiLangData: warehouse ? warehouse?.multiLangData : data?.warehouseSummary?.multiLangData,
    });

    if (res?.data?.success) {
      Notify.success(t("Edit successfully"));
      fetch();
    } else {
      Notify.error(t(data?.data?.message));
    }
  };
  const handleDeleteWarehouse = (id: any) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await CodingService.deleteWarehouse(id ?? data.warehouseSummary.id);
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          setFilter({
            warehouseId: id ? data.warehouseSummary.id : null,
            keyword: "",
            pageIndex: 1,
            pageSize: 1000,
          });
          fetch();
        } else {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };
  const handleEditWarehouse = () => {
    setOpenEditWarehouse(true);
  };
  useEffect(() => {
    fetch();
  }, [filterDebounce, locale]);

  return (
    <div className="pb-20 pt-8">
      <Container size="xl">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                title: t("Warehouse management"),
              },
            ]}
          />
        </Flex>
        <Card className="bg-white shadow-md mt-6 p-0">
          <div className="py-4 flex flex-col lg:flex-row">
            <div className="lg:w-[30%] border-r-2">
              <div className="flex gap-4 px-4 border-b-2 h-20 py-5">
                <Input
                  placeholder={t("Warehouse name or creator name")}
                  className="w-[350px]"
                  onChange={(value) =>
                    setFilter((pre) => ({
                      ...pre,
                      keyword: value.target.value.trim(),
                    }))
                  }
                  rightSection={<Search color="blue" />}
                />
                <Button
                  onClick={() => {
                    setOpenModalWarehouseCreate(true);
                  }}
                >
                  {t("Create")}
                </Button>
              </div>
              <div>
                <ScrollArea h={510}>
                  <div className="py-2 px-4 flex flex-col gap-2">
                    {data?.listWarehouses?.results?.map((value, index) => {
                      return (
                        <div
                          key={value.id}
                          className={clsx(
                            "flex justify-between items-center py-2 px-2 cursor-pointer rounded-sm",
                            data?.warehouseSummary?.id == value?.id
                              ? "bg-[#e1e2ea] font-semibold "
                              : "hover:bg-[#e1e2ea] hover:font-semibold"
                          )}
                          onClick={() => {
                            router.push(`warehouse?wareid=${value?.id}`);
                            setFilter((pre) => ({
                              ...pre,
                              warehouseId: value.id,
                            }));
                          }}
                        >
                          <div className="flex gap-2">
                            <Files />
                            <Text className="text-base ">{value.name}</Text>
                          </div>
                          <Triangle fill="#c1c7d0" color="#c1c7d0" className="rotate-90" size={14} />
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="lg:w-[70%] border-t-2 pt-4 lg:border-0 lg:pt-0">
              <div className="border-b-2 h-20 pb-6 px-4 flex justify-between item-center">
                <div className="flex flex-col gap-1">
                  <Text className="text-xl font-semibold w-[400px] text-ellipsis overflow-hidden">
                    {data?.warehouseSummary?.warehouseName}
                  </Text>
                  <div className="flex items-center gap-2">
                    <Text className="text-sm">{t("Created by")}:</Text>
                    <Link
                      href={`/profile/${data?.warehouseSummary?.owner?.userId}`}
                      className="text-base text-blue-500"
                    >
                      {data?.warehouseSummary?.owner?.userName}
                    </Link>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select
                    value={data?.warehouseSummary?.isPublic ? "1" : "0"}
                    onChange={(value) => handleChangeWarehousePublic(value, null)}
                    data={[
                      {
                        value: "0",
                        label: t("Private"),
                      },
                      {
                        value: "1",
                        label: t("Public"),
                      },
                    ]}
                  />
                  <Button onClick={() => setMoadlAddSkill(true)} leftIcon={<Plus />}>
                    {t("Add skill")}
                  </Button>
                  <Button color="green" onClick={handleEditWarehouse}>
                    <Pencil />
                  </Button>
                  <Button color="red" onClick={() => handleDeleteWarehouse(null)}>
                    <Trash />
                  </Button>
                </div>
              </div>
              <div className="px-4 py-2">
                <Text className="font-semibold">
                  {t("Total")}: {data?.warehouseSummary?.totalSubWarehouse}
                </Text>
              </div>
              <div className="overflow-auto">
                <ScrollArea h={480}>
                  <div className="min-w-[800px]">
                    <div className="flex justify-between py-3 gap-2 bg-slate-300 px-4">
                      <div className="w-[5%] text-[#5e6c84]">#</div>
                      <div className="w-[35%]">
                        <Text className="text-[#5e6c84]">{t("Warehouse")}</Text>
                      </div>
                      <div className="w-[10%]">
                        <Text className="text-[#5e6c84]">{t("Easy")}</Text>
                      </div>
                      <div className="w-[10%]">
                        <Text className="text-[#5e6c84]">{t("Medium")}</Text>
                      </div>
                      <div className="w-[10%]">
                        <Text className="text-[#5e6c84]">{t("Hard")}</Text>
                      </div>
                      <div className="w-[30%]"></div>
                    </div>
                    {data?.warehouseSummary?.listSubWarehouses?.map((item, index) => {
                      return (
                        <div className="flex justify-between items-center py-3 px-4 border-b-2" key={item.id}>
                          <div className="w-[5%]">{index + 1}</div>
                          <div className="w-[35%]">
                            <Link className="hover:text-blue-600" href={`/warehouse/detail/${item?.id}`}>
                              {item?.name}
                            </Link>
                          </div>
                          <div className="w-[10%]">{item?.totalEasy}</div>
                          <div className="w-[10%]">{item?.totalMedium}</div>
                          <div className="w-[10%]">{item?.totalHard}</div>
                          <div className="flex items-center justify-end pr-4 gap-4 w-[30%]">
                            <Select
                              variant="unstyled"
                              onChange={(value) => handleChangeWarehousePublic(value, item)}
                              className="w-[132px]"
                              value={item?.isPublic ? "1" : "0"}
                              data={[
                                {
                                  value: "0",
                                  label: t("Private"),
                                },
                                {
                                  value: "1",
                                  label: t("Public"),
                                },
                              ]}
                            />
                            <ActionIcon
                              onClick={() =>
                                setOpenEditSkill({
                                  parentId: data?.warehouseSummary?.id,
                                  dataEdit: { item },
                                })
                              }
                            >
                              <Pencil color="green" className="cursor-pointer" />
                            </ActionIcon>
                            <ActionIcon onClick={() => handleDeleteWarehouse(item.id)}>
                              <Trash color="red" className="cursor-pointer" />
                            </ActionIcon>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </Card>
      </Container>
      {openEditWarehouse && (
        <ModalAddWarehouse
          setOpenModalWarehouseCreate={setOpenEditWarehouse}
          fetch={fetch}
          dataEdit={data.warehouseSummary}
        />
      )}
      {openModalWarehouseCreate && (
        <ModalAddWarehouse setOpenModalWarehouseCreate={setOpenModalWarehouseCreate} fetch={fetch} />
      )}
      {modalAddSkill && (
        <ModalAddSkill setMoadlAddSkill={setMoadlAddSkill} fetch={fetch} parentId={data?.warehouseSummary?.id} />
      )}
      {openEditSkill && (
        <ModalAddSkill
          setMoadlAddSkill={setOpenEditSkill}
          fetch={fetch}
          parentId={openEditSkill.parentId}
          dataEdit={openEditSkill.dataEdit?.item}
        />
      )}
    </div>
  );
};

export default WarehouseIndex;
