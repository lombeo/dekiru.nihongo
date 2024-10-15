import { Button } from "@mantine/core";
import { Calendar, X } from "tabler-icons-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { PersonalCourseProcessesContext } from "./Context";
import { useTranslation } from "next-i18next";
import Icon from "@edn/font-icons/icon";
import dayjs from "dayjs";
import { DatePickerInput } from "@mantine/dates";
import { NumberInput, Select } from "@edn/components";
import { ReportService } from "@src/modules/reports/service/report.services";
import { getCookie } from "@src/helpers/cookies.helper";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useProfileContext } from "@src/context/Can";
import moment from "moment";
import SelectInfinite from "@src/components/SelectInfinite/SelectInfinite";
import { DataSource } from "@src/components/TagField/TagField";
import { LearnCourseService } from "@src/services";
import { FriendService } from "@src/services/FriendService/FriendService";

const Head = () => {
  const { t } = useTranslation();
  const { search, reset, changeFilter, filter, data, isLoading, setViewStatistic } =
    useContext(PersonalCourseProcessesContext);
  const [loadingExport, setLoadingExport] = useState(false);
  const { profile } = useProfileContext();
  const [disable, setDisable] = useState(true);

  const onPickUser = (users) => {
    changeFilter("user", users[0]);
  };

  useEffect(() => {
    if (data?.results.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [data]);

  const handleExport = () => {
    if (!filter.courseId) return;
    const ACCESS_TOKEN = getCookie("ACCESS_TOKEN");
    let endDate = null,
      startDate = null;
    if (filter.startDate) {
      startDate = moment(filter.startDate).format("YYYY-MM-DD");
      let _startDate = new Date(startDate);
      _startDate.setHours(_startDate.getHours() - 7);
      startDate = moment(_startDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    }
    if (filter.endDate) {
      endDate = moment(filter.endDate).format("YYYY-MM-DD");
      let _endDate = new Date(endDate);
      _endDate.setHours(_endDate.getHours() + 17);
      endDate = moment(_endDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    }
    setLoadingExport(true);
    LearnCourseService.exportUserEnroll({
      courseId: filter.courseId,
      userId: data?.results[0]?.id,
      email: profile?.email,
      accessToken: ACCESS_TOKEN,
      startDate,
      endDate,
      inputUserIds: filter.user?.id ? [filter.user?.id] : null,
      progress: filter.progress,
      status: filter.status === -1 ? null : filter.status,
    })
      .then((data: any) => {
        let response = data.data;
        if (response?.data?.success && response.data?.url) {
          const a = document.createElement("a");
          a.href = response.data.url;
          a.click();
        } else {
          Notify.error(t("Export data failed"));
        }
      })
      .finally(() => {
        setLoadingExport(false);
      });
  };

  const handleFetchUsers = useCallback(async (query: string, page: number) => {
    try {
      let data: any[];
      let total: number;
      let limit = 10;
      if (!query || query.trim().length < 2) return;
      const response = await FriendService.searchUser({
        filter: query,
      });
      data = response?.data?.data;
      total = data?.length;
      if (!data) return;
      return Promise.resolve({
        data,
        total,
        limit,
      } as DataSource);
    } catch (e) {}
  }, []);

  const handleFetchCourses = useCallback(async (query: string, page: number) => {
    try {
      let data: any[];
      let total: number;
      let limit = 10;
      const response = await ReportService.getPersonalCourseReport({
        pageIndex: page,
        pageSize: 20,
        courseName: query,
      });
      data = response.data.data?.results;
      total = response.data.data.rowCount;
      if (!data) return;
      return Promise.resolve({
        data,
        total,
        limit,
      } as DataSource);
    } catch (e) {}
  }, []);

  return (
    <div className="p-5 border w-full rounded-md mb-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 grid-wrap gap-5">
        <SelectInfinite
          fetchOptions={handleFetchCourses}
          uniqueKey="permalink"
          value={filter["course"]}
          required
          label={t("Course name")}
          getOptionLabel={(item) => item.title}
          onChange={(value) => {
            changeFilter("course", value);
            changeFilter("permalink", value?.permalink);
            changeFilter("courseId", value?.courseId);
            changeFilter("activityId", null);
            setDisable(true);
          }}
        />
        {/*<div>*/}
        {/*  <label style={{ color: "#212529" }} className="text-base font-medium">*/}
        {/*    {t("Group")}*/}
        {/*  </label>*/}
        {/*  <SearchGroup*/}
        {/*    courseId={filter.courseId}*/}
        {/*    onChange={(option) => {*/}
        {/*      changeFilter("group", option);*/}
        {/*      changeFilter("groupId", option?.id);*/}
        {/*    }}*/}
        {/*    value={filter.group}*/}
        {/*  />*/}
        {/*</div>*/}
        <SelectInfinite
          fetchOptions={handleFetchUsers}
          uniqueKey="userId"
          value={filter["user"]}
          label={t("User")}
          getOptionLabel={(item) => item.userName}
          onChange={(value) => {
            changeFilter("user", value);
            setDisable(true);
          }}
        />
        <Select
          label={t("Enrollment Status")}
          placeholder={t("Select")}
          data={[
            { value: "-1", label: t("All") },
            { value: "1", label: t("Active") },
            { value: "0", label: t("Deactive") },
          ]}
          value={filter?.status?.toString()}
          size="md"
          onChange={(val) => {
            changeFilter("status", +val);
            setDisable(true);
          }}
        />
        <DatePickerInput
          value={filter.startDate}
          onChange={(date) => {
            changeFilter("startDate", date);
            setDisable(true);
          }}
          maxDate={dayjs(new Date()).endOf("day").toDate()}
          placeholder={t("dd/mm/yyyy")}
          valueFormat="DD/MM/YYYY"
          decadeLabelFormat="DD/MM/YYYY"
          label={t("From date(GMT+07)")}
          size="md"
          clearable
          icon={<Calendar size={16} className="left-0" />}
        />
        <DatePickerInput
          value={filter.endDate}
          onChange={(date) => {
            changeFilter("endDate", date);
            setDisable(true);
          }}
          minDate={filter["startDate"] && dayjs(filter["startDate"]).startOf("day").toDate()}
          maxDate={dayjs(new Date()).endOf("day").toDate()}
          valueFormat="DD/MM/YYYY"
          decadeLabelFormat="DD/MM/YYYY"
          label={t("To date(GMT+07)")}
          size="md"
          placeholder={t("dd/mm/yyyy")}
          clearable
          icon={<Calendar size={16} className="left-0" />}
        />
        {/*<Select*/}
        {/*    label={t("Course status")}*/}
        {/*    placeholder={t("Select")}*/}
        {/*    data={[*/}
        {/*      { value: "-1", label: t("All") },*/}
        {/*      { value: "1", label: t("Completed") },*/}
        {/*      { value: "0", label: t("Incomplete") },*/}
        {/*    ]}*/}
        {/*    defaultValue="-1"*/}
        {/*    value={filter?.completed}*/}
        {/*    size="md"*/}
        {/*    onChange={(val) => changeFilter("completed", val)}*/}
        {/*/>*/}
        <NumberInput
          placeholder={`${t("Progress")} (>=)`}
          label={
            <label style={{ color: "#212529" }} className="text-base font-medium">
              {`${t("Progress")} (>=)`}
            </label>
          }
          value={filter.progress}
          onChange={(val) => {
            changeFilter("progress", val);
            setDisable(true);
          }}
          hideControls
          defaultValue={0}
          max={100}
          min={0}
          size="md"
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </div>

      <div className="flex gap-5 items-end flex-wrap col-span-2 mt-4">
        <Button loading={isLoading} onClick={() => search()} size="md" leftIcon={<Icon size={20} name="search" />}>
          {t("Filter")}
        </Button>
        <Button variant="light" size="md" onClick={reset} leftIcon={<X size={20} />}>
          {t("Reset")}
        </Button>
        <Button
          variant="light"
          loading={loadingExport}
          onClick={handleExport}
          disabled={disable}
          size="md"
          leftIcon={<Icon size={20} name="download" />}
        >
          {t("Export")}
        </Button>

        <div>
          <Button disabled={disable} variant="light" size="md" onClick={() => setViewStatistic(true)}>
            {t("View statistic")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Head;
