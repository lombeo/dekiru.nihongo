import { Select } from "@mantine/core";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { AppPagination } from "../Pagination";
import { Visible } from "../Visible";

let pagination = {
  pageIndex: 1,
  pageSize: 1,
  totalItems: 1,
  totalPages: 1,
};

export const DataViewer = (props: any) => {
  const { data = [], pageSize = 10, render, className = "" } = props;
  const [listItems, setListItem] = useState<any>([]);

  const [pageMaxSize, setPageMaxSize] = useState(pageSize);

  const { t } = useTranslation();

  useEffect(() => {
    pagination = {
      pageIndex: 1,
      pageSize: pageMaxSize,
      totalItems: data.length,
      totalPages: Math.ceil(data.length / pageMaxSize),
    };
    sliceData(pagination.pageIndex);
  }, [data, pageMaxSize]);

  const fetchData = () => {
    pagination = {
      ...pagination,
      totalPages: Math.ceil(pagination.totalItems / pagination.pageSize),
    };
  };

  const sliceData = (pageIndex: any) => {
    const currentData = [...data];
    const _start = (pageIndex - 1) * pagination.pageSize;
    const _end = _start + pagination.pageSize;
    const newSliceData = currentData.slice(_start, _end);

    setListItem(newSliceData);
    fetchData();
  };

  const onChangePage = (pageIndex: any) => {
    pagination = {
      ...pagination,
      pageIndex: pageIndex,
    };
    sliceData(pageIndex);
  };

  const onChangeMaxView = (e: any) => {
    const newVal = parseInt(e);
    pagination = {
      ...pagination,
      pageSize: newVal,
      pageIndex: 1,
    };
    setPageMaxSize(newVal);
    sliceData(1);
  };

  const showOptions = [
    {
      label: t("10 items"),
      value: "10",
    },
    {
      label: t("20 items"),
      value: "20",
    },
    {
      label: t("50 items"),
      value: "50",
    },
    {
      label: t("100 items"),
      value: "100",
    },
    {
      label: t("500 items"),
      value: "500",
    },
  ];
  return (
    <Visible visible={data && data.length}>
      <div className={`space-y-3 ${className}`}>
        <div>{listItems.map((x: any, idx: any) => render(x, idx))}</div>
        <div className={`flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            <label>{t("Show")}</label>
            <Select
              size="sm"
              defaultValue={showOptions[0].value}
              onChange={onChangeMaxView}
              data={showOptions}
              value={pageMaxSize}
            />
          </div>
          <AppPagination
            onChange={onChangePage}
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            currentPageSize={listItems.length}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            size="sm"
          />
        </div>
      </div>
    </Visible>
  );
};
