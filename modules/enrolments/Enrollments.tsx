import { Button, Select, Text, Visible } from "@edn/components";
import Checkbox from "@edn/components/Checkbox/Checkbox";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Badge, Pagination, Skeleton, Switch, Table, Image } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import Link from "@src/components/Link";
import { PubsubTopic } from "@src/constants/common.constant";
import { useProfileContext } from "@src/context/Can";
import { getCookie } from "@src/helpers/cookies.helper";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { LearnCourseService } from "@src/services";
import _, { cloneDeep, omit, unionBy } from "lodash";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import PubSub from "pubsub-js";
import React, { useCallback, useEffect, useState } from "react";
import { Pencil } from "tabler-icons-react";
import AddLearner from "./components/AddLearner";
import ExportArea from "./components/ExportArea";
import ImportArea from "./components/ImportArea";
import ModalViewStatistic from "./components/ModalViewStatistic";
import SearchArea from "./components/SearchArea";
import { ChatChanelEnum } from "@chatbox/constants";

const Enrollments = (props: any) => {
  const { courseId, courseTitle, isStudentManager } = props;
  const { t } = useTranslation();

  const { profile } = useProfileContext();

  const [isLoading, setIsLoading] = useState(true);
  const [viewStatistic, setViewStatistic] = useState(false);

  const defaultSearch = {
    status: null,
    startDate: null,
    endDate: null,
    progress: null,
    inputUserIds: [],
    pageIndex: 1,
    pageSize: 20,
    loadSectionProgresses: false,
    courseId: courseId,
  };
  const [filterSearch, setFilterSearch] = useState<any>(defaultSearch);
  const defaultData = {
    currentPage: 0,
    firstRowOnPage: 0,
    lastRowOnPage: 0,
    pageCount: 1,
    pageSize: 10,
    results: [],
    rowCount: 0,
  };
  const [data, setData] = useState(defaultData);
  const [selectedItems, setSelectedItems] = useListState([]);
  const [selectedItem, setSelectedItem] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);

  useEffect(() => {
    setFilterSearch(defaultSearch);
    fetchData(defaultSearch);
    setSelectedItems.setState([]);
  }, [courseId]);

  const fetchData = useCallback(async (filter) => {
    let filterSearch = _.cloneDeep(filter);
    setIsLoading(true);
    filterSearch.inputUserIds = filterSearch.users?.map?.((e) => +e.value);
    filterSearch.users = null;
    let fromDate = null,
      toDate = null;
    if (filterSearch?.startDate) {
      fromDate = moment(filterSearch?.startDate).format("YYYY-MM-DD");
      let _startDate = new Date(fromDate);
      _startDate.setHours(_startDate.getHours() - 7);
      fromDate = moment(_startDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    }
    if (filterSearch?.endDate) {
      toDate = moment(filterSearch?.endDate).format("YYYY-MM-DD");
      let _endDate = new Date(toDate);
      _endDate.setHours(_endDate.getHours() + 17);
      toDate = moment(_endDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    }

    const response = await LearnCourseService.getCourseProgressReport(filterSearch);
    setIsLoading(false);
    if (!response || !response.data) return;
    let data = response.data.data;
    if (response.data?.success) {
      setSelectedItems.setState([]);
      setData(data);
      PubSub.publish(PubsubTopic.ENROLL_COUNT_LENGTH, data?.rowCount);
    } else {
      setData(defaultData);
    }
  }, []);

  //break when learn Id = 0
  if (courseId === 0) {
    return null;
  }

  const onChangeSearch = (newFilter: any) => {
    let filter = {};
    setFilterSearch((prev) => {
      filter = {
        ...prev,
        ...newFilter,
      };
      return filter;
    });
    fetchData(filter);
  };

  //Export handle
  const onExport = (userId: number, courseId: number, courseTitle: string) => {
    const ACCESS_TOKEN = getCookie("ACCESS_TOKEN");
    let fromDate = null,
      toDate = null;
    if (filterSearch?.startDate) {
      fromDate = moment(filterSearch?.startDate).format("YYYY-MM-DD");
      let _startDate = new Date(fromDate);
      _startDate.setHours(_startDate.getHours() - 7);
      fromDate = moment(_startDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    }
    if (filterSearch?.endDate) {
      toDate = moment(filterSearch?.endDate).format("YYYY-MM-DD");
      let _endDate = new Date(toDate);
      _endDate.setHours(_endDate.getHours() + 17);
      toDate = moment(_endDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    }
    let model = {
      courseId: courseId,
      userId: userId,
      email: profile?.email,
      courseTitle: courseTitle,
      accessToken: ACCESS_TOKEN,
      startDate: fromDate,
      endDate: toDate,
      inputUserIds: selectedItems?.map((e) => e.userId),
      progress: filterSearch.progress,
      status: filterSearch.status,
    };
    LearnCourseService.exportUserEnroll(model).then((data: any) => {
      let response = data.data;
      if (response?.data?.success) {
        Notify.success(
          "Data has been exported successfully and the results will be sent to your email within up to 30 minutes"
        );
      } else {
        Notify.error(t("Export data failed"));
      }
    });
  };

  //Refresh when import successfully
  const refreshList = () => {
    //Reset Search when refreshList.
    setFilterSearch(cloneDeep(defaultSearch));
    fetchData(defaultSearch);
  };

  const onApply = async (valueStatusApply: string) => {
    const actionType = parseInt(valueStatusApply);
    if (selectedItems.length > 0) {
      const listEnrollmentId = selectedItems?.map((e) => e.id);
      LearnCourseService.postBulkActionEnrollment({
        listEnrollmentId,
        actionType,
      }).then((response) => {
        if (response?.data?.success) {
          Notify.success(t("Updated successfully!"));
          setSelectedItems.setState([]);
          fetchData(filterSearch);
        }
      });
    }
  };

  const onItemChecked = (event: any, x: any) => {
    const checked = selectedItems.some((e) => e.id === x.id);
    if (checked) {
      setSelectedItems.setState((prev) => prev.filter((e) => e.id !== x.id));
    } else {
      setSelectedItems.setState((prev) => [...prev, x]);
    }
  };

  const isAllChecked =
    data?.results && data.results.length > 0 && !!data?.results?.every((e) => selectedItems.some((s) => s.id === e.id));

  // handle click when click checkbox all
  const onCheckAll = (event: any) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedItems.setState(unionBy([...selectedItems, ...(data?.results || [])], "id"));
    } else {
      setSelectedItems.setState([]);
    }
  };

  const handleChatStudent = (data) => {
    const userId = profile?.userId;
    const dataChatBox = {
      id: userId > data?.userId ? `${data?.userId}_${userId}` : `${userId}_${data?.userId}`,
      lastMessageTimestamp: new Date(),
      friend: {
        id: data.userId,
        username: data?.userName,
        fullName: data?.fullName,
        avatarUrl: data?.avatarUrl,
      },
      ownerId: -1,
      notifyCount: 0,
    };
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data: dataChatBox });
  };

  return (
    <div className="pt-8 pb-20">
      {viewStatistic && <ModalViewStatistic courseId={courseId} setViewStatistic={setViewStatistic} />}

      <div>
        <SearchArea
          onSubmit={() => {
            fetchData(filterSearch);
          }}
          setFilter={(filter) => {
            if (filter.status == -1) {
              const newFilter = {
                ...filterSearch,
                ...filter,
              };
              setFilterSearch(omit(newFilter, "status"));
            } else {
              setFilterSearch((prev) => {
                return {
                  ...prev,
                  ...filter,
                };
              });
            }
          }}
          courseId={courseId}
          filter={filterSearch}
        />
      </div>
      <div className="pt-6 text-md font-semibold">
        {t("Student list")}
        {` (${FunctionBase.formatNumber(data?.rowCount)})`}
      </div>
      {isStudentManager && (
        <div className="block md:flex items-center justify-between mb-4 pt-2">
          <Switch
            label={t("Show activities")}
            onChange={(event) => {
              setFilterSearch((pre) => ({
                ...pre,
                pageIndex: 1,
                loadSectionProgresses: event.currentTarget.checked,
              }));
              fetchData({
                ...filterSearch,
                pageIndex: 1,
                loadSectionProgresses: event.currentTarget.checked,
              });
            }}
          />
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => {
                setOpenModalAdd(true);
                setSelectedItem(null);
              }}
              variant="filled"
              className="w-full md:w-auto"
            >
              <Icon name="user-add" /> <span className="pl-2">{t("Add learner")}</span>
            </Button>
            <Button onClick={() => setOpenModalImport(true)} variant="light" className="w-full md:w-auto">
              <Icon name="upload-cloud" /> <span className="pl-2">{t("Import learners")}</span>
            </Button>
            {openModalImport && (
              <ImportArea
                open={openModalImport}
                onClose={() => setOpenModalImport(false)}
                refreshList={refreshList}
                courseId={courseId}
              />
            )}
            <ExportArea
              courseTitle={courseTitle}
              courseId={courseId}
              data={data}
              isDisabled={!data?.results}
              onChangeSearch={onChangeSearch}
              onExport={onExport}
              date={[filterSearch.startDate, filterSearch.endDate]}
            />
            <Button variant="light" onClick={() => setViewStatistic(true)}>
              {t("View statistic")}
            </Button>
          </div>
        </div>
      )}

      <Visible visible={isLoading}>
        <div className="w-full h-100 relative pt-5">
          <Skeleton className="mb-4" height={40} width={"100%"}></Skeleton>
          <Skeleton className="mb-4" height={40} width={"100%"}></Skeleton>
          <Skeleton className="mb-4" height={40} width={"100%"}></Skeleton>
          <Skeleton className="mb-4" height={40} width={"100%"}></Skeleton>
          <Skeleton className="mb-4" height={40} width={"100%"}></Skeleton>
        </div>
      </Visible>
      <Visible visible={!isLoading}>
        <div>
          <div className="overflow-auto">
            <Table captionSide="bottom" striped withBorder withColumnBorders className="bg-white">
              <colgroup>
                <col className="w-[42px]" />
                <col className="w-[210px] " />
                <col className="w-[132px] min-w-[100px]" />
                <col className="w-[132px]" />
                <col className="w-[132px]" />
                <col className="w-[155px]" />
                <col className="w-[240px]" />
                <col className="w-[120px]" />
                <col className="w-[200px]" />
                <col className="w-[42px]" />
              </colgroup>
              <thead>
                <tr className="h-[52px]">
                  {isStudentManager && (
                    <th className="w-[42px]">
                      <Checkbox
                        className="flex justify-center"
                        indeterminate={!isAllChecked && selectedItems.length > 0}
                        checked={isAllChecked}
                        onChange={onCheckAll}
                      />
                    </th>
                  )}
                  {selectedItems.length > 0 ? (
                    <th colSpan={6}>
                      <div className="flex items-center gap-4">
                        <div>
                          {t("Selected")} {selectedItems.length} {t("items")}
                        </div>
                        <Select
                          placeholder={t("Update enroll status")}
                          data={[
                            { value: "0", label: t("Active") },
                            { value: "1", label: t("Pending") },
                            { value: "2", label: t("Reject") },
                          ]}
                          className="min-w-[240px]"
                          size="sm"
                          onChange={(e) => {
                            onApply(e);
                          }}
                        />
                      </div>
                    </th>
                  ) : (
                    <>
                      <th className="max-w-[500px] w-[200px]">{t("User")}</th>
                      <th className="!text-center">{t("Account status")}</th>
                      <th className="!text-center">{t("Enrollment date")}</th>
                      <th className="!text-center">{t("Start date")}</th>
                      <th className="!text-center">{t("Deadline date")}</th>
                      <th>{t("Final quiz status")}</th>
                      <th className="!text-center">{t("Progress") + " (%)"}</th>
                      <th className="!text-center">{t("Course status")}</th>
                      <th className="!text-center"></th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data?.results?.map((item, idx) => {
                  const isHaveSection = item.sectionProgresses?.length > 0;
                  return (
                    <React.Fragment key={`${item.courseId}-${item.id}`}>
                      <tr className="h-[52px]">
                        {isStudentManager && (
                          <td rowSpan={isHaveSection ? 2 : 1}>
                            <Checkbox
                              className="flex justify-center"
                              checked={selectedItems.some((e) => e.id === item.id)}
                              name="checkbox"
                              onChange={(event) => onItemChecked(event, item)}
                            />
                          </td>
                        )}
                        <td rowSpan={isHaveSection ? 2 : 1}>
                          <Link
                            href={`/profile/${item.userId}`}
                            className="text-primary hover:underline"
                            target="_blank"
                          >
                            {item.userName}
                          </Link>
                        </td>
                        <td rowSpan={isHaveSection ? 2 : 1} className="text-center">
                          {item.status != 0 ? (
                            <span className="text-blue-primary font-semibold">{t("Active")}</span>
                          ) : (
                            <span className="text-orange-primary font-semibold">{t("Pending")}</span>
                          )}
                        </td>
                        <td className="text-center">{formatDateGMT(item.createdOn, "HH:mm DD/MM/YYYY")}</td>
                        <td className="text-center">{formatDateGMT(item.startedTime, "HH:mm DD/MM/YYYY")}</td>
                        <td className="text-center">{formatDateGMT(item.deadlineTime, "HH:mm DD/MM/YYYY")}</td>
                        <td>{t(item.finalQuizStatus)}</td>
                        <td className="text-center">{item.progress > 0 ? item.progress.toFixed(2) : "0"}</td>
                        <td className="text-center">
                          {item.completed ? (
                            <Badge variant="filled" color="green">
                              {t("Completed")}
                            </Badge>
                          ) : (
                            <Badge variant="filled" color="gray">
                              {t("Incomplete")}
                            </Badge>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center items-center gap-2 h-full">
                            <Pencil
                              color="blue"
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedItem(item);
                                setOpenModalAdd(true);
                              }}
                            />
                            {isStudentManager && (
                              <ActionIcon
                                className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] relative"
                                radius="xl"
                                onClick={() => {
                                  handleChatStudent(item);
                                }}
                              >
                                <Image alt="" src="/images/chat.png" fit="cover" height={24} width={24} />
                              </ActionIcon>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isHaveSection && (
                        <tr>
                          <td colSpan={6} className="border-l b-[#dee2e6]">
                            <div className="grid grid-cols-2 gap-x-6">
                              {item.sectionProgresses.map((e) => (
                                <div key={e.id} className={`flex items-center gap-3`}>
                                  <span>
                                    <Text className="min-w-[30px]">
                                      {FunctionBase.formatNumber(e?.completedPercent * 100, 2)}%
                                    </Text>
                                  </span>
                                  <span>-</span>
                                  <span className="text-sm text-ink-primary">
                                    <TextLineCamp>{e.title}</TextLineCamp>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {!data?.results?.length && (
            <Text className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</Text>
          )}
        </div>
        <div className="flex justify-center py-5">
          <Pagination
            total={data?.pageCount}
            value={data?.currentPage}
            onChange={(value) => {
              fetchData({
                ...filterSearch,
                pageIndex: value,
              });
            }}
          />
        </div>
      </Visible>
      {openModalAdd && (
        <AddLearner
          initialValue={selectedItem}
          courseId={courseId}
          onSuccess={refreshList}
          onClose={() => setOpenModalAdd(false)}
        />
      )}
    </div>
  );
};

export default Enrollments;
