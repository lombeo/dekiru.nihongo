import { Select } from "@edn/components";
import { Button, MultiSelect, Tabs, TextInput } from "@mantine/core";
import { MagnifyingGlass } from "@src/components/Svgr/components";
import { testOrderStatus, timeFilter, timeFormat } from "@src/constants/order/order.constant";
import dayjs from "dayjs";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useCallback, useContext, useMemo, useState } from "react";
import { OrdersContext } from "./OrdersContextProvider";
import DatePickerFlex from "@edn/components/DatePickerFlex";
import _ from "lodash";

export const initialTimeType = "2";

//for day
const startDay = moment().startOf("day").toString();
const defaultStartDay = new Date(startDay);
const endDay = moment().startOf("day").toString();
const defaultEndDay = new Date(endDay);

//for month
const startMonth = moment().startOf("month").add(7, "hours").toString();
const defaultFromMonth = new Date(startMonth);
const endMonth = moment().endOf("month").toString();
const defaultToMonth = new Date(endMonth);

//for year
const startYear = moment().startOf("year").add(7, "hours").toString();
const defaultFromYear = new Date(startYear);
const endYear = moment().endOf("year").toString();
const defaultToYear = new Date(endYear);

const OrdersFilter = ({ isAdmin }: { isAdmin?: boolean }) => {
  const { params, setParams, setOrderId, onExport, loadingExport } = useContext(OrdersContext);
  const { t } = useTranslation();
  const [typesFilter, setTypesFilter] = useState<string[]>([]);
  const [isGetTestOrder, setIsGetTestOrder] = useState<string>("");
  const [timeType, setTimeType] = useState<string>(initialTimeType);
  const [fromDateFilter, setFromDateFilter] = useState<string | Date>(defaultFromMonth);
  const [toDateFilter, setToDateFilter] = useState<string | Date>(defaultToMonth);

  const handleSearchCourse = useCallback(
    _.debounce((query: string) => {
      setOrderId(query);
      setParams((prev) => {
        return { ...prev, orderId: query };
      });
    }, 500),
    []
  );

  const onChangeFromDatePicker = (e, field) => {
    if (timeType !== "1") {
      e = new Date(moment(e).add(7, "hours").toString());
    }
    let date = null;
    date = moment(e).format("YYYY-MM-DD");
    let _configDate = new Date(date);
    if (timeType === "1") {
      _configDate.setHours(_configDate.getHours() - 7);
    }
    date = moment(_configDate).utc().format("YYYY-MM-DDTHH:mm:ss");
    date = e ? date + "Z" : "";

    const otherTimeField = timeFilter.find((item) => item.field !== field)?.field;

    if (
      (field === timeFilter[0].field && e && toDateFilter && e <= toDateFilter) ||
      (field === timeFilter[1].field && fromDateFilter && e && e >= fromDateFilter)
    ) {
      setParams((prev) => {
        return {
          ...prev,
          [field]: date ? date : "",
          [otherTimeField]: field === timeFilter[0].field ? toDateFilter : fromDateFilter,
        };
      });
    }
  };

  const statusMemo = useMemo(() => {
    if (!isAdmin) {
      setParams((prev) => {
        return { ...prev, status: "2" };
      });
    }

    return !isAdmin ? (
      <span className="flex items-center pl-4 text-sm font-normal mt-2 sm:mt-0">{t("Order history")}</span>
    ) : (
      <Tabs
        value={params?.status || "all"}
        onTabChange={(value) => {
          setParams((prev) => {
            return { ...prev, status: value === "all" ? "" : value };
          });
        }}
        className="min-h-[60px] [&>div]:h-full"
        unstyled
        styles={(theme) => ({
          tab: {
            ...theme.fn.focusStyles(),
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[9],
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            borderTop: "2px solid transparent",
            borderBottom: "2px solid transparent",
            paddingLeft: "24px",
            paddingRight: "24px",

            "&:disabled": {
              opacity: 0.5,
              cursor: "not-allowed",
            },

            "&:not(:first-of-type)": {
              borderLeft: 0,
            },

            "&[data-active]": {
              borderBottom: "2px solid #506CF0",
              color: "#506CF0",
              fontWeight: "600",
            },
          },

          tabsList: {
            display: "flex",
          },
        })}
      >
        <Tabs.List>
          <Tabs.Tab value="all">{t("All")}</Tabs.Tab>
          <Tabs.Tab value="0">{t("Pending")}</Tabs.Tab>
          <Tabs.Tab value="2">{t("Already paid")}</Tabs.Tab>
          <Tabs.Tab value="3">{t("Fail payment")}</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    );
  }, [params?.status, t]);

  const timeTypeMemo = useMemo(() => {
    const timeTypeKey: string = timeType + "type";
    return (
      <div className="flex flex-row items-center gap-[10px]">
        <span className="text-sm font-normal">{t("Time type")}</span>
        <Select
          className="w-[100px]"
          key={timeTypeKey}
          data={[
            { value: "1", label: t("Day") },
            { value: "2", label: t("Month") },
            { value: "3", label: t("Year") },
          ]}
          defaultValue={initialTimeType}
          value={timeType}
          onChange={(value) => {
            setTimeType(value);
            setFromDateFilter(value === "1" ? defaultStartDay : value === "3" ? defaultFromYear : defaultFromMonth);
            setToDateFilter(value === "1" ? defaultEndDay : value === "3" ? defaultToYear : defaultToMonth);
            setParams((prev) => {
              return {
                ...prev,
                fromDate: value === "1" ? defaultStartDay : value === "3" ? defaultFromYear : defaultFromMonth,
                toDate: value === "1" ? defaultEndDay : value === "3" ? defaultToYear : defaultToMonth,
                timeFilterBy: value,
              };
            });
          }}
        />
      </div>
    );
  }, [timeType, t]);

  const testOrderMemo = useMemo(() => {
    const testOrderKey: string =
      testOrderStatus.find((item) => item.value === params?.getTestOrder)?.selectValue + "type";
    return (
      <div className="flex flex-row items-center gap-[10px]">
        <span className="text-sm font-normal">{t("Order type")}</span>
        <Select
          className="w-[170px]"
          key={testOrderKey}
          data={[
            { value: "", label: t("All") },
            { value: "1", label: t("Test order") },
            { value: "0", label: t("Normal order") },
          ]}
          defaultValue={testOrderStatus.find((item) => item.value === params?.getTestOrder)?.selectValue}
          value={isGetTestOrder}
          onChange={(selectValue) => {
            setIsGetTestOrder(selectValue);
            setParams((prev) => {
              return {
                ...prev,
                getTestOrder: testOrderStatus.find((item) => item.selectValue === selectValue)?.value,
              };
            });
          }}
        />
      </div>
    );
  }, [isGetTestOrder, t]);

  const typeMemo = useMemo(() => {
    return (
      <div className="flex flex-row items-center gap-[10px]">
        <span className="text-sm font-normal">{t("Payment Type")}</span>
        <MultiSelect
          className="w-[140px]"
          data={[
            { value: "0", label: t("Order Voucher") },
            { value: "1", label: t("Foxpay") },
            { value: "2", label: t("VietQR") },
            { value: "3", label: t("CodeLearn") },
          ]}
          placeholder={t("All")}
          defaultValue={params?.types}
          value={typesFilter}
          onChange={(value) => {
            setTypesFilter(value);
            setParams((prev) => {
              return { ...prev, types: value };
            });
          }}
        />
      </div>
    );
  }, [typesFilter, t]);

  const fromDatePickerMemo = useMemo(() => {
    const options: any = {
      maxDate: dayjs(new Date()).endOf("day").toDate(),
      minDate: dayjs(new Date(2000,1,1)),
      valueFormat: timeFormat.find((item) => item.value === timeType)?.format,
      decadeLabelFormat: timeFormat.find((item) => item.value === timeType)?.format,
      placeholder: timeFormat.find((item) => item.value === timeType)?.format,
      clearable: true,
      classNames: { label: "whitespace-pre" },
      styles: { input: { height: "42px" } },
      value: fromDateFilter,
      onChange: (date) => {
        if (!date) {
          setFromDateFilter(null);
          setToDateFilter(null);
        } else {
          setFromDateFilter(timeType === "1" ? date : new Date(moment(date).add(7, "hours").toString()));
        }
        onChangeFromDatePicker(date, timeFilter[0].field);
      },
    };
    return (
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-[10px]">
          <span className="text-sm font-normal">{t("Start time")}</span>
          <DatePickerFlex
            levelType={timeType}
            key={params?.fromDate}
            {...options}
            error={fromDateFilter && toDateFilter && fromDateFilter > toDateFilter}
          />
        </div>
      </div>
    );
  }, [timeType, fromDateFilter, toDateFilter, t]);

  const toDatePickerMemo = useMemo(() => {
    const options: any = {
      maxDate: dayjs(new Date()).endOf("day").toDate(),
      minDate: dayjs(new Date(2000,1,1)),
      valueFormat: timeFormat.find((item) => item.value === timeType)?.format,
      decadeLabelFormat: timeFormat.find((item) => item.value === timeType)?.format,
      placeholder: timeFormat.find((item) => item.value === timeType)?.format,
      clearable: true,
      classNames: { label: "whitespace-pre" },
      styles: { input: { height: "42px" } },
      value: toDateFilter,
      onChange: (date) => {
        if (!date) {
          setToDateFilter(null);
        } else {
          setToDateFilter(timeType === "1" ? date : new Date(moment(date).add(7, "hours").toString()));
        }
        onChangeFromDatePicker(date, timeFilter[1].field);
      },
    };
    return (
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-[10px]">
          <span className="text-sm font-normal">{t("End time")}</span>
          <DatePickerFlex
            disabled={!fromDateFilter}
            levelType={timeType}
            key={params?.toDate}
            {...options}
            error={fromDateFilter && toDateFilter && fromDateFilter > toDateFilter}
          />
        </div>
      </div>
    );
  }, [timeType, fromDateFilter, toDateFilter, t]);

  // useEffect(() => {
  //   if (!userId) {
  //     router.push(`${router.pathname}`);
  //     const cloneParams = { ...params };
  //     delete cloneParams.userId;
  //     setParams(cloneParams);
  //   } else {
  //     setParams({ ...params, userId: userId });
  //     router.push(`${router.pathname}/?userId=${userId}&userName=${userName}`);
  //   }
  // }, [userId]);

  return (
    <div className="w-full rounded-md bg-white">
      <div className="w-full h-auto lg:h-[60px] flex lg:flex-row flex-wrap lg:flex-nowrap justify-between first:lg:h-full">
        {statusMemo}
        <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-6 py-2 px-4">
          {isAdmin && testOrderMemo}
          {typeMemo}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-start gap-4 p-4 bg-[#EDF0FD]">
        <div className="flex items-start flex-wrap gap-4">
          {timeTypeMemo}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap gap-4">
              {fromDatePickerMemo}
              {toDatePickerMemo}
            </div>
            {fromDateFilter && toDateFilter && fromDateFilter > toDateFilter && (
              <span className="text-[#fa5252] text-wrap">{t("Start time must be less than end time")}</span>
            )}
          </div>
        </div>
        {/* <AsyncSelect
            onChange={(data: any) => {
              setUserId(data?.value);
              setUserName(data?.label);
            }}
            isClearable
            value={{ value: userId, label: userName }}
            className="flex-1 w-full"
            loadingMessage={() => t("Loading")}
            noOptionsMessage={(obj) =>
              !_.isNil(obj.inputValue) && obj.inputValue.length >= 2
                ? t("No result found")
                : t("Enter 2 or more characters")
            }
            loadOptions={_.debounce((query: string, callback: (options: any[]) => void) => {
              if (!query || query.trim().length < 2) {
                callback([]);
                return;
              }
              FriendService.searchUser({
                filter: query,
              }).then((res: any) => {
                const data = res?.data?.data;
                callback(
                  data?.map((user: any) => ({
                    label: user.userName,
                    value: `${user.userId}`,
                  })) || []
                );
              });
            }, 300)}
          /> */}
        {isAdmin && (
          <div className="flex-1 w-full flex flex-row items-center gap-4">
            <TextInput
              id="search-order-id"
              defaultValue=""
              classNames={{
                root: "block w-full",
                input: "pl-5 pr-12 rounded-md h-[40px] bg-white border-none",
                rightSection: "right-2",
              }}
              placeholder={t("Filter by order Id")}
              // onKeyDown={(event: any) => {
              //   if (event && event.key === "Enter") {
              //     handleSearchCourse(event.target.value);
              //   }
              // }}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleSearchCourse(event.target.value)}
              rightSection={<MagnifyingGlass width={14} height={14} />}
            />
            {/* <button
              className=" min-w-fit sm:min-w-[127px] h-10 bg-[#506CF0] px-4 flex items-center justify-center text-white font-semibold text-sm rounded-md"
              onClick={() => {
                handleSearchCourse((document.getElementById("search-order-id") as any)?.value);
              }}
            >
              {t("Search")}
            </button> */}
            {isAdmin && (
              <Button className="h-10 px-4 text-sm rounded-md" variant="outline" onClick={onExport}>
                {t("Export file")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersFilter;
