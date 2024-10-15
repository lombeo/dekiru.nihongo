import { useProfileContext } from "@src/context/Can";
import CmsService from "@src/services/CmsService/CmsService";
import { LoadingOverlay } from "components/cms";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import PubSub from "pubsub-js";
import { useCallback, useEffect, useState } from "react";
import { CourseList } from "./CourseList";
import { FilterBar } from "./FilterBar";

export const Courses = () => {
  const router = useRouter();

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { authorized } = useProfileContext();
  const { t } = useTranslation();

  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();
  const filter = Object.fromEntries(params);

  const fetchData = useCallback(() => {
    if (!authorized) return;
    setLoading(true);
    let _filter: any = { ...filter };
    _filter.type = 1;
    CmsService.getCourses(_filter)
      .then((res: any) => {
        if (res && res.data) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, [authorized, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const mySubscriber = function () {
      fetchData();
    };
    PubSub.subscribe("COURSE_SYNC_UPDATED", mySubscriber);
    return () => {
      PubSub.unsubscribe(mySubscriber);
    };
  }, [fetchData]);

  const handleChangePage = (pageIndex: number) => {
    params.set("pageIndex", pageIndex.toString());
    router.push({ pathname: leftPart, search: params.toString() });
  };

  const onFilter = (args: any) => {
    router.push({ pathname: leftPart, query: { ...filter, ...args } });
  };

  const onReset = () => {
    PubSub.publish("RESET_CONFIRMATION");
    router.push("?");
  };

  const tabOnchange = (tabIndex: any) => {
    router.push({
      pathname: leftPart,
      query: { ...filter, pageIndex: 1, tab: tabIndex },
    });
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <FilterBar data={filter} onFilter={onFilter} onReset={onReset} />
      <CourseList courses={data?.items} pagination={data} onFilter={onFilter} onChangePage={handleChangePage} />
    </>
  );
};
