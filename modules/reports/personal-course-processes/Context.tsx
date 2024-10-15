import React, { useEffect, useRef, useState } from "react";
import { isNil } from "lodash";
import moment from "moment/moment";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useTranslation } from "next-i18next";
import { ReportService } from "@src/modules/reports/service/report.services";
import { LearnCourseService } from "@src/services";

export const PersonalCourseProcessesContext = React.createContext({
  data: {} as any,
  dataStatistic: {} as any,
  viewStatistic: false,
  setViewStatistic: (view: any) => {},
  fetchData: () => {},
  search: (filter?: any) => {},
  reset: () => {},
  filter: {} as any,
  isLoading: false,
  changeFilter: (field: string, value: any) => {},
});

export function PersonalCourseProcessesProvider(props: any) {
  const [filter, _setFilter] = useState<any>({
    pageIndex: 1,
  });

  const refFilter = useRef(filter);
  const setFilter = (value) => {
    refFilter.current = value;
    _setFilter(value);
  };
  const [data, setData] = useState<any>();
  const [dataStatistic, setDataStatistic] = useState<any>();
  const [viewStatistic, setViewStatistic] = useState(false);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatistic = async () => {
    const res = await LearnCourseService.getCourseStatic({
      courseId: filter.courseId,
    });
    if (res?.data?.success) {
      setDataStatistic(res?.data?.data);
    }
  };
  useEffect(() => {
    if (filter?.courseId) {
      fetchStatistic();
    }
  }, [filter?.courseId]);

  const fetchData = async () => {
    const filter = refFilter.current;
    if (!filter.permalink) {
      setData(null);
      return;
    }
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
    let completed = null;
    if (filter.completed === "1") {
      completed = true;
    } else if (filter.completed === "0") {
      completed = false;
    }
    try {
      setIsLoading(true);
      const response = await LearnCourseService.getCourseProgressReport({
        ...filter,
        user: null,
        group: null,
        course: null,
        status: filter.status === -1 ? "" : filter.status,
        endDate,
        startDate,
        inputUserIds: filter.user?.userId,
        completed,
      });
      if (response.data?.success) {
        setData(response?.data?.data);
        return;
      }
      setData(null);
    } catch (e: any) {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const search = (filter?: any) => {
    const prevFilter = refFilter.current;
    const newFilter = { ...prevFilter, ...filter, pageIndex: filter?.pageIndex || 1 };
    setFilter(newFilter);
    if (!newFilter.courseId) {
      Notify.error(t("Course cannot be empty"));
      return;
    }
    fetchData();
  };

  const reset = () => {
    setFilter({
      pageIndex: 1,
    });
    fetchData();
  };

  const changeFilter = (field: string, value: any) => {
    if (isNil(value)) delete filter[field];
    else filter[field] = value;
    setFilter({ ...filter });
  };

  return (
    <PersonalCourseProcessesContext.Provider
      value={{
        isLoading,
        data,
        dataStatistic,
        viewStatistic,
        setViewStatistic,
        filter,
        fetchData,
        search,
        reset,
        changeFilter,
      }}
    >
      {props.children}
    </PersonalCourseProcessesContext.Provider>
  );
}
