import { Breadcrumbs, CheckBox } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, Input, NumberInput, Popover, Select, Text, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { NotPermission } from "@src/components/NotPermission/NotPermission";
import { DEFAULT_AVATAR_URL } from "@src/constants/common.constant";
import { padToTwoDigits } from "@src/constants/evaluate/evaluate.constant";
import { useProfileContext } from "@src/context/Can";
import { formatDateGMT, getRandomInt } from "@src/helpers/fuction-base.helpers";
import CodingService from "@src/services/Coding/CodingService";
import yup from "@src/validations/yupGlobal";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Controller, useForm } from "react-hook-form";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarEvent, ChartInfographic, Clock, ClockHour1, DeviceLaptop, Settings, Stack2 } from "tabler-icons-react";
import CardEvaluating from "./components/CardEvaluating";
import { ModalShareLink } from "./components/ModalShareLink";

const data = [
  { name: "0-100", value: 0 },
  { name: "101-200", value: 0 },
  { name: "201-300", value: 0 },
  { name: "301-400", value: 0 },
  { name: "401-500", value: 0 },
  { name: "501-600", value: 0 },
  { name: "601-700", value: 0 },
  { name: "701-800", value: 0 },
  { name: "801-900", value: 0 },
  { name: "901-1000", value: 0 },
];
const EvaluatingCreate = () => {
  const { t } = useTranslation();
  const [dataTemplate, setDataTemplate] = useState({} as any);
  const profile = useProfileContext();

  const token = getAccessToken();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const templateId = router.query.templateId;

  const [dataEvaluating, setDataEvaluating] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [maxNumberOfCreatableTestInDay, setMaxNumberOfCreatableTestInDay] = useState(0);
  const [isSelectTime, setIsSeclectTime] = useState(false);
  const [timeStart, setTimeStart] = useState(new Date() as any);
  const [openModalShareLink, setOpenModalShareLink] = useState(null);
  const [dataCheckCreate, setDataCheckCreate] = useState(true);
  const [option, setOption] = useState([
    {
      label: t("For current account"),
      value: "1",
    },
  ]);
  let lastIndex = 0;

  const initialValues = {
    name: "",
    userTestId: 0,
    templateId: templateId,
    startDate: new Date(),
    anonymousUserName: "",
    isInvisibleResult: false,
    duration: 60,
    bannerImg: "",
    numOfCopy: 0,
    language: keyLocale,
  };
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">00</Text>
            <Text className="text-xs">{t("days")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">00</Text>
            <Text className="text-xs">{t("hours")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">00</Text>
            <Text className="text-xs">{t("minutes")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">00</Text>
            <Text className="text-xs">{t("seconds")}</Text>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(days)}</Text>
            <Text className="text-xs">{t("days")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(hours)}</Text>
            <Text className="text-xs">{t("hours")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(minutes)}</Text>
            <Text className="text-xs">{t("minutes")}</Text>
          </div>
          <Text className="text-red-500">:</Text>
          <div className="flex flex-col items-center">
            <Text className="font-semibold text-red-500 text-lg">{padToTwoDigits(seconds)}</Text>
            <Text className="text-xs">{t("seconds")}</Text>
          </div>
        </div>
      );
    }
  };
  const schema = yup.object().shape({
    name: yup
      .string()
      .max(71, t("Name maximum is 71 characters"))
      .required(t("Name should not be empty."))
      .trim(t("Name should not be empty.")),
  });

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = methodForm;

  const fetchCreateForAnonymous = async () => {
    const res = await CodingService.checkCreateEvaluate({});
    if (res?.data?.success) {
      if (res?.data?.data?.isAllowAssign == true) {
        setOption([
          {
            label: "For anonymous account",
            value: "0",
          },
          {
            label: "For current account",
            value: "1",
          },
        ]);
        setIsAnonymous(true);
      }
      setMaxNumberOfCreatableTestInDay(res?.data?.data?.maxNumberOfCreatableTestInDay);
      setDataCheckCreate(res?.data?.data ? true : false);
    } else {
      Notify.error(t(res?.data?.message));
    }
  };

  const handleSelectTemplate = async () => {
    const res = await CodingService.getDetailTemplate({
      evaluateTemplateId: +templateId,
    });
    if (res?.data?.success) {
      setDataTemplate(res.data.data);
      const data = res.data.data.evaluateTemplateWarehouses.map((value, index) => {
        return {
          name: value.name,
          percent: value.percent,
          warehouseId: value.warehouseId,
          listTemplateSubWarehouses: value.listTemplateSubWarehouses.map((item) => {
            return {
              warehouseId: item.warehouseId,
              randomNumberEasyTask: getRandomInt(item.minNumberEasyTask, item.maxNumberEasyTask),
              randomNumberMediumTask: getRandomInt(item.minNumberMediumTask, item.maxNumberMediumTask),
              randomNumberHardTask: getRandomInt(item.minNumberHardTask, item.maxNumberHardTask),
            };
          }),
        };
      });
      setDataEvaluating(data);
    } else {
      Notify.error(t(res?.data?.message));
    }
  };

  const onSubmit = async (data) => {
    const currentLang = data.language;
    let multiLangData = data.multiLangData || [];
    const langData = {
      key: currentLang,
      name: data.name,
    };

    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      name: data.name,
    };

    multiLangData = [...multiLangData.filter((e) => e.key !== currentLang), langData];

    if (multiLangData.length <= 1) {
      multiLangData = [...multiLangData, langDataOther];
    }

    multiLangData.forEach((e) => {
      if (_.isEmpty(e.name)) {
        e.name = data.name;
      }
    });

    const skills = [];
    if (timeStart - Date.now() > 0 || !isSelectTime) {
      dataEvaluating.forEach((item) => {
        item.listTemplateSubWarehouses.forEach((subItem) => {
          skills.push(subItem);
        });
      });
      const res = await CodingService.saveEvaluate({
        name: data.name,
        startDate: isSelectTime ? timeStart : new Date(),
        endDate: moment(isSelectTime ? timeStart : new Date()).add(+data.duration, "minutes"),
        templateId: dataTemplate.id,
        anonymousUserName: data.anonymousUserName,
        userTestId: isAnonymous ? null : profile.profile.userId,
        isInvisibleResult: data.isInvisibleResult,
        bannerImg: data.bannerImg,
        numOfCopy: data.numOfCopy,
        skillSettings: skills,
        multiLangData: multiLangData,
      });
      if (res?.data?.success) {
        Notify.success(t("Create successfully!"));
        if (isAnonymous) {
          let model = { Id: res?.data?.data?.id, Token: res?.data?.data?.token };
          setOpenModalShareLink(model);
        } else {
          router.push("/evaluating");
        }
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    } else {
      Notify.error(t("Time start need larger than now"));
    }
  };
  useEffect(() => {
    handleSelectTemplate();
  }, [locale]);

  useEffect(() => {
    fetchCreateForAnonymous();
  }, []);

  const handleChangeLang = (value) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];

    const data = {
      key: preLang,
      name: watch("name"),
    };
    multiLangData = multiLangData.filter((e) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);

    const dataLang = multiLangData.find((e) => e.key === value);
    setValue("name", _.isEmpty(dataLang?.name) ? "" : dataLang?.name);

    setValue("language", value);
  };

  return (
    <>
      {!token ? (
        <NotPermission />
      ) : (
        <div>
          <ModalShareLink
            open={openModalShareLink != null}
            onClose={() => setOpenModalShareLink(null)}
            data={openModalShareLink}
          />
          <Container size="xl">
            <Flex className="justify-center" align="center">
              <Breadcrumbs
                data={[
                  {
                    href: "/",
                    title: t("Home"),
                  },
                  {
                    href: "/evaluating",
                    title: t("Evaluating"),
                  },
                  {
                    title: t("Create"),
                  },
                ]}
              />
            </Flex>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Flex className="justify-between items-center md:flex-row gap-4 md:gap-0 flex-col">
                <div className="flex md:flex-row flex-col gap-4 md:items-center">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        error={errors[field.name]?.message as string}
                        placeholder={t("Test Name")}
                        size="md"
                        variant="default"
                        className="md:w-[500px]"
                      />
                    )}
                  />
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder={t("Language")}
                        data={[
                          { label: "Tiếng Việt", value: "vn" },
                          { label: "English", value: "en" },
                        ]}
                        size="md"
                        allowDeselect={false}
                        onChange={handleChangeLang}
                      />
                    )}
                  />
                </div>
                {maxNumberOfCreatableTestInDay > 1 && (
                  <Popover
                    width={400}
                    trapFocus
                    position="bottom"
                    shadow="md"
                    offset={{ mainAxis: 0, crossAxis: -108 }}
                  >
                    <Popover.Target>
                      <Button variant="outline">
                        <Settings />
                        <Text>{t("Advanced settings")}</Text>
                      </Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <div className="flex gap-2 items-center">
                        <Text>{t("Image banner")}:</Text>
                        <Controller
                          name={t("bannerImg")}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder={t("Image banner")}
                              variant="unstyled"
                              className="w-[60%]"
                            ></Input>
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          name="isInvisibleResult"
                          control={control}
                          render={({ field }) => (
                            <CheckBox
                              checked={watch("isInvisibleResult")}
                              {...field}
                              label={t("Hide answer")}
                              className="mt-4"
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center mt-4 gap-2">
                        <Text className="text-[#6e84a3]">{t("Number of copies")}:</Text>
                        <Controller
                          name="numOfCopy"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              placeholder="0"
                              variant="unstyled"
                              size="md"
                              className="w-[60%]"
                            ></Input>
                          )}
                        />
                      </div>
                      <div>
                        <Text className="text-[#6e84a3] mt-4">
                          {t("Percentage of easy tasks")}: {dataTemplate?.easyTaskPercent ?? 1}
                        </Text>
                      </div>
                      <div>
                        <Text className="text-[#6e84a3] mt-4">
                          {t("Percentage of medium tasks")}: {dataTemplate?.mediumTaskPercent ?? 2}
                        </Text>
                      </div>
                      <div>
                        <Text className="text-[#6e84a3] mt-4 mb-4">
                          {t("Percentage of hard tasks")}: {dataTemplate?.hardTaskPercent ?? 3}
                        </Text>
                      </div>
                    </Popover.Dropdown>
                  </Popover>
                )}
              </Flex>
              <div className="bg-white min-h-[400px] my-8">
                <div className="flex justify-between p-2  md:p-6 gap-4 flex-col lg:flex-row">
                  <div className="min-w-[300px]">
                    <div className="flex items-center gap-3 pb-5 border-b-2">
                      <img
                        className="bg-white rounded-full w-[60px] overflow-hidden aspect-square object-cover cursor-pointer"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = DEFAULT_AVATAR_URL;
                        }}
                        src={isAnonymous ? "/images/evaluating/anonymous-avatar.png" : profile?.profile?.avatarUrl}
                      />
                      {option?.length == 2 ? (
                        <div className="flex flex-col gap-3 w-full">
                          <Select
                            data={option.map((element: any) => {
                              return {
                                label: t(element.label),
                                value: element.value,
                              };
                            })}
                            value={isAnonymous ? "0" : "1"}
                            onChange={(value) => setIsAnonymous(value === "0")}
                          />
                          {isAnonymous && (
                            <Controller
                              name="anonymousUserName"
                              control={control}
                              render={({ field }) => <Input {...field} placeholder={t("Examine")} />}
                            />
                          )}
                        </div>
                      ) : (
                        <Link
                          href={`/profile/${profile?.profile?.userId}`}
                          className="text-xl font-semibold text-blue-600 text-ellipsis overflow-hidden w-[240px]"
                        >
                          {profile?.profile?.userName}
                        </Link>
                      )}
                    </div>
                    {!dataCheckCreate && (
                      <div className="bg-[#fff6e5] mt-6 p-4">
                        <Text>{t("Time to start your test is within an hour after your test has been made!")}</Text>
                      </div>
                    )}
                    {option?.length === 2 && (
                      <>
                        <div className="mt-8">
                          <div className="flex gap-2 justify-between">
                            <Text className="min-w-[100px]">
                              {t("Open time")} <span className="text-[#f26c6c]">*</span>:
                            </Text>
                            <Select
                              className="w-full"
                              value={isSelectTime ? "1" : "0"}
                              data={[
                                {
                                  label: t("Open right after created"),
                                  value: "0",
                                },
                                {
                                  label: t("Select time"),
                                  value: "1",
                                },
                              ]}
                              onChange={(value) => setIsSeclectTime(value === "1")}
                            />
                          </div>
                          {isSelectTime && (
                            <div className="pt-4">
                              <DateTimePicker
                                clearable
                                value={new Date(timeStart)}
                                minDate={new Date()}
                                onChange={(value) => setTimeStart(value)}
                              />
                            </div>
                          )}
                          <div className="flex gap-2 mt-2 items-center">
                            <Text className="min-w-[100px]">
                              {t("Last for")} <span className="text-[#f26c6c]">*</span>:
                            </Text>
                            <div className="flex gap-2 items-center">
                              <Controller
                                name="duration"
                                control={control}
                                render={({ field }) => (
                                  <NumberInput {...field} variant="default" className="w-[80px]" min={1} />
                                )}
                              />
                              <Text className="font-semibold">{t("minutes")}</Text>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-14">
                          <Text>{t("The test starts in")}</Text>
                          <div>
                            {isSelectTime ? (
                              <Countdown
                                date={timeStart}
                                key={formatDateGMT(timeStart, "HH:mm:ss DD/MM/YYYY")}
                                renderer={renderer}
                              />
                            ) : (
                              <div className="flex items-start gap-2">
                                <div className="flex flex-col items-center">
                                  <Text className="font-semibold text-red-500 text-lg">00</Text>
                                  <Text className="text-xs">{t("days")}</Text>
                                </div>
                                <Text className="text-red-500">:</Text>
                                <div className="flex flex-col items-center">
                                  <Text className="font-semibold text-red-500 text-lg">00</Text>
                                  <Text className="text-xs">{t("hours")}</Text>
                                </div>
                                <Text className="text-red-500">:</Text>
                                <div className="flex flex-col items-center">
                                  <Text className="font-semibold text-red-500 text-lg">00</Text>
                                  <Text className="text-xs">{t("minutes")}</Text>
                                </div>
                                <Text className="text-red-500">:</Text>
                                <div className="flex flex-col items-center">
                                  <Text className="font-semibold text-red-500 text-lg">00</Text>
                                  <Text className="text-xs">{t("seconds")}</Text>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="md:min-w-[350px] min-w-[300px] px-6 border-x-2">
                    <div className="border-b-2 pb-2">
                      <Text className="text-[#4c5eff] font-semibold text-lg uppercase">{t("Results")}</Text>
                    </div>
                    <div className="flex flex-col content-between mt-2">
                      <div className="flex justify-between my-3">
                        <div className="flex gap-3">
                          <Stack2 color="#4c5eff" />
                          <Text>{t("Task")}</Text>
                        </div>
                        <Text className="font-semibold">0/0</Text>
                      </div>
                      <div className="flex justify-between my-3">
                        <div className="flex gap-3">
                          <ChartInfographic color="#4c5eff" />
                          <Text>{t("Result")}</Text>
                        </div>
                        <Text className="font-semibold">--</Text>
                      </div>
                      <div className="flex justify-between my-3">
                        <div className="flex gap-3">
                          <Clock color="#4c5eff" />
                          <Text>{t("Completed time")}</Text>
                        </div>
                        <Text className="font-semibold">00:00:00</Text>
                      </div>
                      <div className="flex justify-between my-3">
                        <div className="flex gap-3">
                          <CalendarEvent color="#4c5eff" />
                          <Text>{t("Date")}</Text>
                        </div>
                        <Text className="font-semibold">MM/DD/YYYY</Text>
                      </div>
                    </div>
                    <div className="w-full bg-[#ffea00] text-black font-semibold text-lg h-[50px] flex items-center justify-center rounded-sm mt-5">
                      <Text>0/1000</Text>
                    </div>
                  </div>

                  <div className="min-w-[300px">
                    <div className="border-b-2 pb-2">
                      <Text className="text-[#4c5eff] font-semibold text-lg uppercase">{t("Report")}</Text>
                    </div>
                    <div className="flex mt-6 items-center flex-col sm:flex-row md:justify-center lg:justify-start">
                      <div>
                        <Text className="font-semibold uppercase">{t("your score is")}</Text>
                        <Text className="font-semibold text-green-600 text-4xl">0%</Text>
                        <Text className="font-semibold">{t("higher than that of joined programers")}</Text>
                      </div>
                      <div>
                        <BarChart width={330} height={200} data={data} className="text-xs !h-[230px]">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-55} fontSize={10} dy={20} />
                          <YAxis unit="%" ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} fontSize={10} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white min-h-[70px] flex flex-col md:flex-row gap-4 md:gap-0 md-flex-row p-4 justify-between items-center px-6 mb-6">
                <div className="flex gap-8">
                  <div className="flex gap-1">
                    <ClockHour1 color="#c1c7d0" />
                    <Text>
                      {dataTemplate?.duration ?? "--"} {t("minutes")}
                    </Text>
                  </div>
                  <div className="flex gap-1">
                    <DeviceLaptop color="#c1c7d0" />
                    <Text>
                      {dataTemplate?.evaluateTemplateWarehouses?.length ?? "--"} {t("skills")}
                    </Text>
                  </div>
                  <div className="flex gap-1">
                    <Stack2 color="#c1c7d0" />
                    <Text>
                      {dataEvaluating
                        ?.map((sub) => {
                          return sub.listTemplateSubWarehouses.reduce((accumulator, currentValue) => {
                            return (
                              accumulator +
                              currentValue.randomNumberEasyTask +
                              currentValue.randomNumberMediumTask +
                              currentValue.randomNumberHardTask
                            );
                          }, 0);
                        })
                        .reduce((accumulator, currentValue) => accumulator + currentValue, 0) +
                        " " +
                        t("tasks")}
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between bg-white">
                {dataEvaluating?.map((item, index) => {
                  // var numberOfTask = item?.listTemplateSubWarehouses?.length ?? 0;
                  var numberOfTask = item?.listTemplateSubWarehouses.reduce((accumulator, currentValue) => {
                    return (
                      accumulator +
                      currentValue.randomNumberEasyTask +
                      currentValue.randomNumberMediumTask +
                      currentValue.randomNumberHardTask
                    );
                  }, 0);

                  lastIndex += numberOfTask;
                  return (
                    <CardEvaluating
                      key={item.warehouseId}
                      data={item}
                      index={index}
                      firstIndex={lastIndex - numberOfTask + 1}
                    />
                  );
                })}
              </div>

              <div className="flex justify-end mb-5 mt-5">
                <div className="flex gap-8">
                  <Button variant="default" className="w-[120px]" onClick={() => router.push("/evaluating")}>
                    {t("Cancel")}
                  </Button>
                  <Button className="w-[120px]" type="submit" disabled={Object.keys(dataTemplate).length === 0}>
                    {t("Create")}
                  </Button>
                </div>
              </div>
            </form>
          </Container>
        </div>
      )}
    </>
  );
};

export default EvaluatingCreate;
