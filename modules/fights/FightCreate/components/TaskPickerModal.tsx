import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Group, Modal, Pagination, ScrollArea, Select, Skeleton, Text, TextInput, clsx } from "@mantine/core";
import ExternalLink from "@src/components/ExternalLink";
import { NotFound } from "@src/components/Svgr/components";
import useDebounce from "@src/hooks/useDebounce";
import CmsService from "@src/services/CmsService/CmsService";
import { FriendService } from "@src/services/FriendService/FriendService";
import { isEmpty, isNil, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "tabler-icons-react";

interface TaskPickerModalProps {
  onClose: () => void;
  onSelect: (items: any[]) => void;
  excludedIds?: any[];
  multiple?: boolean;
  onlyActivityCode?: boolean;
}

const TaskPickerModal = (props: TaskPickerModalProps) => {
  const { onlyActivityCode, multiple, onClose, onSelect, excludedIds } = props;
  const { t } = useTranslation();
  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 15,
    excludedIds: excludedIds || [],
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const filterDebounce = useDebounce(filter, 300);
  const emptyItems = useMemo(() => new Array(16).fill(null), []);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  const fetch = async () => {
    setIsLoading(true);
    const res = await CmsService.activitySearchActivity({
      ...filter,
      onlyActivityCode,
    });
    if (res?.data?.success) {
      setData(res?.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [filterDebounce]);

  return (
    <Modal
      classNames={{
        root: "overflow-hidden",
        title: "font-semibold uppercase text-lg",
        body: clsx("relative px-0 overflow-hidden", {
          "pb-[69px]": multiple,
        }),
      }}
      title={t("Task list")}
      size={1000}
      centered
      onClose={onClose}
      opened
    >
      <div className="grid gap-5 grid-cols-4 px-6 mb-4">
        <TextInput
          label={t("Name")}
          value={filter.keyword}
          onChange={(e) => setFilter((prev) => ({ ...prev, keyword: e.target.value }))}
        />

        <Select
          nothingFound={t("No result found")}
          data={userOptions}
          clearable
          searchable
          onSearchChange={(query) => {
            if (!query || query.trim().length < 2) return;
            FriendService.searchUser({
              filter: query,
            }).then((res) => {
              const data = res?.data?.data;
              if (data) {
                setUserOptions((prev) =>
                  uniqBy(
                    [
                      ...prev,
                      ...data.map((user) => ({
                        label: user.userName,
                        value: user.userId,
                      })),
                    ],
                    "value"
                  )
                );
              }
            });
          }}
          value={filter.ownerId}
          onChange={(value) => setFilter((prev) => ({ ...prev, ownerId: value }))}
          label={t("Owner")}
        />
        {/* <TextInput
          label={t("Tags")}
          value={filter.tag}
          onChange={(e) => setFilter((prev) => ({ ...prev, tag: e.target.value }))}
        /> */}
        <Select
          data={[
            {
              label: t("Easy"),
              value: "1",
            },
            {
              label: t("Medium"),
              value: "2",
            },
            {
              label: t("fight.Hard"),
              value: "3",
            },
          ]}
          clearable
          value={isNil(filter.levelId) ? null : filter.levelId.toString()}
          onChange={(value) => setFilter((prev) => ({ ...prev, levelId: isNil(value) ? null : +value }))}
          label={t("Level")}
        />
      </div>

      {isLoading && (
        <div className="grid gap-5 grid-cols-4 mb-4 max-h-[calc(100vh_-_400px)] overflow-y-auto px-6">
          {emptyItems.map((e, index) => (
            <Skeleton key={index} height={184} />
          ))}
        </div>
      )}

      {!isLoading && (
        <>
          {/*{data ? (*/}
          <div className="px-6 pb-6">
            <ScrollArea type="always" classNames={{ root: "h-[calc(100vh_-_280px)]" }}>
              <div className="grid gap-5 grid-cols-4">
                <div className="flex gap-2 items-center h-full flex-col py-4 px-3 bg-[#F9FAFC] border">
                  <Button
                    onClick={() => {
                      window.open(`/cms/activity-code/12/create`);
                    }}
                    className="text-xs w-full"
                    color="blue"
                    leftIcon={<Plus width={18} />}
                  >
                    {t("Programming Language")}/{t("SQL")}
                  </Button>
                  {!onlyActivityCode && (
                    <Button
                      onClick={() => {
                        window.open(`/cms/activity/create/8`);
                      }}
                      className="text-xs w-full"
                      color="blue"
                      leftIcon={<Plus width={18} />}
                    >
                      {t("Multiple-choice questions")}
                    </Button>
                  )}
                </div>
                {data?.data?.map((item) => {
                  const isSelected = selectedItems.some((e) => e.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={clsx("flex gap-4 flex-col py-4 px-3 bg-[#F9FAFC] border rounded-md", {})}
                    >
                      <div className="flex items-center justify-between gap-5">
                        <Button
                          size="xs"
                          onClick={() => {
                            if (multiple) {
                              if (isSelected) {
                                setSelectedItems((prev) => prev.filter((e) => e.id !== item.id));
                                return;
                              }
                              setSelectedItems((prev) => [...prev, item]);
                            } else {
                              onSelect([item]);
                              onClose();
                            }
                          }}
                          color={isSelected ? "green" : "blue"}
                          variant={isSelected ? "filled" : "outline"}
                        >
                          {isSelected ? t("Selected") : t("Select")}
                        </Button>
                        <ExternalLink
                          target="_blank"
                          href={
                            item.activityType === 12
                              ? `/cms/activity-code/12/edit/${item.id}?type=${item.activityCodeSubType}`
                              : `/cms/activities?activityId=${item.id}&activityType=${item.activityType}`
                          }
                          rel="noreferrer"
                        >
                          <Button size="xs" variant="transparent" className="underline">
                            {t("View")}
                          </Button>
                        </ExternalLink>
                      </div>
                      <TextLineCamp
                        data-tooltip-id="global-tooltip"
                        data-tooltip-content={item.title}
                        data-tooltip-place="top"
                        line={2}
                        className="text-sm font-semibold h-[40px]"
                      >
                        {item.title}
                      </TextLineCamp>
                      <Text size="xs">
                        <b>{t("Tags")}:</b>{" "}
                        {item.tags
                          ?.split(",")
                          ?.filter((e) => !isEmpty(e))
                          ?.join(", ")}
                      </Text>
                      <Text size="xs">
                        <b>{t("Creator")}:</b> <span>{item.userName}</span>
                      </Text>
                    </div>
                  );
                })}
              </div>

              {data ? (
                <Group position="center" mt="xl">
                  <Pagination
                    withEdges
                    color="blue"
                    value={filter.pageIndex}
                    total={data?.metaData?.pageTotal}
                    onChange={(page) => setFilter((prev) => ({ ...prev, pageIndex: page }))}
                  />
                </Group>
              ) : (
                <div className="flex flex-col items-center justify-center mb-10 bg-white pt-6 pb-4">
                  <NotFound height={199} width={350} />
                  <Text mt="lg" size="lg" fw="bold">
                    {t("No Data Found !")}
                  </Text>
                  <Text fw="bold">{t("Your search did not return any content.")}</Text>
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}

      {multiple && (
        <div className="flex gap-4 justify-between absolute bottom-0 right-0 left-0 px-6 py-4 bg-white border-t">
          <Text size="sm">
            {t("Selected")}: <b>{selectedItems.length}</b>
          </Text>
          <Group>
            <Button onClick={onClose} variant="outline">
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => {
                onSelect(selectedItems);
                onClose();
              }}
            >
              {t("Add")}
            </Button>
          </Group>
        </div>
      )}
    </Modal>
  );
};

export default TaskPickerModal;
