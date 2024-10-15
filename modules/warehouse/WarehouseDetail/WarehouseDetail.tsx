import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { ActionIcon, Button, clsx, Flex, Loader, Pagination, Select, Text, TextInput, Tooltip } from "@mantine/core";
import { Container } from "@src/components";
import { NotFound } from "@src/components/Svgr/components";
import useDebounce from "@src/hooks/useDebounce";
import TaskPickerModal from "@src/modules/fights/FightCreate/components/TaskPickerModal";
import CodingService from "@src/services/Coding/CodingService";
import { getLevelLabel } from "@src/services/Coding/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Plus, Refresh } from "tabler-icons-react";

const WarehouseDetail = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const id = router.query.id;
  const [data, setData] = useState({} as any);
  const [openTaskPickerModal, setOpenTaskPickerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    language: "vn",
    keyword: "",
    levelId: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const filterDebounce = useDebounce(filter);
  const fetch = async () => {
    const res = await CodingService.detailWarehouse({
      ...filter,
      warehouseId: id,
    });
    if (res?.data?.success) {
      setData(res.data.data);
    } else {
      Notify.error(t(res?.data?.message));
    }
    setLoading(false);
  };
  const handelDeleteActivity = async (value) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: async () => {
        const res = await CodingService.removeActivity({
          warehouseId: id,
          activityId: value.id,
        });
        if (res?.data?.success) {
          Notify.success(t("Delete successfully!"));
          fetch();
        } else {
          Notify.error(res?.data?.message);
        }
      },
    });
  };
  const handleSetTask = async (value) => {
    const res = await CodingService.addAcitvity({
      warehouseId: id,
      cmsId: value[0].id,
    });
    if (res?.data?.success) {
      Notify.success(t("Add successfully!"));
      fetch();
    } else {
      Notify.error(t(res?.data?.message));
    }
  };
  const handleSync = (value) => {
    confirmAction({
      title: t("CONFIRMATION"),
      htmlContent: <Text>{t("Are you sure sync task ?")}</Text>,
      onConfirm: async () => {
        const res = await CodingService.synchronizeActivity({
          warehouseId: id,
          activityId: value.id,
        });
        if (res?.data?.success) {
          Notify.success(t("Sync task successfully!"));
          fetch();
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };
  const handleSyncAllActivity = () => {
    confirmAction({
      title: t("CONFIRMATION"),
      htmlContent: <Text>{t("Are you sure sync all task ?")}</Text>,
      onConfirm: async () => {
        const res = await CodingService.synchronizeAllActivity({
          warehouseId: id,
        });
        if (res?.data?.success) {
          Notify.success(t("Sync all task successfully!"));
          fetch();
        } else if (res?.data?.message) {
          Notify.error(t(res?.data?.message));
        }
      },
    });
  };
  useEffect(() => {
    fetch();
  }, [filterDebounce, locale]);
  return (
    <div className="pb-20 pt-8">
      {openTaskPickerModal && (
        <TaskPickerModal onClose={() => setOpenTaskPickerModal(false)} onSelect={handleSetTask} />
      )}

      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/warehouse",
                title: t("Warehouse"),
              },
              {
                title: t("Detail"),
              },
            ]}
          />
        </Flex>
        <Text className="text-2xl font-semibold">{t("All task in the warehouse") + ": " + data?.name}</Text>
        <div className="bg-white flex p-3 mt-6 md:flex-row flex-col">
          <div className="flex gap-1 md:w-[25%]">
            <Text className="text-[#3b3c54] font-semibold">{t("Total tasks") + ":"}</Text>
            <Text className="text-[#2c31cf] font-semibold">
              {data?.totalEasy + data?.totalMedium + data?.totalHard}
            </Text>
          </div>
          <div className="flex gap-1 md:w-[25%]">
            <Text className="text-[#3b3c54] font-semibold">{t("Total easy task") + ":"}</Text>
            <Text className="text-[#2c31cf] font-semibold">{data?.totalEasy}</Text>
          </div>
          <div className="flex gap-1 md:w-[25%]">
            <Text className="text-[#3b3c54] font-semibold">{t("Total medium task") + ":"}</Text>
            <Text className="text-[#2c31cf] font-semibold">{data?.totalMedium}</Text>
          </div>
          <div className="flex gap-1 md:w-[25%]">
            <Text className="text-[#3b3c54] font-semibold">{t("Total hard task") + ":"}</Text>
            <Text className="text-[#2c31cf] font-semibold">{data?.totalHard}</Text>
          </div>
        </div>
        <div className="flex justify-between mt-4 flex-wrap gap-2">
          <div className="flex">
            <TextInput
              placeholder={t("Task name")}
              onChange={(value) => {
                setFilter((pre) => ({
                  ...pre,
                  pageIndex: 1,
                  keyword: value.target.value.trim(),
                }));
              }}
            />
            <Select
              data={[
                {
                  label: t("All"),
                  value: "0",
                },
                {
                  label: t("Easy"),
                  value: "1",
                },
                {
                  label: t("Medium"),
                  value: "2",
                },
                {
                  label: t("Hard"),
                  value: "3",
                },
              ]}
              value={filter.levelId + ""}
              onChange={(value) => {
                setFilter((pre) => ({
                  ...pre,
                  pageIndex: 1,
                  levelId: +value,
                }));
              }}
              className="w-[170px]"
            />
            <Tooltip label={t("Synchronize all task")}>
              <ActionIcon h="36px" w="36px" onClick={handleSyncAllActivity} color="indigo" size="md" variant="outline">
                <Refresh width={20} />
              </ActionIcon>
            </Tooltip>
          </div>
          <div>
            <Button leftIcon={<Plus />} onClick={() => setOpenTaskPickerModal(true)}>
              {t("Create")}
            </Button>
          </div>
        </div>
        <div className="mt-6 bg-white">
          <div className="flex bg-[#e1e2ea] p-4">
            <Text className="w-[5%] min-w-[35px] text-[#5e6c84]">{t("#")}</Text>
            <Text className="w-[65%] text-[#5e6c84]">{t("Task Name")}</Text>
            <Text className="w-[15%] text-[#5e6c84]">{t("Type")}</Text>
            <Text className="w-[15%] text-center text-[#5e6c84]">{t("Action")}</Text>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : data?.listActivities?.results?.length > 0 ? (
            data?.listActivities?.results?.map((value, index) => {
              return (
                <div className="flex px-4 py-2 border-b-2" key={value.id}>
                  <Text className="w-[5%] min-w-[35px] flex items-center">
                    {(data?.listActivities?.currentPage - 1) * 10 + index + 1}
                  </Text>
                  <div className="w-[65%] flex items-center">
                    <Text
                      className="hover:text-blue-500 cursor-pointer inline"
                      onClick={() =>
                        router.push(
                          `/warehouse/activity?activityType=${value.activityType}&activityId=${value.id}&warehouseId=${id}`
                        )
                      }
                    >
                      {value.title}
                    </Text>
                  </div>
                  <Text
                    className={clsx(
                      value.levelId == 1 ? "text-green-500" : value.levelId == 2 ? "text-orange-500" : "text-red-500",
                      "text-sm w-[15%] flex items-center"
                    )}
                  >
                    {t(getLevelLabel(value.levelId))}
                  </Text>
                  <div className="w-[15%] flex justify-center">
                    <Button variant="subtle" onClick={() => handelDeleteActivity(value)}>
                      {t("Delete")}
                    </Button>
                    <Tooltip label={t("Synchronize task")}>
                      <ActionIcon
                        h="36px"
                        w="36px"
                        onClick={() => handleSync(value)}
                        color="indigo"
                        size="md"
                        variant="subtle"
                      >
                        <Refresh width={20} />
                      </ActionIcon>
                    </Tooltip>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col w-[100%] items-center justify-center mb-10 bg-white py-10 mt-10">
              <NotFound height={199} width={350} />
              <Text mt="lg" size="lg" fw="bold">
                {t("No Data Found !")}
              </Text>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <Pagination
            withEdges
            value={data?.listActivities?.currentPage}
            total={data?.listActivities?.pageCount}
            onChange={(pageIndex) => {
              setFilter((prev) => ({
                ...prev,
                pageIndex: pageIndex,
              }));
            }}
          />
        </div>
      </Container>
    </div>
  );
};

export default WarehouseDetail;
