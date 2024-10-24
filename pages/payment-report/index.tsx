import { Breadcrumbs } from "@edn/components";
import { Badge, Loader, Pagination, Select, Table, TextInput, Text, Checkbox, Image } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { CourseEnrollType } from "@src/constants/courses/courses.constant";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { LearnService } from "@src/services/LearnService/LearnService";
import { PaymentService } from "@src/services/PaymentService";
import styles from "@src/styles/Table.module.scss";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState, useRef } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import VoucherInfoModal from "../../modules/payment/components/VoucherInfoModal";
import { Eye } from "tabler-icons-react";
import { FriendService } from "@src/services/FriendService/FriendService";
import { useProfileContext } from "@src/context/Can";
import { ChatChanelEnum } from "@chatbox/constants";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function PaymentReport() {
  const { t } = useTranslation();
  const { profile } = useProfileContext();

  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const [courseList, setCourseList] = useState<any>([]);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [minProgress, setMinProgress] = useState("");
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [courseSelectedIds, setCourseSelectedIds] = useState<any>([]);
  const [userOptions, setUserOptions] = useState([]);
  const [checkedAllCourse, setCheckedAllCourse] = useState(true);

  const initialCouresData = useRef([]);

  const [filter, setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 20,
    status: "",
    type: "",
    userIds: [],
  });

  useEffect(() => {
    getCoursesData();
  }, []);

  useEffect(() => {
    getReportData(minProgress);
  }, [filter, fromDate, toDate, courseSelectedIds]);

  useEffect(() => {
    if (courseList.length) {
      if (checkedAllCourse) {
        const arr = courseList.map((item) => item.id);
        setCourseSelectedIds(arr);
      } else {
        setCourseSelectedIds([courseList[0].id]);
      }
    }
  }, [checkedAllCourse, courseList]);

  const getCoursesData = async () => {
    const res = await LearnService.getPaidCourseList({
      pageSize: 0,
    });

    if (res?.data?.data) {
      setCourseList(res.data.data);
      initialCouresData.current = [...res?.data?.data];
    }
  };

  const getReportData = async (progressNumber?: string) => {
    if ((!fromDate && !toDate) || (fromDate && toDate && fromDate <= toDate)) {
      setIsReportLoading(true);
      const params = { ...filter, courseIds: courseSelectedIds };
      if (fromDate && toDate) {
        params["fromDate"] = fromDate;
        params["toDate"] = toDate;
      }

      if (progressNumber && Number(progressNumber) >= 0 && Number(progressNumber) <= 100)
        params["minProgress"] = Number(progressNumber);

      const res = await PaymentService.courseEnrollReport(params);
      setIsReportLoading(false);
      if (res?.data) {
        setReportData(res?.data);
      }
    }
  };

  const generateEnrollType = (enrollType: string) => {
    switch (enrollType) {
      case CourseEnrollType.REQUEST:
        return t("Enroll by request");
      case CourseEnrollType.COURSE_IN_CLASS:
        return t("Enroll from class");
      case CourseEnrollType.COURSE_IN_COMBO:
        return t("Enroll from combo");
      case CourseEnrollType.ENROLL_BY_ORDER:
        return t("Enroll by order");
      case CourseEnrollType.ENROLL_BY_VOUCHER:
        return t("Enroll by voucher");
      case CourseEnrollType.ADD_BY_ADMIN:
        return t("Add by admin");
      default:
        break;
    }
  };

  const generateNote = (data: any) => {
    if (data?.code) {
      if (data?.enrollType === "ENROLL_BY_VOUCHER") {
        return (
          <span className="text-[#6687f2] hover:underline cursor-pointer" onClick={() => getVoucherInfo(data)}>
            {data?.code}
          </span>
        );
      }
      return data.code;
    } else if (data?.enrollSourcePermalink)
      return (
        <a className="text-[#6687f2] hover:underline" href={data.enrollSourcePermalink}>
          {data?.enrollSourceTitle}
        </a>
      );
  };

  const generateStatus = (statusCode: number) => {
    let color = "";
    let text = "";
    switch (statusCode) {
      case 1:
        color = "blue";
        text = "Unused";
        break;
      case 2:
        color = "green";
        text = "Actived";
        break;
      case 3:
        color = "yellow";
        text = "Pending";
        break;
      case 4:
        color = "red";
        text = "Expired";
        break;

      default:
        break;
    }

    return (
      <div style={{ width: "115px", margin: "auto" }}>
        <Badge color={color} variant="filled" fullWidth>
          <span className="font-semibold">{t(text)}</span>
        </Badge>
      </div>
    );
  };

  const handleSearchCourse = (inputValue) => {
    const arr = initialCouresData.current.filter((item) =>
      item?.title?.toLowerCase().includes(inputValue.toLowerCase())
    );
    setCourseList(arr);
  };

  const debounceFilterByProgress = useCallback(
    _.debounce((progressNumber) => {
      setFilter({ ...filter, pageIndex: 1 });
      getReportData(progressNumber);
    }, 700),
    []
  );

  const getVoucherInfo = async (voucherData) => {
    const res = await PaymentService.getVoucherByCode({
      code: voucherData?.code,
    });
    if (res?.data?.data) {
      setVoucherInfo(res.data.data);
    }
  };

  const handleSearchUsers = useCallback(
    _.debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user?.userName,
            value: user?.userId,
          }));
          setUserOptions((prev) => _.uniqBy([...prev, ...data], "value"));
        }
      });
    }, 700),
    []
  );

  const handleClickCourse = (course) => {
    if (!(courseSelectedIds.length === 1 && courseSelectedIds.includes(course?.id))) {
      const arr = [...courseSelectedIds];
      const index = arr.findIndex((item) => item === course.id);

      if (index !== -1) {
        arr.splice(index, 1);
      } else {
        arr.push(course.id);
      }
      setCourseSelectedIds(arr);
    }
  };

  const handleChatSupport = (data) => {
    const userId = profile?.userId;
    const dataChatBox = {
      id: userId > data?.userId ? `${data?.userId}_${userId}` : `${userId}_${data?.userId}`,
      lastMessageTimestamp: new Date(),
      friend: {
        id: data.userId,
        username: data?.userName,
        fullName: data?.displayName,
        avatarUrl: data?.userAvatar,
      },
      ownerId: -1,
      notifyCount: 0,
    };
    PubSub.publish(ChatChanelEnum.OPEN_CHAT, { data: dataChatBox });
  };

  return (
    <>
      <HeadSEO title={t("Payment report")} />
      <DefaultLayout bgGray>
        <div className="px-8">
          <Breadcrumbs
            data={[
              {
                href: `/`,
                title: t("Home"),
              },
              {
                title: t("Payment report"),
              },
            ]}
          />

          <div className="mb-10 flex gap-5">
            <div className="w-1/5 min-w-[220px] grow h-fit border bg-white rounded-sm p-2 overflow-hidden">
              <Text>{t("Course")}</Text>
              <TextInput
                className="mt-3 mb-5"
                placeholder={t("Search course")}
                size="xs"
                onChange={(e: any) => handleSearchCourse(e.target.value)}
              />

              <div className="mt-2 h-[600px] overflow-auto scroll-thin pr-1">
                <div
                  className="flex items-center text-sm p-2 gap-3 cursor-pointer w-fit"
                  onClick={() => setCheckedAllCourse((prev) => !prev)}
                >
                  <Checkbox checked={checkedAllCourse} />
                  <span>{t("All")}</span>
                </div>

                {courseList.map((course) => (
                  <div
                    key={course.id}
                    className="flex justify-between items-center text-sm p-2 gap-3 cursor-pointer rounded"
                    onClick={() => handleClickCourse(course)}
                  >
                    <Checkbox checked={courseSelectedIds.includes(course.id)} />
                    <div className="text-ellipsis whitespace-nowrap overflow-hidden grow" title={course?.title}>
                      {course?.title}
                    </div>
                    <div className="flex items-center">
                      <Eye
                        width={16}
                        height={16}
                        color="#506cf0"
                        onClick={() => window.open(`/learning/${course?.permalink}`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grow">
              <div className="flex items-center gap-4 flex-wrap mb-8">
                <Select
                  label={t("Username")}
                  data={userOptions}
                  searchable
                  clearable
                  nothingFound={t("No result found")}
                  placeholder={t("Username")}
                  onSearchChange={handleSearchUsers}
                  onChange={(value) => {
                    setFilter((prev) => ({ ...prev, userIds: [value], pageIndex: 1 }));
                    if (!value) {
                      setUserOptions([]);
                      setFilter((prev) => ({ ...prev, userIds: [], pageIndex: 1 }));
                    }
                  }}
                />
                <Select
                  data={[
                    { value: "", label: t("All") },
                    { value: CourseEnrollType.REQUEST, label: t("Enroll by request") },
                    { value: CourseEnrollType.COURSE_IN_CLASS, label: t("Enroll from class") },
                    { value: CourseEnrollType.COURSE_IN_COMBO, label: t("Enroll from combo") },
                    { value: CourseEnrollType.ENROLL_BY_ORDER, label: t("Enroll by order") },
                    { value: CourseEnrollType.ENROLL_BY_VOUCHER, label: t("Enroll by voucher") },
                    { value: CourseEnrollType.ADD_BY_ADMIN, label: t("Add by admin") },
                  ]}
                  clearable={false}
                  allowDeselect={false}
                  label={t("Enroll type")}
                  value={filter.type}
                  onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, type: value }))}
                />
                <Select
                  data={[
                    { value: "", label: t("All") },
                    { value: "1", label: t("Unused") },
                    { value: "2", label: t("Actived") },
                    { value: "3", label: t("Pending") },
                    { value: "4", label: t("Expired") },
                  ]}
                  clearable={false}
                  allowDeselect={false}
                  label={t("Status")}
                  value={filter.status}
                  onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: 1, status: value }))}
                />
                <div className="relative">
                  <div className="flex gap-4">
                    <DatePickerInput
                      valueFormat="DD/MM/YYYY"
                      decadeLabelFormat="DD/MM/YYYY"
                      label={t("From date")}
                      placeholder={t("DD/MM/YYYY")}
                      clearable
                      classNames={{ label: "whitespace-pre" }}
                      value={fromDate}
                      onChange={(value) => {
                        setFromDate(value);
                        if (!value) setToDate(null);
                      }}
                      error={fromDate && toDate && fromDate > toDate}
                    />
                    <DatePickerInput
                      valueFormat="DD/MM/YYYY"
                      decadeLabelFormat="DD/MM/YYYY"
                      label={t("To date")}
                      placeholder={t("DD/MM/YYYY")}
                      clearable
                      classNames={{ label: "whitespace-pre" }}
                      value={toDate}
                      onChange={(value) => setToDate(value)}
                      disabled={!fromDate}
                      error={fromDate && toDate && fromDate > toDate}
                    />
                  </div>
                  {fromDate && toDate && fromDate > toDate && (
                    <div className="text-[#fa5252] text-wrap text-xs absolute left-0 top-full mt-1 whitespace-nowrap">
                      {t("Start time must be less than end time")}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <TextInput
                    classNames={{
                      input: "px-3 w-20",
                    }}
                    label={`${t("Progress")} (>=)`}
                    placeholder={t("Progress")}
                    value={minProgress}
                    onChange={(e: any) => {
                      setMinProgress(e.currentTarget.value.replace(/[^0-9]/g, ""));
                      debounceFilterByProgress(e.currentTarget.value);
                    }}
                    error={minProgress && (Number(minProgress) < 0 || Number(minProgress) > 100)}
                  />
                  {minProgress && (Number(minProgress) < 0 || Number(minProgress) > 100) && (
                    <div className="text-[#fa5252] text-wrap text-xs absolute left-0 top-full mt-1 whitespace-nowrap">
                      {t("{{title}} must be greater than {{from}} and less than {{to}}", {
                        title: "Progress",
                        from: 0,
                        to: 100,
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-auto">
                <Table className={styles.table} captionSide="bottom" striped withBorder>
                  <thead>
                    <tr>
                      <th className="!text-center">#</th>
                      <th>{t("User")}</th>
                      <th>{t("Course name")}</th>
                      <th>{t("Enroll type")}</th>
                      <th>{t("Note")}</th>
                      <th className="!text-center w-[10%]">{t("Status")}</th>
                      <th className="!text-center w-[10%]">{t("Date")}</th>
                      <th className="!text-center">{t("Price")}</th>
                      <th className="!text-center">{t("Progress")}</th>
                      <th className="!text-center w-[10%]">{t("Date of most recent activity")}</th>
                      <th className="!text-center">{t("Action")}</th>
                    </tr>
                  </thead>
                  {!isReportLoading && (
                    <tbody>
                      {reportData?.data?.map((item: any, index: number) => (
                        <tr key={item.id}>
                          <td className="text-center">{filter.pageSize * (filter.pageIndex - 1) + index + 1}</td>
                          <td>{item?.userId === 0 ? "Anonymous" : item?.userName}</td>
                          <td>{item?.courseTitle}</td>
                          <td>{generateEnrollType(item?.enrollType)}</td>
                          <td>{generateNote(item)}</td>
                          <td className="text-center">{generateStatus(item?.status)}</td>
                          <td className="text-center">{formatDateGMT(item?.date, "HH:mm DD/MM/YYYY")}</td>
                          <td className="text-center">{FunctionBase.formatNumber(item?.amount)} đ</td>
                          <td className="text-center">{Math.round(item?.progress)}%</td>
                          <td className="text-center">{formatDateGMT(item?.lastSubmitDate, "HH:mm DD/MM/YYYY")}</td>
                          <td className="!text-center">
                            {item?.userId !== 0 && item?.userId !== profile.userId && (
                              <div className="flex justify-center cursor-pointer">
                                <Image
                                  alt=""
                                  src="/images/chat.png"
                                  fit="cover"
                                  height={24}
                                  width={24}
                                  onClick={() => handleChatSupport(item)}
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </Table>
              </div>
              {isReportLoading && (
                <div className="flex justify-center items-center w-full h-24 bg-white">
                  <Loader color="blue" />
                </div>
              )}
              {!!reportData?.data?.length && (
                <div className="mt-8 pb-8 flex justify-center">
                  <Pagination
                    color="blue"
                    withEdges
                    value={filter.pageIndex}
                    total={reportData?.metaData?.pageTotal}
                    onChange={(page) => {
                      setFilter((prev) => ({
                        ...prev,
                        pageIndex: page,
                      }));
                    }}
                  />
                </div>
              )}
              {!isReportLoading && !reportData?.data?.length && (
                <div className="p-12 bg-white text-center text-gray-secondary">{t("No results found")}</div>
              )}
            </div>
          </div>
          {voucherInfo && <VoucherInfoModal data={voucherInfo} onClose={() => setVoucherInfo(null)} />}
        </div>
      </DefaultLayout>
    </>
  );
}
